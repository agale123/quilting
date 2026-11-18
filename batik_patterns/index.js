const SVGNS = "http://www.w3.org/2000/svg";

// Draw a square with the provided location, dimensions and fill
function drawSquare(x, y, w, h, f) {
  const square = document.createElementNS(SVGNS, "rect");
  square.setAttributeNS(null, "x", x);
  square.setAttributeNS(null, "y", y);
  square.setAttributeNS(null, "width", w);
  square.setAttributeNS(null, "height", h);
  square.setAttributeNS(null, "fill", f);
  document.getElementById("svg").appendChild(square);
}

// Draw a triangle with the provided points and fill
function drawTriangle(p, f) {
  const triangle = document.createElementNS(SVGNS, "polygon");
  const points = p.map((i) => i.x + "," + i.y).join(" ");
  triangle.setAttributeNS(null, "points", points);
  triangle.setAttributeNS(null, "fill", f);
  document.getElementById("svg").appendChild(triangle);
}

function drawPinwheel(r, c, w, light, dark) {
  const SQUARE = [
    [0.5, 0],
    [1, 0.5],
    [0.5, 1],
    [0, 0.5],
  ];
  const DIAGONAL = [
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ];

  drawSquare(c * w, r * w, w, w, light);
  for (let i = 0; i < 4; i++) {
    drawTriangle(
      [
        { x: (c + 0.5) * w, y: (r + 0.5) * w },
        { x: (c + SQUARE[i][0]) * w, y: (r + SQUARE[i][1]) * w },
        { x: (c + DIAGONAL[i][0]) * w, y: (r + DIAGONAL[i][1]) * w },
      ],
      dark,
    );
  }
}

function drawNorthwind(x, y, w, c1, c2, rotate) {
  drawSquare(x * w, y * w, w, w, c1);

  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 3; r++) {
      if (rotate) {
        if (c === 2 && r === 0) {
          continue;
        } else if (c === 0 && r === 2) {
          drawSquare(w * (x + c / 3), w * (y + r / 3), w / 3, w / 3, c2);
        } else {
          drawTriangle(
            [
              { x: w * (x + c / 3), y: w * (y + r / 3) },
              { x: w * (x + c / 3), y: w * (y + (r + 1) / 3) },
              { x: w * (x + (c + 1) / 3), y: w * (y + (r + 1) / 3) },
            ],
            c2,
          );
        }
      } else {
        if (c === 0 && r === 0) {
          continue;
        } else if (c === 2 && r === 2) {
          drawSquare(w * (x + c / 3), w * (y + r / 3), w / 3, w / 3, c2);
        } else {
          drawTriangle(
            [
              { x: w * (x + c / 3), y: w * (y + (r + 1) / 3) },
              { x: w * (x + (c + 1) / 3), y: w * (y + r / 3) },
              { x: w * (x + (c + 1) / 3), y: w * (y + (r + 1) / 3) },
            ],
            c2,
          );
        }
      }
    }
  }
}

// Color schemes
const VIRIDIS = [
  "#fde725",
  "#7ad151",
  "#22a884",
  "#2a788e",
  "#414487",
  "#440154",
];

const PLASMA = [
  "#f0f921",
  "#fcd225",
  "#fdae32",
  "#f68d45",
  "#e76f5a",
  "#d5546e",
  "#c03a83",
  "#a62098",
  "#8606a6",
  "#6300a7",
  "#3e049c",
  "#0d0887",
];

const RAINBOW = [
  "#54478c",
  "#2c699a",
  "#048ba8",
  "#0db39e",
  "#83e377",
  "#b9e769",
  "#efea5a",
  "#f1c453",
  "#f29e4c",
];

// Tidepools pattern
function pinwheel() {
  const COLS = 7;
  const ROWS = 9;
  const W = 80;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if ((r + c) % 2 == 0) {
        drawSquare(c * W, r * W, W, W, RAINBOW[(c + r) / 2]);
      } else {
        drawPinwheel(
          r,
          c,
          W,
          RAINBOW[Math.floor((c + r) / 2)],
          RAINBOW[Math.ceil((c + r) / 2)],
        );
      }
    }
  }
}

function drawLake(x, y, w, c1, c2) {
  drawSquare(x * w, y * w, w, w, c1);
  drawTriangle(
    [
      { x: w * (x + 1 / 4), y: w * y },
      { x: w * (x + 1 / 4), y: w * (y + 3 / 4) },
      { x: w * (x + 1), y: w * (y + 3 / 4) },
    ],
    c2,
  );

  const locs = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ];

  for (const loc of locs) {
    const c = loc[0];
    const r = loc[1];
    drawTriangle(
      [
        { x: w * (x + c / 4), y: w * (y + r / 4) },
        { x: w * (x + c / 4), y: w * (y + (r + 1) / 4) },
        { x: w * (x + (c + 1) / 4), y: w * (y + (r + 1) / 4) },
      ],
      c2,
    );
  }
}

// Lady of the Lake pattern
function lake() {
  const COLS = 5;
  const ROWS = 7;
  const W = 100;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const c1 = Math.floor(Math.random() * 6);
      const c2 = c1 + 6;
      drawLake(c, r, W, VIRIDIS[3], VIRIDIS[1]);
    }
  }
}

// Northwind pattern
function northwind() {
  const COLS = 5;
  const ROWS = 7;
  const W = 90;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const c1 = Math.floor(Math.random() * 6);
      const c2 = c1 + 6;
      const rotate = (c + r) % 2 == 1;
      drawNorthwind(
        c,
        r,
        W,
        PLASMA[c % 2 == 1 ? c2 : c1],
        PLASMA[c % 2 == 1 ? c1 : c2],
        rotate,
      );
    }
  }
}

// Option switcher
function onChange(selectElement) {
  document.getElementById("svg").innerHTML = '<defs id="defs"></defs>';
  const value = selectElement.value;
  if (value === "pinwheel") {
    pinwheel();
  } else if (value === "lady") {
    lake();
  } else if (value === "northwind") {
    northwind();
  }
}

onChange(document.getElementsByTagName("select")[0]);
