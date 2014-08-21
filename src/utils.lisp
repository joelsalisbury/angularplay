(in-package :cl-user)
(defpackage :scansion.utils
  (:use :cl)
  (:export :split-string
	   :group
	   :equal-report
	   :test
	   :test-package))
(in-package :scansion.utils)

(defun split-string (string char)
  "Returns a list of substrings of string divided by char."
  (loop for i = 0 then (1+ j)
     as j = (position char string :start i)
     collect (subseq string i j)
     while j))

(defun group (source n)
  (if (zerop n) (error "zero length"))
  (labels ((rec (source acc)
             (let ((rest (nthcdr n source)))
               (if (consp rest)
                   (rec rest (cons
                               (subseq source 0 n)
                               acc))
                   (nreverse
                     (cons source acc))))))
    (if source (rec source nil) nil)))

(defun equal-report (a b)
  "NST report for determining if a and b are equal."
  (if (equal a b)
      (nst:make-success-report)
      (nst:make-failure-report :format "expected ~A but got ~A"
			       :args (list a b))))

(defmacro test (group)
  "NST shortcut for running all tests in a given group."
  `(nst:nst-cmd :run-group ,group))

(defun test-package ()
  "NST shortcut for running all tests in a package."
  (nst:nst-cmd :run-package))
