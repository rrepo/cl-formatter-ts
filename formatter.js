"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function formatLispCode(code) {
    var indentLevel = 0;
    var result = '';
    var i = 0;
    var inString = false; // 文字列リテラル内かどうかを追跡
    // 最初に改行と余分なスペースを削除して正規化
    code = code
        .replace(/(;.*?)(\r?\n)/g, function (match, comment, newline) { return "".concat(comment, "TTT").concat(newline); })
        .replace(/\s+/g, ' ')
        .replace(/`\s*\(/g, '`(')
        .trim();
    console.log(code);
    while (i < code.length) {
        var char = code[i];
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
            var content = '';
            var innerIndex = i + 1;
            var nestedLevel = 1;
            while (innerIndex < code.length && nestedLevel > 0) {
                if (code[innerIndex] === '(')
                    nestedLevel++;
                else if (code[innerIndex] === ')')
                    nestedLevel--;
                if (nestedLevel > 0)
                    content += code[innerIndex];
                innerIndex++;
            }
            if (indentLevel == 0) {
                result += '\n';
            }
            if (content.trim().length < 20) {
                result += "(";
                indentLevel++;
            }
            else {
                result += "\n".concat(' '.repeat(indentLevel * 2), "(");
                indentLevel++;
            }
        }
        else if (char === ')') {
            var count = 0;
            while (i < code.length && code[i] === ')') {
                count++;
                i++;
            }
            console.log('before', indentLevel);
            indentLevel -= count;
            console.log('after', indentLevel);
            result += ')'.repeat(count);
        }
        else if (char === ';') {
            if (code[i + 1] === ';') {
                console.log(code[i + 1]);
                result += '\n';
            }
            result += char;
            while (i + 1 < code.length) {
                var nextChar = code[i + 1];
                if (nextChar === 'T' && code[i + 2] === 'T' && code[i + 3] === 'T') {
                    i += 3;
                    result += '\n';
                    break;
                }
                else {
                    result += nextChar;
                    i++;
                }
            }
        }
        else if (char === 'T' && code[i + 1] === 'T' && code[i + 2] === 'T') {
            i = i + 3;
            if (code[i + 1] !== '(') {
                result += "\n".concat(' '.repeat(indentLevel * 2));
            }
        }
        else {
            result += char;
        }
        i++;
    }
    return result;
}
// テキストファイルへの出力
var initcode = "\n(defun nodes->dot (nodes) \n  (mapc \n    (lambda (node) (fresh-line) \n      (princ (dot-name (car node))) (princ \"[label=\"\") (princ (dot-label node)) (princ \"\"];\")) nodes)) \n        (nodes->dot *wizard-nodes*) \n        (defun edges->dot (edges) \n          (mapc \n            (lambda (node) \n              (mapc \n                (lambda (edge) (fresh-line) \n                  (princ (dot-name (car node))) (princ \"->\") \n                  (princ (dot-name (car edge))) (princ \"[label=\"\") (princ (dot-label (cdr edge))) (princ \"\"];\")) (cdr node))) \n edges))\n                (edges->dot *wizard-edges*) \n                (defun graph-dot (nodes edges) (princ \"digraoh{\") (nodes->dot nodes) (edges->dot edges) (princ \"}\") )\n";
var formattedCode = formatLispCode(initcode);
fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
