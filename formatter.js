"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Lispコードのフォーマット関数
function formatLispCode(code) {
    var indentLevel = 0;
    var result = '';
    var i = 0;
    // 最初に改行と余分なスペースを削除して正規化
    code = code.replace(/\s+/g, ' ')
        .replace(/` \(/g, '`(')
        .trim();
    while (i < code.length) {
        var char = code[i];
        if ((char === '(') && (i === 0 || code[i - 1] !== '\'' && code[i - 1] !== '`')) {
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
            // インデントレベルが0、新しい(がたされたとき、は改行を入れるようにしたい
            if (indentLevel == 0) {
                result += '\n';
            }
            if (content.trim().length < 20) {
                result += "(";
                indentLevel++;
            }
            else {
                // 新しい `(` に移るとき改行を入れる
                result += "\n".concat(' '.repeat(indentLevel * 2), "(");
                indentLevel++;
            }
        }
        else if (char === ')') {
            indentLevel = Math.max(0, indentLevel - 1);
            result += ")";
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
var initcode = "\n(setq *print-level* nil)\n(setq *print-length* nil)\n\n(defparameter \n  *nodes*\n  '((living-room (you are in the living room. a wizard is snoring loudly on the couch.))\n    (garden (you are in a beautiful garden. there is a well front of you.))\n    (attic (are you in the attic. there is a giant welding torch in the corner.))\n   )\n)\n\n(defun describe-location (location nodes) \n  (cadr (assoc location nodes))\n)\n\n(describe-location 'living-room *nodes*)\n\n(defparameter \n  *edges*\n  `\n((living-room (garden west door) (attic upstairs ladder))\n    (garden (living-room east door))\n    (attic (living-room downstairs ladder))\n  )\n)";
var formattedCode = formatLispCode(initcode);
fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
