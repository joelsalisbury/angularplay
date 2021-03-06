(in-package :cl-user)
(defpackage :scansion.testing
  (:use :cl)
  (:import-from :scansion.utils
		:equal-report)
  (:import-from :scansion.parsing
		:pre-process-length-line
		:pre-process-syllable-line
		:pre-process-text-line
		:text-char-p
		:eat-space
		:match-text-sylb
		:determine-syllable-length
		:bad-syllable-handler
		:get-syllable-range
		:bad-syllable
		:process-syllables)
  (:import-from :scansion.model
		:syllable
		:syllable-position
		:syllable-start
		:syllable-char-cnt
		:syllable-length
		:syllable-text))
(in-package :scansion.testing)
  

(nst:def-test-group process-syllables-tests ()
  (nst:def-criterion (:process-syllables (syllables) (text sylbls lengths pos index))
    (equal-report syllables
		  (mapcar (lambda (s)
			    `(:POSITION ,(syllable-position s)
			      :START ,(syllable-start s)
			      :CHAR-CNT ,(syllable-char-cnt s)
			      :LENGTH ,(syllable-length s)
			      :TEXT ,(syllable-text s)))
			  (process-syllables text sylbls lengths pos index))))
  (nst:def-test creates-syllables (:process-syllables
				   ((:POSITION 0 :START 0
				     :CHAR-CNT 2 :LENGTH 1 :TEXT "my")
				    (:POSITION 1 :START 3
				     :CHAR-CNT 4 :LENGTH 2 :TEXT "text")))
    '(#\m #\y #\Space #\t #\e #\x #\t) '("my" "text") '(1 2) 0 0))

(nst:def-test-group get-syllable-range-tests ()
  (nst:def-test simple-range (:values (:equal 0) (:equal 2))
    (get-syllable-range '(#\a #\b #\c) '(#\a #\b)))
  (nst:def-test space-prefix-range (:values (:equal 2) (:equal 2))
    (get-syllable-range '(#\. #\Space #\a #\b #\c) '(#\a #\b))))

(nst:def-test-group determine-syllable-length-tests ()
  (nst:def-test simple-syllable (:equal 2)
    (determine-syllable-length '(#\a #\b #\c #\d) '(#\a #\b)))
  (nst:def-test trans-space-syllable (:equal 3)
    (determine-syllable-length '(#\a #\Space #\c #\d) '(#\a #\- #\c)))
  (nst:def-test error-out-on-mismatch (:err :type bad-syllable)
    (determine-syllable-length '(#\a #\b) '(#\c))))

(nst:def-test-group match-text-sylb-tests ()
  (nst:def-criterion (:match-text-sylb (match txt-cnt syb-cnt) (text sylb))
    (multiple-value-bind (mtc txt syb)
	(match-text-sylb text sylb)
      (equal-report (list mtc txt syb) (list match txt-cnt syb-cnt))))
  (nst:def-test matches-same-char
      (:match-text-sylb t 1 1) '(#\A) '(#\A))
  (nst:def-test matches-up-low-char
      (:match-text-sylb t 1 1) '(#\a) '(#\A))
  (nst:def-test matches-space-dash
      (:match-text-sylb t 1 1) '(#\Space) '(#\-))
  (nst:def-test matches-non-text-dash
      (:match-text-sylb t 1 1) '(#\.) '(#\-))
  (nst:def-test no-match-text-dash
      (:match-text-sylb nil 0 0) '(#\a) '(#\-))
  (nst:def-test matches-dash-dash
      (:match-text-sylb t 1 1) '(#\-) '(#\-))
  (nst:def-test matches-dash-and-eats-space
      (:match-text-sylb t 3 1) '(#\. #\Space #\Space) '(#\-)))

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

(nst:def-test-group pre-process-text-line-with-comma-tests ()
  (nst:def-criterion (:pre-process-text-line (expected) (raw))
    (equal-report expected (pre-process-text-line raw)))

  (nst:def-test splits-line-to-identify-start-and-text
      (:pre-process-text-line (545 "nec pietate fuit, nec bello maior et armis."))
    "Line:,545,Full Line:,\"nec pietate fuit, nec bello maior et armis.\",,,,,,,,,,,,,,"))

(nst:def-test-group pre-process-text-line-no-comma-tests ()
  (nst:def-criterion (:pre-process-text-line (expected) (raw))
    (equal-report expected (pre-process-text-line raw)))

  (nst:def-test splits-line-to-identify-start-and-text
      (:pre-process-text-line (545 "nec pietate fuit nec bello maior et armis."))
    "Line:,545,Full Line:,nec pietate fuit nec bello maior et armis.,,,,,,,,,,,,,,"))

(nst:def-test-group pre-process-syllable-line-tests ()
  (nst:def-criterion (:pre-process-syllable-line (expected) (raw))
    (equal-report expected (pre-process-syllable-line raw)))

  (nst:def-test splits-line-and-identifies-syllables
      (:pre-process-syllable-line ("Rex" "er" "at" "Ae" "ne" "as" "nob" "is" "quo-i" "us" "ti" "or" "al" "ter"))
    ",Rex,er,at,Ae,ne,as,nob,is,quo-i,us,ti,or,al,ter,,,"))

(nst:def-test-group pre-process-length-line-tests ()
  (nst:def-criterion (:pre-process-length-line (expected) (raw))
    (equal-report expected (pre-process-length-line raw)))

  (nst:def-test splits-line-and-identifies-lengths
      (:pre-process-length-line (1 0 0 1 1 1 1 1 1 1 0 0 1 2))
    "Length:,-,u,u,-,-,-,-,-,-,-,u,u,-,X,,,"))

