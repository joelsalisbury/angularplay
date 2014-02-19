(in-package :scansion)

(nst:def-test-group eat-space-tests ()
  (nst:def-test eats-spaces-and-punctuation (:equal '(#\a))
    (multiple-value-bind (text n) (eat-space '(#\. #\Space #\, #\a))
      (declare (ignore n)) text))
  (nst:def-test return-count-of-eaten (:equal 3)
    (multiple-value-bind (text n) (eat-space '(#\. #\Space #\, #\a))
      (declare (ignore text)) n)))
  
(nst:def-test-group text-char-p-tests ()
  (nst:def-test t-for-upper-case (:true) (text-char-p #\A))
  (nst:def-test t-for-lower-case (:true) (text-char-p #\a))
  (nst:def-test t-for-number (:true) (text-char-p #\1))
  (nst:def-test false-for-punctuation (:not :true) (text-char-p #\.)))

(nst:def-test-group pre-process-text-line-tests ()
  (nst:def-criterion (:pre-process-text-line (expected) (raw))
    (testing:equal-report expected (pre-process-text-line raw)))

  (nst:def-test splits-line-to-identify-start-and-text
      (:pre-process-text-line (545 "nec pietate fuit, nec bello maior et armis."))
    "Line:#545#Full Line:#nec pietate fuit, nec bello maior et armis.##############"))

    (nst:def-test-group pre-process-syllable-line-tests ()
      (nst:def-criterion (:pre-process-syllable-line (expected) (raw))
	(testing:equal-report expected (pre-process-syllable-line raw)))

      (nst:def-test splits-line-and-identifies-syllables
	  (:pre-process-syllable-line ("Rex" "er" "at" "Ae" "ne" "as" "nob" "is" "quo-i" "us" "ti" "or" "al" "ter"))
	"#Rex#er#at#Ae#ne#as#nob#is#quo-i#us#ti#or#al#ter###"))

(nst:def-test-group pre-process-length-line-tests ()
  (nst:def-criterion (:pre-process-length-line (expected) (raw))
      (testing:equal-report expected (pre-process-length-line raw)))

  (nst:def-test splits-line-and-identifies-lengths
	    (:pre-process-length-line (1 0 0 1 1 1 1 1 1 1 0 0 1 2))
	    "Length:#-#u#u#-#-#-#-#-#-#-#u#u#-#X###"))
	    