/*
 * @Author: YornQiu
 * @Date: 2021-05-14 17:01:47
 * @LastEditors: YornQiu
 * @LastEditTime: 2021-05-17 23:29:05
 * @Description: global components
 * @FilePath: \vue-template\src\components\index.js
 */

const components = {
  //import, then add global component here
};

/**
 * Usage: Vue.use(components)
 */
export default {
  install(Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key]);
    });
  }
};
