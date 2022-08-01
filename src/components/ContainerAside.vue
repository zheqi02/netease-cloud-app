<script setup lang="ts">
const activeName = $ref('first')
</script>

<template>
  <div w-200px h-full rounded-bl p-x-2 border-r-1 border-zinc-400>
    <el-tabs v-model="activeName" stretch class="demo-tabs">
      <el-tab-pane label="首页菜单" name="first">
        <div>热门推荐</div>
        
      </el-tab-pane>
      <el-tab-pane label="播放列表" name="second">aaa</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
:deep(.demo-tabs > .el-tabs__content) {}
</style>
