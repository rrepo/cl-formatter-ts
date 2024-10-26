import * as fs from 'fs';

// Lispコードのフォーマット関数
function formatLispCode(code: string): string {
  let indentLevel = 0;
  let result = '';
  let i = 0;

  while (i < code.length) {
    const char = code[i];

    if (i < code.length - 1 && (char === '\'' || char === '`') && code[i + 1] === '(') {
      // ここで20文字以上なら、改行して表示する機能を追加する
      result += char + '(';
      indentLevel++;
      i++;
    } else if (char === '(') {
      let content = '';
      let innerIndex = i + 1;
      let nestedLevel = 1;

      while (innerIndex < code.length && nestedLevel > 0) {
        if (code[innerIndex] === '(') nestedLevel++;
        else if (code[innerIndex] === ')') nestedLevel--;
        if (nestedLevel > 0) content += code[innerIndex];
        innerIndex++;
      }
      
      if (content.trim().length < 20) {
        console.log(content.trim())
        result += '(' + content.trim() + ')';
        i = innerIndex - 1;
      } else {
        if (content.includes('(') || content.includes(')')) {
          result += '(';
          indentLevel++;
        } else {
          result += '(' + content.trim() + ')';
          i = innerIndex - 1;
        }
      }
    } else if (char === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      result +=  ')';
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
(defparameter 
  *nodes*
  '((living-room (you are in the living room. a wizard is snoring loudly on the couch.))
    (garden (you are in a beautiful garden. there is a well front of you.))
    (attic (are you in the attic. there is a giant welding torch in the corner.))
   )
)

(defun describe-location (location nodes) 
  (cadr (assoc location nodes))
)

(describe-location 'living-room *nodes*)

`;
const formattedCode = formatLispCode(initcode);

fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
