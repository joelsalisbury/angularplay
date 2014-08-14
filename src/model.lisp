(in-package :cl-user)
(defpackage :scansion.model
  (:use :cl)
  (:export :line :line-text :line-numbr
	   :syllable :syllable-line-id :syllable-position :syllable-start
	   :syllable-char-cnt :syllable-length :syllable-text))
(in-package :scansion.model)

(defclass line ()
    ((book :initarg :book :accessor line-book)
     (text :initarg :text :accessor line-text)
     (numbr :initarg :numbr :accessor line-numbr)
     (syllables :initarg :syllables :accessor line-syllables)))

(defclass syllable ()
    ((line-id :initarg :line-id :accessor syllable-line-id)
     (position :initarg :position :accessor syllable-position)
     (start :initarg :start :accessor syllable-start)
     (char-cnt :initarg :char-cnt :accessor syllable-char-cnt)
     (length :initarg :length :accessor syllable-length)
     (text :initarg :text :accessor syllable-text)))
