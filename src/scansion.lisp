(in-package :scansion)

(defun get-nth-integer-from-uri (n)
  (nth n (cl-ppcre:all-matches-as-strings "[0-9]+" (hunchentoot:request-uri hunchentoot::*request*))))

(setf hunchentoot:*dispatch-table*
      (list
       (hunchentoot:create-regex-dispatcher "^/line/([0-9]*)/([0-9]*)?" 'line-controller)))

(defun line-controller ()
  (let ((line-id (get-nth-integer-from-uri 0))
	(count (get-nth-integer-from-uri 1)))
    (cl-who:with-html-output-to-string (s)
      (:html
       (:head
	(:title "Scansion Data"))
       (:body
	(:h1 (format s "You asked for ~a lines starting at line ~a"
		     count line-id)))))))


(hunchentoot:define-easy-handler (hello-sbcl :uri "/") ()
  (cl-who:with-html-output-to-string (s)
    (:html
     (:head
      (:title "Heroku CL Example App"))
     (:body
      (:h1 "Heroku CL Example App")
      (:h3 "Using")
      (:ul
       (:li (format s "~A ~A" (lisp-implementation-type) (lisp-implementation-version)))
       (:li (format s "Hunchentoot ~A" hunchentoot::*hunchentoot-version*))
       (:li (format s "CL-WHO")))
      (:h3 "App Database")
      (:div
       (:pre "SELECT version();"))
      (:div (format s "~A" (postmodern:with-connection (db-params)
			     (postmodern:query "select version()"))))))))
