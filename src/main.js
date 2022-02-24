import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/styles/index.scss';

import directives from '@/directives';
import GlobalComponents from '@/components';

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'medium' });
Vue.use(directives);
Vue.use(GlobalComponents);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
