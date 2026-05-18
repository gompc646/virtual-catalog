document.addEventListener("DOMContentLoaded", () => {

  const leftContainer  = document.getElementById("stitchPattern");
  const rightContainer = document.getElementById("stitchPatternRight");

  // LEFT: 13x13 rosette — 8 petals radiating from center cross
  const flowerMotif = [
    [0,0,0,0,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,1,0,1,0,1,0,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,1,0,0,1,1,1,0,0,1,0,0],
    [0,1,0,0,1,0,1,0,1,0,0,1,0],
    [1,0,1,1,0,0,1,0,0,1,1,0,1],
    [1,1,0,0,1,1,1,1,1,0,0,1,1],
    [1,0,1,1,0,0,1,0,0,1,1,0,1],
    [0,1,0,0,1,0,1,0,1,0,0,1,0],
    [0,0,1,0,0,1,1,1,0,0,1,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,0,0,1,0,1,0,1,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,0,0,0,0],
  ];

  // RIGHT: square frame with diamond fill, then diagonal lattice
  const geoMotif = [
    [0,1,1,1,1,1,0],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [0,1,1,1,1,1,0],
    [0,0,0,0,0,0,0],
    [0,0,1,0,1,0,0],
    [0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0],
    [0,0,1,0,1,0,0],
    [0,0,0,0,0,0,0],
  ];

  function buildGrid(motif, numTiles, gap, fadeDirection) {
    const MOTIF_H  = motif.length;
    const MOTIF_W  = motif[0].length;
    const TILE_H   = MOTIF_H + gap;
    const TOTAL_ROWS = TILE_H * numTiles;
    const grid = [];

    for (let y = 0; y < TOTAL_ROWS; y++) {
      const row = [];
      const motifRow  = y % TILE_H;
      const tileIndex = Math.floor(y / TILE_H);

      for (let x = 0; x < MOTIF_W; x++) {
        let char = " ";
        if (motifRow < MOTIF_H && motif[motifRow][x] === 1) char = "x";

        const pos = fadeDirection === 'bottom-up'
          ? tileIndex / numTiles
          : 1 - (tileIndex / numTiles);
        const noise  = (Math.random() - 0.5) * 0.08;
        const fadeAt = Math.max(0, Math.min(1, pos + noise));

        row.push({ char, fadeAt });
      }
      grid.push(row);
    }
    return { grid, totalRows: TOTAL_ROWS, motifW: MOTIF_W };
  }

  function buildRenderer(container, gridData) {
    const { grid, totalRows, motifW } = gridData;
    return function render(progress) {
      let out = "";
      for (let y = 0; y < totalRows; y++) {
        for (let x = 0; x < motifW; x++) {
          const cell = grid[y][x];
          const t = (progress - cell.fadeAt) / 0.15;
          out += t >= 1 ? " " : cell.char;
        }
        out += "\n";
      }
      container.textContent = out;
    };
  }

  const leftGrid  = buildGrid(flowerMotif, 8, 3, 'bottom-up');
  const rightGrid = buildGrid(geoMotif,    7, 3, 'bottom-up');

  const renderLeft  = buildRenderer(leftContainer,  leftGrid);
  const renderRight = buildRenderer(rightContainer, rightGrid);

  window.addEventListener("scroll", () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    renderLeft(progress);
    renderRight(progress);
  });

  renderLeft(0);
  renderRight(0);
});