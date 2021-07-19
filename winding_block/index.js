const SVGNS = "http://www.w3.org/2000/svg";

const WIDTH = 16;
const HEIGHT = 20;

// This represents the different pattern sets and number of unique fabrics per set
const PATTERNS = {
    'peacock': 12,
    'royalnights': 20,
    'sewfine': 20,
    'tongaicing': 20,
    'tongatreats': 20,
};

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
function drawTriange(p, f) {
    const triangle = document.createElementNS(SVGNS, 'polygon');
    const points = p.map(i => i.x + ',' + i.y).join(' ');
    triangle.setAttributeNS(null, 'points', points);
    triangle.setAttributeNS(null, 'fill', f);
    document.getElementById('svg').appendChild(triangle);
}

// Draw a pattern element for use in the background of a shape
function drawPattern(folder, i) {
    const pattern = document.createElementNS(SVGNS, 'pattern');
    pattern.setAttributeNS(null, 'id', folder + i);
    pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');
    pattern.setAttributeNS(null, 'width', 50);
    pattern.setAttributeNS(null, 'height', 50);

    const image = document.createElementNS(SVGNS, 'image');
    image.setAttributeNS(null, 'href', 'images/' + folder + '/' + i + '.jpg');
    image.setAttributeNS(null, 'width', 50);
    image.setAttributeNS(null, 'height', 50);
    image.setAttributeNS(null, 'x', 0);
    image.setAttributeNS(null, 'y', 0);

    pattern.appendChild(image);
    document.getElementById('defs').appendChild(pattern);
}

// Add patterns to the canvas to use as backgrounds
for (const [pattern, count] of Object.entries(PATTERNS)) {
    for (var i = 1; i <= count; i++) {
        drawPattern(pattern, i);
    }
}

// Generate baskets of colors. For lights, we just have one copy of each color.
// For the darks we have one entry representing each block.
let darks = [];
let lights = [];
for (const [key, value] of Object.entries(PATTERNS)) {
    for (var i = 1; i <= value; i++) {
        if (key === 'tongaicing') {
            lights.push({ key, i })
        } else {
            for (var j = 0; j < Math.floor(WIDTH * HEIGHT / value / 4); j++) {
                darks.push({ key, i });
            }

            if (i <= (WIDTH * HEIGHT / 4) - (Math.floor(WIDTH * HEIGHT / value / 4) * value)) {
                darks.push({ key, i });
            }
        }
    }
}

// Returns the orientation of the block given the x,y coorindates
// 0: Square is top left
// 1: Square is top right
// 2: Square is bottom right
// 3: Square is bottom left
function getOrientation(x, y) {
    // Adjust for the second and third columns being offset
    if (x >= 4 && x < 8) {
        y += 2;
    } else if (x >= 8 && x < 12) {
        y += 1;
    }

    // Return orientation of block
    const i = x % 4;
    const j = y % 3;
    if ((i === 0 && j === 1) || (i === 2 && j === 2)) {
        return 0;
    } else if ((i === 1 && j === 1) || (i === 3 && j === 2)) {
        return 2;
    } else if ((i === 0 && j === 2) || (i === 1 && j === 0) || (i === 2 && j === 1)) {
        return 3;
    } else {
        return 1;
    }
}

// Return the points to draw a triange based on the rotation of the block
function getPoints(x, y) {
    const orient = getOrientation(x, y);
    const topleft = { 'x': x * 50, 'y': y * 50 };
    const topright = { 'x': x * 50 + 50, 'y': y * 50 };
    const bottomleft = { 'x': x * 50, 'y': y * 50 + 50 };
    const bottomright = { 'x': x * 50 + 50, 'y': y * 50 + 50 };
    switch (orient) {
        case 0:
            return [topright, bottomleft, bottomright];
        case 1:
            return [topleft, bottomleft, bottomright];
        case 2:
            return [topleft, bottomleft, topright];
        case 3:
            return [topleft, topright, bottomright];
    }
}

// Return the x, y positioning of the small square within the block
function getRect(x, y) {
    const orient = getOrientation(x, y);
    return {
        'x': x * 50 + (orient > 0 && orient < 3 ? 25 : 0),
        'y': y * 50 + (orient >= 2 ? 25 : 0),
    };
}

// Return the average color of the provided image
function getAvgColor(folder, i) {
    const img = document.createElement('img');
    img.setAttribute('src', 'images/' + folder + '/' + i + '.jpg');
    document.body.appendChild(img);

    var canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        rgb = { r: 0, g: 0, b: 0 },
        pixelInterval = 5,
        count = 0,
        i = -4,
        data, length;

    // set the height and width of the canvas element to that of the image
    var height = canvas.height = img.naturalHeight || img.offsetHeight || img.height,
        width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

    context.drawImage(img, 0, 0);

    data = context.getImageData(0, 0, width, height);

    data = data.data;
    length = data.length;
    while ((i += pixelInterval * 4) < length) {
        count++;
        rgb.r += data[i];
        rgb.g += data[i + 1];
        rgb.b += data[i + 2];
    }

    // floor the average values to give correct rgb values (ie: round number values)
    rgb.r = Math.floor(rgb.r / count);
    rgb.g = Math.floor(rgb.g / count);
    rgb.b = Math.floor(rgb.b / count);

    document.body.removeChild(img);

    return rgb;
}

// Calculate the distance between two RGB colors
function calculateDist(c1, c2) {
    return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
}

// Shuffles an array in place and returns it
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Define baseline colors
const red = { r: 255, g: 0, b: 0 };
const orange = { r: 255, g: 165, b: 0 };
const yellow = { r: 255, g: 255, b: 0 };
const green = { r: 0, g: 128, b: 0 };
const blue = { r: 0, g: 0, b: 255 };
const purple = { r: 75, g: 0, b: 130 };
const colors = [red, orange, yellow, green, blue, purple];

// Sort dark colors into 6 buckets based on closest distance
const buckets = {
    reds: [],
    oranges: [],
    yellows: [],
    greens: [],
    blues: [],
    purples: [],
};

for (const { key, i } of darks) {
    const color = getAvgColor(key, i);
    const dists = colors.map(c => calculateDist(color, c));
    const smallest = dists.indexOf(Math.min.apply(Math, dists));
    const smallestKey = Object.keys(buckets)[smallest];
    buckets[smallestKey].push({ key, i });
}

// Merge colors back together in a randomized way
darks = [
    ...shuffleArray(buckets.reds),
    ...shuffleArray(buckets.oranges),
    ...shuffleArray(buckets.yellows),
    ...shuffleArray(buckets.greens),
    ...shuffleArray(buckets.blues),
    ...shuffleArray(buckets.purples),
];

// Iterate through the indices in different orders to get different patterns:
const ALGORITHM = 'diagonal';

// Vertical color bars
let ordering = [];
for (var x = 0; x < WIDTH; x += 1) {
    for (var y = 0; y < HEIGHT; y += 1) {
        ordering.push({ x, y });
    }
}

// Random colors
if (ALGORITHM === 'random') {
    shuffleArray(ordering);
}

// Diagonal color bars
if (ALGORITHM === 'diagonal') {
    ordering.sort((a, b) => {
        const aDist = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
        const bDist = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));
        return aDist > bDist ? 1 : -1;
    });
}

// Concentric circles
if (ALGORITHM === 'circle') {
    ordering.sort((a, b) => {
        const aDist = Math.sqrt(Math.pow(a.x - WIDTH / 2, 2) + Math.pow(a.y - HEIGHT / 2, 2));
        const bDist = Math.sqrt(Math.pow(b.x - WIDTH / 2, 2) + Math.pow(b.y - HEIGHT / 2, 2));
        return aDist > bDist ? 1 : -1;
    });
}

for (var i = 0; i < ordering.length; i++) {
    const dark = darks[i];
    const { x, y } = ordering[i];

    // Just randomize the light color squares
    const light = lights[Math.floor(Math.random() * lights.length)];

    // Draw the light colored background
    drawSquare(x * 50, y * 50, 50, 50, 'url(#' + light.key + light.i + ')');

    // Draw the dark colored square and rectangle
    const pos = getRect(x, y);
    drawSquare(pos.x, pos.y, 25, 25, 'url(#' + dark.key + dark.i + ')');

    const points = getPoints(x, y);
    drawTriange(points, 'url(#' + dark.key + dark.i + ')')
}