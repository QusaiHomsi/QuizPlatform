from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Room(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    code       = db.Column(db.String(6), unique=True, nullable=False)
    examiner   = db.Column(db.String(100), nullable=False)
    status     = db.Column(db.String(20), default='lobby')   # lobby|active|finished
    current_q  = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    questions  = db.relationship('Question', backref='room', lazy=True, cascade='all,delete')
    contestants= db.relationship('Contestant', backref='room', lazy=True, cascade='all,delete')

class Question(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    room_id     = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    order       = db.Column(db.Integer, nullable=False)
    text        = db.Column(db.Text, nullable=False)
    qtype       = db.Column(db.String(20), default='text')   # text|mcq
    options     = db.Column(db.Text, default='')             # JSON array for MCQ
    answer      = db.Column(db.Text, nullable=False)         # correct answer text
    note        = db.Column(db.Text, default='')
    pts_1st     = db.Column(db.Integer, default=300)
    pts_2nd     = db.Column(db.Integer, default=200)
    pts_3rd     = db.Column(db.Integer, default=100)

class Contestant(db.Model):
    id           = db.Column(db.Integer, primary_key=True)
    room_id      = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    name         = db.Column(db.String(100), nullable=False)
    sid          = db.Column(db.String(200), default='')
    total_points = db.Column(db.Integer, default=0)
    disqualified = db.Column(db.Boolean, default=False)
    dq_reason    = db.Column(db.String(200), default='')

class Answer(db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    room_id       = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    question_id   = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    contestant_id = db.Column(db.Integer, db.ForeignKey('contestant.id'), nullable=False)
    answer_text   = db.Column(db.Text, nullable=False)
    is_correct    = db.Column(db.Boolean, default=False)
    elapsed_ms    = db.Column(db.Integer, default=0)
    points        = db.Column(db.Integer, default=0)
    answered_at   = db.Column(db.DateTime, default=datetime.utcnow)