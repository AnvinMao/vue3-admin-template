<script setup lang="ts">
import zh from "element-plus/es/locale/lang/zh-cn";
import { ElConfigProvider } from "element-plus";
import { useAppStore } from "@/store/modules/app";

const appStore = useAppStore();
</script>

<template>
  <el-config-provider :locale="zh" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>
