CREATE MIGRATION m1lnsh4gzstucqva5hrrpyxhbhapo3rqzdfr6y6wimd3lo2c2r5kpq
    ONTO m1nojun6uy3qeczc2ae66lcvnkdkboxn6b2apwf4u5v6vxztcppaya
{
  ALTER TYPE default::Store {
      CREATE CONSTRAINT std::exclusive ON ((.name, .owner));
  };
};
