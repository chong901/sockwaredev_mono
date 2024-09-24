import { UserService } from "@/app/api/graphql/(services)/user-service";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";

export class LabelService {
  static getLabels = async (userId: string) => {
    return await e
      .select(e.Label, (label) => ({
        name: true,
        id: true,
        filter: e.op(label.owner.id, "=", userId),
      }))
      .run(edgedbClient);
  };

  static addLabel = async (userId: string, name: string) => {
    const currentUser = UserService.getUserQuery(userId);
    const label = await e
      .select(
        e.insert(e.Label, {
          name,
          owner: currentUser,
        }),
        () => ({ id: true, name: true })
      )
      .run(edgedbClient);

    return label;
  };
}
