# Voice Journal — 미, 나의 음역대

미(E3~E4) 음역대를 찾고 유지하기 위한 개인 훈련 사이트.

## 구조

```
index.html               마크업
css/style.css            스타일
js/app.js                화면 동작 (체크리스트 · 기록 · 피치 모니터 · 아카이브)
js/weather.js            오늘의 기상 캐스터 멘트 자동 생성
data/ment-templates.json 멘트 문장 풀  ← 여기만 고치면 멘트가 늘어난다
```

## 기상 캐스터 멘트

페이지를 열면 오늘 날짜의 멘트가 없을 때만 자동으로 한 번 만든다.

- 날씨: [Open-Meteo](https://open-meteo.com) — 무료, API 키 불필요, 김포 좌표 고정
- 문장: `data/ment-templates.json` 의 풀에서 **날짜를 씨앗으로** 골라 조합
  → 같은 날은 항상 같은 멘트, 날이 바뀌면 달라진다
- 직접 쓴 멘트가 이미 있으면 자동 생성은 양보한다
- 실패하면 조용히 넘어간다 (콘솔에만 경고)

### 멘트 늘리는 법

`data/ment-templates.json` 의 배열에 문장을 추가하면 끝. 코드는 건드리지 않는다.

```
/     짧은 쉼
//    긴 쉼
빈 줄  단락 구분
```

치환자: `{loc} {dow} {min} {max} {cur} {season} {gap} {humid} {wind} {pop} {morningAdj}`

## 로컬에서 보기

```sh
python3 -m http.server 8000
# http://localhost:8000
```

`file://` 로 열면 `fetch`가 막혀 멘트 자동 생성이 안 된다. 반드시 서버로 띄울 것.

## 저장되는 것

전부 브라우저 localStorage. 기기 간 동기화는 없다.

```
voice-journal-*          체크리스트 · 연습 기록 · 멘트 아카이브
voice-journal-weather-cache   당일 날씨 (하루 1회만 호출하기 위함)
```
