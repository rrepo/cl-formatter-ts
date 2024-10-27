import * as fs from 'fs';

// Lispコードのフォーマット関数
function formatLispCode(code: string): string {
  let indentLevel = 0;
  let result = '';
  let i = 0;

  // 最初に改行と余分なスペースを削除して正規化
  code = code.replace(/\s+/g, ' ').trim();

  while (i < code.length) {
    const char = code[i];

    if ((char === '(') && (i === 0 || code[i - 1] !== '\'' && code[i - 1] !== '`')) {
      let content = '';
      let innerIndex = i + 1;
      let nestedLevel = 1;

      while (innerIndex < code.length && nestedLevel > 0) {
        if (code[innerIndex] === '(') nestedLevel++;
        else if (code[innerIndex] === ')') nestedLevel--;
        if (nestedLevel > 0) content += code[innerIndex];
        innerIndex++;
      }

      // インデントレベルが0、新しい(がたされたとき、は改行を入れるようにしたい
      console.log(indentLevel)
      console.log(content)

      if (content.trim().length < 20) {
        result += `(`;
        indentLevel++;
      } else {
        // 新しい `(` に移るとき改行を入れる
        result += `\n${' '.repeat(indentLevel * 2)}(`;
        indentLevel++;
      }
    } else if (char === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      result +=  `)`;
    } else {
      result += char;
    }

    i++;
  }

  return result
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}

// テキストファイルへの出力
const initcode = `
(defparameter *nodes* (    (       living-room (you are in the living room. a wizard is snoring loudly on the couch.))(garden (you are in a beautiful garden. there is a well front of you.))(attic (are you in the attic. there is a giant welding torch in the corner.))))(defun describe-location (location nodes) (cadr (assoc location nodes)))(describe-location       'living-room *nodes*)
(apply #'+ '(1 2 3)) 
`;
const formattedCode = formatLispCode(initcode);

fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
