(in-package :cl-user)
(defpackage :scansion.scansion
  (:use :cl)
  (:import-from :scansion.parsing
		:get-lines)
  (:import-from :scansion.model
		:syllable-position
		:syllable-start
		:syllable-char-cnt
		:syllable-length
		:syllable-text
		:line-numbr
		:line-text
		:line-book
		:line-syllables)
  (:import-from :scansion.utils
		:group)
  (:export :main
	   :process-files))
(in-package :scansion.scansion)

(defun main (args)
  "Provide: outfile <book 1> <book 1 file> ..."
  (let ((outfile (cadr args))
	(files (group (cddr args) 2)))
    (process-files files outfile)))

(defun process-files (files outfile)
  (let ((lines (loop for file in files
		  append (get-lines (cadr file) (car file)))))
    (with-open-file (out outfile
			 :direction :output
			 :if-exists :supersede
			 :if-does-not-exist :create)
      (format out (json:with-explicit-encoder
		    (json:encode-json-to-string
		     `(:object
		       "lines" (:array
				,@(loop for line in lines collect
				       `(:object
					 "id" ,(line-numbr line)
					 "book" ,(line-book line)
					 "string" ,(line-text line)
					 "syllables" (:array
						      ,@(loop for sylb in (line-syllables line) collect
							     `(:object
							       "id" ,(syllable-position sylb)
							       "text" ,(syllable-text sylb)
							       "quantity" ,(case (syllable-length sylb)
										 (0 "u")
										 (1 "-")
										 (2 "x"))
							       "start" ,(syllable-start sylb)
							       "charCnt" ,(syllable-char-cnt sylb))))))))))))))
