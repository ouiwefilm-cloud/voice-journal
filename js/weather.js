/* 오늘의 기상 캐스터 멘트 — 자동 생성
 *
 * Open-Meteo(무료·API 키 불필요)에서 김포 날씨를 받아
 * data/ment-templates.json 의 문장 풀을 조합해 3단락 멘트를 만든다.
 *
 * 멘트 문장을 늘리려면 코드가 아니라 JSON만 고치면 된다.
 * window.VoiceWeather.buildToday() -> Promise<{date, summary, icon, script} | null>
 */
(function () {
  'use strict';

  var LAT = 37.6153;   // 김포시청
  var LON = 126.7156;
  var CACHE_KEY = 'voice-journal-weather-cache';

  var API =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + LAT + '&longitude=' + LON +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max' +
    '&timezone=Asia%2FSeoul&forecast_days=1';

  var DOW = ['일', '월', '화', '수', '목', '금', '토'];

  // WMO weather code -> 내부 카테고리
  function categorize(code) {
    if (code === 0 || code === 1) return 'clear';
    if (code === 2 || code === 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 51 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code === 85 || code === 86) return 'snow';
    if (code >= 95) return 'storm';
    return 'cloudy';
  }

  var ICON = { clear: '☀', cloudy: '⛅', fog: '🌫', rain: '☂', snow: '❄', storm: '⛈' };
  var LABEL = { clear: '맑음', cloudy: '구름많음', fog: '안개', rain: '비', snow: '눈', storm: '천둥번개' };

  function season(month) {
    if (month >= 3 && month <= 5) return '봄';
    if (month >= 6 && month <= 8) return '여름';
    if (month >= 9 && month <= 11) return '가을';
    return '겨울';
  }

  // 날짜를 씨앗으로 쓴 결정적 선택 — 같은 날은 같은 멘트, 날이 바뀌면 달라진다
  function pick(list, seed) {
    if (!list || !list.length) return '';
    return list[seed % list.length];
  }

  function fill(tpl, v) {
    return tpl.replace(/\{(\w+)\}/g, function (m, k) {
      return v[k] !== undefined ? v[k] : m;
    });
  }

  function localDateStr(d) {
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function morningAdj(table, min) {
    for (var i = 0; i < table.length; i++) {
      if (min <= table[i][0]) return table[i][1];
    }
    return table[table.length - 1][1];
  }

  // 조건에 맞는 본문 키를 우선순위대로 고른다
  function bodyKey(cat, t) {
    if (cat === 'rain' || cat === 'storm') return 'rain';
    if (cat === 'snow') return 'snow';
    if (t.humid <= 35) return 'dry';
    if (t.max >= 31) return 'hot';
    if (t.max <= 3) return 'cold';
    if (t.gap >= 12) return 'gap';
    if (t.wind >= 7) return 'wind';
    return 'mild';
  }

  function closingKey(cat, t) {
    if (cat === 'rain' || cat === 'storm' || cat === 'snow') return 'umbrella';
    if (t.uv >= 7) return 'uvHigh';
    if (t.gap >= 12) return 'layer';
    if (t.max >= 20) return 'warm';
    return 'default';
  }

  function compose(tpl, w) {
    var now = new Date();
    var cat = categorize(w.code);
    var seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    var vals = {
      loc: tpl.location,
      dow: DOW[now.getDay()],
      min: w.min,
      max: w.max,
      cur: w.cur,
      humid: w.humid,
      wind: w.wind,
      pop: w.pop,
      gap: w.max - w.min,
      season: season(now.getMonth() + 1),
      morningAdj: morningAdj(tpl.morningAdj, w.min)
    };

    var bKey = bodyKey(cat, { humid: w.humid, max: w.max, gap: vals.gap, wind: w.wind });
    var cKey = closingKey(cat, { uv: w.uv, gap: vals.gap, max: w.max });

    var parts = [
      fill(pick(tpl.opening[cat] || tpl.opening.cloudy, seed), vals),
      fill(pick(tpl.body[bKey] || tpl.body.mild, seed + 1), vals),
      fill(pick(tpl.closing[cKey] || tpl.closing.default, seed + 2), vals)
    ];

    return {
      date: localDateStr(now),
      summary: LABEL[cat] + ' / ' + w.min + '°~' + w.max + '° / 습도 ' + w.humid + '%',
      icon: ICON[cat] || '☀',
      script: parts.join('\n\n')
    };
  }

  function fetchWeather() {
    // 같은 날 이미 받아왔으면 재사용 (새로고침마다 때리지 않도록)
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.date === localDateStr(new Date())) {
        return Promise.resolve(cached.w);
      }
    } catch (e) { /* 캐시 깨져 있으면 그냥 새로 받는다 */ }

    return fetch(API)
      .then(function (r) {
        if (!r.ok) throw new Error('weather http ' + r.status);
        return r.json();
      })
      .then(function (j) {
        var c = j.current, d = j.daily;
        var w = {
          code: d.weather_code[0],
          min: Math.round(d.temperature_2m_min[0]),
          max: Math.round(d.temperature_2m_max[0]),
          cur: Math.round(c.temperature_2m),
          humid: Math.round(c.relative_humidity_2m),
          wind: Math.round(c.wind_speed_10m / 3.6),          // km/h -> m/s
          pop: Math.round(d.precipitation_probability_max[0] || 0),
          uv: Math.round(d.uv_index_max[0] || 0)
        };
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ date: localDateStr(new Date()), w: w }));
        } catch (e) { /* 저장 실패해도 동작에는 지장 없다 */ }
        return w;
      });
  }

  function fetchTemplates() {
    return fetch('/data/ment-templates.json').then(function (r) {
      if (!r.ok) throw new Error('templates http ' + r.status);
      return r.json();
    });
  }

  // 실패하면 null. 호출하는 쪽에서 기존 수동 멘트로 조용히 넘어가면 된다.
  function buildToday() {
    return Promise.all([fetchTemplates(), fetchWeather()])
      .then(function (a) { return compose(a[0], a[1]); })
      .catch(function (err) {
        console.warn('[weather] 자동 멘트 생성 실패:', err.message);
        return null;
      });
  }

  window.VoiceWeather = { buildToday: buildToday };
})();
