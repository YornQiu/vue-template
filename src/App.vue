<template>
  <div id="app" class="dfc">
    <TheFrameHeader />
    <el-container>
      <TheFrameAside />
      <el-main class="frame-content">
        <router-view />
      </el-main>
    </el-container>
    <TheFrameFooter />
  </div>
</template>

<script>
import TheFrameHeader from '@/components/frame/TheFrameHeader';
import TheFrameFooter from '@/components/frame/TheFrameFooter';
import TheFrameAside from '@/components/frame/TheFrameAside';

export default {
  name: 'App',
  components: {
    TheFrameHeader,
    TheFrameFooter,
    TheFrameAside,
  },
};
</script>
