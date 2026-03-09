import os, json, random, string
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, abort
from flask_socketio import SocketIO, join_room, leave_room, emit
from models import db, Room, Question, Contestant, Answer

app = Flask(__name__)
app.secret_key = 'CHANGE_THIS_SECRET_KEY_IN_PRODUCTION'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins='*')

with app.app_context():
    db.create_all()

# ── helpers ──────────────────────────────────────────────────────────────────

def gen_code():
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if not Room.query.filter_by(code=code).first():
            return code

def room_or_404(code):
    return Room.query.filter_by(code=code).first_or_404()

def question_top3(question):
    """Return top-3 correct answers sorted by elapsed_ms."""
    correct = (Answer.query
               .filter_by(question_id=question.id, is_correct=True)
               .order_by(Answer.elapsed_ms)
               .limit(3).all())
    result = []
    for a in correct:
        c = Contestant.query.get(a.contestant_id)
        result.append({'name': c.name, 'elapsed_ms': a.elapsed_ms, 'points': a.points})
    return result

# ── routes: examiner ──────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create', methods=['POST'])
def create_room():
    examiner_name = request.form.get('examiner_name', 'Examiner').strip()
    code = gen_code()
    room = Room(code=code, examiner=examiner_name)
    db.session.add(room)
    db.session.commit()
    session['role'] = 'examiner'
    session['room_code'] = code
    return redirect(url_for('examiner_setup', code=code))

@app.route('/examiner/<code>/setup', methods=['GET', 'POST'])
def examiner_setup(code):
    room = room_or_404(code)
    if request.method == 'POST':
        # Delete existing questions
        Question.query.filter_by(room_id=room.id).delete()
        data = request.get_json()
        for i, q in enumerate(data.get('questions', [])):
            opts = json.dumps(q.get('options', [])) if q['type'] == 'mcq' else ''
            question = Question(
                room_id=room.id, order=i,
                text=q['text'], qtype=q['type'],
                options=opts, answer=q['answer'].strip(),
                note=q.get('note', ''),
                pts_1st=int(q.get('pts_1st', 300)),
                pts_2nd=int(q.get('pts_2nd', 200)),
                pts_3rd=int(q.get('pts_3rd', 100)),
            )
            db.session.add(question)
        db.session.commit()
        return jsonify({'ok': True})
    return render_template('examiner_setup.html', room=room)

@app.route('/examiner/<code>/lobby')
def examiner_lobby(code):
    room = room_or_404(code)
    contestants = Contestant.query.filter_by(room_id=room.id, disqualified=False).all()
    questions   = Question.query.filter_by(room_id=room.id).order_by(Question.order).all()
    return render_template('examiner_lobby.html', room=room,
                           contestants=contestants, question_count=len(questions))

@app.route('/examiner/<code>/quiz')
def examiner_quiz(code):
    room = room_or_404(code)
    questions = Question.query.filter_by(room_id=room.id).order_by(Question.order).all()
    return render_template('examiner_quiz.html', room=room, questions=questions)

# ── routes: contestant ────────────────────────────────────────────────────────

@app.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        code = request.form.get('code', '').upper().strip()
        name = request.form.get('name', '').strip()
        room = Room.query.filter_by(code=code).first()
        if not room:
            return render_template('join.html', error='Room not found.')
        if room.status != 'lobby':
            return render_template('join.html', error='Room is not accepting new players.')
        if Contestant.query.filter_by(room_id=room.id, name=name).first():
            return render_template('join.html', error='Name already taken in this room.')
        c = Contestant(room_id=room.id, name=name)
        db.session.add(c)
        db.session.commit()
        session['role'] = 'contestant'
        session['room_code'] = code
        session['contestant_id'] = c.id
        return redirect(url_for('contestant_lobby', code=code))
    return render_template('join.html')

@app.route('/contestant/<code>/lobby')
def contestant_lobby(code):
    room = room_or_404(code)
    c_id = session.get('contestant_id')
    contestant = Contestant.query.get(c_id) if c_id else None
    return render_template('contestant_lobby.html', room=room, contestant=contestant)

@app.route('/contestant/<code>/quiz')
def contestant_quiz(code):
    room = room_or_404(code)
    c_id = session.get('contestant_id')
    contestant = Contestant.query.get_or_404(c_id)
    if contestant.disqualified:
        return render_template('contestant_quiz.html', disqualified=True,
                               reason=contestant.dq_reason, room=room)
    return render_template('contestant_quiz.html', room=room,
                           contestant=contestant, disqualified=False)

@app.route('/end-exam')
def end_exam():
    session.clear()
    return redirect(url_for('index'))

# ── API: results ──────────────────────────────────────────────────────────────

@app.route('/api/room/<code>/final')
def api_final(code):
    room = room_or_404(code)
    contestants = (Contestant.query.filter_by(room_id=room.id)
                   .order_by(Contestant.total_points.desc()).all())
    return jsonify([{
        'name': c.name,
        'total_points': c.total_points,
        'disqualified': c.disqualified,
        'dq_reason': c.dq_reason
    } for c in contestants])

# ── SocketIO ──────────────────────────────────────────────────────────────────

@socketio.on('examiner_join')
def on_examiner_join(data):
    code = data['code']
    join_room(code)
    join_room(f'examiner_{code}')
    # If quiz is already active, send current question
    room = Room.query.filter_by(code=code).first()
    if room and room.status == 'active':
        _emit_question(code, room.current_q)

@socketio.on('contestant_join_room')
def on_contestant_join(data):
    code  = data['code']
    c_id  = data['contestant_id']
    c     = Contestant.query.get(c_id)
    if c:
        c.sid = request.sid
        db.session.commit()
        join_room(code)
        emit('contestant_list_update',
             {'contestants': _contestant_list(code)},
             to=code)
        # If quiz is already active, send current question
        room = Room.query.filter_by(code=code).first()
        if room and room.status == 'active':
            _emit_question(code, room.current_q)

@socketio.on('start_quiz')
def on_start_quiz(data):
    code = data['code']
    room = Room.query.filter_by(code=code).first()
    if not room: 
        emit('error', {'msg': 'Room not found'})
        return
    questions = Question.query.filter_by(room_id=room.id).order_by(Question.order).all()
    if not questions:
        emit('error', {'msg': 'No questions loaded'})
        return
    room.status    = 'active'
    room.current_q = 0
    db.session.commit()
    emit('quiz_started', {}, to=code)
    _emit_question(code, 0)

@socketio.on('submit_answer')
def on_submit_answer(data):
    code       = data['code']
    c_id       = data['contestant_id']
    answer_txt = data['answer'].strip()
    elapsed_ms = data['elapsed_ms']
    room       = Room.query.filter_by(code=code).first()
    if not room or room.status != 'active': return
    c = Contestant.query.get(c_id)
    if not c or c.disqualified: return

    questions = Question.query.filter_by(room_id=room.id).order_by(Question.order).all()
    if room.current_q >= len(questions): return
    q = questions[room.current_q]

    # Prevent double-answer
    if Answer.query.filter_by(question_id=q.id, contestant_id=c_id).first():
        return

    is_correct = answer_txt.lower() == q.answer.lower()
    pts = 0
    if is_correct:
        correct_count = Answer.query.filter_by(question_id=q.id, is_correct=True).count()
        if   correct_count == 0: pts = q.pts_1st
        elif correct_count == 1: pts = q.pts_2nd
        elif correct_count == 2: pts = q.pts_3rd
        if pts:
            c.total_points += pts
    a = Answer(room_id=room.id, question_id=q.id, contestant_id=c_id,
               answer_text=answer_txt, is_correct=is_correct,
               elapsed_ms=elapsed_ms, points=pts)
    db.session.add(a)
    db.session.commit()

    # Confirm to contestant
    emit('answer_confirmed', {'correct': is_correct, 'points': pts})

    # Check if all active contestants answered
    active = Contestant.query.filter_by(room_id=room.id, disqualified=False).count()
    answered = Answer.query.filter_by(question_id=q.id, room_id=room.id).count()
    if answered >= active:
        _emit_q_result(code, q)

@socketio.on('next_question')
def on_next_question(data):
    code = data['code']
    room = Room.query.filter_by(code=code).first()
    if not room: return
    questions = Question.query.filter_by(room_id=room.id).order_by(Question.order).all()
    room.current_q += 1
    db.session.commit()
    if room.current_q >= len(questions):
        _emit_final(code)
    else:
        _emit_question(code, room.current_q)

@socketio.on('disqualify')
def on_disqualify(data):
    code   = data['code']
    c_id   = data['contestant_id']
    reason = data.get('reason', 'Violated quiz rules')
    c = Contestant.query.get(c_id)
    if c:
        c.disqualified = True
        c.dq_reason    = reason
        db.session.commit()
        emit('you_are_dq', {'reason': reason}, to=c.sid)
        emit('contestant_list_update',
             {'contestants': _contestant_list(code)}, to=code)

# ── private helpers ───────────────────────────────────────────────────────────

def _contestant_list(code):
    room = Room.query.filter_by(code=code).first()
    return [{'id': c.id, 'name': c.name, 'disqualified': c.disqualified}
            for c in Contestant.query.filter_by(room_id=room.id).all()]

def _emit_question(code, idx):
    room = Room.query.filter_by(code=code).first()
    if not room:
        print(f"Error: Room {code} not found")
        return
    questions = Question.query.filter_by(room_id=room.id).order_by(Question.order).all()
    if not questions or idx >= len(questions):
        print(f"Error: No questions or invalid index {idx} for room {code}")
        return
    q = questions[idx]
    opts = json.loads(q.options) if q.options else []
    total = len(questions)
    # IMPORTANT: answer is NEVER sent to clients
    payload = {
        'index': idx, 'total': total,
        'text': q.text, 'type': q.qtype,
        'options': opts, 'note': q.note,
        'pts_1st': q.pts_1st, 'pts_2nd': q.pts_2nd, 'pts_3rd': q.pts_3rd,
    }
    print(f"Emitting question {idx+1}/{total} for room {code}")
    emit('new_question', payload, to=code)

def _emit_q_result(code, q):
    top3 = question_top3(q)
    emit('question_result', {'top3': top3}, to=code)

def _emit_final(code):
    room = Room.query.filter_by(code=code).first()
    room.status = 'finished'
    db.session.commit()
    contestants = (Contestant.query.filter_by(room_id=room.id)
                   .order_by(Contestant.total_points.desc()).all())
    board = [{'name': c.name, 'total_points': c.total_points,
              'disqualified': c.disqualified} for c in contestants]
    emit('quiz_finished', {'leaderboard': board}, to=code)

# ── Error Handlers ────────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(error):
    return render_template('error.html', 
                          title='Page Not Found',
                          message='The page you are looking for does not exist.',
                          error_code=404), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('error.html',
                          title='Server Error',
                          message='An internal server error occurred. Please try again.',
                          error_code=500), 500

@app.errorhandler(403)
def forbidden(error):
    return render_template('error.html',
                          title='Access Denied',
                          message='You do not have permission to access this resource.',
                          error_code=403), 403

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)