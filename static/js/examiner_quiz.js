function initExaminer(code) {
  const socket = io();
  socket.emit('examiner_join', {code});

  socket.on('new_question', function(q) {
    $('#result-panel').addClass('d-none');
    $('#final-panel').addClass('d-none');
    $('#q-counter').text(`${t('question')} ${q.index + 1} / ${q.total}`);

    let html = `<h5>${q.text}</h5>`;
    if (q.type === 'mcq') {
      html += '<ul class="list-group list-group-flush mt-2">';
      q.options.forEach(o => { html += `<li class="list-group-item bg-transparent text-light">▪ ${o}</li>`; });
      html += '</ul>';
    }
    if (q.note) html += `<div class="alert alert-info mt-3 mb-0"><strong>📌 ${t('note') || 'Note'}: </strong>${q.note}</div>`;
    html += `<div class="mt-2 text-secondary small">
      <span title="First place points">🥇 ${q.pts_1st}pts</span> &nbsp; 
      <span title="Second place points">🥈 ${q.pts_2nd}pts</span> &nbsp; 
      <span title="Third place points">🥉 ${q.pts_3rd}pts</span>
    </div>`;
    $('#q-panel').html(html);
  });

  socket.on('question_result', function(data) {
    let html = '';
    const medals = ['🥇','🥈','🥉'];
    data.top3.forEach((p, i) => {
      html += `<div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-dark rounded" title="${p.name}">
        <span>${medals[i]} <strong>${p.name}</strong></span>
        <span class="text-success fw-bold">${p.points} ${t('pts1st') ? 'pts' : 'pts'} &nbsp;<small class="text-secondary">${(p.elapsed_ms/1000).toFixed(2)}s</small></span>
      </div>`;
    });
    if (!data.top3.length) html = `<p class="text-secondary">❌ ${t('invalidAnswer') || 'No one answered correctly.'}</p>`;
    $('#top3-list').html(html);
    $('#result-panel').removeClass('d-none');
  });

  $('#next-btn').on('click', function() {
    if(confirm(t('nextQuestionDesc') || 'Proceed to next question?')) {
      socket.emit('next_question', {code});
      $('#result-panel').addClass('d-none');
    }
  });

  socket.on('quiz_finished', function(data) {
    $('#result-panel, #q-panel').addClass('d-none');
    let html = `<table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>${t('contestants') || 'Name'}</th>
          <th>${t('topThisRound') ? 'Pts' : 'Points'}</th>
          <th>${t('quizRules') || 'Status'}</th>
        </tr>
      </thead>
      <tbody>`;
    data.leaderboard.forEach((p, i) => {
      html += `<tr title="${p.name}">
        <td>${i+1}</td>
        <td><strong>${p.name}</strong></td>
        <td class="fw-bold text-success">${p.total_points}</td>
        <td>
          ${p.disqualified ? 
            `<span class="badge bg-danger" title="Disqualified">🚫 ${t('error') || 'DQ'}</span>` : 
            `<span class="badge bg-success" title="Active">✅ ${t('quizActive') || 'OK'}</span>`}
        </td>
      </tr>`;
    });
    html += '</tbody></table>';
    $('#final-board').html(html);
    $('#final-panel').removeClass('d-none');
  });

  socket.on('contestant_list_update', function(data) {
    let html = '';
    data.contestants.forEach(c => {
      const status = c.disqualified ? '🚫' : (c.answered ? '🟡' : '🟢');
      const title = c.disqualified ? 'Disqualified' : (c.answered ? 'Answered' : 'Waiting');
      html += `<span class="badge ${c.disqualified?'bg-danger':'bg-success'} m-1" title="${title}">
        ${status} ${c.name}
      </span>`;
    });
    $('#c-list').html(html || `<p class="text-secondary">${t('waitingForContestants')}</p>`);
  });
}
