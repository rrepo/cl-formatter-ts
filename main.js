// TypeScriptファイル（main.ts）
var code = "(defparameter *edges* `(\n  (living-room (garden west door) \n    (attic upstairs ladder)) \n  (garden \n    (living-room east door)) __COMMENT__; test__ \n  (attic \n    (living-room downstairs ladder)) __COMMENT__;test__ ))";
// `__COMMENT__` を削除し、`__` を改行に置き換え
var result = code
    .replace(/__COMMENT__/g, '') // `__COMMENT__` を削除
    .replace(/__\s*/g, '\n'); // `__` を改行に置き換え、続く空白を削除
console.log(result);
