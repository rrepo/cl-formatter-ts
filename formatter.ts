import * as fs from 'fs';

function formatLispCode(code: string): string {
  let indentLevel = 0;
  let result = '';
  let i = 0;

  // 最初に改行と余分なスペースを削除して正規化
  code = code
    .replace(/(;.*?)(\r?\n)/g, (match, comment, newline) => `${comment}TTT${newline}`)
    .replace(/\s+/g, ' ')
    .replace(/`\s*\(/g, '`(')
    .trim()

  console.log(code)

  while (i < code.length) {
    const char: string = code[i];

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
        // 手前が(か()内の場合は変えるようにしたいが、検出するやり方がわからない
        result += `\n${' '.repeat(indentLevel * 2)}(`;
        indentLevel++;
      }
    } else if (char === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      result += `)`;
    } else if (char == "T" && code[i + 1] == "T" && code[i + 2] == "T") {
      i = i + 3
      if (code[i + 1] != "(") {
        result += `\n${' '.repeat(indentLevel * 2)}`;
      }
    } else {
      result += char;
    }
    i++;
  }

  return result
  // .split('\n')
  // .map(line => line.trimEnd())
  // .join('\n');
}

// テキストファイルへの出力
const initcode = `
(defparameter 
  *edges*
  \`
((living-room (garden west door) (attic upstairs ladder)) ;trtttere
(garden (living-room east door)
); test
(attic (living-room downstairs ;test
ladder))
))`;
const formattedCode = formatLispCode(initcode);

fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
