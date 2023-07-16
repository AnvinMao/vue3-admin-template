<script setup lang="ts">
import { nextTick, ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";

import path from "path-browserify";

import { useRoute, useRouter } from "vue-router";
import { usePermissionStore } from "@/store/modules/permission";
import { useTagsViewStore, TagView } from "@/store/modules/tagsView";
import ScrollPane from "./ScrollPane.vue";

const router = useRouter();
const route = useRoute();

const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();

const { visitedViews } = storeToRefs(tagsViewStore);

const selectedTag = ref({});
const scrollPaneRef = ref();
const affixTags = ref<TagView[]>([]);

watch(
  route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  {
    immediate: true,
  }
);

function filterAffixTags(routes: any[], basePath = "/") {
  let tags: TagView[] = [];

  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }

    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      if (childTags.length >= 1) {
        tags = tags.concat(childTags);
      }
    }
  });
  return tags;
}

function initTags() {
  const tags: TagView[] = filterAffixTags(permissionStore.routes);
  affixTags.value = tags;
  for (const tag of tags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}

function addTags() {
  if (route.name) {
    tagsViewStore.addView(route);
    const current = visitedViews.value.find((item: TagView): boolean =>
      isActive(item)
    );
    if (current) {
      selectedTag.value = current;
    }
  }
}

function moveToCurrentTag() {
  nextTick(() => {
    for (const r of tagsViewStore.visitedViews) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r);
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route);
        }
      }
    }
  });
}

function isActive(tag: TagView) {
  return tag.path === route.path;
}

function isAffix(tag: TagView) {
  return tag.meta && tag.meta.affix;
}

function isFirstView(): boolean {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
      tagsViewStore.visitedViews[0].fullPath
    );
  } catch (err) {
    return false;
  }
}

function isLastView(): boolean {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
      tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
}

function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(selectedTag.value);
  const { fullPath } = view;
  nextTick(() => {
    router.replace({ path: "/redirect" + fullPath }).catch((err) => {
      console.warn(err);
    });
  });
}

function toLastView(visitedViews: TagView[], view?: any) {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === "Dashboard") {
      // to reload home page
      router.replace({ path: "/redirect" + view.fullPath });
    } else {
      router.push("/");
    }
  }
}

function closeSelectedTag(view: TagView) {
  tagsViewStore.delView(view).then((res: any) => {
    if (isActive(view)) {
      toLastView(res.visitedViews, view);
    }
  });
}

function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}

function closeOtherTags() {
  router.push(selectedTag.value);
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

function closeAllTags(view: TagView) {
  tagsViewStore.delAllViews().then((res: any) => {
    toLastView(res.visitedViews, view);
  });
}

const handleMenu = (command: string) => {
  switch (command) {
    case "refresh":
      refreshSelectedTag(selectedTag.value);
      break;
    case "close":
      closeSelectedTag(selectedTag.value);
      break;
    case "close_other":
      closeOtherTags();
      break;
    case "close_left":
      closeLeftTags();
      break;
    case "close_right":
      closeRightTags();
      break;
    case "close_all":
      closeAllTags(selectedTag.value);
      break;
  }
};

onMounted(() => {
  initTags();
});
</script>

<template>
  <div class="tags-container flex items-center justify-between">
    <scroll-pane ref="scrollPaneRef">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="'tags-item ' + (isActive(tag) ? 'active' : '')"
        :data-path="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
      >
        {{ tag.meta?.title }}
        <span
          v-if="!isAffix(tag)"
          class="tags-item-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <i-ep-close class="text-[10px]" />
        </span>
      </router-link>
    </scroll-pane>
    <div
      class="refresh cursor-pointer px-1"
      @click="refreshSelectedTag(selectedTag)"
    >
      <svg-icon icon-class="refresh" />
    </div>
    <el-dropdown trigger="click" @command="handleMenu">
      <div class="cursor-pointer px-2"><i-ep-operation /></div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="refresh">
            <svg-icon icon-class="refresh" />重新加载
          </el-dropdown-item>
          <el-dropdown-item command="close" :disabled="!!isAffix(selectedTag)">
            <svg-icon icon-class="close" />关闭标签页
          </el-dropdown-item>
          <el-dropdown-item
            command="close_left"
            :disabled="isFirstView()"
            divided
          >
            <svg-icon icon-class="close_left" />关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="close_right" :disabled="isLastView()">
            <svg-icon icon-class="close_right" />关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="close_other" divided>
            <svg-icon icon-class="close_other" />关闭其它
          </el-dropdown-item>
          <el-dropdown-item command="close_all">
            <svg-icon icon-class="close_all" />关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.tags-container {
  width: 100%;
  padding: 0 5px 0 10px;

  .refresh {
    color: var(--el-text-color-regular);
  }

  .tags-item {
    position: relative;
    display: inline-block;
    height: 32px;
    padding: 0 12px;
    margin-left: 3px;
    font-size: 12px;
    line-height: 31px;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid var(--el-border-color-light);
    border-bottom: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    &:first-of-type {
      margin-left: 0;
    }

    &:hover {
      color: var(--el-color-primary);
    }

    &.active {
      color: #fff;
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }

    &-close {
      margin-left: 4px;
      border-radius: 100%;

      &:hover {
        color: #fff;
        background: rgb(0 0 0 / 22%);
      }
    }
  }
}

.el-dropdown-menu {
  .svg-icon {
    margin-right: 10px;
  }
}
</style>
