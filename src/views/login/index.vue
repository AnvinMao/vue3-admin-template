<template>
  <div class="w-full h-screen bg-[#1A2038] flex items-center justify-center">
    <div
      class="login-form bg-white rounded-3 w-3xl max-w-[90%] py-12 sm-py-18 flex flex-col sm-flex-row sm-items-center"
    >
      <div class="w-full pb-6 sm-pb-0 sm-w-1/2 px-6">
        <img src="~@/assets/dreamer.svg" class="w-full" />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="flex-1 px-6"
      >
        <el-form-item prop="account">
          <div class="px-2 text-gray leading-0">
            <i-ep-user />
          </div>
          <el-input
            ref="account"
            v-model="loginData.account"
            class="flex-1"
            size="large"
            placeholder="用户名"
            name="account"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="px-2 text-gray leading-0">
            <i-ep-lock />
          </span>
          <el-input
            v-model="loginData.password"
            class="flex-1"
            placeholder="密码"
            :type="passwordVisible === false ? 'password' : 'input'"
            size="large"
            name="password"
            @keyup.enter="handleLogin"
          />
          <span
            class="mr-2 text-gray cursor-pointer leading-0"
            @click="passwordVisible = !passwordVisible"
          >
            <template v-if="passwordVisible === false">
              <i-ep-view />
            </template>
            <template v-else><i-ep-hide /></template>
          </span>
        </el-form-item>
        <div class="flex justify-between">
          <el-checkbox v-model="remember" label="Remember me" />
          <a href="#" class="text-right text-sm pt-2 text-gray">
            Forgot password?
          </a>
        </div>
        <el-button
          size="default"
          :loading="loading"
          type="primary"
          class="w-full mt-4"
          @click.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/store/modules/user";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { LoginData } from "@/api/admin/types";

const userStore = useUserStore();
const route = useRoute();

const loading = ref(false);
const passwordVisible = ref(false);
const remember = ref(true);

const loginFormRef = ref(ElForm);

const loginData = ref<LoginData>({
  account: "",
  password: "",
});

const loginRules = {
  account: [{ required: true, trigger: "blur" }],
  password: [{ required: true, trigger: "blur", validator: passwordValidator }],
};

function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error("The password can not be less than 6 digits"));
  } else {
    callback();
  }
}

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          const query: LocationQuery = route.query;
          const redirect = (query.redirect as LocationQueryValue) ?? "/";
          const otherQueryParams = Object.keys(query).reduce(
            (acc: any, cur: string) => {
              if (cur !== "redirect") {
                acc[cur] = query[cur];
              }
              return acc;
            },
            {}
          );

          router.push({ path: redirect, query: otherQueryParams });
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("登录失败，账号或密码错误！");
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}
</script>

<style lang="scss" scoped>
.login-form {
  box-shadow: rgb(0 0 0 / 6%) 0 3px 3px -2px,
    rgb(0 0 0 / 4%) 0 3px 4px 0, rgb(0 0 0 / 4%) 0 1px 8px 0;
}

.el-form-item {
  background: #fff;
  border: 1px solid #cdcdcd;
  border-radius: 5px;
}

.el-input {
  background: transparent;

  // 子组件 scoped 无效，使用 :deep
  :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;

    .el-input__inner {
      color: #666;
      caret-color: #666;
      background: transparent;
      border: 0;
      border-radius: 0;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: #666 !important;
      }

      // 设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition: color 99999s ease-out, background-color 99999s ease-out;
        transition-delay: 99999s;
      }
    }
  }
}
</style>
