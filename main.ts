// TypeScriptファイル（main.ts）
const code: string = `(defparameter *edges* \`(
  (living-room (garden west door) 
    (attic upstairs ladder)) 
  (garden 
    (living-room east door)) __COMMENT__; test__ 
  (attic 
    (living-room downstairs ladder)) __COMMENT__;test__ ))`;

// `__COMMENT__` を削除し、`__` を改行に置き換え
const result: string = code
  .replace(/__COMMENT__/g, '')  // `__COMMENT__` を削除
  .replace(/__\s*/g, '\n');     // `__` を改行に置き換え、続く空白を削除

console.log(result);
