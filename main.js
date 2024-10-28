"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// コメントの一時的な置換と復元
function replaceComments(code) {
    return code
        .replace(/(;.*?)(\r?\n)/g, function (match, comment, newline) { return "__COMMENT__".concat(comment, "__").concat(newline); })
        .replace(/\s+/g, ' ') // 空白を正規化
        .replace(/`\s*\(/g, '`(') // 「` (」を「`(」に正規化
        .trim();
}
function restoreComments(code) {
    return code
        .replace(/__COMMENT__/g, '')
        .replace(/__\s*/g, '\n'); // `__` を改行に置き換え
}
// Lispコードのリスト構造を解析し、インデント調整
function parseLispExpression(code) {
    var indentLevel = 0;
    var result = '';
    var i = 0;
    while (i < code.length) {
        var char = code[i];
        if (char === '(' && (i === 0 || (code[i - 1] !== '\'' && code[i - 1] !== '`'))) {
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
            // インデント処理
            result += indentLevel === 0 ? '\n' : '';
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
            indentLevel = Math.max(0, indentLevel - 1);
            result += ")";
        }
        else {
            result += char;
        }
        i++;
    }
    return result;
}
// Lispコードのフォーマット関数
function formatLispCode(code) {
    code = replaceComments(code);
    var formattedCode = parseLispExpression(code);
    formattedCode = restoreComments(formattedCode);
    // 行末の余分な空白を削除
    return formattedCode
        .split('\n')
        .map(function (line) { return line.trimEnd(); })
        .join('\n');
}
// テキストファイルへの出力
var initcode = "\n(defparameter *edges* `((living-room (garden west door) (attic upstairs ladder))\n    (garden (living-room east door)) ; test\n    (attic (living-room downstairs ladder)) ;test\n    ))";
var formattedCode = formatLispCode(initcode);
fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
