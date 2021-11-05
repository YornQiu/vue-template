<template>
  <div id="app" class="dfc">
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
  </div>
</template>

<script>
import FrameHeader from '@/components/FrameHeader';
import FrameAside from '@/components/FrameAside';

export default {
  name: 'App',
  components: {
    FrameHeader,
    FrameAside
  }
};
</script>

<style lang="scss">
.frame-content {
  background-color: $bg-color-content;
}
.el-footer {
  border-top: 1px solid #eaecef;
}
</style>
