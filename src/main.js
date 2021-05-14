import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import './registerServiceWorker';
import router from './routers';
import store from './store';

import directives from '@/directives';
import GlobalComponents from '@/components';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(directives);
Vue.use(GlobalComponents);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
