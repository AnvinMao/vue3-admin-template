<script setup lang="ts">
import Editor from "@/components/WangEditor/index.vue";
const content = ref("");
</script>

<template>
  <div class="app-container">
    <div class="wrapper">
      <editor v-model="content" style="height: 500px" />
    </div>
  </div>
</template>
