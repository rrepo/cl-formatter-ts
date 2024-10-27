// Lispコードのフォーマット関数
function formatLispCode(code) {
  let indentLevel = 0;
  let result = '';
  let i = 0;

  // 最初に改行と余分なスペースを削除して正規化
  code = code.replace(/\s+/g, ' ').trim();

  while (i < code.length) {
    const char = code[i];

    if (char === "\`" && code[i +1] == "(") {
      console.log(char,"!!!")
    }

    i++;
  }

  return result
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}

// テキストファイルへの出力
const initcode = `
(setq *print-level* nil)
(setq *print-length* nil)

(defparameter 
  *nodes*
  '((living-room (you are in the living room. a wizard is snoring loudly on the couch.))
    (garden (you are in a beautiful garden. there is a well front of you.))
    (attic (are you in the attic. there is a giant welding torch in the corner.))
   )
)

(defun describe-location (location nodes) 
  (cadr (assoc location nodes))
)

(describe-location 'living-room *nodes*)

(defparameter 
  *edges*
  \`((living-room (garden west door) (attic upstairs ladder)) 
    (garden (living-room east door))
    (attic (living-room downstairs ladder))
  )
)`;
const formattedCode = formatLispCode(initcode);

console.log(formattedCode)