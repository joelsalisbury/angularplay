(in-package :cl-user)

(print ">>> Building system....")

(load (merge-pathnames "scansion.asd" *build-dir*))

(push (merge-pathnames "dep/dpc-cl/" *build-dir*) asdf:*central-registry*)
(ql:quickload :dpc-cl)
(push (merge-pathnames "dep/web/" *build-dir*) asdf:*central-registry*)
(ql:quickload :web)
(push (merge-pathnames "dep/testing/" *build-dir*) asdf:*central-registry*)
(ql:quickload :testing)

(ql:quickload :scansion)

;;; Redefine / extend heroku-toplevel here if necessary.

(print ">>> Done building system")
