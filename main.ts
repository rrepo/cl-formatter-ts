import * as fs from 'fs';

function formatLispCode(code: string): string {
  let indentLevel = 0;
  let result = '';
  let i = 0;

  // コメントを保護し、余分なスペースや改行を削除
  code = code
    .replace(/(;.*?)(\r?\n)?/g, (match, comment) => `${comment}TTT`)
    .replace(/\s+/g, ' ')
    .replace(/`\s*\(/g, '`(')
    .trim();

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

      if (indentLevel === 0) {
        result += '\n';
      }

      if (content.trim().length < 20) {
        result += `(`;
        indentLevel++;
      } else {
        result += `\n${' '.repeat(indentLevel * 2)}(`;
        indentLevel++;
      }
    } else if (char === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      if (i + 1 < code.length && code[i + 1] === ')') {
        result += `)`;
      } else {
        result += `)\n${' '.repeat(indentLevel * 2)}`;
      }
    } else if (char === "T" && code[i + 1] === "T" && code[i + 2] === "T") {
      // コメント行の改行を防ぐ
      result = result.trimEnd() + ` `;
      i += 2;
    } else {
      result += char;
    }
    i++;
  }

  return result
    .replace(/TTT\s?/g, "") // コメントマーカーを削除
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

// テキストファイルへの出力
const initcode = `
(defparameter 
  *edges*
  \`
((living-room (garden west door) (attic upstairs ladder)) ;trtttere
(garden (living-room east door)); test
(attic (living-room downstairs ladder)) ;test
))`;
const formattedCode = formatLispCode(initcode);

fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
