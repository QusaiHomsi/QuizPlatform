function initContestant(code, cId, cName) {
  'use strict';

  let questionStartTime = null;
  let answered = false;
  let currentNote = '';
  let warnCount = 0;
  let currentQ = null;
  const MAX_WARNS = 1;
  window._quizActive = false;

  // ── Violation handler (called from HTML script block too) ────────────────
  window._quizViolation = function(reason) {
    if (warnCount < MAX_WARNS) {
      warnCount++;
      const warningMsg = t('warning') + ` ${warnCount}/${MAX_WARNS}: ${t(reason) || reason}. Next = ${t('disqualifiedDesc') || 'disqualification'}.`;
      showWarn(warningMsg);
    } else {
      socket.emit('disqualify', { code, contestant_id: cId, reason });
    }
  };

  function showWarn(msg) {
    $('#warn-banner').text(msg).removeClass('d-none');
    setTimeout(() => $('#warn-banner').addClass('d-none'), 5000);
  }

  // ── Fullscreen ────────────────────────────────────────────────────────────
  function requestFS() {
    const el = document.documentElement;
    (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen
      || el.msRequestFullscreen || function(){}).call(el);
  }

  function isFS() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement
              || document.mozFullScreenElement || document.msFullscreenElement);
  }

  ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
    .forEach(ev => document.addEventListener(ev, () => {
      if (!isFS() && window._quizActive) window._quizViolation('leftFullscreen');
    }));

  // ── Visibility / focus (catches screenshot tools, Circle to Search overlay) ──
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && window._quizActive)
      window._quizViolation('switchedTab');
  });

  window.addEventListener('blur', () => {
    if (window._quizActive)
      window._quizViolation('switchedTab');
  });

  // ── Canvas rendering — heavy anti-OCR + anti-Circle-to-Search ────────────
  function renderQuestionCanvas(text, type, options) {
    const canvas = document.getElementById('q-canvas');
    const dpr = window.devicePixelRatio || 1;
    const W = Math.min(window.innerWidth - 60, 800);
    const fontSize = 22;
    const lineH = 34;
    const pad = 28;

    const tmp = canvas.getContext('2d');
    tmp.font = `bold ${fontSize}px Arial`;

    function wrap(ctx, t, maxW) {
      const words = t.split(' ');
      const lines = [];
      let line = '';
      for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
        else line = test;
      }
      if (line) lines.push(line);
      return lines;
    }

    const lines = wrap(tmp, text, W - pad * 2);
    let H = pad * 2 + lines.length * lineH + 20;
    if (type === 'mcq' && options.length) H += options.length * (lineH + 4) + 16;

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // ── Background gradient (breaks uniform background OCR expects) ──
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1a1a2e');
    bg.addColorStop(0.5, '#16213e');
    bg.addColorStop(1, '#0f3460');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── Layer 1: Dense random pixel noise ──
    // This directly defeats OCR and image-recognition (Circle to Search needs
    // clean edges — noise destroys edge detection)
    const imgData = ctx.getImageData(0, 0, W * dpr, H * dpr);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      if (Math.random() < 0.08) {  // 8% of pixels get noise
        const v = Math.random() * 60;
        d[i]   += v;
        d[i+1] += v;
        d[i+2] += v;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // ── Layer 2: Random colored dot clusters ──
    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = `rgba(${Math.random()*200|0},${Math.random()*200|0},${Math.random()*200|0},0.06)`;
      ctx.beginPath();
      ctx.arc(Math.random()*W, Math.random()*H, Math.random()*3+1, 0, Math.PI*2);
      ctx.fill();
    }

    // ── Layer 3: Diagonal watermark grid (multiple lines defeat crop) ──
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px Arial';
    ctx.translate(W/2, H/2);
    ctx.rotate(-Math.PI / 7);
    for (let r = -H*2; r < H*2; r += 38) {
      for (let c = -W*2; c < W*2; c += 130) {
        ctx.fillText('QUIZARENA © PROTECTED', c, r);
      }
    }
    ctx.restore();

    // ── Layer 4: Random thin scan lines (disrupts OCR line detection) ──
    ctx.save();
    ctx.globalAlpha = 0.03;
    for (let y = 0; y < H; y += 3) {
      ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();

    // ── Render question text with subtle per-character jitter ──
    // Character-level jitter makes OCR character segmentation fail
    ctx.fillStyle = '#f0f0f0';
    ctx.font = `bold ${fontSize}px Arial`;
    let y = pad + lineH;
    lines.forEach(line => {
      let x = pad;
      for (const ch of line) {
        const jitterY = (Math.random() - 0.5) * 2.5;  // ±1.25px vertical jitter
        const jitterX = (Math.random() - 0.5) * 0.8;  // ±0.4px horizontal jitter
        ctx.fillText(ch, x + jitterX, y + jitterY);
        x += ctx.measureText(ch).width;
      }
      y += lineH;
    });

    // ── Render MCQ options with same jitter ──
    if (type === 'mcq' && options.length) {
      const letters = ['A','B','C','D','E','F'];
      ctx.font = `${fontSize - 2}px Arial`;
      options.forEach((opt, i) => {
        ctx.fillStyle = '#7ec8e3';
        const label = `${letters[i]}. ${opt}`;
        let x = pad + 12;
        for (const ch of label) {
          const jY = (Math.random() - 0.5) * 2;
          const jX = (Math.random() - 0.5) * 0.6;
          ctx.fillText(ch, x + jX, y + jY);
          x += ctx.measureText(ch).width;
        }
        y += lineH + 4;
      });
    }

    // ── Layer 5: Subtle color tint overlay post-text (further breaks AI search) ──
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = `hsl(${Math.random()*360},50%,50%)`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // ── Socket setup ──────────────────────────────────────────────────────────
  const socket = io();
  socket.emit('contestant_join_room', { code, contestant_id: cId });

  socket.on('you_are_dq', (data) => {
    document.body.innerHTML = `
      <div class="container py-5 text-center">
        <div class="display-1 mb-3">🚫</div>
        <h2 class="text-danger">${t('disqualified')}</h2>
        <p class="text-secondary">${data.reason}</p>
        <small class="text-warning">${t('disqualifiedDesc')}</small>
      </div>`;
    window._quizActive = false;
  });

  socket.on('new_question', (q) => {
    currentQ   = q;
    answered   = false;
    currentNote = q.note || '';
    questionStartTime = Date.now();
    window._quizActive = true;

    if (!isFS()) requestFS();

    $('#q-counter').text(`${t('question')} ${q.index + 1} / ${q.total}`);
    $('#answer-area,#waiting-panel,#result-panel,#final-panel').addClass('d-none');
    $('#warn-banner').addClass('d-none');

    renderQuestionCanvas(q.text, q.type, q.options);

    if (q.type === 'mcq') {
      const letters = ['A','B','C','D','E','F'];
      let html = '';
      q.options.forEach((opt, i) => {
        html += `<button class="btn btn-outline-info w-100 mb-2 mcq-btn" data-val="${opt}" title="Select option ${letters[i]}">
          ${letters[i]}. ${opt}
        </button>`;
      });
      $('#mcq-options').html(html).removeClass('d-none');
      $('#text-input-area').addClass('d-none');
      $('#submit-btn').data('selected', '');

      $('#mcq-options .mcq-btn').on('click', function () {
        if (answered) return;
        $('.mcq-btn').removeClass('btn-info').addClass('btn-outline-info');
        $(this).removeClass('btn-outline-info').addClass('btn-info');
        $('#submit-btn').data('selected', $(this).data('val'));
      });
    } else {
      $('#text-input-area').removeClass('d-none');
      $('#mcq-options').addClass('d-none');
      $('#text-answer').val('');
    }
    $('#answer-area').removeClass('d-none');
  });

  $('#submit-btn').on('click', function () {
    if (answered) return;
    let ans = '';
    if (currentQ && currentQ.type === 'mcq') {
      ans = $('#submit-btn').data('selected') || '';
    } else {
      ans = $('#text-answer').val().trim();
    }
    if (!ans) { showWarn(`❌ ${t('required') || 'Please enter or select an answer.'}`); return; }
    answered = true;
    const elapsed = Date.now() - questionStartTime;
    socket.emit('submit_answer', { code, contestant_id: cId, answer: ans, elapsed_ms: elapsed });
    $('#answer-area').addClass('d-none');
    $('#waiting-panel').removeClass('d-none');
  });

  socket.on('question_result', (data) => {
    $('#waiting-panel').addClass('d-none');
    const medals = ['🥇','🥈','🥉'];
    let html = '';
    data.top3.forEach((p, i) => {
      const self = p.name === cName;
      html += `<div class="badge ${self ? 'bg-success' : 'bg-secondary'} fs-6 m-1" title="${self ? 'This is you!' : ''}">
        ${medals[i]} ${p.name} — ${p.points}pts (${(p.elapsed_ms/1000).toFixed(2)}s)
      </div>`;
    });
    $('#top3-list').html(html || `<p class="text-secondary">${t('noContestants') || 'No correct answers this round.'}</p>`);
    $('#note-area').toggleClass('d-none', !currentNote).html(currentNote ? '📌 <strong>' + currentNote + '</strong>' : '');
    $('#result-panel').removeClass('d-none');
  });

  socket.on('quiz_finished', (data) => {
    window._quizActive = false;
    $('#result-panel,#answer-area,#waiting-panel').addClass('d-none');
    let html = `<table class="table table-dark table-striped">
      <thead><tr><th>#</th><th>${t('contestants') || 'Name'}</th><th>${t('topThisRound') ? 'Points' : 'Points'}</th></tr></thead><tbody>`;
    data.leaderboard.forEach((p, i) => {
      const self = p.name === cName ? 'table-success' : '';
      html += `<tr class="${self}"><td>${i+1}</td><td>${p.name}</td>
               <td class="fw-bold">${p.total_points}</td></tr>`;
    });
    html += '</tbody></table>';
    $('#final-board').html(html);
    $('#final-panel').removeClass('d-none');
    if (document.exitFullscreen) document.exitFullscreen();
  });
}