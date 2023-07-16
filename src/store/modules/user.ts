import { defineStore } from "pinia";

import { adminLogin, getAccount, adminLogout } from "@/api/admin";
import { LoginData, AccountInfo } from "@/api/admin/types";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", () => {
  const token = useStorage("accessToken", "");
  const account = ref<AccountInfo>();

  /**
   * 登录调用
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      adminLogin(loginData)
        .then((response) => {
          console.log(response);
          token.value = response.token;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function accountDetail() {
    return new Promise<AccountInfo>((resolve, reject) => {
      getAccount()
        .then((data) => {
          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          account.value = data;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      adminLogout()
        .then(() => {
          resetRouter();
          resetToken();
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 重置
  function resetToken() {
    token.value = "";
    account.value = undefined;
  }

  return {
    token,
    account,
    login,
    logout,
    accountDetail,
    resetToken,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
