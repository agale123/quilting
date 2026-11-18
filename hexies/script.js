///////////////////////////////////////////////////////////////////////////////
// Setup
///////////////////////////////////////////////////////////////////////////////

const N = 24;
let imgs = [];

async function setup() {
  createCanvas(600, 800);
  background(255);

  for (let i = 0; i < N; i++) {
    imgs[i] = await loadImage(`images/${i + 1}.jpg`);
  }

  noLoop();
}

///////////////////////////////////////////////////////////////////////////////
// Shape helpers
///////////////////////////////////////////////////////////////////////////////

function irect(img, x, y, w, h) {
  push();
  {
    beginClip();
    // rect(x, y, w, [h])
    // quad(x1, y1, x2, y2, x3, y3, x4, y4)
    rect(x, y, w, h);
    endClip();

    // image(img, x, y, w, h)
    image(img, x, y, w, h);
  }
  pop();
}

function itriangle(img, x1, y1, x2, y2, x3, y3) {
  push();
  {
    beginClip();
    // triangle(x1, y1, x2, y2, x3, y3)
    triangle(x1, y1, x2, y2, x3, y3);
    endClip();

    // image(img, x, y, w, h)
    const x = Math.min(x1, x2, x3);
    const y = Math.min(y1, y2, y3);
    image(img, x, y, Math.max(x1, x2, x3) - x, Math.max(y1, y2, y3) - y);
  }
  pop();
}

function cline(c, w, x1, y1, x2, y2) {
  push();
  {
    // line(x1, y1, x2, y2)
    stroke(c);
    strokeWeight(w);
    line(x1, y1, x2, y2);
  }
  pop();
}

///////////////////////////////////////////////////////////////////////////////
// Color helpers
///////////////////////////////////////////////////////////////////////////////

function getAverageColor(img) {
  img.loadPixels();
  let r = 0,
    g = 0,
    b = 0;
  let totalPixels = img.pixels.length / 4;

  for (let i = 0; i < img.pixels.length; i += 4) {
    r += img.pixels[i]; // Red
    g += img.pixels[i + 1]; // Green
    b += img.pixels[i + 2]; // Blue
  }

  return color(r / totalPixels, g / totalPixels, b / totalPixels);
}

///////////////////////////////////////////////////////////////////////////////
// Draw
///////////////////////////////////////////////////////////////////////////////

function demo() {
  // All fabric swatches
  for (let i = 0; i < N; i++) {
    const x = (i % 4) * 100;
    const y = Math.floor(i / 4) * 100;
    image(imgs[i], x, y, 100, 100);

    fill("white");
    noStroke();
    // Opposite hue (+180) represents complementary colors
    // Saturation is the intensity of the color
    // Brightness represents how light/dark the color is
    const color = getAverageColor(imgs[i]);
    text("H: " + parseInt(hue(color)), x + 25, y + 25);
    text("S: " + parseInt(saturation(color)), x + 25, y + 50);
    text("B: " + parseInt(brightness(color)), x + 25, y + 75);
  }

  irect(imgs[0], 300, 700, 100, 50);
  itriangle(imgs[5], 450, 450, 450, 550, 550, 550);
  cline("white", 10, 300, 700, 400, 750);
}

function draw() {
  stroke("black");
  rect(0, 0, 600, 800);

  demo();
}
