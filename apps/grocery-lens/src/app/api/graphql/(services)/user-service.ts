import e from "@/edgedb/edgeql-js";

export class UserService {
  static getUserQuery(userId: string) {
    return e.select(e.User, () => ({ filter_single: { id: userId } }));
  }
}
