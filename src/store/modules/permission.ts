import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import { constantRoutes, asyncRoutes } from "@/router";
import { store } from "@/store";

/**
 * Use meta.role to determine if the current user has permission
 *
 * @param role 用户角色
 * @param route 路由
 * @returns
 */
const hasPermission = (role: string, route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return (route.meta.roles as string[]).includes(role);
  }

  return true;
};

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 接口返回的异步(动态)路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], role: string) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role);
      }
      asyncRoutes.push(tmp);
    }
  });

  return asyncRoutes;
};

// setup
export const usePermissionStore = defineStore("permission", () => {
  // state
  const routes = ref<RouteRecordRaw[]>([]);

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }
  /**
   * 生成动态路由
   *
   * @param role 用户角色
   * @returns
   */
  function generateRoutes(role: string): Promise<RouteRecordRaw[]> {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      let accessedRoutes;
      if (role === "admin") {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, role);
      }

      setRoutes(accessedRoutes);
      resolve(accessedRoutes);
    });
  }

  return { routes, setRoutes, generateRoutes };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
