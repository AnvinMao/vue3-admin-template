import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true, noKeepAlive: true },
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: { title: "后台首页", icon: "dashboard", affix: true },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true, noKeepAlive: true },
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true, noKeepAlive: true },
      },
    ],
  },

  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
];

// 权限路由
export const asyncRoutes = [
  {
    path: "/user",
    component: Layout,
    redirect: "/user/index",
    meta: { title: "用户管理", icon: "member" },
    children: [
      {
        path: "index",
        component: () => import("@/views/user/index.vue"),
        name: "UserList",
        meta: { title: "用户列表", roles: ["admin"] },
      },
      {
        path: "test",
        component: () => import("@/views/user/test.vue"),
        name: "UserTest",
        meta: { title: "测试页面", roles: ["admin"] },
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
