import * as fs from 'fs';

// Lispコードのフォーマット関数
function formatLispCode(code: string): string {
  let indentLevel = 0;
  let result = '';
  let i = 0;

  // 最初に改行と余分なスペースを削除して正規化
  code = code.replace(/(;.*?)(\r?\n)/g, (match, comment, newline) => `__COMMENT__${comment}__${newline}`)
    // 空白を正規化
    .replace(/\s+/g, ' ')
    .replace(/`\s*\(/g, '`(')
    .trim()
  // コメントを元に戻す
  // .replace(/__COMMENT__(.*?);__(\r?\n)/g, '$1$2');

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
      if (indentLevel == 0) {
        result += '\n';
      }

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
      result += `)`;
    } else {
      result += char;
    }
    i++;
  }

  // console.log(result)
  result = result
    .replace(/__COMMENT__/g, '')
    .replace(/__\s*/g, '\n');
  console.log(result)
  // return result


  return result
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}

// テキストファイルへの出力
const initcode = `
(defparameter 
  *edges*
  \`
((living-room (garden west door) (attic upstairs ladder))
    (garden (living-room east door)) ; test
    (attic (living-room downstairs ladder)) ;test
))`;
const formattedCode = formatLispCode(initcode);

fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
