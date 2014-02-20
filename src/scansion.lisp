(in-package :scansion)

(defun get-nth-integer-from-uri (n)
  (nth n (cl-ppcre:all-matches-as-strings "[0-9]+" (hunchentoot:request-uri hunchentoot::*request*))))

(setf hunchentoot:*dispatch-table*
      (list
       (hunchentoot:create-regex-dispatcher "^/lines/([0-9]*)/([0-9]*)$" 'line-controller)))

(defun line-controller ()
  (let* ((line-id (parse-integer (get-nth-integer-from-uri 0)))
	 (count (parse-integer (get-nth-integer-from-uri 1)))
	 (lines (line-select (:and (:>= 'numbr line-id) (:< 'numbr (+ line-id count)))
			     'numbr))
	 (line-ids (loop for line in lines collect (line-id line)))
	 (syllables (syllable-select (:in 'line-id (:set line-ids)) 'line-id 'position)))
    (json:with-explicit-encoder
      (json:encode-json-to-string
       `(:object
	 "lines" (:array
		  ,@(loop for line in lines collect
		       `(:object
			"id" ,(line-numbr line)
			"string" ,(line-text line)
			"syllables" (:array
				     ,@(loop for sylb in (remove-if-not (lambda (x)
								      (equal (line-id line)
									     (syllable-line-id x))) syllables) collect
					   `(:object
					     "id" ,(syllable-position sylb)
					     "text" ,(syllable-text sylb)
					     "quantity" ,(case (syllable-length sylb)
							       (0 "u")
							       (1 "-")
							       (2 "x"))
					     "start" ,(syllable-start sylb)
					     "charCnt" ,(syllable-char-cnt sylb))))))))))))
