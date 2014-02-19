(in-package :scansion)

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

