(push (merge-pathnames "dep/dpc-cl/" *build-dir*) asdf:*central-registry*)
(push (merge-pathnames "dep/web/" *build-dir*) asdf:*central-registry*)
(push (merge-pathnames "dep/testing/" *build-dir*) asdf:*central-registry*)

(asdf:defsystem #:scansion
  :serial t
  :description "Serves up scansion data for latin texts."
  :depends-on (#:hunchentoot
	       #:cl-who
	       #:postmodern
	       #:dpc-cl
	       #:web
	       #:testing)
  :components ((:file "package")
	       (:module :src
			:serial t      
			:components ((:file "scansion")))))

