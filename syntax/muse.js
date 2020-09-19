// let M =
// {
//     v : 'v',
//     f : function()
//     {
//         console.log(this.v);
//     }
// }

let part = require('./mpart.js');

part.v = "Hello";
part.f();
// M.f();