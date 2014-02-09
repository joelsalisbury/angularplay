(in-package :cl-user)

(print ">>> Building system....")

(load (merge-pathnames "scansion.asd" *build-dir*))

(ql:quickload :scansion)

;;; Redefine / extend heroku-toplevel here if necessary.

(print ">>> Done building system")
