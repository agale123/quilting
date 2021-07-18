// Initial ordering of fabrics
const fabrics = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  
function renderBlocks(blocks, text) {
    const title = document.createElement('h1');
    title.innerText = text;
    document.body.appendChild(title);
    for (const block of blocks) {
        const parent = document.createElement('div');
        for (const square of block) {
            const child = document.createElement('span');
            child.innerText = square;
            child.className = square;
            parent.appendChild(child);
        }
        document.body.appendChild(parent);
    }
}

// Generate initial grids
let blocks = fabrics.map(f => Array(9).fill(f));

// Perform first split
let tempBlocks = JSON.parse(JSON.stringify(blocks));
for (let i = 0; i < 9; i++) {
    tempBlocks[i][0] = blocks[(i+3) % 9][0];
    tempBlocks[i][1] = blocks[(i+3) % 9][1];
    tempBlocks[i][2] = blocks[(i+3) % 9][2];
}
blocks = tempBlocks
renderBlocks(blocks, 'First split');

// Perform second split
tempBlocks = JSON.parse(JSON.stringify(blocks));
for (let i = 0; i < 9; i++) {
    tempBlocks[i][6] = blocks[(i+6) % 9][6];
    tempBlocks[i][7] = blocks[(i+6) % 9][7];
    tempBlocks[i][8] = blocks[(i+6) % 9][8];
}
blocks = tempBlocks
renderBlocks(blocks, 'Second split');

// Perform third split
tempBlocks = JSON.parse(JSON.stringify(blocks));
for (let i = 0; i < 9; i++) {
    tempBlocks[i][0] = blocks[(i+4) % 9][0];
    tempBlocks[i][3] = blocks[(i+4) % 9][3];
    tempBlocks[i][6] = blocks[(i+4) % 9][6];
}
blocks = tempBlocks
renderBlocks(blocks, 'Third split');

// Perform fourth split
tempBlocks = JSON.parse(JSON.stringify(blocks));
const offsets = [8, 6, 4, 2, 0, 7, 5, 3, 1];
for (let i = 0; i < 9; i++) {
    tempBlocks[i][2] = blocks[offsets[i]][2];
    tempBlocks[i][5] = blocks[offsets[i]][5];
    tempBlocks[i][8] = blocks[offsets[i]][8];
}
blocks = tempBlocks
renderBlocks(blocks, 'Fourth split');
