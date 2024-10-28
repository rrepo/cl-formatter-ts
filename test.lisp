(defun fizz_buzz (num)
  (cond ((and (= 0 (mod num 3)) (= 0 (mod num 5))) "FizzBuzz")
        (= 0 (mod num 3)) "Fizz") ;fizz
        ((= 0 (mod num 5)) "Buzz")
        (t num))
