const svgns = "http://www.w3.org/2000/svg";

const patterns = {
    'peacock': 12,
    'royalnights': 20,
    'sewfine': 20,
    'tongaicing': 20,
    'tongatreats': 20,
};

// Add patterns to the canvas
for (const [key, value] of Object.entries(patterns)) {
    for (var i = 1; i <= value; i += 1) {
        const pattern = document.createElementNS(svgns, 'pattern');
        pattern.setAttributeNS(null, 'id', key + i);
        pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');
        pattern.setAttributeNS(null, 'width', 50);
        pattern.setAttributeNS(null, 'height', 50);

        const image = document.createElementNS(svgns, 'image');
        image.setAttributeNS(null, 'href', 'images/' + key + '/' + i + '.jpg');
        image.setAttributeNS(null, 'width', 50);
        image.setAttributeNS(null, 'height', 50);
        image.setAttributeNS(null, 'x', 0);
        image.setAttributeNS(null, 'y', 0);

        pattern.appendChild(image);
        document.getElementById('defs').appendChild(pattern);
    }
}

// Generate baskets of colors. For lights, we just have one copy of each color.
// For the darks we have one entry representing each block.
let darks = [];
const lights = [];
for (const [key, value] of Object.entries(patterns)) {
    for (var i = 1; i <= value; i += 1) {
        if (key === 'tongaicing') {
            lights.push({ key, i })
        } else {
            // Push two copies of the color for everything else
            darks.push({ key, i });
            darks.push({ key, i });
            darks.push({ key, i });
            darks.push({ key, i });
            if (key === 'peacock') {
                // Add extra copies since there are only 12 colors to rotate.
                darks.push({ key, i });
                darks.push({ key, i });
                if (i <= 8) {
                    darks.push({ key, i });
                }
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

function drawSquare(x, y, w, h, f) {
    const square = document.createElementNS(svgns, 'rect');
    square.setAttributeNS(null, 'x', x);
    square.setAttributeNS(null, 'y', y);
    square.setAttributeNS(null, 'width', w);
    square.setAttributeNS(null, 'height', h);
    square.setAttributeNS(null, 'fill', f);
    document.getElementById('svg').appendChild(square);
}

function drawTriange(p, f) {
    const triangle = document.createElementNS(svgns, 'polygon');
    const points = p.map(i => i.x + ',' + i.y).join(' ');
    triangle.setAttributeNS(null, 'points', points);
    triangle.setAttributeNS(null, 'fill', f);
    document.getElementById('svg').appendChild(triangle);
}

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

function calculateDist(c1, c2) {
    return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
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
const reds = [];
const oranges = [];
const yellows = [];
const greens = [];
const blues = [];
const purples = [];

for (const { key, i } of darks) {
    const color = getAvgColor(key, i);
    const dists = colors.map(c => calculateDist(color, c));
    const smallest = dists.indexOf(Math.min.apply(Math, dists));
    switch (smallest) {
        case 0:
            reds.push({ key, i });
            break;
        case 1:
            oranges.push({ key, i });
            break;
        case 2:
            yellows.push({ key, i });
            break;
        case 3:
            greens.push({ key, i });
            break;
        case 4:
            blues.push({ key, i });
            break;
        case 5:
            purples.push({ key, i });
            break;
    }
}

// Merge colors back together in a randomized way
darks = [
    ...reds.sort(() => (Math.random() > .5) ? 1 : -1),
    ...oranges.sort(() => (Math.random() > .5) ? 1 : -1),
    ...yellows.sort(() => (Math.random() > .5) ? 1 : -1),
    ...greens.sort(() => (Math.random() > .5) ? 1 : -1),
    ...blues.sort(() => (Math.random() > .5) ? 1 : -1),
    ...purples.sort(() => (Math.random() > .5) ? 1 : -1),
];

// Add blocks to the canvas
let darksIndex = 0;
for (var x = 0; x < 16; x += 1) {
    for (var y = 0; y < 20; y += 1) {
        // TODO(agale): Diagonal color bars
        // const dark = ...
        // Vertical color bars
        // const dark = darks[darksIndex++];
        // Random colors
        const dark = darks[Math.floor(Math.random() * darks.length)];
        const light = lights[Math.floor(Math.random() * lights.length)];

        // Draw the light colored background
        drawSquare(x * 50, y * 50, 50, 50, 'url(#' + light.key + light.i + ')');

        // Draw the dark colored square and rectangle
        const pos = getRect(x, y);
        drawSquare(pos.x, pos.y, 25, 25, 'url(#' + dark.key + dark.i + ')');

        const points = getPoints(x, y);
        drawTriange(points, 'url(#' + dark.key + dark.i + ')')
    }
}