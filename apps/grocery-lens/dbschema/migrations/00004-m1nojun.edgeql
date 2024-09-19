CREATE MIGRATION m1nojun6uy3qeczc2ae66lcvnkdkboxn6b2apwf4u5v6vxztcppaya
    ONTO m15xodlfjx5qoxgvqjv22sfwuzhyloh3jvg2usgdeggsk2yjts54dq
{
  ALTER TYPE default::GroceryItem {
      DROP PROPERTY store;
  };
  CREATE TYPE default::Store EXTENDING default::Timestamp {
      CREATE REQUIRED LINK owner: default::User;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::GroceryItem {
      CREATE REQUIRED LINK store: default::Store {
          SET REQUIRED USING (std::assert_exists(.store));
      };
  };
  ALTER TYPE default::Store {
      CREATE MULTI LINK groceryItems := (.<store[IS default::GroceryItem]);
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK stores := (.<owner[IS default::Store]);
  };
};
