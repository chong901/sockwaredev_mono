import { db } from "@/db/db";
import e from "@/edgedb/edgeql-js";

export class LabelService {
  static getUserLabels = async (userId: string) => {
    return db
      .selectFrom("label")
      .selectAll()
      .where("user_id", "=", userId)
      .execute();
  };

  static getUserLabelsByIds = async (userId: string, labelIds: string[]) => {
    return db
      .selectFrom("label")
      .selectAll()
      .where("user_id", "=", userId)
      .where("id", "in", labelIds)
      .execute();
  };

  static addLabel = async (userId: string, name: string) => {
    const result = await db
      .insertInto("label")
      .values({ name, user_id: userId })
      .returningAll()
      .execute();
    return result[0];
  };

  static getLabelsQuery = (userId: string, names: string[]) => {
    if (names.length === 0) return e.set();

    return e.select(e.Label, (label) => {
      const nameInCondition = e.op(label.name, "in", e.set(...names));
      const isCurrentUser = e.op(label.owner.id, "=", e.uuid(userId));
      return {
        filter: e.all(e.set(nameInCondition, isCurrentUser)),
      };
    });
  };
}
