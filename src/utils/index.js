/*
 * @Author: QY
 * @Date: 2020-12-16 15:35:55
 * @LastEditors: QY
 * @LastEditTime: 2020-12-31 17:49:11
 * @Description: 工具类
 * @FilePath: \vue-template\src\utils\index.js
 */

import numberUtils from '@/utils/numberUtils';

const utils = {
  /**
   * @description: 从localStorage中读取属性值
   * @param {string} key
   * @param {string} parse 是否将序列化的字符串转化为Object
   * @return {string|object}
   */
  getItem(key, parse) {
    let value = localStorage.getItem(key);
    if (value !== null && parse) {
      return JSON.parse(value);
    }
    return value;
  },
  /**
   * @description: 在localStorage中设置属性值
   * @param {string} key
   * @param {string|object} value
   * @return {boolean}
   */
  setItem(key, value) {
    if (this.isEmpty(key) || this.isVain(value)) {
      return false;
    }
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
    return true;
  },
  /**
   * @description: 从localStorage中删除属性值
   * @param {string} key
   */
  removeItem(key) {
    localStorage.removeItem(key);
  },
  /**
   * @description: 判断是否为null,undefined,""
   * @param {string} value
   * @return {boolean} 是否为空
   */
  isEmpty(value) {
    return value === null || value === undefined || value === '';
  },
  /**
   * @description: 判断是否为null,undefined
   * @param {string} value
   * @return {boolean} 是否为空
   */
  isVain(value) {
    return value === null || value === undefined;
  },
  /**
   * @description 生成32位唯一数uuid
   * @return {string} uuid
   */
  uuid() {
    let s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
  }
};

export default { ...utils, numberUtils };
