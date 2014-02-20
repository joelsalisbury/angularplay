(in-package :scansion)

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
      (when (cdr syllables)
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


(defun match-text-sylb (text sylb)
  "Matches one or more characters from text and sylb. Return match and numbers."
  (let ((text-char (car text))
	(sylb-char (car sylb)))
    (cond
      ((equal (char-upcase text-char) (char-upcase sylb-char))
       (values t 1 1))
      ((or (and (equal #\Space text-char) (equal #\- sylb-char))
	   (and (or (not (text-char-p text-char))
		    (equal #\- text-char))
		(equal #\- sylb-char)))
       (values t
	       (multiple-value-bind (_ num) (eat-space text)
		 (declare (ignore _)) num)
	       1))
      (t (values nil 0 0)))))

(defun eat-space (text)
  "Return removing non-alpha-numeric chars at beginning and # chars removed."
  (do ((i 0 (1+ i)))
      ((text-char-p (nth i text))
       (values (nthcdr i text) i))))

(defun text-char-p (char)
  "Identifies text chars by checking for upper/lowercase or a number."
  (multiple-value-bind (match x y z) 
      (cl-ppcre:scan "[A-Za-z0-9]" (string char))
    (declare (ignore x y z)) match))

(defun pre-process-text-line (line)
  (let* ((parts (split-string line #\#))
	 (line-num (parse-integer (nth 1 parts)))
	 (text (nth 3 parts)))
    (list line-num text)))

(defun pre-process-syllable-line (line)
  (let ((syllables (cdr (split-string line #\#))))
    (loop for syllable in syllables
       while (not (equal syllable "")) collect syllable)))

(defun pre-process-length-line (line)
  (let ((lengths (cdr (split-string line #\#))))
    (loop for length in lengths
       while (not (equal length "")) collect
	 (cond 
	   ((equal length "u") 0)
	   ((equal length "-") 1)
	   ((or (equal length "x")
		(equal length "X")) 2)))))

