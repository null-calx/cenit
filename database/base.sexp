(def-table "users" (:text "Users" :hidden t :write-perm "admin")
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

(def-table "rolepermissions" (:text "Roles" :hidden t :url "roles")
  ("id"
   :pkey t)
  ("role"
   :type :text
   :poster t)
  ("permissions"
   :type (:array :text)))

(def-table "crops" (:text "Crops" :url "crops" :write-perm "crop-manager")
  ("cropid"
   :pkey t)
  ("cropname"
   :type :text
   :poster t))

(def-table "dailyharvest" (:text "Daily Harvest" :url "daily-harvest" :write-perm "harvest-manager")
  ("harvestid"
   :pkey t)
  ("harvestname"
   :type :text
   :poster t)
  ("cropid"
   :type :uuid
   :fkey ("crops" "cropid" "cropname")))

(def-table "sorting" (:text "Sorting" :url "sorting" :write-perm "sort-manager")
  ("sortingid"
   :pkey t)
  ("sortname"
   :type :text
   :poster t)
  ("harvestid"
   :type :uuid
   :fkey ("dailyharvest" "harvestid" "harvestname")))
