<script setup lang="ts">
import { useRoute } from "vue-router";
import SidebarItem from "./SidebarItem.vue";
import Logo from "./Logo.vue";

import { usePermissionStore } from "@/store/modules/permission";
import { useAppStore } from "@/store/modules/app";
import variables from "@/styles/variables.module.scss";

const permissionStore = usePermissionStore();
const appStore = useAppStore();
const currRoute = useRoute();
</script>

<template>
  <div class="has-logo">
    <logo :collapse="!appStore.sidebar.opened" />
    <el-scrollbar>
      <el-menu
        :default-active="currRoute.path"
        :collapse="!appStore.sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionStore.routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="!appStore.sidebar.opened"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
