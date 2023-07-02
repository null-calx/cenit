(require :asdf)

(asdf:load-system :yason)

(cl:defpackage :make-json
  (:use :cl :yason))

(cl:in-package :make-json)

(defparameter *table-list* nil)

(defparameter *tables* (make-hash-table :test #'equal))

(defparameter *input-pathname* "base.sexp")

(defparameter *output-pathname* "db-structure.json")

(defun as-keyword (symbol)
  (intern (string symbol) :keyword))

(defun normalize (fields)
  (loop for field in fields
	for (name poster) = (if (listp field) field (list field))
	collect (list name (or poster name))))

(defun field->slots (fields)
  (loop for (name) in fields
	collect (list name :initarg (as-keyword name))))

(defun field->names (fields)
  (loop for (name) in fields
	collect name))

(defun stringify (symbol-or-string)
  (if (stringp symbol-or-string)
      symbol-or-string
      (string-downcase (string symbol-or-string))))

(defmacro def-object-class (name &body fields)
  (let ((obj-var (gensym "OBJ-"))
	(stream-var (gensym "STREAM-"))
	(fields (normalize fields)))
    `(progn
       (defclass ,name ()
	 ,(field->slots fields))
       (defmethod encode ((,obj-var ,name) &optional (,stream-var *standard-output*))
	 (with-output (,stream-var)
	   (with-object ()
	     (with-slots ,(field->names fields) ,obj-var
	       ,@(loop for (name poster) in fields
		       collect
		       `(if ,name
			    (encode-object-element ,(stringify poster) ,name)))))))
       (defmethod slot-unbound (class (instance ,name) slot-name)
	 (declare (ignore class))
	 (setf (slot-value instance slot-name) nil)))))

(def-object-class fkey
  table
  column
  imports)

(def-object-class column
  name
  text
  type
  (unique "isUnique")
  (required "isRequired")
  (internal "isInternal")
  (import "isImported")
  (poster "isPoster")
  (pkey "primaryKey")
  (fkey "foreignKey")
  (read-perm "readPermission"))

(def-object-class table
  name
  text
  url
  prev
  next
  columns
  (hidden "isHidden")
  (write-perm "writePermission"))

(defun imports->columns (table-name imports)
  (loop with table = (or (gethash table-name *tables*)
			 (error "ERROR: table '~a' not found." table-name))
	for column in (slot-value table 'columns)
	when (member (slot-value column 'name) imports :test #'equal)
	  collect column))

(defun def-fkey (table column &rest imports)
  (make-instance 'fkey
		 :table table
		 :column column
		 :imports (imports->columns table imports)))

(defmacro def-column (name &key
			     (text name) (type :integer)
			     unique required internal import poster
			     pkey fkey read-perm)
  (let ((ins-var (gensym "COLUMN-")))
    `(let ((,ins-var (make-instance 'column
				    :name ,name
				    :text ,text
				    :type ',type
				    :unique ,unique
				    :required ,required
				    :internal ,internal
				    :import ,import
				    :poster ,poster
				    :pkey ,pkey
				    :read-perm ,read-perm)))
       (with-slots (fkey pkey internal) ,ins-var
	 (declare (ignorable fkey pkey internal))
	 ,(if fkey `(setf fkey (def-fkey ,@fkey)))
	 ,(if pkey `(setf internal t)))
       ,ins-var)))

(defmacro def-table (name (&key
			   (text name) (url name)
			   hidden write-perm)
			  &body column-list)
  (let ((ins-var (gensym "TABLE-")))
    `(let ((,ins-var (make-instance 'table
				    :name ,name
				    :text ,text
				    :url ,url
				    :hidden ,hidden
				    :write-perm ,write-perm)))
       (with-slots (columns) ,ins-var
	 (setf columns (list ,@(loop for column in column-list
				     collect `(def-column ,@column))))
	 (loop for column in columns
	       for fkey = (slot-value column 'fkey)
	       for prev-name = (if fkey (slot-value fkey 'table))
	       when prev-name
		 do (let ((prev-table (or (gethash prev-name *tables*)
					  (error "ERROR: table '~a' not found." prev-name))))
		      (with-slots (prev (cur-name name)) ,ins-var
			(with-slots (next (prev-name name)) prev-table
			  (push prev-name prev)
			  (push cur-name next))))))
       (push ,name *table-list*)
       (setf (gethash ,name *tables*) ,ins-var)
       ,ins-var)))

(defun print-json (&optional (stream *standard-output*))
  (let ((*symbol-encoder* #'string)
	(hashmap (make-hash-table)))
    (setf (gethash "tables" hashmap) *tables*)
    (setf (gethash "tableNameList" hashmap) (reverse *table-list*))
    (encode hashmap stream)
    (format stream "~%")
    (force-output stream)))

(defun print-json-to-file (&optional (pathname *output-pathname*))
  (with-open-file (output pathname
			  :direction :output
			  :if-exists :supersede
			  :if-does-not-exist :create)
    (print-json output)))

(defun main ()
  (load *input-pathname*)
  (print-json-to-file))

(main)
