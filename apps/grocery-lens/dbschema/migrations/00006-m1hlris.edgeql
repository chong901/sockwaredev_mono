CREATE MIGRATION m1hlrisne77jactmdnlsxr7helhjffxdvnrajby5w4uyfk2z46uvoa
    ONTO m1lnsh4gzstucqva5hrrpyxhbhapo3rqzdfr6y6wimd3lo2c2r5kpq
{
  ALTER TYPE default::GroceryItem {
      CREATE PROPERTY pricePerUnit := ((.price / .amount));
  };
};
