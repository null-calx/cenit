SYMLINK='../src/lib/server/db-structure.json'
FILE='db-structure.json'

all: echo

echo: $(FILE)
	jq . $(FILE)

$(FILE): make-json.lisp db-structure.sexp
	sbcl --noinform --disable-debugger --quit --load make-json.lisp
