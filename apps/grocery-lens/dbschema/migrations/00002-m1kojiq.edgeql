CREATE MIGRATION m1kojiqxv4v75ecd3sp3gcrczhau7wmdbag5oxv3nohef4mzxx7cda
    ONTO m1crlufo4xu2mz3nsrsmse7iheviq7j5eddxfowkejjl3hothup3qq
{
  CREATE TYPE default::Label EXTENDING default::Timestamp {
      CREATE REQUIRED LINK owner: default::User;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE SCALAR TYPE default::Unit EXTENDING enum<gram, kilogram, liter, milliliter, piece, bag, box>;
  CREATE TYPE default::GroceryItem EXTENDING default::Timestamp {
      CREATE MULTI LINK labels: default::Label;
      CREATE REQUIRED LINK owner: default::User;
      CREATE REQUIRED PROPERTY amount: std::float32;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE OPTIONAL PROPERTY notes: std::str;
      CREATE REQUIRED PROPERTY price: std::float32;
      CREATE OPTIONAL PROPERTY store: std::str;
      CREATE REQUIRED PROPERTY unit: default::Unit;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK groceryItems := (.<owner[IS default::GroceryItem]);
      CREATE MULTI LINK labels := (.<owner[IS default::Label]);
  };
};
