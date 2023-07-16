<script setup lang="ts">
defineOptions({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Dashboard",
  inheritAttrs: false,
});

import { useTransition, TransitionPresets } from "@vueuse/core";

const duration = 5000;
// 收入金额
const amount = ref(0);
const amountOutput = useTransition(amount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
amount.value = 2000;

// 访问数
const visitCount = ref(0);
const visitCountOutput = useTransition(visitCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
visitCount.value = 2000;

//消息数
const messageCount = ref(0);
const messageCountOutput = useTransition(messageCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
messageCount.value = 2000;

// 订单数
const orderCount = ref(0);
const orderCountOutput = useTransition(orderCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
orderCount.value = 2000;
</script>

<template>
  <div class="app-container">
    <!-- 数据卡片 -->
    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div
            class="text-[#40c9c6] hover:!text-white hover:bg-[#40c9c6] p-3 rounded"
          >
            <svg-icon icon-class="uv" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">访问数</div>
            <div class="text-lg text-right">
              {{ Math.round(visitCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>

      <!--消息数-->
      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div
            class="text-[#36a3f7] hover:!text-white hover:bg-[#36a3f7] p-3 rounded"
          >
            <svg-icon icon-class="message" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">消息数</div>
            <div class="text-lg text-right">
              {{ Math.round(messageCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div
            class="text-[#f4516c] hover:!text-white hover:bg-[#f4516c] p-3 rounded"
          >
            <svg-icon icon-class="money" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">收入金额</div>
            <div class="text-lg text-right">
              {{ Math.round(amountOutput) }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="mb-2">
        <div class="data-box">
          <div
            class="text-[#34bfa3] hover:!text-white hover:bg-[#34bfa3] p-3 rounded"
          >
            <svg-icon icon-class="shopping" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">订单数</div>
            <div class="text-lg text-right">
              {{ Math.round(orderCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Echarts 图表 -->
    <el-row :gutter="15">
      <el-col :sm="24" :lg="8" class="mb-4">
        <BarChart id="barChart" height="400px" width="100%" />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="mb-4">
        <PieChart id="pieChart" height="400px" width="100%" />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="mb-4">
        <RadarChart id="radarChart" height="400px" width="100%" />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.data-box {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-weight: bold;
  color: var(--el-text-color-regular);
  background: var(--el-bg-color-overlay);
  border-color: var(--el-border-color);
  border-radius: var(--borderRadius);
  box-shadow: var(--el-box-shadow-light);
}
</style>
