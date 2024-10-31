"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function formatLispCode(code) {
    var indentLevel = 0;
    var result = '';
    var i = 0;
    // 最初に改行と余分なスペースを削除して正規化
    code = code
        .replace(/(;.*?)(\r?\n)/g, function (match, comment, newline) { return "".concat(comment, "TTT").concat(newline); })
        .replace(/\s+/g, ' ')
        .replace(/`\s*\(/g, '`(')
        .trim();
    console.log(code);
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
                // 手前が(か()内の場合は変えるようにしたいが、検出するやり方がわからない
                result += "\n".concat(' '.repeat(indentLevel * 2), "(");
                indentLevel++;
            }
        }
        else if (char === ')') {
            indentLevel = Math.max(0, indentLevel - 1);
            result += ")";
        }
        else if (char == "T" && code[i + 1] == "T" && code[i + 2] == "T") {
            i = i + 3;
            if (code[i + 1] != "(") {
                result += "\n".concat(' '.repeat(indentLevel * 2));
            }
        }
        else {
            result += char;
        }
        i++;
    }
    return result;
    // .split('\n')
    // .map(line => line.trimEnd())
    // .join('\n');
}
// テキストファイルへの出力
var initcode = "\n(defparameter \n  *edges*\n  `\n((living-room (garden west door) (attic upstairs ladder)) ;trtttere\n(garden (living-room east door)\n); test\n(attic (living-room downstairs ;test\nladder))\n))";
var formattedCode = formatLispCode(initcode);
fs.writeFileSync('formatted_lisp_code.txt', formattedCode);
console.log("フォーマット済みのコードが 'formatted_lisp_code.txt' に出力されました。");
