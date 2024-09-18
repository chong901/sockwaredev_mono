CREATE MIGRATION m1crlufo4xu2mz3nsrsmse7iheviq7j5eddxfowkejjl3hothup3qq
    ONTO initial
{
  CREATE ABSTRACT TYPE default::Timestamp {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY updated_at: std::datetime {
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::User EXTENDING default::Timestamp {
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY image: std::str;
      CREATE PROPERTY name: std::str;
  };
};
