import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  session: defaultStatements.session,
  user: Array.from(new Set(["read", "unban", "update", ...defaultStatements.user])),
} as const;
const accessControl = createAccessControl(statement);
const admin = accessControl.newRole({
  session: adminAc.statements.session,
  user: [
    "create",
    "read",
    "update",
    "delete",
    "list",
    "ban",
    "unban",
    "impersonate",
    "set-password",
    "set-role",
  ],
});
const doctor = accessControl.newRole({
  user: ["create", "read", "update", "delete", "ban", "unban"],
});
const patient = accessControl.newRole({
  user: ["read", "update", "delete"],
});
const nurse = accessControl.newRole({
  user: ["read", "update", "delete"],
});

export { accessControl, admin, doctor, nurse, patient, statement };
