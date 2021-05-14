/*
 * @Author: YogurtQ
 * @Date: 2021-05-14 17:01:47
 * @LastEditors: YogurtQ
 * @LastEditTime: 2021-05-14 17:02:01
 * @Description: file content
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
