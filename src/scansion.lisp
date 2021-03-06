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
		:line-syllables
		:line-index
		:line-id
		:book
		:book-id
		:book-lines)
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
  (let ((books (loop for file in files
		  collect (get-lines (cadr file) (car file)))))
    (with-open-file (out outfile
			 :direction :output
			 :if-exists :supersede
			 :if-does-not-exist :create)
      (format out (json:with-explicit-encoder
		    (json:encode-json-to-string
		     `(:object
		       "lines" (:object
				,@(loop for book in books append
				       `(,(book-id book)
					  (:object
					   "name" ,(book-id book)
					   "firstLine" ,(line-numbr (car (book-lines book)))
					   "rangeDisplay" ,(build-range-display (book-lines book))
					   "lines" (:array
						    ,@(loop for line in (book-lines book) append
							   `((:object
							      "id" ,(line-numbr line)
							      "index" ,(line-index line)
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
										    "charCnt" ,(syllable-char-cnt sylb)))))))))))))))))))

;; 1-200, 345-623, ...
(defun build-range-display (lines)
  (let ((range (format nil "~a" (line-numbr (car lines))))
	(lastLineNum (- (line-numbr (car lines)) 1))
	(currentLineNum))
    (loop for line in lines
	 do (progn
	      (setf currentLineNum (line-numbr line))
	      (unless (eq currentLineNum (+ 1 lastLineNum))
		(setf range (format nil "~a-~a, ~a" range lastLineNum currentLineNum)))
	      (setf lastLineNum currentLineNum)))
    (format nil "~a-~a" range lastLineNum)))
    
		    
    
