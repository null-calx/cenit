(require :asdf)

(asdf:load-system :yason)

(cl:defpackage :make-query
  (:use :cl :yason))

(cl:in-package :make-query)

(defparameter *input-pathname* "base.sexp")

(defparameter *output-pathname* "db-query.json")

(defun pkey (c)
  (getf (cdr c) :pkey))

(defun find-pkey (cl)
  (loop for c in cl
	if (pkey c)
	  do (return c)
	finally (error "No pkey")))

(defun poster (c)
  (getf (cdr c) :poster))

(defun find-poster (cl)
  (loop for c in cl
	if (poster c)
	  do (return c)
	finally (error "No poster")))

(defun internal (c)
  (getf (cdr c) :internal))

(defun fkey (c)
  (getf (cdr c) :fkey))

(defun non-internal (cl)
  (format nil "~{~a~^, ~}"
	  (loop for c in cl
		for pkey = (pkey c)
		for internal = (internal c)
		unless (or pkey internal)
		  collect (car c))))

(defun select-generic-key (cl)
  (format nil "~a as poster, ~a as href"
	  (car (find-poster cl))
	  (car (find-pkey cl))))

(defun select-specific-key (cl)
  (non-internal cl))

(defun select-joins (tn cl) "!!!")

(defun select-specific-where (cl)
  (format nil "~a = ~a"
	  (car (find-pkey cl))
	  "$1"))

(defun insert-keys (cl)
  (non-internal cl))

(defun insert-values (cl) "!!!")

(defun update-params (cl) "!!!")

(defun update-values (cl) "!!!")

(defun delete-where (cl) "!!!")

(defun parse-table (table)
  (destructuring-bind (def-symbol table-name (&rest params) &rest column-list)
      table
    (declare (ignore def-symbol params))
    (let ((hash (make-hash-table)))
      (setf (gethash "select-generic" hash)
	    (format nil "select ~a from ~a;"
		    (select-generic-key column-list)
		    table-name))
      (setf (gethash "select-specific" hash)
	    (format nil "select ~a from ~a ~a where ~a;"
		    (select-specific-key column-list)
		    table-name
		    (select-joins table-name column-list)
		    (select-specific-where column-list)))
      (setf (gethash "insert" hash)
	    (format nil "insert into ~a (~a) values (~a);"
		    table-name
		    (insert-keys column-list)
		    (insert-values column-list)))
      (setf (gethash "update" hash)
	    (format nil "update ~a where ~a set ~a;"
		    table-name
		    (update-params column-list)
		    (update-values column-list)))
      (setf (gethash "delete" hash)
	    (format nil "delete from ~a where ~a;"
		    table-name
		    (delete-where column-list)))
      hash)))

(defun parser (out in)
  (encode
   (loop for line = (read in nil)
	 while line
	 collect (parse-table line)) out))

(defun print-out ()
  (with-open-file (in *input-pathname*
		      :direction :input)
    (parser t in)))
