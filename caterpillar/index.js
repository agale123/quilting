const SVGNS = "http://www.w3.org/2000/svg";

// Quilt dimensions (in blocks)
const WIDTH = 8;
const HEIGHT = 10;
const BLOCK_DIM = 100;

// Number of patterns and solids
const PATTERNS = 13;
const SOLIDS = 5;

// Draw a square with the provided location, dimensions and fill
function drawSquare(x, y, w, h, f) {
    const square = document.createElementNS(SVGNS, 'rect');
    square.setAttributeNS(null, 'x', x);
    square.setAttributeNS(null, 'y', y);
    square.setAttributeNS(null, 'width', w);
    square.setAttributeNS(null, 'height', h);
    square.setAttributeNS(null, 'fill', f);
    document.getElementById('svg').appendChild(square);
}

// Draw a triangle with the provided points and fill
function drawPolygon(p, f) {
    const triangle = document.createElementNS(SVGNS, 'polygon');
    const points = p.map(i => i.x + ',' + i.y).join(' ');
    triangle.setAttributeNS(null, 'points', points);
    triangle.setAttributeNS(null, 'fill', f);
    document.getElementById('svg').appendChild(triangle);
}

// Draw a pattern element for use in the background of a shape
function drawPattern(i) {
    const pattern = document.createElementNS(SVGNS, 'pattern');
    pattern.setAttributeNS(null, 'id', i);
    pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');
    pattern.setAttributeNS(null, 'width', BLOCK_DIM);
    pattern.setAttributeNS(null, 'height', BLOCK_DIM);

    const image = document.createElementNS(SVGNS, 'image');
    image.setAttributeNS(null, 'href', 'images/' + i + '.jpg');
    image.setAttributeNS(null, 'width', BLOCK_DIM);
    image.setAttributeNS(null, 'height', BLOCK_DIM);
    image.setAttributeNS(null, 'x', 0);
    image.setAttributeNS(null, 'y', 0);

    pattern.appendChild(image);
    document.getElementById('defs').appendChild(pattern);
}

// Shuffles an array in place and returns it
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function clearSvg() {
    const svg = document.getElementById('svg');
    for (const child of [...svg.children]) {
        if (child.tagName !== "defs") {
            svg.removeChild(child);
        }
    }
}

// Add patterns to the canvas to use as backgrounds
for (let i = 1; i <= 13; i++) {
    drawPattern(i);
}
for (let i = 'a'.charCodeAt(0); i <= 'e'.charCodeAt(0); i++) {
    drawPattern(String.fromCharCode(i));
}

// Event handler for switching the patern
function switchPattern(pattern) {
    clearSvg();
    if (pattern === 'Blocks') {
        drawBlocks();
    } else if (pattern === 'Xs and Os') {
        drawXsAndOs();
    } else if (pattern === 'Rhombus') {
        drawRhombus();
    } else if (pattern === 'Cake') {
        drawCake();
    } else if (pattern === 'Sawtooth') {
        drawSawtooth();
    }
}

// Randomly arrange fabrics as simple blocks.
function drawBlocks() {
    for (var x = 0; x < WIDTH; x += 1) {
        for (var y = 0; y < HEIGHT; y += 1) {
            let pattern = Math.floor(Math.random() * (PATTERNS + SOLIDS)) + 1;
            if (pattern > PATTERNS) {
                pattern = String.fromCharCode('a'.charCodeAt(0) + pattern - PATTERNS - 1);
            }
            drawSquare(x * BLOCK_DIM, y * BLOCK_DIM, BLOCK_DIM, BLOCK_DIM, `url(#${pattern})`);
        }
    }
}

// Randomly arrange fabrics in the Xs And Os pattern.
function drawXsAndOs() {
    for (var x = 0; x < WIDTH; x += 1) {
        for (var y = 0; y < HEIGHT; y += 1) {
            let pattern = Math.floor(Math.random() * (PATTERNS + SOLIDS)) + 1;
            if (pattern > PATTERNS) {
                pattern = String.fromCharCode('a'.charCodeAt(0) + pattern - PATTERNS - 1);
            }
            drawSquare(x * BLOCK_DIM, y * BLOCK_DIM, BLOCK_DIM, BLOCK_DIM, `url(#${pattern})`);
        }
    }
    for (var y = 0; y < HEIGHT + 1; y += 1) {
        let solid = String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * SOLIDS));
        for (var x = 0; x < WIDTH + 1; x += 1) {
            const center = { 'x': x * BLOCK_DIM + (y % 2 === 1 ? BLOCK_DIM : 0), 'y': y * BLOCK_DIM + (x % 2 === 1 ? BLOCK_DIM : 0) };
            const offsets = [
                { 'x': BLOCK_DIM / 2, 'y': 0 },
                { 'x': 0, 'y': BLOCK_DIM / 2 },
                { 'x': BLOCK_DIM / -2, 'y': 0 },
                { 'x': 0, 'y': BLOCK_DIM / -2 },
            ];
            const points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `white`);
        }
    }
}

// Randomly arrange fabrics in a Rhombus Gemstone pattern.
function drawRhombus() {
    for (var x = 0; x < WIDTH * 2 + 1; x += 1) {
        for (var y = 0; y < HEIGHT / 2 + 1; y += 1) {
            const pattern = Math.floor(Math.random() * (PATTERNS - 2)) + 1;
            const solid = String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * SOLIDS));
            const center = { 'x': x * BLOCK_DIM / 2, 'y': y * BLOCK_DIM * 2 + (x % 2 === 1 ? -1 * BLOCK_DIM : 0) };

            // Draw rhombus
            let offsets = [
                { 'x': BLOCK_DIM / 2, 'y': 0 },
                { 'x': 0, 'y': BLOCK_DIM },
                { 'x': BLOCK_DIM / -2, 'y': 0 },
                { 'x': 0, 'y': BLOCK_DIM * -1 },
            ];
            let points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `url(#${pattern})`);

            // Draw border
            offsets = [
                { 'x': 0, 'y': BLOCK_DIM },
                { 'x': BLOCK_DIM / 2, 'y': 0 },
                { 'x': 0, 'y': -1 * BLOCK_DIM },
                { 'x': BLOCK_DIM / -7, 'y': -1 * BLOCK_DIM + BLOCK_DIM / 4 },
                { 'x': BLOCK_DIM / 2 - BLOCK_DIM / 4, 'y': 0 },
                { 'x': BLOCK_DIM / -7, 'y': BLOCK_DIM - BLOCK_DIM / 4 },
            ];
            points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `url(#${solid})`);
        }
    }
}

// Randomly arrange fabrics in a Cake pattern.
function drawCake() {
    for (var x = 1; x < WIDTH / 2 + 1 ; x += 1) {
        for (var y = 1; y < HEIGHT; y += 1) {
            if (x === WIDTH / 2 && y % 2 === 0) {
                continue;
            }
            const pattern = Math.floor(Math.random() * (PATTERNS - 2)) + 1;
            const solid = String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * SOLIDS));
            const center = { 'x': x * BLOCK_DIM * 2 + (y % 2 === 1 ? -1 * BLOCK_DIM : 0), 'y': y * BLOCK_DIM };

            // Draw border
            let offsets = [
                { 'x': BLOCK_DIM, 'y': 0 },
                { 'x': 0, 'y': BLOCK_DIM },
                { 'x': BLOCK_DIM * -1, 'y': 0 },
                { 'x': 0, 'y': BLOCK_DIM * -1 },
            ];
            let points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `url(#${solid})`);

            // Draw small square background
            offsets = [
                { 'x': 0, 'y': BLOCK_DIM / 2 },
                { 'x': BLOCK_DIM / 4, 'y': BLOCK_DIM / 1.3 },
                { 'x': 0, 'y': BLOCK_DIM },
                { 'x': BLOCK_DIM / -4, 'y': BLOCK_DIM / 1.3 },
            ];
            points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `white`);

            // Draw background
            offsets = [
                { 'x': 0, 'y': BLOCK_DIM / 2 },
                { 'x': BLOCK_DIM / 1.3, 'y': BLOCK_DIM / -4 },
                { 'x': 0, 'y': BLOCK_DIM * -1 },
                { 'x': BLOCK_DIM / -1.3, 'y': BLOCK_DIM / -4 },
            ];
            points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `white`);

            // Draw square
            offsets = [
                { 'x': 0, 'y': 0 },
                { 'x': BLOCK_DIM / 2, 'y': BLOCK_DIM / -2 },
                { 'x': 0, 'y': BLOCK_DIM * -1 },
                { 'x': BLOCK_DIM / -2, 'y': BLOCK_DIM / -2 },
            ];
            points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `url(#${pattern})`);
        }
    }
}

// Randomly arrange fabrics in a Sawtooth pattern.
function drawSawtooth() {
    for (var x = 0; x < WIDTH; x += 1) {
        for (var y = 0; y < HEIGHT; y += 1) {

            const pattern = Math.floor(Math.random() * (PATTERNS - 2)) + 1;
            const solid = String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * SOLIDS));
            const center = { 'x': x * BLOCK_DIM + BLOCK_DIM / 2, 'y': y * BLOCK_DIM + BLOCK_DIM / 2 };

            // Draw triangles
            offsets = [
                { 'x': BLOCK_DIM / -4, 'y': BLOCK_DIM / -4 },
                { 'x': BLOCK_DIM / -4, 'y': BLOCK_DIM / -2 },
                { 'x': 0, 'y': BLOCK_DIM / -4 },
                { 'x': BLOCK_DIM / 4, 'y': BLOCK_DIM / -2 },
                { 'x': BLOCK_DIM / 4, 'y': BLOCK_DIM / -4 },

                { 'x': BLOCK_DIM / 4, 'y': BLOCK_DIM / -4 },
                { 'x': BLOCK_DIM / 2, 'y': BLOCK_DIM / -4 },
                { 'x': BLOCK_DIM  / 4, 'y': 0 },
                { 'x': BLOCK_DIM / 2, 'y': BLOCK_DIM / 4 },
                { 'x': BLOCK_DIM / 4, 'y': BLOCK_DIM / 4 },

                { 'x': BLOCK_DIM / -4, 'y': BLOCK_DIM / 4 },
                { 'x': BLOCK_DIM / -4, 'y': BLOCK_DIM / 2 },
                { 'x': 0, 'y': BLOCK_DIM / 4 },
                { 'x': BLOCK_DIM / 4, 'y': BLOCK_DIM / 2 },
                { 'x': BLOCK_DIM / 4, 'y': BLOCK_DIM / 4 },

                { 'x': BLOCK_DIM / -4, 'y': BLOCK_DIM / -4 },
                { 'x': BLOCK_DIM / -2, 'y': BLOCK_DIM / -4 },
                { 'x': BLOCK_DIM  / -4, 'y': 0 },
                { 'x': BLOCK_DIM / -2, 'y': BLOCK_DIM / 4 },
                { 'x': BLOCK_DIM / -4, 'y': BLOCK_DIM / 4 },
            ];
            points = [];
            for (const offset of offsets) {
                points.push({ 'x': offset.x + center.x, 'y': offset.y + center.y });
            }
            drawPolygon(points, `url(#${solid})`);

            // Draw inner square
            drawSquare(x * BLOCK_DIM + BLOCK_DIM / 4, y * BLOCK_DIM + BLOCK_DIM / 4, BLOCK_DIM / 2, BLOCK_DIM / 2, `url(#${pattern})`);
        }
    }
}

// Start with drawing blocks
switchPattern('Blocks');