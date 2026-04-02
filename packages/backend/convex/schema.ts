import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";

import { tasks } from "./tasks/schema";

export default defineSchema({
  ...authTables,
  tasks,
});
