(in-package :scansion)

(defun get-nth-integer-from-uri (n)
  (nth n (cl-ppcre:all-matches-as-strings "[0-9]+" (hunchentoot:request-uri hunchentoot::*request*))))

(setf hunchentoot:*dispatch-table*
      (list
       (hunchentoot:create-regex-dispatcher "^/lines/([0-9]*)/([0-9]*)$" 'line-controller)))

(defvar line-one)
(defvar line-one-id)
(defvar local-file #p"./data/aeneid.csv")

(defun refresh-db (file)
  ;; Get rid of the old data
  (with-connection (db-params)
    (execute (:delete-from 'syllable))
    (execute (:delete-from 'line)))
  
  (with-open-file (in file :direction :input)
    (loop for text-line = (read-line in nil)
       while text-line do
	 (let* ((junk-1 (read-line in nil))
		(syllable-line (read-line in nil))
		(length-line (read-line in nil))
		(junk-2 (read-line in nil)))
	   (declare (ignore junk-1 junk-2))
	   (process-line (pre-process-text-line text-line)
			 (pre-process-syllable-line syllable-line)
			 (pre-process-length-line length-line))))))

(defun process-line (text syllables lengths)
;  (print syllables)
;  (print lengths)
;  (print (coerce (cdr text) 'list))
  (let ((line (line-create :text (cadr text) :numbr (car text))))
    (process-syllables (line-id line) (coerce (cadr text) 'list) syllables lengths 0 0)))

(defun process-syllables (line-id text syllables lengths pos index)
  (let ((sylb (coerce (car syllables) 'list)))
    (multiple-value-bind (start len) (get-syllable-range text sylb index)
      (syllable-create :line-id line-id
		       :position pos
		       :start start
		       :char-cnt len
		       :length (car lengths)
		       :text (car syllables))
;      (print (format nil "Pos: ~a; Range: ~a for ~A; Text: ~a (~a)"
;		     pos start len (car syllables) (car lengths)))

      (when (cdr syllables)
;	(print (format nil "Remainder: ~a; Syllables: ~a; Lengths: ~a; Pos: ~a; Index: ~a" (nthcdr (+ (- start index) len) text)
;			   (cdr syllables) 
;			   (cdr lengths)
;			   (1+ pos)
;			   (+ start len)))
	(process-syllables line-id
			   (nthcdr (+ (- start index) len) text)
			   (cdr syllables) 
			   (cdr lengths)
			   (1+ pos)
			   (+ start len))))))
    
(defun get-syllable-range (text sylb &optional (start 0))
  (multiple-value-bind (fresh-text offset) (eat-space text)
    (let ((start (+ start offset))
	  (length (determine-syllable-length fresh-text sylb)))
      (values start length))))
	 
(define-condition bad-syllable (condition) ())     
(defun bad-syllable-handler (condition)
  (declare (ignore condition))
  (format t "Bad-syllable!"))
(handler-bind ((bad-syllable #'bad-syllable-handler)))
  
(defun determine-syllable-length (text sylb &optional (len 0))
  (multiple-value-bind (match text-cnt sylb-cnt)
      (match-text-sylb text sylb)
    (if match
	(if (nthcdr sylb-cnt sylb)
	    (determine-syllable-length (nthcdr text-cnt text)
				       (nthcdr sylb-cnt sylb) (+ len text-cnt))
	    (+ len text-cnt))
	(if (equal #\- (car sylb))
	    (determine-syllable-length text (cdr sylb) len)
	    (error 'bad-syllable)))))

(defun text-sylb-char-match (text sylb)
  "Letters match if they are equal or the text is a space and the sylb is a -."
  (or (equal (char-upcase text) (char-upcase sylb))
	  (and (equal #\Space text) (equal #\- sylb))))

(defun match-text-sylb (text sylb)
  (let ((text-char  (car text))
	(sylb-char (car sylb)))
    (cond
      ((equal (char-upcase text-char) (char-upcase sylb-char))
       (values t 1 1))
      ((or (and (equal #\Space text-char) (equal #\- sylb-char))
;	   (and (equal #\, text-char) (equal #\- sylb-char)))
	   (and (or (not (text-char-p text-char))
		    (equal #\- text-char))
		(equal #\- sylb-char)))
       (values t
	       (multiple-value-bind (_ num) (eat-space text)
		 (declare (ignore _)) num)
	       1)))))
  

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
