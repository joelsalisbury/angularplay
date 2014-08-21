(in-package :cl-user)
(defpackage :scansion.model
  (:use :cl)
  (:export :book :book-id :book-lines
	   :line :line-id :line-index :line-text :line-numbr :line-syllables
	   :syllable :syllable-position :syllable-start
	   :syllable-char-cnt :syllable-length :syllable-text))
(in-package :scansion.model)

(defclass book ()
  ((id :initarg :id :accessor book-id)
   (lines :initarg :lines :accessor book-lines)))

(defclass line ()
  ((id :initarg :id :accessor line-id)
   (index :initarg :index :accessor line-index)
   (text :initarg :text :accessor line-text)
   (numbr :initarg :numbr :accessor line-numbr)
   (syllables :initarg :syllables :accessor line-syllables)))

(defclass syllable ()
  ((position :initarg :position :accessor syllable-position)
   (start :initarg :start :accessor syllable-start)
   (char-cnt :initarg :char-cnt :accessor syllable-char-cnt)
   (length :initarg :length :accessor syllable-length)
   (text :initarg :text :accessor syllable-text)))
