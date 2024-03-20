import type { UserInfo } from "@/api/user";

export function getUserStatusText(user: UserInfo) {
  if (user.isAdmin) {
    return {
      name: "管理员",
      localeKey: "user.role.admin"
    };
  }

  if (user.isBanned) {
    return {
      name: "封禁中",
      localeKey: "user.role.banned"
    };
  }

  return {
    name: "访客",
    localeKey: "user.role.normal"
  };
}
