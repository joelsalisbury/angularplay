(asdf:defsystem #:scansion
  :serial t
  :description "Serves up scansion data for latin texts."
  :depends-on (#:cl-ppcre #:nst #:cl-json)
  :components ((:file "package")
	       (:module :src
			:serial t      
			:components ((:file "utils")
				     (:file "model")
				     (:file "parsing")
				     (:file "scansion")))
	       (:module :test
			:serial t      
			:components ((:file "scansion-tests")))))



