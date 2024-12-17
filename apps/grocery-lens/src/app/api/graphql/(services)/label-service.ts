import { db } from "@/db/db";

export class LabelService {
  static getUserLabels = async (userId: string) => {
    return db.selectFrom("label").selectAll().where("user_id", "=", userId).execute();
  };

  static getUserLabelsByIds = async (userId: string, labelIds: string[]) => {
    if (labelIds.length === 0) {
      return [];
    }
    return db.selectFrom("label").selectAll().where("user_id", "=", userId).where("id", "in", labelIds).execute();
  };

  static addLabel = async (userId: string, name: string) => {
    const result = await db.insertInto("label").values({ name, user_id: userId }).returningAll().execute();
    return result[0];
  };
}
