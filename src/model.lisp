(in-package :scansion)

;;; Some configuration
(setf web:*app-name* "SCANSION")
(setf web:*local-database-url* "SCANSION_DB")

(defmodel line
    ((text :col-type (varchar 255) :initarg :text :accessor line-text)
     (numbr :col-type int :initarg :numbr :accessor line-numbr)))

(defmodel syllable
    ((line-id :col-type int :initarg :line-id :accessor syllable-line-id)
     (position :col-type int :initarg :position :accessor syllable-position)
     (start :col-type int :initarg :start :accessor syllable-start)
     (char-cnt :col-type int :initarg :char-cnt :accessor syllable-char-cnt)
     (length :col-type int :initarg :length :accessor syllable-length)
     (text :col-type (varchar 10) :initarg :text :accessor syllable-text)))
