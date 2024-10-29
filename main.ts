const inputString = `(defparameter *edges* \`(
  (living-room (garden west door) 
    (attic upstairs ladder)) 
  (garden 
    (living-room east door)) __C; test
  __R 
  (attic 
    (living-room downstairs ladder)) __C;test
  __R ))`;

// __Cと__Rを''に置き換える
const outputString = inputString.replace(/__C|__R/g, "");

console.log(outputString);
