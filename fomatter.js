"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Lispコードのフォーマット関数
function formatLispCode(code) {
    var indentLevel = 0;
    var result = '';
    var i = 0;
    while (i < code.length) {
        var char = code[i];
        if (i < code.length - 1 && (char === '\'' || char === '`') && code[i + 1] === '(') {
            result += '\n' + ' '.repeat(indentLevel * 2) + char + '(';
            indentLevel++;
            i++;
        }
        else if (char === '(') {
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
            if (content.trim().length < 20) {
                console.log(content.trim());
                result += '(' + content.trim() + ')';
                i = innerIndex - 1;
            }
            else {
                if (content.includes('(') || content.includes(')')) {
                    result += ' '.repeat(indentLevel * 2) + '(';
                    indentLevel++;
                }
                else {
                    result += ' '.repeat(indentLevel * 2) + '(' + content.trim() + ')';
                    i = innerIndex - 1;
                }
            }
        }
        else if (char === ')') {
            indentLevel = Math.max(0, indentLevel - 1);
            result += ')';
        }
        else {
            result += char;
        }
        i++;
    }
    return result
        .split('\n')
        .map(function (line) { return line.trimEnd(); })
        .join('\n');
}
// テキストファイルへの出力
var initcode = "\n(defun factorial(n)\n  (if (= n 0) 1\n    (* n (factorial (- n 1)))))\n(print (factorial 5))\n";
var formattedCode = formatLispCode(initcode);
fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
