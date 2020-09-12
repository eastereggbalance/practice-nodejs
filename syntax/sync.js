let fs = require('fs');

/*
//readFileSync
console.log('A');
let result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
*/

console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', (err, result) =>
{
    console.log(result);
});
console.log('C');

// nodejs 성능 끌어 올릴려면 비동기 사용 