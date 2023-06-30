SYMLINK='../src/lib/server/db-structure.json'

all: json sql

json: db-structure.json
	jq . $<

sql: db-structure.sql
	highlight $<

db-structure.json: make-json.lisp base.sexp
	sbcl --noinform --disable-debugger --quit --load make-json.lisp

db-structure.sql: make-sql.lisp base.sexp
	sbcl --noinform --disable-debugger --quit --load make-sql.lisp
