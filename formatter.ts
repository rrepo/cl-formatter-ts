import * as fs from 'fs';

function formatLispCode(code: string): string {
  let indentLevel = 0;
  let result = '';
  let i = 0;
  let inString = false; // 文字列リテラル内かどうかを追跡

  // 最初に改行と余分なスペースを削除して正規化
  code = code
    .replace(/(;.*?)(\r?\n)/g, (match, comment, newline) => `${comment}TTT${newline}`)
    .replace(/\s+/g, ' ')
    .replace(/`\s*\(/g, '`(')
    .trim();

  console.log(code);

  while (i < code.length) {
    const char: string = code[i];

    // 文字列リテラルの開始と終了を判定
    if (char === '"' && (i === 0 || code[i - 1] !== '\\')) {
      inString = !inString; // 文字列リテラルの状態を切り替える
      result += char;
      i++;
      continue;
    }

    // 文字列リテラル内ではそのまま追加
    if (inString) {
      result += char;
      i++;
      continue;
    }

    // 通常のコード処理
    if (char === '(' && (i === 0 || code[i - 1] !== '\'' && code[i - 1] !== '`')) {
      let content = '';
      let innerIndex = i + 1;
      let nestedLevel = 1;

      while (innerIndex < code.length && nestedLevel > 0) {
        if (code[innerIndex] === '(') nestedLevel++;
        else if (code[innerIndex] === ')') nestedLevel--;
        if (nestedLevel > 0) content += code[innerIndex];
        innerIndex++;
      }

      if (indentLevel == 0) {
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
      let count = 0;
      while (i < code.length && code[i] === ')') {
        count++;
        i++;
      }
      console.log('before', indentLevel);
      indentLevel -= count;
      console.log('after', indentLevel);
      result += ')'.repeat(count);
    } else if (char === ';') {
      if (code[i + 1] === ';') {
        console.log(code[i + 1]);
        result += '\n';
      }

      result += char;

      while (i + 1 < code.length) {
        const nextChar = code[i + 1];

        if (nextChar === 'T' && code[i + 2] === 'T' && code[i + 3] === 'T') {
          i += 3;
          result += '\n';
          break;
        } else {
          result += nextChar;
          i++;
        }
      }
    } else if (char === 'T' && code[i + 1] === 'T' && code[i + 2] === 'T') {
      i = i + 3;
      if (code[i + 1] !== '(') {
        result += `\n${' '.repeat(indentLevel * 2)}`;
      }
    } else {
      result += char;
    }
    i++;
  }

  return result;
}

// テキストファイルへの出力
const initcode = `
(defun nodes->dot (nodes) 
  (mapc 
    (lambda (node) (fresh-line) 
      (princ (dot-name (car node))) (princ "[label=\"") (princ (dot-label node)) (princ "\"];")) nodes)) 
        (nodes->dot *wizard-nodes*) 
        (defun edges->dot (edges) 
          (mapc 
            (lambda (node) 
              (mapc 
                (lambda (edge) (fresh-line) 
                  (princ (dot-name (car node))) (princ "->") 
                  (princ (dot-name (car edge))) (princ "[label=\"") (princ (dot-label (cdr edge))) (princ "\"];")) (cdr node))) 
 edges))
                (edges->dot *wizard-edges*) 
                (defun graph-dot (nodes edges) (princ "digraoh{") (nodes->dot nodes) (edges->dot edges) (princ "}") )
`;
const formattedCode = formatLispCode(initcode);

fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
