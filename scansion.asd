(push #p"./dep/dpc-cl/" asdf:*central-registry*)
(push #p"./dep/web/" asdf:*central-registry*)
(push #p"./dep/testing/" asdf:*central-registry*)

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

