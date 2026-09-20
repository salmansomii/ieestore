const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, 'products.js');
let productsContent = fs.readFileSync(productsFile, 'utf8');

// The file exports an array: export const products = [ ... ];
// It's easier to just parse the file by removing everything from the start up to the first new product "n1".
// Wait, we can't easily parse it if it has JS code.
// Let's just use regex to remove objects where id is b1-b4, c1-c3, t1-t2.
// Actually, it's much safer to just read the file, and rebuild the products array.
// But it's not JSON, it's a JS file with `export const products = [...]`.
// We can use a regex to match the old products, but since they have nested objects, it's tricky.
// Instead, I can just replace the entire content of products.js!
// I already know exactly what n1-n18 are. I can just re-generate the file!
