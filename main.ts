import * as fs from 'fs';

// コメントの一時的な置換と復元
function replaceComments(code: string): string {
  return code
    .replace(/(;.*?)(\r?\n)/g, (match, comment, newline) => `__COMMENT__${comment}__${newline}`)
    .replace(/\s+/g, ' ')        // 空白を正規化
    .replace(/`\s*\(/g, '`(')    // 「` (」を「`(」に正規化
    .trim();
}

function restoreComments(code: string): string {
  return code
    .replace(/__COMMENT__/g, '')
    .replace(/__\s*/g, '\n');    // `__` を改行に置き換え
}

// Lispコードのリスト構造を解析し、インデント調整
function parseLispExpression(code: string): string {
  let indentLevel = 0;
  let result = '';
  let i = 0;

  while (i < code.length) {
    const char = code[i];

    if (char === '(' && (i === 0 || (code[i - 1] !== '\'' && code[i - 1] !== '`'))) {
      let content = '';
      let innerIndex = i + 1;
      let nestedLevel = 1;

      while (innerIndex < code.length && nestedLevel > 0) {
        if (code[innerIndex] === '(') nestedLevel++;
        else if (code[innerIndex] === ')') nestedLevel--;
        if (nestedLevel > 0) content += code[innerIndex];
        innerIndex++;
      }

      // インデント処理
      result += indentLevel === 0 ? '\n' : '';
      if (content.trim().length < 20) {
        result += `(`;
        indentLevel++;
      } else {
        result += `\n${' '.repeat(indentLevel * 2)}(`;
        indentLevel++;
      }
    } else if (char === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      result += `)`;
    } else {
      result += char;
    }
    i++;
  }

  return result;
}

// Lispコードのフォーマット関数
function formatLispCode(code: string): string {
  code = replaceComments(code);
  let formattedCode = parseLispExpression(code);
  formattedCode = restoreComments(formattedCode);

  // 行末の余分な空白を削除
  return formattedCode
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}

// テキストファイルへの出力
const initcode = `
(defparameter *edges* \`((living-room (garden west door) (attic upstairs ladder))
    (garden (living-room east door)) ; test
    (attic (living-room downstairs ladder)) ;test
    ))`;

const formattedCode = formatLispCode(initcode);
fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
