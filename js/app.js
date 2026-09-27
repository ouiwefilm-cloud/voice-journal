// Tongue twisters data
  const twisters = [
    "간장 공장 공장장은 강 공장장이고, 된장 공장 공장장은 공 공장장이다.",
    "내가 그린 기린 그림은 목 긴 기린 그림이고, 네가 그린 기린 그림은 목 짧은 기린 그림이다.",
    "저 분은 백 법학박사이고, 이 분은 박 법학박사이다.",
    "경찰청 쇠창살 외철창살, 검찰청 쇠창살 쌍철창살.",
    "앞집 팥죽은 붉은 팥 풋팥죽이고, 뒷집 콩죽은 검은 콩 햇콩죽이다.",
    "중앙청 창살은 쌍창살이고, 시청 창살은 외창살이다.",
    "서울특별시 특허허가과 허가과장 허 과장.",
    "한국관광공사 곽진광 관광과장.",
    "박범복 군은 밤 벚꽃놀이를 가고, 방범복 양은 낮 벚꽃놀이를 간다.",
    "저기 있는 말뚝이 말 맬 말뚝이냐 말 안 맬 말뚝이냐.",
    "상표 붙인 큰 깡통은 깐 콩 깡통인가 안 깐 콩 깡통인가.",
    "들의 콩깍지는 깐 콩깍지인가 안 깐 콩깍지인가. 깐 콩깍지면 어떻고 안 깐 콩깍지면 어떠냐.",
    "내가 그린 구름 그림은 새털구름 그린 그림이고, 네가 그린 구름 그림은 깃털구름 그린 그림이다.",
    "작년에 온 솥 장수는 새 솥 장수이고, 금년에 온 솥 장수는 헌 솥 장수이다.",
    "신진 샹송가수의 신춘 샹송 쇼.",
    "저기 저 뜀틀이 내가 뛸 뜀틀인가 내가 안 뛸 뜀틀인가.",
    "옆집 팥죽은 붉은 팥 풋 팥죽, 우리집 콩죽은 검정 콩 단 콩죽.",
    "간장 공장 공장장 강 공장장 공공장 공장장 공 공장장.",
    "들에 콩깍지는 깐 콩깍지인가 안 깐 콩깍지인가.",
    "저기 계신 저 분이 박 법학박사이시고, 여기 계신 이 분이 백 법학박사이시다."
  ];

  // Render list
  const listEl = document.getElementById('twister-list');
  const storageKey = 'voice-journal-twisters-done';
  let doneSet = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));

  function render() {
    listEl.innerHTML = '';
    twisters.forEach((text, i) => {
      const item = document.createElement('div');
      item.className = 'twister-item' + (doneSet.has(i) ? ' done' : '');
      item.innerHTML = `
        <div class="twister-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="twister-text">${text}</div>
        <button class="twister-check${doneSet.has(i) ? ' checked' : ''}" data-idx="${i}" aria-label="완료 표시"></button>
      `;
      listEl.appendChild(item);
    });
    // Update dashboard counter
    const counter = document.getElementById('dash-twister-count');
    if (counter) counter.textContent = `${doneSet.size}/${twisters.length}`;
  }

  listEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('twister-check')) {
      const idx = parseInt(e.target.dataset.idx);
      if (doneSet.has(idx)) doneSet.delete(idx);
      else doneSet.add(idx);
      localStorage.setItem(storageKey, JSON.stringify([...doneSet]));
      render();
    }
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('연습 기록을 모두 초기화할까요?')) {
      doneSet.clear();
      localStorage.removeItem(storageKey);
      render();
    }
  });

  render();

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.script-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Smooth scroll offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
        // Close menu if open
        document.body.classList.remove('menu-open');
      }
    });
  });

  // Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const menuOverlay = document.getElementById('menu-overlay');

  function openMenu() { document.body.classList.add('menu-open'); }
  function closeMenu() { document.body.classList.remove('menu-open'); }

  menuToggle.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });
  menuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Scroll Progress + Current Section + Float Button
  const scrollProgress = document.getElementById('scroll-progress');
  const currentSectionEl = document.getElementById('current-section');
  const floatBtn = document.getElementById('float-btn');

  const sectionMap = [
    { id: 'daily-broadcast', label: '오늘의 멘트' },
    { id: 'daily', label: '일상 습관' },
    { id: 'vocal', label: '발성 훈련' },
    { id: 'articulation', label: '발음 훈련' },
    { id: 'scripts', label: '아나운서 멘트' },
    { id: 'twister', label: '잰말 놀이' },
    { id: 'modeling', label: '모델링 연습' },
    { id: 'pitch', label: '피치 모니터' },
    { id: 'resources', label: '자료실' }
  ];

  function updateScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';

    // Float button visibility
    if (scrollTop > 600) floatBtn.classList.add('visible');
    else floatBtn.classList.remove('visible');

    // Current section detection
    const triggerY = window.innerHeight * 0.3;
    let currentLabel = '';
    for (const s of sectionMap) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerY) currentLabel = s.label;
      else break;
    }

    if (currentLabel && scrollTop > 200) {
      currentSectionEl.textContent = currentLabel;
      currentSectionEl.classList.add('visible');
    } else {
      currentSectionEl.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Float button - back to top
  floatBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Practice Log (Modeling section)
  const logStorageKey = 'voice-journal-practice-log';
  const logInput = document.getElementById('log-input');
  const logSaveBtn = document.getElementById('log-save');
  const logToggleBtn = document.getElementById('log-toggle');
  const logListEl = document.getElementById('log-list');
  const logCountEl = document.getElementById('log-count');

  let logs = JSON.parse(localStorage.getItem(logStorageKey) || '[]');

  function updateLogCount() {
    logCountEl.textContent = `${logs.length}개`;
  }

  function renderLogs() {
    if (logs.length === 0) {
      logListEl.innerHTML = '<p style="color: var(--ink-mute); font-size: 14px; padding: 10px;">아직 기록이 없어요.</p>';
      return;
    }
    logListEl.innerHTML = logs.map((log, i) => `
      <div class="log-entry">
        <span class="log-date">${log.date}</span>
        ${log.text.replace(/</g, '&lt;').replace(/\n/g, '<br>')}
        <button class="log-delete" data-idx="${i}" aria-label="삭제">×</button>
      </div>
    `).join('');
  }

  logSaveBtn.addEventListener('click', () => {
    const text = logInput.value.trim();
    if (!text) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    logs.unshift({ date: dateStr, text });
    localStorage.setItem(logStorageKey, JSON.stringify(logs));
    logInput.value = '';
    updateLogCount();
    renderLogs();
    if (logListEl.style.display === 'none') {
      logListEl.style.display = 'block';
      logToggleBtn.textContent = '기록 접기';
    }
  });

  logToggleBtn.addEventListener('click', () => {
    if (logListEl.style.display === 'none') {
      renderLogs();
      logListEl.style.display = 'block';
      logToggleBtn.textContent = '기록 접기';
    } else {
      logListEl.style.display = 'none';
      logToggleBtn.textContent = '지난 기록 보기';
    }
  });

  logListEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('log-delete')) {
      const idx = parseInt(e.target.dataset.idx);
      if (confirm('이 기록을 삭제할까요?')) {
        logs.splice(idx, 1);
        localStorage.setItem(logStorageKey, JSON.stringify(logs));
        updateLogCount();
        renderLogs();
      }
    }
  });

  updateLogCount();

  // ==========================================
  // Pitch Monitor
  // ==========================================

  const NOTE_NAMES_KO = ['도', '도♯', '레', '레♯', '미', '파', '파♯', '솔', '솔♯', '라', '라♯', '시'];
  const NOTE_NAMES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Piano roll range: C3 (MIDI 48) to C5 (MIDI 72) — covers E3~E4 and surroundings
  const MIDI_MIN = 48;
  const MIDI_MAX = 72;
  const TARGET_MIN_MIDI = 52;  // E3
  const TARGET_MAX_MIDI = 64;  // E4

  function freqToMidi(freq) {
    return 69 + 12 * Math.log2(freq / 440);
  }
  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  function midiToNoteName(midi) {
    const rounded = Math.round(midi);
    const octave = Math.floor(rounded / 12) - 1;
    const noteIndex = ((rounded % 12) + 12) % 12;
    return {
      ko: NOTE_NAMES_KO[noteIndex] + octave,
      en: NOTE_NAMES_EN[noteIndex] + octave,
      octave,
      noteIndex
    };
  }

  // Autocorrelation-based pitch detection
  function detectPitch(buffer, sampleRate) {
    const SIZE = buffer.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    const trimmed = buffer.slice(r1, r2);
    const newSize = trimmed.length;
    if (newSize < 100) return -1;

    const c = new Array(newSize).fill(0);
    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize - i; j++) {
        c[i] = c[i] + trimmed[j] * trimmed[j + i];
      }
    }

    let d = 0;
    while (d < newSize - 1 && c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < newSize; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    if (maxpos <= 0) return -1;
    let T0 = maxpos;

    const x1 = c[T0 - 1] || 0, x2 = c[T0] || 0, x3 = c[T0 + 1] || 0;
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  // State
  let audioContext = null;
  let analyser = null;
  let micStream = null;
  let rafId = null;
  let isActive = false;
  let smoothedMidi = null;
  const SMOOTH_FACTOR = 0.7;

  let measurements = [];
  let inTargetCount = 0;
  let totalCount = 0;
  let startTime = null;

  const HISTORY_SECONDS = 10;
  const HISTORY_FPS = 20;
  const HISTORY_LEN = HISTORY_SECONDS * HISTORY_FPS;
  let history = new Array(HISTORY_LEN).fill(null);
  let lastHistoryPush = 0;

  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const micBtn = document.getElementById('mic-btn');
  const micBtnText = document.getElementById('mic-btn-text');
  const pitchNoteEl = document.getElementById('pitch-note');
  const pitchFreqEl = document.getElementById('pitch-freq');
  const pitchFeedbackEl = document.getElementById('pitch-feedback');
  const pitchReading = document.querySelector('.pitch-reading');
  const pianoRoll = document.getElementById('piano-roll');
  const targetZone = document.getElementById('target-zone');
  const pitchIndicator = document.getElementById('pitch-indicator');
  const statAvg = document.getElementById('stat-avg');
  const statAccuracy = document.getElementById('stat-accuracy');
  const statDuration = document.getElementById('stat-duration');
  const statReset = document.getElementById('stat-reset');
  const historyCanvas = document.getElementById('pitch-history');
  const historyCtx = historyCanvas.getContext('2d');

  function buildPianoRoll() {
    const range = MIDI_MAX - MIDI_MIN;
    for (let midi = MIDI_MIN; midi <= MIDI_MAX; midi++) {
      const { ko, noteIndex } = midiToNoteName(midi);
      const pct = ((MIDI_MAX - midi) / range) * 100;
      const marker = document.createElement('div');
      marker.className = 'note-marker';
      if (noteIndex === 0) marker.classList.add('octave');
      marker.style.top = pct + '%';
      if (noteIndex === 0 || noteIndex === 4) {
        marker.innerHTML = `<span>${ko}</span>`;
      }
      pianoRoll.appendChild(marker);
    }
    const topPct = ((MIDI_MAX - TARGET_MAX_MIDI) / range) * 100;
    const bottomPct = ((MIDI_MAX - TARGET_MIN_MIDI) / range) * 100;
    targetZone.style.top = topPct + '%';
    targetZone.style.height = (bottomPct - topPct) + '%';
  }
  buildPianoRoll();

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = historyCanvas.getBoundingClientRect();
    historyCanvas.width = rect.width * dpr;
    historyCanvas.height = rect.height * dpr;
    historyCtx.setTransform(1, 0, 0, 1, 0, 0);
    historyCtx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function renderHistory() {
    const rect = historyCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    historyCtx.clearRect(0, 0, w, h);

    const range = MIDI_MAX - MIDI_MIN;
    const topY = ((MIDI_MAX - TARGET_MAX_MIDI) / range) * h;
    const bottomY = ((MIDI_MAX - TARGET_MIN_MIDI) / range) * h;
    historyCtx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    historyCtx.fillRect(0, topY, w, bottomY - topY);

    historyCtx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
    historyCtx.setLineDash([4, 4]);
    historyCtx.lineWidth = 1;
    historyCtx.beginPath();
    historyCtx.moveTo(0, topY); historyCtx.lineTo(w, topY);
    historyCtx.moveTo(0, bottomY); historyCtx.lineTo(w, bottomY);
    historyCtx.stroke();
    historyCtx.setLineDash([]);

    historyCtx.strokeStyle = 'rgba(122, 110, 98, 0.15)';
    for (let midi = MIDI_MIN; midi <= MIDI_MAX; midi += 12) {
      const y = ((MIDI_MAX - midi) / range) * h;
      historyCtx.beginPath();
      historyCtx.moveTo(0, y);
      historyCtx.lineTo(w, y);
      historyCtx.stroke();
    }

    historyCtx.strokeStyle = '#B85A3A';
    historyCtx.lineWidth = 2;
    historyCtx.beginPath();
    let started = false;
    for (let i = 0; i < HISTORY_LEN; i++) {
      const val = history[i];
      const x = (i / (HISTORY_LEN - 1)) * w;
      if (val === null) { started = false; continue; }
      const y = ((MIDI_MAX - val) / range) * h;
      if (!started) { historyCtx.moveTo(x, y); started = true; }
      else historyCtx.lineTo(x, y);
    }
    historyCtx.stroke();

    for (let i = 0; i < HISTORY_LEN; i++) {
      const val = history[i];
      if (val === null) continue;
      if (val >= TARGET_MIN_MIDI && val <= TARGET_MAX_MIDI) {
        const x = (i / (HISTORY_LEN - 1)) * w;
        const y = ((MIDI_MAX - val) / range) * h;
        historyCtx.fillStyle = '#22c55e';
        historyCtx.beginPath();
        historyCtx.arc(x, y, 2.5, 0, Math.PI * 2);
        historyCtx.fill();
      }
    }
  }

  function updateStats() {
    if (measurements.length === 0) {
      statAvg.textContent = '—';
      statAccuracy.textContent = '—';
      statDuration.textContent = '0초';
      return;
    }
    const avgMidi = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    statAvg.textContent = midiToNoteName(avgMidi).ko;
    const accuracy = totalCount > 0 ? Math.round((inTargetCount / totalCount) * 100) : 0;
    statAccuracy.textContent = accuracy + '%';
    if (startTime) {
      statDuration.textContent = Math.floor((Date.now() - startTime) / 1000) + '초';
    }
  }

  function update() {
    if (!isActive) return;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    const freq = detectPitch(buffer, audioContext.sampleRate);
    const now = performance.now();

    if (freq > 60 && freq < 2000) {
      const midi = freqToMidi(freq);
      if (midi >= MIDI_MIN - 4 && midi <= MIDI_MAX + 4) {
        if (smoothedMidi === null) smoothedMidi = midi;
        else smoothedMidi = smoothedMidi * SMOOTH_FACTOR + midi * (1 - SMOOTH_FACTOR);

        const displayMidi = smoothedMidi;
        const note = midiToNoteName(displayMidi);
        const displayFreq = midiToFreq(displayMidi);

        pitchNoteEl.textContent = note.ko;
        pitchFreqEl.textContent = displayFreq.toFixed(1) + ' Hz · ' + note.en;

        const range = MIDI_MAX - MIDI_MIN;
        const clamped = Math.max(MIDI_MIN, Math.min(MIDI_MAX, displayMidi));
        pitchIndicator.style.top = ((MIDI_MAX - clamped) / range) * 100 + '%';
        pitchIndicator.style.opacity = '1';

        const inTarget = displayMidi >= TARGET_MIN_MIDI && displayMidi <= TARGET_MAX_MIDI;
        const tooHigh = displayMidi > TARGET_MAX_MIDI;
        const tooLow = displayMidi < TARGET_MIN_MIDI;

        pitchReading.classList.toggle('in-target', inTarget);
        pitchReading.classList.toggle('too-high', tooHigh);
        pitchReading.classList.toggle('too-low', tooLow);
        pitchIndicator.classList.toggle('in-target', inTarget);

        if (inTarget) {
          pitchFeedbackEl.textContent = '좋아요, 딱 미 음역대예요 ✓';
        } else if (tooHigh) {
          const diff = Math.max(1, Math.round(displayMidi - TARGET_MAX_MIDI));
          pitchFeedbackEl.textContent = `조금 높아요. ${diff}반음만 낮춰보세요`;
        } else {
          pitchFeedbackEl.textContent = '조금 낮아요. 살짝 올려도 좋아요';
        }

        measurements.push(displayMidi);
        if (measurements.length > 2000) measurements.shift();
        totalCount++;
        if (inTarget) inTargetCount++;

        if (now - lastHistoryPush > 1000 / HISTORY_FPS) {
          history.push(displayMidi);
          history.shift();
          lastHistoryPush = now;
        }
      }
    } else {
      if (now - lastHistoryPush > 1000 / HISTORY_FPS) {
        history.push(null);
        history.shift();
        lastHistoryPush = now;
      }
      pitchIndicator.style.opacity = '0.3';
      pitchReading.classList.remove('in-target', 'too-high', 'too-low');
    }

    renderHistory();
    updateStats();
    rafId = requestAnimationFrame(update);
  }

  async function startMic() {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(micStream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      isActive = true;
      startTime = Date.now();
      statusDot.classList.add('active');
      statusText.textContent = '측정 중';
      micBtn.classList.add('active');
      micBtnText.textContent = '⏹ 마이크 끄기';
      pitchFeedbackEl.textContent = '소리를 내보세요';

      update();
    } catch (err) {
      statusText.textContent = '마이크 권한 거부됨';
      pitchFeedbackEl.textContent = '브라우저에서 마이크 사용을 허용해주세요';
      console.error('Mic error:', err);
    }
  }

  function stopMic() {
    isActive = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (micStream) micStream.getTracks().forEach(t => t.stop());
    if (audioContext) audioContext.close();
    audioContext = null;
    analyser = null;
    micStream = null;
    smoothedMidi = null;

    statusDot.classList.remove('active');
    statusText.textContent = '마이크 꺼짐';
    micBtn.classList.remove('active');
    micBtnText.textContent = '🎤 마이크 켜기';
    pitchNoteEl.textContent = '—';
    pitchFreqEl.textContent = '0 Hz';
    pitchFeedbackEl.textContent = '마이크를 켜고 소리를 내보세요';
    pitchReading.classList.remove('in-target', 'too-high', 'too-low');
    pitchIndicator.style.opacity = '0';
  }

  micBtn.addEventListener('click', () => {
    if (isActive) stopMic();
    else startMic();
  });

  statReset.addEventListener('click', () => {
    measurements = [];
    inTargetCount = 0;
    totalCount = 0;
    startTime = isActive ? Date.now() : null;
    history = new Array(HISTORY_LEN).fill(null);
    updateStats();
    renderHistory();
  });

  renderHistory();

  // ==========================================
  // Daily Weather Broadcast
  // ==========================================

  const broadcastStorageKey = 'voice-journal-broadcasts';

  // Initial seed data - today's broadcast
  const seedBroadcasts = [
    {
      date: '2026-04-24',
      summary: '맑음 → 오후 구름많음 / 11°~22° / 건조특보',
      icon: '☀',
      script: "오늘 금요일 김포는 / 아침 11도로 선선하게 시작해 / 낮 최고 22도까지 오르며 / 봄다운 하루가 예상됩니다. //\n\n다만 대기가 매우 건조한 가운데 / 중부 지방에는 건조 특보가 내려졌는데요 / 작은 불씨도 큰 산불로 이어질 수 있어 / 각별히 조심해 주시기 바랍니다. //\n\n자외선 지수는 '매우 높음' 단계입니다 / 외출하실 때는 / 선크림과 모자 / 꼭 챙겨주세요."
    }
  ];

  let broadcasts = JSON.parse(localStorage.getItem(broadcastStorageKey) || 'null');
  if (broadcasts === null) {
    broadcasts = seedBroadcasts;
    localStorage.setItem(broadcastStorageKey, JSON.stringify(broadcasts));
  }

  let currentBroadcastIdx = 0;

  // DOM refs
  const broadcastDateEl = document.getElementById('broadcast-date');
  const weatherSummaryEl = document.getElementById('weather-summary');
  const broadcastScriptEl = document.getElementById('broadcast-script');
  const broadcastCopyBtn = document.getElementById('broadcast-copy');
  const broadcastReadBtn = document.getElementById('broadcast-read');
  const broadcastAddBtn = document.getElementById('broadcast-add');
  const broadcastForm = document.getElementById('broadcast-form');
  const formDateEl = document.getElementById('form-date');
  const formSummaryEl = document.getElementById('form-summary');
  const formScriptEl = document.getElementById('form-script');
  const formSaveBtn = document.getElementById('form-save');
  const formCancelBtn = document.getElementById('form-cancel');
  const archiveListEl = document.getElementById('archive-list');
  const archiveCountEl = document.getElementById('archive-count');

  // Format date for display
  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const dow = days[d.getDay()];
    return `${y}년 ${m}월 ${day}일 (${dow})`;
  }

  // Format script with pause marks
  function formatScript(script) {
    // Split by double newlines into paragraphs
    return script.split(/\n\n+/).map(para => {
      const formatted = para
        .replace(/\/\//g, '<span class="pause-long">//</span>')
        .replace(/(?<!<span class="pause-long">)\//g, '<span class="pause-mark">/</span>')
        .replace(/\n/g, '<br>');
      return `<p>${formatted}</p>`;
    }).join('');
  }

  function renderBroadcast(idx) {
    if (broadcasts.length === 0) {
      broadcastDateEl.textContent = '—';
      weatherSummaryEl.querySelector('.weather-text').textContent = '멘트를 추가해주세요';
      weatherSummaryEl.querySelector('.weather-icon').textContent = '☀';
      broadcastScriptEl.classList.add('empty');
      broadcastScriptEl.innerHTML = '<p>오늘의 멘트가 아직 없어요. 아래 "＋ 새 멘트 추가" 버튼으로 저장해보세요.</p>';
      return;
    }
    const b = broadcasts[idx];
    broadcastDateEl.textContent = formatDate(b.date);
    weatherSummaryEl.querySelector('.weather-text').textContent = b.summary || '';
    weatherSummaryEl.querySelector('.weather-icon').textContent = b.icon || '☀';
    broadcastScriptEl.classList.remove('empty');
    broadcastScriptEl.innerHTML = formatScript(b.script);
  }

  function renderArchive() {
    archiveCountEl.textContent = `${broadcasts.length}개 저장됨`;
    if (broadcasts.length === 0) {
      archiveListEl.innerHTML = '<p class="archive-empty">아직 아카이브가 비어 있어요.</p>';
      return;
    }
    archiveListEl.innerHTML = broadcasts.map((b, i) => `
      <div class="archive-item ${i === currentBroadcastIdx ? 'active' : ''}">
        <div class="archive-item-header">
          <span class="archive-date">${formatDate(b.date)}</span>
          <span class="archive-weather">${b.summary || ''}</span>
        </div>
        <div class="archive-preview">${b.script.replace(/\/\/|\//g, '').replace(/\n+/g, ' ')}</div>
        <div class="archive-actions-row">
          <button class="archive-mini-btn" data-action="view" data-idx="${i}">보기</button>
          <button class="archive-mini-btn" data-action="edit" data-idx="${i}">수정</button>
          <button class="archive-mini-btn delete" data-action="delete" data-idx="${i}">삭제</button>
        </div>
      </div>
    `).join('');
  }

  function saveBroadcasts() {
    // Sort by date descending (newest first)
    broadcasts.sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(broadcastStorageKey, JSON.stringify(broadcasts));
  }

  // Get weather icon from summary text
  function guessIcon(summary) {
    const s = summary.toLowerCase();
    if (s.includes('눈')) return '❄';
    if (s.includes('비') || s.includes('소나기')) return '☂';
    if (s.includes('흐림') || s.includes('흐리')) return '☁';
    if (s.includes('구름')) return '⛅';
    if (s.includes('맑')) return '☀';
    if (s.includes('안개')) return '🌫';
    return '☀';
  }

  // Initial render
  renderBroadcast(0);
  renderArchive();

  // 오늘 멘트 자동 생성 — 오늘 날짜가 아직 없을 때만 한 번 만든다.
  // 직접 쓴 멘트는 건드리지 않고, 실패하면 조용히 기존 화면을 유지한다.
  if (window.VoiceWeather) {
    const todayStr = (() => {
      const d = new Date(), p = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    })();

    if (!broadcasts.some(b => b.date === todayStr)) {
      window.VoiceWeather.buildToday().then(b => {
        if (!b) return;
        if (broadcasts.some(x => x.date === b.date)) return;  // 그 사이 직접 저장했으면 양보
        b.auto = true;
        broadcasts.push(b);
        saveBroadcasts();
        currentBroadcastIdx = broadcasts.findIndex(x => x.date === b.date);
        renderBroadcast(currentBroadcastIdx);
        renderArchive();
      });
    }
  }

  // Copy button
  broadcastCopyBtn.addEventListener('click', () => {
    if (broadcasts.length === 0) return;
    const text = broadcasts[currentBroadcastIdx].script;
    navigator.clipboard.writeText(text).then(() => {
      const orig = broadcastCopyBtn.textContent;
      broadcastCopyBtn.textContent = '✓ 복사됨';
      setTimeout(() => broadcastCopyBtn.textContent = orig, 1500);
    });
  });

  // Practice mode
  broadcastReadBtn.addEventListener('click', () => {
    if (broadcasts.length === 0) return;
    document.body.classList.toggle('practice-mode');
    if (document.body.classList.contains('practice-mode')) {
      broadcastReadBtn.textContent = '✕ 연습 종료';
      window.scrollTo(0, 0);
    } else {
      broadcastReadBtn.textContent = '🎤 연습 모드';
    }
  });

  // Add button - show form
  broadcastAddBtn.addEventListener('click', () => {
    broadcastForm.style.display = 'block';
    const today = new Date().toISOString().split('T')[0];
    formDateEl.value = today;
    formSummaryEl.value = '';
    formScriptEl.value = '';
    formScriptEl.dataset.editIdx = '';
    broadcastForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  formCancelBtn.addEventListener('click', () => {
    broadcastForm.style.display = 'none';
  });

  formSaveBtn.addEventListener('click', () => {
    const date = formDateEl.value;
    const summary = formSummaryEl.value.trim();
    const script = formScriptEl.value.trim();
    if (!date || !script) {
      alert('날짜와 멘트는 필수예요.');
      return;
    }
    const entry = {
      date,
      summary,
      icon: guessIcon(summary),
      script
    };
    const editIdx = formScriptEl.dataset.editIdx;
    if (editIdx !== '') {
      broadcasts[parseInt(editIdx)] = entry;
    } else {
      // Check for duplicate date
      const existingIdx = broadcasts.findIndex(b => b.date === date);
      if (existingIdx >= 0) {
        if (!confirm('같은 날짜의 멘트가 이미 있어요. 덮어쓸까요?')) return;
        broadcasts[existingIdx] = entry;
      } else {
        broadcasts.unshift(entry);
      }
    }
    saveBroadcasts();
    currentBroadcastIdx = broadcasts.findIndex(b => b.date === date);
    if (currentBroadcastIdx < 0) currentBroadcastIdx = 0;
    renderBroadcast(currentBroadcastIdx);
    renderArchive();
    broadcastForm.style.display = 'none';
  });

  // Archive actions
  archiveListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.archive-mini-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const idx = parseInt(btn.dataset.idx);

    if (action === 'view') {
      currentBroadcastIdx = idx;
      renderBroadcast(idx);
      renderArchive();
      document.querySelector('.broadcast-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'edit') {
      const b = broadcasts[idx];
      broadcastForm.style.display = 'block';
      formDateEl.value = b.date;
      formSummaryEl.value = b.summary || '';
      formScriptEl.value = b.script;
      formScriptEl.dataset.editIdx = idx;
      broadcastForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (action === 'delete') {
      if (confirm(`${formatDate(broadcasts[idx].date)} 멘트를 삭제할까요?`)) {
        broadcasts.splice(idx, 1);
        saveBroadcasts();
        if (currentBroadcastIdx >= broadcasts.length) currentBroadcastIdx = 0;
        renderBroadcast(currentBroadcastIdx);
        renderArchive();
      }
    }
  });
