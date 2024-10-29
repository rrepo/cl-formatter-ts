var inputString = "(defparameter *edges* `(\n  (living-room (garden west door) \n    (attic upstairs ladder)) \n  (garden \n    (living-room east door)) __C; test\n  __R \n  (attic \n    (living-room downstairs ladder)) __C;test\n  __R ))";
// __Cと__Rを''に置き換える
var outputString = inputString.replace(/__C|__R/g, "");
console.log(outputString);
