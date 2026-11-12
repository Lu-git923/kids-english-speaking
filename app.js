/* 英语口语小达人 — app.js */
(function () {
  'use strict';

  var PHRASES = window.PHRASES || [];
  var UNIT_SIZE = 20;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var synth = window.speechSynthesis || null;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------------- 本地存储 ---------------- */
  var mem = {};
  function load(k, def) {
    try {
      var v = localStorage.getItem('kes.' + k);
      return v === null ? def : JSON.parse(v);
    } catch (e) { return k in mem ? mem[k] : def; }
  }
  function save(k, v) {
    mem[k] = v;
    try { localStorage.setItem('kes.' + k, JSON.stringify(v)); } catch (e) {}
  }

  var store = {
    scores: load('scores', {}),      // id -> best score
    fav: load('fav', {}),            // id -> 1
    settings: load('settings', { voice: '', rate: 0.9, auto: true, zh: true, len: 20 })
  };

  var state = {
    queue: [], idx: 0, title: '', session: [],
    listening: false, rec: null, timer: null, current: null, lock: false
  };

  /* ---------------- 工具 ---------------- */
  function show(id) {
    ['home', 'practice'].forEach(function (s) {
      $(s).classList.toggle('active', s === id);
    });
  }
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function byId(id) {
    for (var i = 0; i < PHRASES.length; i++) if (PHRASES[i].id === id) return PHRASES[i];
    return null;
  }
  function isMobile() { return /iphone|ipad|ipod|android|mobile/i.test(navigator.userAgent); }

  /* ---------------- 录音对比 ---------------- */
  var recAudio = { mr: null, chunks: [], stream: null, url: null, t0: 0, tick: null, player: null };

  function audioSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  function updateRecBtn(on) {
    var b = $('btnRecAudio');
    if (!b) return;
    b.classList.toggle('rec-on', !!on);
    b.innerHTML = on ? '<span class="recording-dot"></span>停止录音' : '🔴 录音对比';
  }

  function cleanupRecAudio() {
    if (recAudio.stream) {
      recAudio.stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} });
      recAudio.stream = null;
    }
    recAudio.mr = null;
  }

  function startRecAudio() {
    if (recAudio.mr) return;
    if (synth) synth.cancel();
    if (state.listening) stopUI();
    $('playback').classList.add('hidden');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      recAudio.stream = stream;
      recAudio.chunks = [];
      var mr;
      try {
        mr = new MediaRecorder(stream, MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm')
          ? { mimeType: 'audio/webm' } : undefined);
      } catch (e) {
        try { mr = new MediaRecorder(stream); } catch (e2) { toast('这台设备不支持录音'); cleanupRecAudio(); return; }
      }
      recAudio.mr = mr;
      mr.ondataavailable = function (e) { if (e.data && e.data.size) recAudio.chunks.push(e.data); };
      mr.onstop = function () {
        var blob = new Blob(recAudio.chunks, { type: mr.mimeType || 'audio/webm' });
        if (recAudio.url) URL.revokeObjectURL(recAudio.url);
        recAudio.url = URL.createObjectURL(blob);
        cleanupRecAudio();
        updateRecBtn(false);
        $('playback').classList.remove('hidden');
      };
      try { mr.start(); } catch (e) { toast('录音启动失败'); cleanupRecAudio(); updateRecBtn(false); return; }
      recAudio.t0 = Date.now();
      updateRecBtn(true);
      clearInterval(recAudio.tick);
      recAudio.tick = setInterval(function () {
        var s = Math.floor((Date.now() - recAudio.t0) / 1000);
        var b = $('btnRecAudio');
        if (b) b.innerHTML = '<span class="recording-dot"></span>停止录音 ' + s + 's';
        if (s >= 15) stopRecAudio();
      }, 250);
    }).catch(function (err) {
      updateRecBtn(false);
      var name = err && err.name;
      toast(name === 'NotAllowedError' ? '麦克风被拒绝，请在浏览器设置里允许' : '无法开始录音');
    });
  }

  function stopRecAudio() {
    clearInterval(recAudio.tick);
    if (recAudio.mr && recAudio.mr.state !== 'inactive') {
      try { recAudio.mr.stop(); } catch (e) {}
    }
  }

  function playMine() {
    if (!recAudio.url) { toast('还没有录音'); return; }
    try {
      if (!recAudio.player) recAudio.player = new Audio();
      recAudio.player.src = recAudio.url;
      recAudio.player.currentTime = 0;
      recAudio.player.play().catch(function () { toast('播放失败，再点一次试试'); });
    } catch (e) { toast('播放失败'); }
  }

  function resetAudioTools() {
    clearInterval(recAudio.tick);
    if (recAudio.mr && recAudio.mr.state !== 'inactive') {
      try { recAudio.mr.onstop = null; recAudio.mr.stop(); } catch (e) {}
    }
    cleanupRecAudio();
    if (recAudio.url) { URL.revokeObjectURL(recAudio.url); recAudio.url = null; }
    updateRecBtn(false);
    if ($('playback')) $('playback').classList.add('hidden');
  }

  /* ---------------- 文本归一化 & 打分 ---------------- */
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function numToWords(n) {
    if (!isFinite(n)) return '';
    if (n < 0) return 'minus ' + numToWords(-n);
    if (n % 1 !== 0) {
      var parts = String(n).split('.');
      return numToWords(parseInt(parts[0], 10)) + ' point ' + parts[1].split('').map(function (d) { return ONES[+d]; }).join(' ');
    }
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
    if (n < 10000) return ONES[Math.floor(n / 1000)] + ' thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    return String(n);
  }

  function tokenize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[\u2018\u2019\u0060\u00b4]/g, "'")
      .replace(/(\d+(?:\.\d+)?)/g, function (m) { return ' ' + numToWords(parseFloat(m)) + ' '; })
      .replace(/'/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  function lev(a, b) {
    var m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1), i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  var LIGHT = { a: 1, an: 1, the: 1, to: 1, of: 1, in: 1, on: 1, at: 1, is: 1, am: 1, are: 1, be: 1, it: 1, and: 1, or: 1, but: 1, so: 1 };
  function wordWeight(w) { return LIGHT[w] ? 0.5 : 1; }

  // 同音词视为读对（语音识别常把 see 听成 sea）
  var HOMO = {};
  [['see', 'sea'], ['two', 'to', 'too'], ['four', 'for'], ['eight', 'ate'], ['one', 'won'],
   ['there', 'their', 'theyre'], ['here', 'hear'], ['right', 'write'], ['no', 'know'],
   ['son', 'sun'], ['by', 'buy', 'bye'], ['meat', 'meet'], ['week', 'weak'], ['i', 'eye'],
   ['hour', 'our'], ['weather', 'whether'], ['wood', 'would'], ['blue', 'blew'],
   ['night', 'knight'], ['red', 'read'], ['sale', 'sail'], ['tail', 'tale'], ['way', 'weigh'],
   ['deer', 'dear'], ['flour', 'flower'], ['board', 'bored'], ['threw', 'through'],
   ['whole', 'hole'], ['peace', 'piece'], ['wear', 'where'], ['which', 'witch'],
   ['hair', 'hare'], ['fair', 'fare'], ['plain', 'plane'], ['break', 'brake'],
   ['pair', 'pear'], ['die', 'dye'], ['flew', 'flu'], ['knew', 'new'], ['mail', 'male'],
   ['oar', 'or', 'ore'], ['rose', 'rows'], ['scene', 'seen'], ['steel', 'steal'],
   ['wait', 'weight'], ['war', 'wore'], ['write', 'right'], ['its', 'its']
  ].forEach(function (g) { g.forEach(function (w) { HOMO[w] = g[0]; }); });

  function wordCredit(a, b) {
    if (a === b) return 1;
    if (HOMO[a] && HOMO[a] === HOMO[b]) return 1;
    var len = Math.max(a.length, b.length);
    if (!len) return 1;
    var sim = 1 - lev(a, b) / len;
    if (sim >= 0.9) return 0.85;
    if (sim >= 0.75) return 0.55;
    if (sim >= 0.6) return 0.25;
    return 0;
  }

  // 词级对齐，返回每个参考词的状态
  function align(ref, hyp) {
    var m = ref.length, n = hyp.length;
    var INS = 0.45;
    var dp = [], bt = [], i, j;
    for (i = 0; i <= m; i++) { dp.push(new Array(n + 1).fill(0)); bt.push(new Array(n + 1).fill('')); }
    for (i = 1; i <= m; i++) { dp[i][0] = dp[i - 1][0] + wordWeight(ref[i - 1]); bt[i][0] = 'del'; }
    for (j = 1; j <= n; j++) { dp[0][j] = j * INS; bt[0][j] = 'ins'; }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        var credit = wordCredit(ref[i - 1], hyp[j - 1]);
        var wgt = wordWeight(ref[i - 1]);
        var sub = dp[i - 1][j - 1] + (1 - credit) * wgt;
        var del = dp[i - 1][j] + wgt;
        var ins = dp[i][j - 1] + INS;
        var best = sub, op = 'sub';
        if (del < best - 1e-9) { best = del; op = 'del'; }
        if (ins < best - 1e-9) { best = ins; op = 'ins'; }
        dp[i][j] = best; bt[i][j] = op;
      }
    }
    // 回溯
    var out = new Array(m);
    var credits = new Array(m);
    i = m; j = n;
    while (i > 0 || j > 0) {
      var op = i === 0 ? 'ins' : (j === 0 ? 'del' : bt[i][j]);
      if (op === 'sub') {
        credits[i - 1] = wordCredit(ref[i - 1], hyp[j - 1]);
        out[i - 1] = { w: ref[i - 1], credit: credits[i - 1] };
        i--; j--;
      } else if (op === 'del') {
        out[i - 1] = { w: ref[i - 1], credit: 0 };
        i--;
      } else {
        j--;
      }
    }
    var matched = 0;
    out.forEach(function (o) { if (o && o.credit >= 0.95) matched++; });
    var totalWeight = 0;
    for (i = 0; i < m; i++) totalWeight += wordWeight(ref[i]);
    return { cost: dp[m][n], words: out, matched: matched, total: m, weight: totalWeight };
  }

  function scoreTexts(refText, hypText) {
    var ref = tokenize(refText), hyp = tokenize(hypText);
    if (!ref.length) return { score: 0, words: [], matched: 0, total: 0, extra: 0 };
    if (!hyp.length) return { score: 0, words: ref.map(function (w) { return { w: w, credit: 0 }; }), matched: 0, total: ref.length, extra: 0 };
    var al = align(ref, hyp);
    var raw = 1 - al.cost / al.weight;
    var score = Math.max(0, Math.min(100, Math.round(raw * 100)));
    // 大量无关内容时进一步压低
    if (al.matched === 0 && hyp.length > 0) score = Math.min(score, 10);
    return {
      score: score,
      words: al.words.map(function (o) {
        return { w: o.w, credit: o.credit };
      }),
      matched: al.matched,
      total: al.total,
      extra: Math.max(0, hyp.length - ref.length)
    };
  }

  /* ---------------- 语音合成 ---------------- */
  var voices = [];
  var chosenVoice = null;

  function pickVoice() {
    voices = (synth ? synth.getVoices() : []).filter(function (v) {
      return /^en(-|_)?/i.test(v.lang) || /english/i.test(v.name);
    });
    if (!voices.length) return null;
    var want = store.settings.voice;
    if (want) {
      for (var i = 0; i < voices.length; i++) if (voices[i].voiceURI === want) return voices[i];
    }
    var prefer = [/google.*us.*english/i, /aria/i, /natural/i, /samantha/i, /zira/i, /jenny/i, /david/i, /mark/i, /us.*english/i];
    for (var p = 0; p < prefer.length; p++) {
      for (var k = 0; k < voices.length; k++) if (prefer[p].test(voices[k].name)) return voices[k];
    }
    var us = voices.filter(function (v) { return /en[-_]US/i.test(v.lang); });
    return us[0] || voices[0];
  }

  function refreshVoiceList() {
    var sel = $('selVoice');
    if (!sel) return;
    sel.innerHTML = '';
    if (!voices.length) {
      var o = document.createElement('option');
      o.textContent = '（系统没有找到英语语音）';
      sel.appendChild(o);
      if ($('voiceState')) $('voiceState').textContent = '⚠️ 系统里没有英语语音包，发音可能不标准。请在 Windows「设置 → 时间和语言 → 语音」中添加英语（美国）语音。';
      return;
    }
    if ($('voiceState')) $('voiceState').textContent = '共找到 ' + voices.length + ' 个英语语音，选一个孩子听着最清楚的。';
    voices.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v.voiceURI;
      o.textContent = v.name + ' · ' + v.lang;
      sel.appendChild(o);
    });
    if (chosenVoice) sel.value = chosenVoice.voiceURI;
  }

  function speak(text, rateOverride) {
    if (!synth) { toast('当前浏览器不支持朗读'); return; }
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    if (chosenVoice) u.voice = chosenVoice;
    u.rate = rateOverride || store.settings.rate || 0.9;
    u.pitch = 1.05;
    u.volume = 1;
    u.onerror = function () {};
    // iOS 上先 cancel 立刻 speak 会没声音，隔一小会儿再播
    setTimeout(function () { try { synth.speak(u); } catch (e) {} }, 60);
    // Chrome 偶发卡住，补一次 resume
    setTimeout(function () { try { synth.resume(); } catch (e) {} }, 120);
  }

  /* ---------------- 语音识别 ---------------- */
  function startRecord() {
    if (state.lock || state.listening) return;
    if (!SR) { openManual(); return; }
    if (synth) synth.cancel();
    if (recAudio.mr) stopRecAudio();

    state.listening = true;
    state.userFinished = false;
    state.interim = '';
    state.finalText = '';
    state.alts = [];
    $('result').classList.add('hidden');
    $('manual').classList.add('hidden');
    $('liveBox').classList.remove('hidden');
    $('liveText').textContent = '我在听……大声读出来吧';
    $('btnRecord').classList.add('listening');
    $('btnRecord').textContent = '🎙️ 正在听……';
    $('btnDone').classList.remove('hidden');

    var rec;
    try { rec = new SR(); } catch (e) { stopUI(); toast('无法启动麦克风'); return; }
    state.rec = rec;
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 5;

    var got = false;
    rec.onresult = function (e) {
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var r = e.results[i];
        if (r.isFinal) {
          got = true;
          for (var a = 0; a < r.length; a++) state.alts.push(r[a].transcript);
          state.finalText += ' ' + r[0].transcript;
        } else {
          interim += r[0].transcript;
        }
      }
      state.interim = interim;
      var live = (state.finalText + ' ' + interim).trim();
      if (live) $('liveText').textContent = live;
    };
    rec.onerror = function (e) {
      // 用户已经点了「读完了」：某些浏览器 stop() 会报 aborted，直接按现有内容评分
      if (state.userFinished && (e.error === 'aborted' || e.error === 'no-speech')) {
        forceFinish();
        return;
      }
      stopUI();
      var map = {
        'not-allowed': '麦克风被拒绝了，请点地址栏的🔒允许麦克风',
        'service-not-allowed': '麦克风被拒绝，请允许后重试',
        'no-speech': '没听到声音，再试一次吧',
        'audio-capture': '没有找到麦克风',
        'network': '语音识别需要联网，网络不通。可以换 Edge 浏览器试试',
        'aborted': ''
      };
      var msg = map[e.error];
      if (msg === undefined) msg = '识别出错：' + e.error;
      if (msg) toast(msg);
      if (e.error === 'network' || e.error === 'service-not-allowed' || e.error === 'audio-capture') openManual();
      got = false;
    };
    rec.onend = function () {
      var finished = state.userFinished;
      var spoken = (state.finalText + ' ' + (state.interim || '')).trim();
      stopUI();
      if (finished) {
        if (!spoken) { toast('没听清，再大声一点试试～'); return; }
        evaluate();
        return;
      }
      if (!got || !state.finalText.trim()) {
        if (!state.manualOpen) toast('没听清，再大声一点试试～');
        return;
      }
      evaluate();
    };
    try {
      rec.start();
    } catch (e) {
      stopUI();
      toast('麦克风启动失败，请重试');
      return;
    }
    clearTimeout(state.timer);
    state.timer = setTimeout(function () {
      if (state.listening) { try { rec.stop(); } catch (e) {} }
    }, 12000);
  }

  function stopUI() {
    state.listening = false;
    state.userFinished = false;
    clearTimeout(state.timer);
    clearTimeout(state.endTimer);
    $('liveBox').classList.add('hidden');
    $('btnRecord').classList.remove('listening');
    $('btnRecord').textContent = '🎤 开始跟读';
    $('btnDone').classList.add('hidden');
    if (state.rec) { try { state.rec.onend = null; state.rec.abort(); } catch (e) {} state.rec = null; }
  }

  /* 点「读完了」= 立刻停止识别并评分，不用等自动断句 */
  function finishRecord() {
    if (!state.listening || !state.rec) return;
    state.userFinished = true;
    clearTimeout(state.timer);
    try { state.rec.stop(); } catch (e) { forceFinish(); return; }
    clearTimeout(state.endTimer);
    state.endTimer = setTimeout(function () {
      if (state.listening) forceFinish();   // 兜底：个别浏览器不触发 onend
    }, 1500);
  }

  function forceFinish() {
    var text = (state.finalText + ' ' + (state.interim || '')).trim();
    var rec = state.rec;
    if (rec) { try { rec.onend = null; rec.abort(); } catch (e) {} }
    stopUI();
    if (!text) { toast('没听清，再大声一点试试～'); return; }
    if (state.alts.indexOf(text) < 0) state.alts.push(text);
    evaluate();
  }

  function evaluate() {
    var p = state.current;
    if (!p) return;
    var best = null;
    var cands = state.alts.slice();
    if (state.finalText.trim()) cands.push(state.finalText.trim());
    if (state.interim && state.interim.trim()) cands.push(state.interim.trim());
    cands.forEach(function (t) {
      var r = scoreTexts(p.en, t);
      if (!best || r.score > best.score) { best = r; best.text = t; }
    });
    if (!best) return;
    renderResult(best);
  }

  /* ---------------- 结果展示 ---------------- */
  var PRAISE = [
    { min: 95, txt: '太厉害了！跟老外一样标准！', emoji: '🏆' },
    { min: 85, txt: '很棒！发音很清楚！', emoji: '🎉' },
    { min: 70, txt: '不错哦，再顺一点就更好了！', emoji: '👍' },
    { min: 50, txt: '有进步！跟着慢速再读一遍吧', emoji: '💪' },
    { min: 0, txt: '别急，先听两遍再跟读～', emoji: '🤔' }
  ];

  function renderResult(res) {
    var p = state.current;
    var score = res.score;
    var prev = store.scores[p.id] || 0;
    if (score > prev) { store.scores[p.id] = score; save('scores', store.scores); }

    var pr = PRAISE.filter(function (x) { return score >= x.min; })[0];
    var stars = score >= 90 ? 3 : score >= 75 ? 2 : score >= 60 ? 1 : 0;
    var color = score >= 85 ? '#2fc46b' : score >= 70 ? '#4f8cff' : score >= 50 ? '#ff9f43' : '#ff6b9d';

    $('scoreNum').textContent = score;
    $('scoreRing').style.background = 'conic-gradient(' + color + ' ' + (score * 3.6) + 'deg,#eaf0fa 0deg)';
    $('stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    $('praise').textContent = pr.emoji + ' ' + pr.txt;
    $('praise').style.color = color;
    $('subScore').textContent = '读对 ' + res.matched + ' / ' + res.total + ' 个词' + (res.extra ? ' · 多了 ' + res.extra + ' 个词' : '');

    var diff = $('diff');
    diff.innerHTML = '';
    res.words.forEach(function (w) {
      var cls = w.credit >= 0.95 ? 'ok' : w.credit >= 0.4 ? 'near' : 'miss';
      var el = document.createElement('span');
      el.className = 'chip ' + cls;
      el.textContent = w.w;
      diff.appendChild(el);
    });

    $('bestBadge').textContent = '最好 ' + store.scores[p.id] + ' 分';
    $('result').classList.remove('hidden');
    $('manual').classList.add('hidden');
    if (score >= 90) confetti();
    save('scores', store.scores);
    var sess = state.session.filter(function (x) { return x.id === p.id; })[0];
    if (sess) sess.score = Math.max(sess.score, score);
    else state.session.push({ id: p.id, score: score });
    if (isMobile()) {
      setTimeout(function () {
        try { $('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
      }, 80);
    }
  }

  function openManual() {
    state.manualOpen = true;
    $('result').classList.add('hidden');
    $('manual').classList.remove('hidden');
  }

  function confetti() {
    var box = $('confetti');
    var emo = ['⭐', '🎉', '✨', '🌟', '🎈', '💫'];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('i');
      s.textContent = emo[Math.floor(Math.random() * emo.length)];
      s.style.left = (Math.random() * 92 + 4) + '%';
      s.style.top = (-10 - Math.random() * 30) + 'px';
      s.style.animationDelay = (Math.random() * 0.35) + 's';
      s.style.fontSize = (16 + Math.random() * 16) + 'px';
      box.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 2200); })(s);
    }
  }

  /* ---------------- 练习流程 ---------------- */
  function startPractice(ids, title) {
    if (!ids.length) { toast('这里还没有内容哦'); return; }
    state.queue = ids.slice();
    state.idx = 0;
    state.title = title;
    state.session = [];
    show('practice');
    renderPhrase();
  }

  function renderPhrase() {
    var p = byId(state.queue[state.idx]);
    if (!p) return finish();
    state.current = p;
    state.manualOpen = false;
    state.lock = false;

    $('enText').textContent = p.en;
    $('zhText').textContent = p.zh;
    $('zhText').classList.toggle('hidden', !store.settings.zh);
    $('toggleZh').textContent = store.settings.zh ? '隐藏中文' : '显示中文';
    $('badgeInfo').textContent = state.title;
    var best = store.scores[p.id];
    $('bestBadge').textContent = best ? '最好 ' + best + ' 分' : '还没读过';
    $('btnFav').textContent = store.fav[p.id] ? '★' : '☆';
    $('btnFav').classList.toggle('on', !!store.fav[p.id]);

    $('result').classList.add('hidden');
    $('manual').classList.add('hidden');
    $('liveBox').classList.add('hidden');
    $('diff').innerHTML = '';
    resetAudioTools();
    $('scoreRing').style.background = 'conic-gradient(#eaf0fa 0deg,#eaf0fa 0deg)';

    var n = state.queue.length;
    $('progressText').textContent = (state.idx + 1) + ' / ' + n;
    $('progressBar').style.width = ((state.idx) / n * 100) + '%';

    if (store.settings.auto) setTimeout(function () { speak(p.en); }, 180);
  }

  function nextPhrase() {
    if (state.listening) stopUI();
    if (synth) synth.cancel();
    state.idx++;
    if (state.idx >= state.queue.length) { finish(); return; }
    renderPhrase();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
  }

  function finish() {
    if (synth) synth.cancel();
    var s = state.session;
    if (!s.length) { show('home'); renderHome(); return; }
    var avg = Math.round(s.reduce(function (a, b) { return a + b.score; }, 0) / s.length);
    var stars = s.filter(function (x) { return x.score >= 90; }).length;
    $('sumAvg').textContent = avg;
    $('sumCount').textContent = s.length;
    $('sumStars').textContent = stars;
    $('sumEmoji').textContent = avg >= 85 ? '🏆' : avg >= 70 ? '🎉' : '💪';
    $('sumTitle').textContent = avg >= 85 ? '太棒啦，这一轮超厉害！' : avg >= 70 ? '这一轮完成啦！' : '完成啦，再练一次会更好！';

    var weak = s.filter(function (x) { return x.score < 80; })
      .sort(function (a, b) { return a.score - b.score; })
      .slice(0, 8);
    var list = $('sumList');
    list.innerHTML = '';
    if (!weak.length) {
      list.innerHTML = '<p class="tiny" style="text-align:center">全部都在 80 分以上，太强了！🌟</p>';
    } else {
      weak.forEach(function (w) {
        var p = byId(w.id);
        var row = document.createElement('div');
        row.className = 'sum-item';
        row.innerHTML = '<span>' + p.en + '</span><i>' + w.score + '</i>';
        list.appendChild(row);
      });
    }
    $('summary').classList.remove('hidden');
  }

  /* ---------------- 首页 ---------------- */
  function renderHome() {
    var scores = store.scores;
    var ids = Object.keys(scores);
    $('stDone').textContent = ids.length;
    $('stAvg').textContent = ids.length
      ? Math.round(ids.reduce(function (a, k) { return a + scores[k]; }, 0) / ids.length) : 0;
    $('stStars').textContent = ids.filter(function (k) { return scores[k] >= 90; }).length;

    var grid = $('unitGrid');
    grid.innerHTML = '';
    var total = Math.ceil(PHRASES.length / UNIT_SIZE);
    for (var u = 1; u <= total; u++) {
      var from = (u - 1) * UNIT_SIZE + 1;
      var to = Math.min(u * UNIT_SIZE, PHRASES.length);
      var done = 0, sum = 0, cnt = 0;
      for (var i = from; i <= to; i++) {
        var sc = scores[i];
        if (sc) { cnt++; sum += sc; if (sc >= 80) done++; }
      }
      var btn = document.createElement('button');
      btn.className = 'unit' + (done === (to - from + 1) ? ' complete' : '');
      btn.innerHTML =
        '<span class="no">第 ' + u + ' 关</span>' +
        '<div class="range">' + from + ' – ' + to + ' 句</div>' +
        '<div class="bar"><i style="width:' + (done / (to - from + 1) * 100) + '%"></i></div>' +
        '<div class="done">' + (cnt ? (cnt + ' 句已练 · 均 ' + Math.round(sum / cnt) + ' 分') : '还没开始') + '</div>';
      (function (u, from, to) {
        btn.addEventListener('click', function () {
          var arr = [];
          for (var k = from; k <= to; k++) arr.push(k);
          startPractice(arr, '第 ' + u + ' 关');
        });
      })(u, from, to);
      grid.appendChild(btn);
    }

    // 按场景分类
    var catGrid = $('catGrid');
    if (catGrid) {
      var catMap = {}, catOrder = [];
      PHRASES.forEach(function (p) {
        if (!p.cat) return;
        if (!catMap[p.cat]) { catMap[p.cat] = []; catOrder.push(p.cat); }
        catMap[p.cat].push(p.id);
      });
      catGrid.innerHTML = '';
      if (!catOrder.length) {
        $('catHead').classList.add('hidden');
        catGrid.classList.add('hidden');
      } else {
        catOrder.forEach(function (name) {
          var list = catMap[name];
          var done = list.filter(function (id) { return (scores[id] || 0) >= 80; }).length;
          var b = document.createElement('button');
          b.className = 'cat';
          b.innerHTML =
            '<span class="c-emoji">' + catEmoji(name) + '</span>' +
            '<span class="c-body">' +
            '<span class="c-name">' + name + '</span>' +
            '<span class="c-cnt">' + list.length + ' 句 · 已练 ' + done + '</span>' +
            '<span class="c-bar"><i style="width:' + Math.round(done / list.length * 100) + '%"></i></span>' +
            '</span>';
          b.addEventListener('click', function () { startCategory(list, name, scores); });
          catGrid.appendChild(b);
        });
      }
    }
  }

  function catEmoji(name) {
    var map = [
      [/职场|工作/, '💼'], [/会议/, '🗣️'], [/日常|社交/, '☕'], [/观点/, '💡'],
      [/问题|突发/, '🛠️'], [/购物|餐厅|消费/, '🛒'], [/旅行|出行|住宿/, '✈️'],
      [/家庭|健康/, '🏠'], [/学习|成长/, '📚'], [/电话|网络/, '📞']
    ];
    for (var i = 0; i < map.length; i++) if (map[i][0].test(name)) return map[i][1];
    return '🎯';
  }

  // 从该场景里挑「还没练熟」的句子，凑一轮（默认 20 句），练完再点会接着往后
  function startCategory(list, name, scores) {
    var start = -1;
    for (var i = 0; i < list.length; i++) {
      if ((scores[list[i]] || 0) < 80) { start = i; break; }
    }
    if (start < 0) start = 0;                        // 全练熟了就从头发再复习一遍
    var n = Math.min(store.settings.len || 20, list.length);
    var slice = [];
    for (var k = 0; k < n; k++) slice.push(list[(start + k) % list.length]);
    startPractice(slice, name);
  }

  /* ---------------- 事件 ---------------- */
  function bind() {
    $('btnPlay').addEventListener('click', function () { speak(state.current.en); });
    $('btnSlow').addEventListener('click', function () { speak(state.current.en, 0.6); });
    $('btnRecord').addEventListener('click', function () {
      if (state.listening) finishRecord(); else startRecord();
    });
    $('btnDone').addEventListener('click', finishRecord);
    $('btnRecAudio').addEventListener('click', function () {
      if (recAudio.mr) stopRecAudio(); else startRecAudio();
    });
    $('btnPlayMine').addEventListener('click', playMine);
    $('btnPlayStd').addEventListener('click', function () { speak(state.current.en); });
    $('btnReRec').addEventListener('click', function () { resetAudioTools(); startRecAudio(); });
    $('btnAgain').addEventListener('click', function () {
      $('result').classList.add('hidden');
      speak(state.current.en);
    });
    $('btnNext').addEventListener('click', nextPhrase);
    $('btnBack').addEventListener('click', function () {
      if (state.listening) stopUI();
      if (synth) synth.cancel();
      show('home'); renderHome();
    });
    $('toggleZh').addEventListener('click', function () {
      store.settings.zh = !store.settings.zh;
      save('settings', store.settings);
      $('zhText').classList.toggle('hidden', !store.settings.zh);
      $('toggleZh').textContent = store.settings.zh ? '隐藏中文' : '显示中文';
    });
    $('btnFav').addEventListener('click', function () {
      var id = state.current.id;
      if (store.fav[id]) { delete store.fav[id]; toast('已取消收藏'); }
      else { store.fav[id] = 1; toast('已收藏 ⭐'); }
      save('fav', store.fav);
      $('btnFav').textContent = store.fav[id] ? '★' : '☆';
      $('btnFav').classList.toggle('on', !!store.fav[id]);
    });

    $('btnManualOk').addEventListener('click', function () {
      var p = state.current;
      renderResult({ score: 88, matched: tokenize(p.en).length, total: tokenize(p.en).length, extra: 0,
        words: tokenize(p.en).map(function (w) { return { w: w, credit: 1 }; }) });
      state.manualOpen = false;
    });
    $('btnManualNo').addEventListener('click', function () {
      state.manualOpen = false;
      $('manual').classList.add('hidden');
      speak(state.current.en, 0.6);
    });

    Array.prototype.forEach.call(document.querySelectorAll('.qbtn[data-mode]'), function (b) {
      b.addEventListener('click', function () {
        var mode = b.dataset.mode;
        if (mode === 'random') {
          var all = PHRASES.map(function (p) { return p.id; });
          startPractice(shuffle(all).slice(0, store.settings.len), '🎲 随机挑战');
        } else if (mode === 'wrong') {
          var bad = Object.keys(store.scores)
            .filter(function (k) { return store.scores[k] < 75; })
            .sort(function (a, b) { return store.scores[a] - store.scores[b]; })
            .slice(0, store.settings.len);
          if (!bad.length) { toast('还没有错题，先去闯关吧～'); return; }
          startPractice(bad, '📕 错题本');
        } else if (mode === 'fav') {
          var favs = Object.keys(store.fav);
          if (!favs.length) { toast('还没有收藏，点句子右上角 ☆ 收藏'); return; }
          startPractice(favs, '⭐ 我的收藏');
        }
      });
    });

    $('btnSumHome').addEventListener('click', function () {
      $('summary').classList.add('hidden'); show('home'); renderHome();
    });
    $('btnSumAgain').addEventListener('click', function () {
      $('summary').classList.add('hidden');
      state.idx = 0; state.session = []; renderPhrase();
    });

    /* 设置 */
    $('btnSettings').addEventListener('click', function () {
      $('settings').classList.remove('hidden');
      refreshVoiceList();
      $('rateRange').value = store.settings.rate;
      $('rateVal').textContent = store.settings.rate;
      $('chkAuto').checked = !!store.settings.auto;
      $('chkZh').checked = !!store.settings.zh;
      $('selLen').value = String(store.settings.len);
      $('srState').textContent = SR
        ? '✅ 当前浏览器支持语音识别评分'
        : '⚠️ 当前浏览器不支持语音识别（请用 Edge 或 Chrome），现在只能手动打分。';
    });
    $('btnCloseSet').addEventListener('click', function () {
      $('settings').classList.add('hidden');
    });
    $('selVoice').addEventListener('change', function () {
      store.settings.voice = this.value;
      chosenVoice = pickVoice();
      save('settings', store.settings);
      speak('Hello! Nice to meet you.');
    });
    $('rateRange').addEventListener('input', function () {
      store.settings.rate = parseFloat(this.value);
      $('rateVal').textContent = this.value;
      save('settings', store.settings);
    });
    $('rateRange').addEventListener('change', function () { speak('How are you today?'); });
    $('chkAuto').addEventListener('change', function () {
      store.settings.auto = this.checked; save('settings', store.settings);
    });
    $('chkZh').addEventListener('change', function () {
      store.settings.zh = this.checked; save('settings', store.settings);
      if (state.current) {
        $('zhText').classList.toggle('hidden', !this.checked);
        $('toggleZh').textContent = this.checked ? '隐藏中文' : '显示中文';
      }
    });
    $('selLen').addEventListener('change', function () {
      store.settings.len = parseInt(this.value, 10); save('settings', store.settings);
    });
    $('btnReset').addEventListener('click', function () {
      if (!confirm('确定清空所有学习记录吗？（分数、收藏都会删除）')) return;
      store.scores = {}; store.fav = {};
      save('scores', {}); save('fav', {});
      renderHome();
      toast('已清空记录');
    });

    document.addEventListener('keydown', function (e) {
      if (!$('practice').classList.contains('active')) return;
      if ($('settings').classList.contains('hidden') === false) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.code === 'Space') { e.preventDefault(); speak(state.current.en); }
      else if (e.key === 'r' || e.key === 'R') { if (state.listening) finishRecord(); else startRecord(); }
      else if (e.key === 'ArrowRight') { nextPhrase(); }
    });
  }

  // 调试/测试入口
  window.__kes = {
    scoreTexts: scoreTexts, tokenize: tokenize, state: state, store: store,
    renderResult: renderResult, phrases: PHRASES, recAudio: recAudio
  };

  /* ---------------- 手机 / 微信 ---------------- */
  function copyLink() {
    var url = location.href;
    function done(ok) { toast(ok ? '链接已复制，粘贴到微信发出去就行' : '复制失败，请长按地址栏复制'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { done(true); }, function () { legacyCopy(url); done(true); });
    } else { legacyCopy(url); done(true); }
  }
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
  }

  function initMobile() {
    var ua = (navigator.userAgent || '').toLowerCase();
    // 微信/企微内置浏览器不支持语音识别，提示用系统浏览器打开
    if (/micromessenger|wxwork/.test(ua)) {
      $('wxTip').classList.remove('hidden');
    }
    $('wxCopy').addEventListener('click', copyLink);
    $('wxStill').addEventListener('click', function () { $('wxTip').classList.add('hidden'); });

    // iOS 首次必须由用户手势解锁语音合成
    var unlocked = false;
    function unlock() {
      if (unlocked || !synth) return;
      unlocked = true;
      try {
        var u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        synth.speak(u);
      } catch (e) {}
    }
    ['touchstart', 'pointerdown', 'click'].forEach(function (ev) {
      document.addEventListener(ev, unlock, { once: true, capture: true, passive: true });
    });
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    if (!PHRASES.length) {
      document.body.innerHTML = '<p style="padding:40px;text-align:center">数据没有加载成功，请确认 data/phrases.js 存在。</p>';
      return;
    }
    if (synth) {
      voices = synth.getVoices();
      chosenVoice = pickVoice();
      synth.onvoiceschanged = function () { chosenVoice = pickVoice(); refreshVoiceList(); };
    }
    if (audioSupported()) $('audioTools').classList.remove('hidden');
    initMobile();
    bind();
    renderHome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
