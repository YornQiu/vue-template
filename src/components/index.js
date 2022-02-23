/*
 * @Author: Yorn Qiu
 * @Date: 2021-05-14 17:01:47
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-02-23 12:26:46
 * @Description: global components
 * @FilePath: /vue-template/src/components/index.js
 */

const components = {
  //import, then add global component here
};

/**
 * Usage: Vue.use(components)
 */
export default {
  install(Vue) {
    Object.keys(components).forEach((key) => {
      Vue.component(key, components[key]);
    });
  },
};
