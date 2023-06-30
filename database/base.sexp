(def-table "users" (:text "Users" :write-perm "admin")
  ("userid"
   :pkey t)
  ("username"
   :type :text
   :poster t
   :unique t
   :required t)
  ("password"
   :type :text
   :required t
   :read-perm "admin")
  ("emailid"
   :type :text
   :unique t
   :required t
   :read-perm "admin")
  ("roles"
   :type (:array :text)
   :internal t))

(def-table "rolepermissions" (:text "Roles" :url "roles")
  ("id"
   :pkey t)
  ("role"
   :type :text
   :poster t)
  ("permissions"
   :type (:array :text)))

(def-table "test1" (:text "Test1" :url "1")
  ("id"
   :pkey t)
  ("name"
   :type :text
   :poster t)
  ("rest"
   :type :text))

(def-table "test2" (:text "Test2" :url "2")
  ("id"
   :pkey t)
  ("name"
   :type :text
   :poster t)
  ("forid"
   :fkey ("test1" "id")))
