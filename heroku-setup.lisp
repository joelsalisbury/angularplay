(in-package :cl-user)

(print ">>> Building system....")

(load (merge-pathnames "scansion.asd" *build-dir*))

(push #p"./dep/dpc-cl/" asdf:*central-registry*)
(push #p"./dep/web/" asdf:*central-registry*)
(push #p"./dep/testing/" asdf:*central-registry*)

(ql:quickload :scansion)

;;; Redefine / extend heroku-toplevel here if necessary.

(print ">>> Done building system")
