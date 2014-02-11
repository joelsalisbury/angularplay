(in-package :scansion)

(defun get-nth-integer-from-uri (n)
  (nth n (cl-ppcre:all-matches-as-strings "[0-9]+" (hunchentoot:request-uri hunchentoot::*request*))))

(setf hunchentoot:*dispatch-table*
      (list
       (hunchentoot:create-regex-dispatcher "^/lines/([0-9]*)/([0-9]*)$" 'line-controller)))

(defvar line-one)
(defvar line-one-id)

(defun refresh-db ()
  ;; Get rid of the old data
  (with-connection (db-params)
    (execute (:delete-from 'syllable))
    (execute (:delete-from 'line)))
  
  (with-open-file (in #p"./data/aeneid.csv" :direction :input)
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
  (print text)
  (print syllables)
  (print lengths))

(defun pre-process-text-line (line)
  (let* ((parts (split-string line #\;))
	 (line-num (parse-integer (nth 1 parts)))
	 (text (nth 3 parts)))
    (list line-num text)))

(defun pre-process-syllable-line (line)
  (let ((syllables (cdr (split-string line #\;))))
    (loop for syllable in syllables
       while (not (equal syllable "")) collect syllable)))

(defun pre-process-length-line (line)
  (let ((lengths (cdr (split-string line #\;))))
    (loop for length in lengths
       while (not (equal length "")) collect
	 (cond 
	   ((equal length "u") 0)
	   ((equal length "-") 1)
	   ((or (equal length "x")
		(equal length "X")) 2)))))
	

#|
    (let* ((text-line (read-line stream)
  (setf line-one (line-create :text "arma virum que cano, Troiae qui primus ab oris" :numbr 1))
  (setf line-one-id (line-id line-one))

  (syllable-create :line-id line-one-id :position 1 :start 0 :char-cnt 2 :length 1 :text "ar")
  (syllable-create :line-id line-one-id :position 2 :start 2 :char-cnt 2 :length 0 :text "ma")
  (syllable-create :line-id line-one-id :position 3 :start 5 :char-cnt 2 :length 0 :text "vi")
  (syllable-create :line-id line-one-id :position 4 :start 7 :char-cnt 3 :length 1 :text "rum")
  (syllable-create :line-id line-one-id :position 5 :start 11 :char-cnt 3 :length 0 :text "que")
  (syllable-create :line-id line-one-id :position 6 :start 15 :char-cnt 2 :length 0 :text "ca")
  (syllable-create :line-id line-one-id :position 7 :start 17 :char-cnt 2 :length 1 :text "no")
  (syllable-create :line-id line-one-id :position 8 :start 21 :char-cnt 3 :length 1 :text "Tro")
  (syllable-create :line-id line-one-id :position 9 :start 24 :char-cnt 3 :length 1 :text "iae")
  (syllable-create :line-id line-one-id :position 10 :start 28 :char-cnt 3 :length 1 :text "qui")
  (syllable-create :line-id line-one-id :position 11 :start 32 :char-cnt 3 :length 1 :text "pri")
  (syllable-create :line-id line-one-id :position 12 :start 35 :char-cnt 3 :length 0 :text "mus")
  (syllable-create :line-id line-one-id :position 13 :start 39 :char-cnt 2 :length 0 :text "ab")
  (syllable-create :line-id line-one-id :position 14 :start 42 :char-cnt 1 :length 1 :text "o")
  (syllable-create :line-id line-one-id :position 15 :start 43 :char-cnt 3 :length 2 :text "ris"))
|#

(defun line-controller ()
  (let* ((line-id (parse-integer (get-nth-integer-from-uri 0)))
	 (count (parse-integer (get-nth-integer-from-uri 1)))
	 (lines (line-select (:and (:>= 'numbr line-id) (:< 'numbr (+ line-id count)))))
	 (line-ids (loop for line in lines collect (line-id line)))
	 (syllables (syllable-select (:in 'line-id (:set line-ids)))))
    (json:with-explicit-encoder
      (json:encode-json-to-string
       `(:object
	 "lines" (:array
		  ,@(loop for line in lines collect
		       `(:object
			"id" ,(line-numbr line)
			"string" ,(line-text line)
			"syllables" (:array
				     ,@(loop for sylb in syllables collect
					   `(:object
					     "id" ,(syllable-position sylb)
					     "text" ,(syllable-text sylb)
					     "quantity" ,(case (syllable-length sylb)
							       (0 "u")
							       (1 "-")
							       (2 "x"))
					     "start" ,(syllable-start sylb)
					     "charCnt" ,(syllable-char-cnt sylb))))))))))))
