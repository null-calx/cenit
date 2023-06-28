(require :asdf)

(asdf:load-system :yason)

(cl:defpackage :make-json
  (:use :cl :yason))

(cl:in-package :make-json)

(defparameter *table-list* nil)

(defparameter *tables* (make-hash-table :test #'equal))

(defvar *output-pathname* (probe-file "../src/lib/server/db-structure.json"))

(defun as-keyword (symbol)
  (intern (string symbol) :keyword))

(defun normalize-field-list (fields)
  (loop for field in fields
	for (name poster) = (if (listp field) field (list field))
	collect (list name (or poster name))))

(defun field-slots (normal-fields)
  (loop for (name) in normal-fields
	collect (list name :initarg (as-keyword name))))

(defun field-slot-names (normal-fields)
  (loop for (name) in normal-fields
	collect name))

(defun stringify (symbol-or-string)
  (if (stringp symbol-or-string)
      symbol-or-string
      (string-downcase (string symbol-or-string))))

(defun field-slot-encode-logic (normal-fields)
  (loop for (name poster) in normal-fields
	collect	`(if ,name
		   (encode-object-element ,(stringify poster) ,name))))

(defmacro object-class (name (&rest fields))
  (let ((obj-var (gensym "OBJ-"))
	(stream-var (gensym "STREAM-"))
	(normal-fields (normalize-field-list fields)))
    `(progn
       (defclass ,name ()
	 ,(field-slots normal-fields))
       (defmethod encode ((,obj-var ,name)
			  &optional (,stream-var *standard-output*))
	 (with-output (,stream-var)
	   (with-object ()
	     (with-slots ,(field-slot-names normal-fields) ,obj-var
	       ,@(field-slot-encode-logic normal-fields)
	       ,obj-var))))
       (defmethod slot-unbound (class (instance ,name) slot-name)
	 (declare (ignorable class))
	 (setf (slot-value instance slot-name) nil)))))

(object-class fkey (table column))
(object-class column (name text type required
		      (internal "isInternal")
		      (poster "isPoster")
		      (pkey "primaryKey")
		      (fkey "foreignKey")
		      (read-perm "readPermission")))
(object-class table (name text url prev next columns hidden
		     (write-perm "writePermission")))

(defmacro make-column (name
		       &key (text name) (type :integer)
			 pkey fkey read-perm poster required internal)
  (when fkey
    (assert (= (length fkey) 2)))
  (let ((ins-var (gensym "COLUMN-")))
    `(let ((,ins-var (make-instance 'column
				    :name ,name
				    :text ,text
				    :type ,type)))
       (with-slots (pkey fkey read-perm poster required internal) ,ins-var
	 (declare (ignorable pkey fkey read-perm required internal))
	 ,(if pkey `(setf pkey t))
	 ,(if required `(setf required t))
	 ,(if internal `(setf internal t))
	 ,(if fkey `(setf fkey (make-instance 'fkey
					      :table ,(first fkey)
					      :column ,(second fkey))))
	 ,(if read-perm `(setf read-perm ,read-perm))
	 ,(if poster `(setf poster ,poster)))
       ,ins-var)))

(defun column-list-from-table-body (param-tuple-list)
  `(list ,@(loop for param-tuple in param-tuple-list
		 collect `(make-column ,@param-tuple))))

(defun update-fkey-list (cur-table prev-table)
  (with-slots (prev (cur-name name)) cur-table
    (with-slots (next (prev-name name)) prev-table
      ; (unless prev (setf prev nil))
      ; (unless next (setf next nil))
      (push prev-name prev)
      (push cur-name next))))

(defmacro make-table (name (&key (text name) (url name) write-perm hidden)
		      &body table-body)
  (let ((ins-var (gensym "TABLE-")))
    `(let ((,ins-var (make-instance 'table
				    :name ,name
				    :text ,text
				    :url ,url)))
       (with-slots (prev columns write-perm hidden) ,ins-var
	 (setf columns ,(column-list-from-table-body table-body))
	 (loop for column in columns
	       for fkey = (slot-value column 'fkey)
	       for prev-name = (if fkey (slot-value fkey 'table))
	       when fkey
		 do (let ((prev-table (gethash prev-name *tables*)))
		      (unless prev-table
			(error "ERROR: table '~a' not found." prev-name))
		      (update-fkey-list ,ins-var prev-table)))
	 (if ,hidden (setf hidden ,hidden))
	 (if ,write-perm (setf write-perm ,write-perm)))
       (push ,name *table-list*)
       (setf (gethash ,name *tables*) ,ins-var)
       ,ins-var)))

(defun print-json (&optional (stream *standard-output*))
  (let ((*symbol-encoder* #'string)
	(hashmap (make-hash-table)))
    (setf (gethash "tables" hashmap) *tables*)
    (setf (gethash "tableNameList" hashmap) *table-list*)
    (encode hashmap stream)
    (format stream "~%")
    (force-output stream)))

(defun main ()
  (with-open-file (output *output-pathname*
			  :direction :output
			  :if-exists :supersede
			  :if-does-not-exist :create)
    (let ((json (with-output-to-string (stream)
		  (print-json stream))))
      (format output "~a" json)
      (format t "// wrote file '~a'~%~%~a" *output-pathname* json))))

(make-table "rolepermissions" (:text "Roles" :url "roles")
  ("id" :pkey t)
  ("role" :type :text :poster t)
  ("permissions" :type :text-array))

(make-table "users" (:text "Users" :write-perm "admin")
  ("userid" :pkey t)
  ("username" :type :text :poster t :required t)
  ("password" :type :text :read-perm "admin")
  ("emailid" :type :text :read-perm "admin")
  ("roles" :type :text-array :internal t))

(main)
