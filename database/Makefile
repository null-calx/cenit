all: echo

echo: db-structure.json
	jq . db-structure.json

db-structure.json: make-json.lisp db-structure.sexp
	sbcl --noinform --disable-debugger --quit --load make-json.lisp
