CREATE MIGRATION m15xodlfjx5qoxgvqjv22sfwuzhyloh3jvg2usgdeggsk2yjts54dq
    ONTO m1kojiqxv4v75ecd3sp3gcrczhau7wmdbag5oxv3nohef4mzxx7cda
{
  ALTER TYPE default::Label {
      CREATE CONSTRAINT std::exclusive ON ((.name, .owner));
  };
};
