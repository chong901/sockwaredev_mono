CREATE MIGRATION m1d2jjvlfdkj636bvuwzhtw4neoj3q52mnb5g33gj55ifft2cyze6a
    ONTO m1hlrisne77jactmdnlsxr7helhjffxdvnrajby5w4uyfk2z46uvoa
{
  ALTER TYPE default::GroceryItem {
      CREATE OPTIONAL PROPERTY url: std::str;
  };
};
