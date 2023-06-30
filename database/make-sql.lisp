(require :asdf)

(asdf:load-system :yason)

(cl:defpackage :make-sql
  (:use :cl))

(cl:in-package :make-sql)

(defparameter *input-pathname* "base.sexp")

(defparameter *output-pathname* "db-structure.sql")

(defun parse-type (type pkey)
  (if pkey "uuid default uuid_generate_v4 () primary key"
      (cond ((eq type :integer) "integer")
	    ((eq type :text) "text")
	    ((eq type nil) "integer")
	    ((listp type)
	     (cond ((eq (first type) :array)
		    (cond ((eq (second type) :text) "text[]")
			  (t (error "Unknown array of '~a'." (second type)))))
		   (t (error "Unknown composite '~a'." type))))
	    (t (error "Unknown type '~a'." type)))))

(defun parse-column (column)
  (destructuring-bind (column-name &key unique required type pkey &allow-other-keys)
      column
    (with-output-to-string (string)
      (format string "~a ~a" column-name (parse-type type pkey))
      (if unique (format string " unique"))
      (if required (format string " not null")))))

(defun parse-column-list (column-list)
  (loop for column in column-list
	collect (parse-column column)))

(defun parse-fkey (fkey column-name table-name)
  (destructuring-bind (table column &rest imports)
      fkey
    (declare (ignore imports))
    (format nil "constraint ~a foreign key (~a) references ~a (~a)"
	    (format nil "fk_~a_~a" table-name table)
	    column-name
	    table
	    column)))

(defun parse-constraint (column-list table-name)
  (loop for (column-name . keys) in column-list
	for fkey = (getf keys :fkey)
	when fkey
	  collect (parse-fkey fkey column-name table-name)))

(defun parse-table (table)
  (destructuring-bind (def-symbol table-name (&rest params) &rest column-list)
      table
    (declare (ignore def-symbol params))
    (format nil "create table ~a (~%~{  ~a~^,~%~}~{,~%  ~a~}~%);"
	    table-name
	    (parse-column-list column-list)
	    (parse-constraint column-list table-name))))

(defun parser (stream-in)
  (cons "create extension if not exists \"uuid-ossp\";"
	(loop for table = (read stream-in nil)
	      while table
	      collect (parse-table table))))

(defun print-sql (out in)
  (format out "~{~a~%~^~%~}" (parser in)))

(defun main ()
  (with-open-file (out *output-pathname*
		       :direction :output
		       :if-exists :supersede
		       :if-does-not-exist :create)
    (with-open-file (in *input-pathname*
			:direction :input)
      (print-sql out in))))

(main)
