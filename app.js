// Card thumbnail display adjustments. x/y are percentages of the 16:9 frame.
const thumbnailAdjustments = {
  "あ": {"scale": 1.337, "x": -0.836, "y": -3.991},
  "い": {"scale": 1.263, "x": -0.789, "y": -2.207},
  "う": {"scale": 2.328, "x": 2.182, "y": -3.842},
  "え": {"scale": 2.358, "x": -0.368, "y": -0.655},
  "お": {"scale": 1.654, "x": 0.258, "y": -3.708},
  "か": {"scale": 2.215, "x": 0.347, "y": -2.284},
  "き": {"scale": 2.318, "x": 0.0, "y": -2.743},
  "く": {"scale": 1.677, "x": 2.883, "y": -3.095},
  "け": {"scale": 2.176, "x": -0.34, "y": -5.504},
  "こ": {"scale": 2.197, "x": 0.344, "y": -2.654},
  "さ": {"scale": 1.646, "x": 0.514, "y": -3.007},
  "し": {"scale": 1.62, "x": -2.532, "y": -3.715},
  "す": {"scale": 2.176, "x": 1.02, "y": -3.086},
  "せ": {"scale": 2.163, "x": 0.338, "y": -4.555},
  "そ": {"scale": 2.202, "x": 1.032, "y": -3.775},
  "た": {"scale": 2.189, "x": 0.684, "y": -4.035},
  "ち": {"scale": 2.189, "x": 0.684, "y": -2.819},
  "つ": {"scale": 2.202, "x": 0.0, "y": -2.552},
  "て": {"scale": 2.202, "x": -0.344, "y": -2.552},
  "と": {"scale": 2.211, "x": 0.691, "y": -3.595},
  "な": {"scale": 2.202, "x": 0.0, "y": -3.775},
  "に": {"scale": 2.211, "x": -0.346, "y": -3.595},
  "ぬ": {"scale": 2.328, "x": 0.0, "y": -3.842},
  "ね": {"scale": 2.328, "x": 0.0, "y": -3.842},
  "の": {"scale": 2.318, "x": 0.363, "y": -2.743},
  "は": {"scale": 2.348, "x": -2.568, "y": -3.464},
  "ひ": {"scale": 2.358, "x": -1.474, "y": -4.585},
  "ふ": {"scale": 2.304, "x": -1.08, "y": -1.735},
  "へ": {"scale": 2.333, "x": -0.364, "y": -3.747},
  "ほ": {"scale": 2.308, "x": -1.442, "y": -4.219},
  "ま": {"scale": 2.328, "x": 0.364, "y": -3.842},
  "み": {"scale": 2.318, "x": -0.724, "y": -4.031},
  "む": {"scale": 2.333, "x": -0.365, "y": -3.747},
  "め": {"scale": 2.348, "x": -0.733, "y": -3.464},
  "も": {"scale": 2.373, "x": 0.371, "y": -4.31},
  "や": {"scale": 1.746, "x": -1.091, "y": -5.135},
  "ゆ": {"scale": 1.746, "x": 1.091, "y": -4.165},
  "よ": {"scale": 1.754, "x": 0.274, "y": -4.939},
  "ら": {"scale": 1.762, "x": -1.377, "y": -3.765},
  "り": {"scale": 1.763, "x": 0.551, "y": -3.74},
  "る": {"scale": 1.74, "x": 0.272, "y": -4.315},
  "れ": {"scale": 1.74, "x": -0.272, "y": -4.315},
  "ろ": {"scale": 1.74, "x": 0.0, "y": -3.348},
  "わ": {"scale": 1.757, "x": 0.0, "y": -4.866},
  "を": {"scale": 1.746, "x": -0.818, "y": -4.165},
  "ん": {"scale": 1.716, "x": -1.608, "y": -3.962}
};

const rowNames = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ', null];
const rowEnglishNames = ['A', 'Ka', 'Sa', 'Ta', 'Na', 'Ha', 'Ma', 'Ya', 'Ra', 'Wa'];
const rowSizes = [5, 5, 5, 5, 5, 5, 5, 3, 5, 2, 1];
const groups = document.getElementById('groups');
const shell = document.getElementById('video-shell');
const selectedKana = document.getElementById('selected-kana');
const selectedQr = document.getElementById('selected-qr');
let videos = [];
let selected = 0;
let playerFrame = null;

function stopPlayer() {
  if (playerFrame) {
    playerFrame.src = 'about:blank';
    playerFrame.remove();
    playerFrame = null;
  }
}

function isDesktopPlayback() {
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    navigator.userAgentData?.mobile === true ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return !mobile && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function preparePlayer(item, startPlayback = false) {
  stopPlayer();
  const iframe = document.createElement('iframe');
  iframe.title = `${item.kana}の書き方動画（繰り返し再生）`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.src = `https://www.youtube.com/embed/${item.id}?autoplay=${startPlayback ? 1 : 0}&loop=1&playlist=${item.id}&playsinline=0&rel=0&controls=1&fs=1`;
  playerFrame = iframe;
  shell.replaceChildren(iframe);
  if (startPlayback && iframe.requestFullscreen) {
    try {
      const request = iframe.requestFullscreen();
      if (request && typeof request.catch === 'function') request.catch(() => {});
    } catch {
      // Fullscreen rejection must not interrupt playback or character selection.
    }
  }
}

function choose(index, updateUrl = true, userAction = false) {
  selected = index;
  const item = videos[index];
  selectedKana.textContent = item.kana;
  document.getElementById('selected-romaji').textContent = item.romaji;
  selectedQr.src = `qr/${item.id}.svg`;
  selectedQr.alt = `${item.kana}の書き方動画ページへのQRコード`;
  document.getElementById('previous-kana').disabled = index === 0;
  document.getElementById('next-kana').disabled = index === videos.length - 1;
  document.querySelectorAll('.card').forEach((card, n) => {
    card.classList.toggle('active', n === index);
    card.querySelector('button').setAttribute('aria-pressed', String(n === index));
  });
  preparePlayer(item, userAction && isDesktopPlayback());
  if (updateUrl) shell.scrollIntoView({ behavior: 'instant', block: 'start' });
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('kana', item.kana);
    url.hash = '';
    history.replaceState(null, '', url);
  }
}

function render() {
  let offset = 0;
  for (let row = 0; row < rowNames.length; row++) {
    const section = document.createElement('section');
    section.className = 'group';
    if (rowNames[row]) {
      section.setAttribute('aria-label', `${rowNames[row]}行 / ${rowEnglishNames[row]}-row`);
      const label = document.createElement('h3');
      label.className = 'group-label';
      label.innerHTML = `<span class="row-ja">${rowNames[row]}行</span> / <span class="row-en" lang="en">${rowEnglishNames[row]}-row</span>`;
      section.append(label);
    } else {
      section.className = 'group group-standalone';
    }
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    for (let j = 0; j < rowSizes[row]; j++) {
      const index = offset + j;
      const item = videos[index];
      const thumbnail = thumbnailAdjustments[item.kana];
      const card = document.createElement('article');
      card.className = 'card';
      if (rowNames[row] === 'や') card.style.gridColumn = String(j * 2 + 1);
      if (rowNames[row] === 'わ') card.style.gridColumn = String(j * 4 + 1);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'card-button';
      button.setAttribute('aria-label', `${item.kana}の書き方動画を再生`);
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = `<div class="thumb" style="--thumb-scale:${thumbnail.scale};--thumb-x:${thumbnail.x}%;--thumb-y:${thumbnail.y}%"><img src="https://i.ytimg.com/vi/${item.id}/hqdefault.jpg" alt="" loading="lazy"><span class="thumb-frame thumb-frame-top" aria-hidden="true"></span><span class="thumb-frame thumb-frame-bottom" aria-hidden="true"></span><span class="thumb-frame thumb-frame-left" aria-hidden="true"></span><span class="thumb-frame thumb-frame-right" aria-hidden="true"></span></div><div class="card-bottom"><div class="character-label"><span class="card-kana">${item.kana}</span><span class="card-romaji" lang="en">${item.romaji}</span></div><img class="card-qr" src="qr/${item.id}.svg" alt="${item.kana}の書き方動画ページへのQRコード"></div>`;
      button.addEventListener('click', () => choose(index, true, true));
      card.append(button);
      grid.append(card);
    }
    offset += rowSizes[row];
    section.append(grid);
    groups.append(section);
  }
  const kana = new URLSearchParams(location.search).get('kana');
  const index = Math.max(0, videos.findIndex(item => item.kana === kana));
  choose(index, false);
}

document.getElementById('previous-kana').addEventListener('click', () => {
  if (selected > 0) choose(selected - 1, true, true);
});
document.getElementById('next-kana').addEventListener('click', () => {
  if (selected < videos.length - 1) choose(selected + 1, true, true);
});

window.addEventListener('popstate', () => {
  if (!videos.length) return;
  const kana = new URLSearchParams(location.search).get('kana');
  choose(Math.max(0, videos.findIndex(item => item.kana === kana)), false);
});
window.addEventListener('pagehide', stopPlayer);
window.addEventListener('pageshow', event => {
  if (event.persisted && videos.length) preparePlayer(videos[selected]);
});

document.getElementById('print-button').addEventListener('click', () => window.print());
fetch('videos.json').then(response => {
  if (!response.ok) throw new Error('Data unavailable');
  return response.json();
}).then(data => { videos = data; render(); }).catch(() => {
  groups.textContent = '動画一覧を読み込めませんでした。ページを再読み込みしてください。';
});
