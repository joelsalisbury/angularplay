(in-package :scansion)

(setf web:*app-name* "SCANSION")
(setf *local-database-url* "SCANSION_DB")

(defun get-nth-integer-from-uri (n)
  (nth n (cl-ppcre:all-matches-as-strings "[0-9]+" (hunchentoot:request-uri hunchentoot::*request*))))

(setf hunchentoot:*dispatch-table*
      (list
       (hunchentoot:create-regex-dispatcher "^/lines/([0-9]*)/([0-9]*)$" 'line-controller)))

(defun line-controller ()
  (let ((line-id (get-nth-integer-from-uri 0))
	(count (get-nth-integer-from-uri 1)))
    (cl-who:with-html-output-to-string (s)
      (:html
       (:head
	(:title "Scansion Data"))
       (:body
	(:h1 (format s "You asked for ~a lines starting at line ~a"
		     count line-id)))))))

(defmodel line
    ((text :col-type (varchar 255) :initarg :text :accessor line-text)))

(defmodel syllable
    ((line :col-type int :initarg :line :accessor syllable-line)
     (position :col-type int :initarg :position :accessor syllable-position)
     (start :col-type int :initarg :start :accessor syllable-start)
     (char-cnt :col-type int :initarg :char-cnt :accessor syllable-char-cnt)
     (length :col-type int :initarg :length :accessor syllable-length)
     (text :col-type (varchar 10) :initarg :text :accessor syllable-text)))
     
  