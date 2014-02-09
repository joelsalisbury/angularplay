(asdf:defsystem #:scansion
  :serial t
  :description "Serves up scansion data for latin texts."
  :depends-on (#:hunchentoot
	       #:cl-who
	       #:postmodern)
  :components ((:file "package")
	       (:module :src
			:serial t      
			:components ((:file "scansion")))))

