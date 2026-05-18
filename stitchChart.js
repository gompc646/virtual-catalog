// ── STITCH CHART — scroll-triggered x dot plot ──────────────────
// Garment service lifespan data from Vermeyen et al. 2025
// Each x mark represents one data point on a log scale

const garmentData = [
  {
    category: "shirts, short sleeve",
    occasions: [
      { label: "informal", n: 141, useTime: 4,  wears: 33, washFreq: 2,  cleanCycles: 16 },
      { label: "smart",    n: 127, useTime: 5,  wears: 13, washFreq: 2,  cleanCycles: 7  },
      { label: "formal",   n: 58,  useTime: 5,  wears: 9,  washFreq: 2,  cleanCycles: 6  },
      { label: "sports",   n: 48,  useTime: 4,  wears: 47, washFreq: 1,  cleanCycles: 42 },
      { label: "functional",n: 48, useTime: 5,  wears: 8,  washFreq: 2,  cleanCycles: 5  },
    ]
  },
  {
    category: "shirts, long sleeve",
    occasions: [
      { label: "informal", n: 88,  useTime: 4,  wears: 26, washFreq: 2,  cleanCycles: 14 },
      { label: "smart",    n: 127, useTime: 5,  wears: 13, washFreq: 2,  cleanCycles: 7  },
      { label: "formal",   n: 58,  useTime: 5,  wears: 8,  washFreq: 2,  cleanCycles: 5  },
      { label: "sports",   n: 36,  useTime: 4,  wears: 48, washFreq: 1,  cleanCycles: 42 },
    ]
  },
  {
    category: "sweater",
    occasions: [
      { label: "informal", n: 156, useTime: 5,  wears: 44, washFreq: 4,  cleanCycles: 11 },
      { label: "smart",    n: 53,  useTime: 5,  wears: 19, washFreq: 4,  cleanCycles: 5  },
      { label: "formal",   n: 35,  useTime: 5,  wears: 14, washFreq: 4,  cleanCycles: 4  },
      { label: "sports",   n: 88,  useTime: 4,  wears: 48, washFreq: 2,  cleanCycles: 24 },
    ]
  },
  {
    category: "pants, long",
    occasions: [
      { label: "informal", n: 141, useTime: 5,  wears: 55, washFreq: 4,  cleanCycles: 15 },
      { label: "smart",    n: 64,  useTime: 5,  wears: 34, washFreq: 4,  cleanCycles: 9  },
      { label: "formal",   n: 41,  useTime: 5,  wears: 19, washFreq: 3,  cleanCycles: 6  },
      { label: "sports",   n: 77,  useTime: 4,  wears: 64, washFreq: 2,  cleanCycles: 28 },
    ]
  },
  {
    category: "dress",
    occasions: [
      { label: "informal", n: 62,  useTime: 4,  wears: 20, washFreq: 2,  cleanCycles: 10 },
      { label: "smart",    n: 96,  useTime: 5,  wears: 9,  washFreq: 2,  cleanCycles: 5  },
      { label: "formal",   n: 96,  useTime: 5,  wears: 5,  washFreq: 2,  cleanCycles: 3  },
    ]
  },
  {
    category: "coats",
    occasions: [
      { label: "informal", n: 31,  useTime: 5,  wears: 136,washFreq: 60, cleanCycles: 1  },
      { label: "smart",    n: 41,  useTime: 5,  wears: 42, washFreq: 60, cleanCycles: 0  },
      { label: "formal",   n: 41,  useTime: 5,  wears: 14, washFreq: 60, cleanCycles: 0  },
    ]
  },
  {
    category: "nightwear",
    occasions: [
      { label: "nightwear",n: 114, useTime: 5,  wears: 151,washFreq: 7,  cleanCycles: 24 },
    ]
  },
];

const occasionColors = {
  informal:   'rgba(84,3,3,0.75)',
  smart:      'rgba(84,3,3,0.5)',
  formal:     'rgba(84,3,3,0.3)',
  sports:     'rgba(84,3,3,0.9)',
  functional: 'rgba(84,3,3,0.4)',
  nightwear:  'rgba(84,3,3,0.7)',
};

const metrics = [
  { key: 'useTime',     label: 'use time (years)',        min: 1,  max: 10  },
  { key: 'wears',       label: 'wears over lifespan',     min: 1,  max: 200 },
  { key: 'washFreq',    label: 'wears before washing',    min: 1,  max: 100 },
  { key: 'cleanCycles', label: 'cleaning cycles',         min: 0,  max: 50  },
];

let activeMetric = 'wears';
let activeOccasions = new Set(['informal','smart','formal','sports','functional','nightwear']);
let revealed = new Set();

function logScale(val, min, max, width) {
  const logMin = Math.log10(Math.max(min, 0.5));
  const logMax = Math.log10(max);
  const logVal = Math.log10(Math.max(val, 0.5));
  return ((logVal - logMin) / (logMax - logMin)) * width;
}

function buildChart() {
  const wrap = document.getElementById('stitch-chart');
  if (!wrap) return;
  wrap.innerHTML = '';

  const metric = metrics.find(m => m.key === activeMetric);
  const W = Math.min(wrap.offsetWidth - 160, 520);

  // header
  const header = document.createElement('div');
  header.className = 'sc-header';
  header.innerHTML = `<span class="sc-metric-label">— ${metric.label} —</span>`;
  wrap.appendChild(header);

  // metric buttons
  const btnRow = document.createElement('div');
  btnRow.className = 'sc-btn-row';
  metrics.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'sc-btn' + (m.key === activeMetric ? ' active' : '');
    btn.textContent = m.label;
    btn.onclick = () => { activeMetric = m.key; buildChart(); };
    btnRow.appendChild(btn);
  });
  wrap.appendChild(btnRow);

  // occasion filter
  const occRow = document.createElement('div');
  occRow.className = 'sc-occ-row';
  ['informal','smart','formal','sports','functional','nightwear'].forEach(occ => {
    const btn = document.createElement('button');
    btn.className = 'sc-occ-btn' + (activeOccasions.has(occ) ? ' active' : '');
    btn.style.setProperty('--occ-color', occasionColors[occ]);
    btn.textContent = occ;
    btn.onclick = () => {
      if (activeOccasions.has(occ) && activeOccasions.size > 1) activeOccasions.delete(occ);
      else activeOccasions.add(occ);
      buildChart();
    };
    occRow.appendChild(btn);
  });
  wrap.appendChild(occRow);

  // rows
  garmentData.forEach((garment, gi) => {
    const row = document.createElement('div');
    row.className = 'sc-row';
    row.dataset.index = gi;

    const label = document.createElement('div');
    label.className = 'sc-label';
    label.textContent = garment.category;
    row.appendChild(label);

    const track = document.createElement('div');
    track.className = 'sc-track';
    track.style.width = W + 'px';

    // axis ticks
    const tickVals = activeMetric === 'useTime'
      ? [1,2,5,10]
      : activeMetric === 'washFreq'
      ? [1,2,5,10,20,50,100]
      : [1,2,5,10,20,50,100,200];

    tickVals.forEach(v => {
      const tick = document.createElement('div');
      tick.className = 'sc-tick';
      tick.style.left = logScale(v, metric.min, metric.max, W) + 'px';
      tick.textContent = v;
      track.appendChild(tick);
    });

    // dots
    garment.occasions.forEach(occ => {
      if (!activeOccasions.has(occ.label)) return;
      const val = occ[activeMetric];
      if (val === undefined || val === null) return;

      const dot = document.createElement('div');
      dot.className = 'sc-dot';
      dot.style.left = logScale(Math.max(val, 0.5), metric.min, metric.max, W) + 'px';
      dot.style.color = occasionColors[occ.label];
      dot.textContent = 'x';
      dot.title = `${occ.label}: ${val} ${metric.label} (n=${occ.n})`;

      // revealed state
      if (revealed.has(gi)) {
        dot.classList.add('visible');
      }

      // tooltip
      const tip = document.createElement('div');
      tip.className = 'sc-tip';
      tip.innerHTML = `<strong>${occ.label}</strong><br>${val} ${metric.label}<br>n = ${occ.n}`;
      dot.appendChild(tip);

      track.appendChild(dot);
    });

    row.appendChild(track);
    wrap.appendChild(row);
  });

  // axis label
  const axisLabel = document.createElement('div');
  axisLabel.className = 'sc-axis-label';
  axisLabel.style.width = W + 'px';
  axisLabel.style.marginLeft = '150px';
  axisLabel.textContent = `← less    ${metric.label}    more →`;
  wrap.appendChild(axisLabel);

  setupScrollReveal();
}

function setupScrollReveal() {
  const rows = document.querySelectorAll('.sc-row');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const gi = parseInt(entry.target.dataset.index);
        revealed.add(gi);
        const dots = entry.target.querySelectorAll('.sc-dot');
        dots.forEach((dot, i) => {
          setTimeout(() => dot.classList.add('visible'), i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  rows.forEach(row => {
    if (!revealed.has(parseInt(row.dataset.index))) {
      observer.observe(row);
    }
  });
}

document.addEventListener('DOMContentLoaded', buildChart);