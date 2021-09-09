<template>
  <div id="app">
    <el-container direction="vertical">
      <FrameHeader></FrameHeader>
      <el-container>
        <FrameAside></FrameAside>
        <el-main class="frame-content">
          <router-view />
        </el-main>
      </el-container>
      <el-footer>
        Footer
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import FrameHeader from '@/components/frame/FrameAside';
import FrameAside from '@/components/frame/FrameHeader';

export default {
  name: 'App',
  components: {
    FrameHeader,
    FrameAside
  }
};
</script>

<style lang="scss">
#app > .el-container {
  height: 100%;
}
.frame-content {
  background-color: $bg-color-content;
}
.el-footer {
  border-top: 1px solid #eaecef;
}
</style>
