import type { NavMenuItems } from "~/types/nav";

export const navMenu: NavMenuItems = [
  {
    title: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    link: "/admin",
  },
  {
    title: "Exam",
    icon: "i-lucide-clipboard",
    link: "/admin/exams",
  },
  {
    title: "Questions",
    icon: "i-lucide-file-question",
    link: "/admin/questions",
  },
  {
    title: "Subjects",
    icon: "i-lucide-book",
    link: "/admin/subjects",
  },

  {
    title: "Students",
    icon: "i-lucide-square-user",
    link: "/admin/users",
  },
];

export const navMenuBottom: NavMenuItems = [
  {
    title: "Help",
    icon: "i-lucide-life-buoy",
    link: "/",
  },
  {
    title: "Account",
    icon: "i-lucide-square-user",
    link: "/",
  },
];
