const articles = [
  { n: 1, href: 'article-1.html', title: 'Unravelling the Service Lifespan of Garments' },
  { n: 2, href: 'article-2.html', title: 'もったいない' },
  { n: 3, href: 'article-3.html', title: 'They Give Moth Holes a Makeover' },
  { n: 4, href: 'article-4.html', title: 'Environmental Impacts in the Fashion Industry' },
  { n: 5, href: 'article-5.html', title: 'Wabi Sabi' },
  { n: 6, href: 'article-6.html', title: 'Article Six' },
];

const numberGrids = {
  1: [[0,0,0,1,1,1,0,0],[0,0,1,1,1,1,0,0],[0,1,1,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,0,0,0,1,1,0,0],[0,1,1,1,1,1,1,1]],
  2: [[0,0,1,1,1,1,1,0],[0,1,1,1,1,1,1,1],[1,1,0,0,0,0,1,1],[1,1,0,0,0,0,1,1],[0,0,0,0,0,1,1,0],[0,0,0,0,1,1,1,0],[0,0,0,0,1,1,0,0],[0,0,0,1,1,1,0,0],[0,0,0,1,1,0,0,0],[0,0,1,1,1,0,0,0],[0,0,1,1,0,0,0,0],[0,1,1,1,0,0,0,0],[1,1,1,1,1,1,1,1]],
  3: [[0,0,1,1,1,1,1,0],[0,1,1,1,1,1,1,1],[1,1,0,0,0,0,1,1],[0,0,0,0,0,1,1,0],[0,0,0,1,1,1,0,0],[0,0,0,1,1,1,0,0],[0,0,0,0,1,1,1,0],[0,0,0,0,0,1,1,1],[1,1,0,0,0,0,1,1],[0,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,0]],
  4: [[0,0,0,0,0,1,1,0],[0,0,0,0,1,1,1,0],[0,0,0,1,0,1,1,0],[0,0,1,1,0,1,1,0],[0,1,1,0,0,1,1,0],[1,1,0,0,0,1,1,0],[1,1,1,1,1,1,1,1],[0,0,0,0,0,1,1,0],[0,0,0,0,0,1,1,0]],
  5: [[0,1,1,1,1,1,1,1],[0,1,1,0,0,0,0,0],[0,1,1,0,0,0,0,0],[0,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1],[0,0,0,0,0,0,1,1],[1,1,0,0,0,0,1,1],[0,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,0]],
  6: [[0,0,0,1,1,1,1,0],[0,0,1,1,1,1,1,1],[0,1,1,0,0,0,0,0],[1,1,0,0,0,0,0,0],[1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1],[1,1,0,0,0,0,1,1],[0,1,1,0,0,1,1,0],[0,0,1,1,1,1,1,0]],
};

// embroidered house motif
const houseGrid = [
  [0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,0,0,1,0,0,0],
  [0,0,1,0,0,0,0,1,0,0],
  [0,1,0,0,0,0,0,0,1,0],
  [1,0,0,0,0,0,0,0,0,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,1,0,0,1,0],
  [0,1,0,0,1,1,0,0,1,0],
  [0,1,0,0,1,1,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,0],
];

function motifToText(motif) {
  return motif.map(row =>
    row.map(c => c ? (Math.random() < 0.07 ? ' ' : 'x') : ' ').join('')
  ).join('\n');
}

function buildSpine() {
  const current = parseInt(document.body.dataset.article || '1');
  const next    = articles.find(a => a.n === current + 1) || null;
  const prev    = articles.find(a => a.n === current - 1) || null;

  // ── SPINE ──────────────────────────────────────────────────────
  const spine = document.createElement('nav');
  spine.id = 'stitch-spine';

  // home — embroidered house
  const home = document.createElement('a');
  home.href      = 'index.html';
  home.className = 'spine-home';
  home.title     = 'catalog home';

  const housePre = document.createElement('pre');
  housePre.textContent = motifToText(houseGrid);
  home.appendChild(housePre);

  const homeTip = document.createElement('span');
  homeTip.className   = 'spine-tip';
  homeTip.textContent = 'catalog home';
  home.appendChild(homeTip);

  spine.appendChild(home);

  // divider
  const divider = document.createElement('div');
  divider.className = 'spine-divider';
  spine.appendChild(divider);

  // article numbers
  articles.forEach(article => {
    const link = document.createElement('a');
    link.href      = article.href;
    link.className = 'spine-num' + (article.n === current ? ' current' : '');
    link.title     = article.title;

    const numEl = document.createElement('pre');
    numEl.textContent = motifToText(numberGrids[article.n]);
    link.appendChild(numEl);

    const tip = document.createElement('span');
    tip.className   = 'spine-tip';
    tip.textContent = article.title;
    link.appendChild(tip);

    spine.appendChild(link);
  });

  document.body.appendChild(spine);

  // ── CORNER TAG next ────────────────────────────────────────────
  if (next) {
    const tag = document.createElement('a');
    tag.href = next.href;
    tag.id   = 'corner-tag';

    tag.innerHTML = `
      <div class="tag-fold"></div>
      <div class="tag-content">
        <span class="tag-next">next</span>
        <span class="tag-title">${next.title}</span>
      </div>
    `;
    document.body.appendChild(tag);
  }

  // ── CORNER TAG prev ────────────────────────────────────────────
  if (prev) {
    const ptag = document.createElement('a');
    ptag.href = prev.href;
    ptag.id   = 'corner-tag-prev';

    ptag.innerHTML = `
      <div class="tag-content">
        <span class="tag-next">prev</span>
        <span class="tag-title">${prev.title}</span>
      </div>
      <div class="tag-fold-prev"></div>
    `;
    document.body.appendChild(ptag);
  }
}

document.addEventListener('DOMContentLoaded', buildSpine);