import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

// setup
export const useAppStore = defineStore("app", () => {
  // state
  const device = useStorage("device", "desktop");
  const size = useStorage<any>("size", "default");

  const sidebarStatus = useStorage("sidebarStatus", "closed");
  const sidebar = reactive({
    opened: sidebarStatus.value !== "closed",
    withoutAnimation: false,
  });

  // actions
  function toggleSidebar(withoutAnimation: boolean) {
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = withoutAnimation;
    if (sidebar.opened) {
      sidebarStatus.value = "opened";
    } else {
      sidebarStatus.value = "closed";
    }
  }

  function closeSideBar(withoutAnimation: boolean) {
    sidebar.opened = false;
    sidebar.withoutAnimation = withoutAnimation;
    sidebarStatus.value = "closed";
  }

  function openSideBar(withoutAnimation: boolean) {
    sidebar.opened = true;
    sidebar.withoutAnimation = withoutAnimation;
    sidebarStatus.value = "opened";
  }

  function toggleDevice(val: string) {
    device.value = val;
  }

  function changeSize(val: string) {
    size.value = val;
  }

  return {
    device,
    sidebar,
    size,
    toggleDevice,
    changeSize,
    toggleSidebar,
    closeSideBar,
    openSideBar,
  };
});
