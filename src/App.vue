<template>
  <div id="app">
    <TheHeader />
    <el-container>
      <TheAside />
      <el-main class="layout-content">
        <router-view />
      </el-main>
    </el-container>
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader';
import TheFooter from '@/components/layout/TheFooter';
import TheAside from '@/components/layout/TheAside';

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
    TheAside,
  },
};
</script>
