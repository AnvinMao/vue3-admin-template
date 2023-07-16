<script lang="ts" setup>
defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const title = import.meta.env.VITE_APP_TITLE;
</script>

<template>
  <div class="w-full h-[83px] bg-[#0f337a]">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="h-full w-full flex items-center justify-center"
        to="/"
      >
        <img src="~@/assets/logo.png" class="w-5 h-5" />
      </router-link>

      <router-link
        v-else
        key="expand"
        class="h-full w-full flex items-center justify-start pl-4"
        to="/"
      >
        <img src="~@/assets/logo.png" class="w-5 h-5" />
        <span class="ml-3 uppercase text-white font-bold">{{ title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}

.sidebarLogoFade-leave-active,
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
</style>
