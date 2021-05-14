/*
 * @Author: YogurtQ
 * @Date: 2020-12-16 15:35:55
 * @LastEditors: YogurtQ
 * @LastEditTime: 2021-04-12 23:32:50
 * @Description: 工具类
 * @FilePath: \vue-template\src\utils\index.js
 */

import numberUtils from '@/utils/numberUtils';

const utils = {
  /**
   * @description: 从localStorage中读取属性值
   * @param {string} key
   * @param {boolean} parse 是否将序列化的字符串转化为Object
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
   * @description: 判断是否为 null,undefined或""
   * @param {string} value
   * @return {boolean} 是否为空
   */
  isEmpty(value) {
    return value === null || value === undefined || value === '';
  },

  /**
   * @description: 判断是否为 null或undefined
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
  },

  /**
   * @description: 验证文本是否合法
   * @param {string} value 输入的值
   * @param {string} type 输入的值的类型
   * @param {object} params 其他参数
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validate(value, type, params = {}) {
    const { required = true, length } = params;
    if (required && this.validateRequired(value)) {
      return this.validateRequired(value);
    }
    if (length && this.validateLength(value, length)) {
      return this.validateLength(value);
    }
    switch (type) {
      case 'number':
        return this.validateNumber(value);
      case 'int':
        return this.validateInt(value);
      case 'username':
        return this.validateUsername(value);
      case 'password':
        return this.validatePassword(value);
      case 'space':
        return this.validateSpace(value);
      case 'mail':
        return this.validateMail(value);
      case 'mobile':
        return this.validateMobile(value);
      case 'tel':
        return this.validateTel(value);
      case 'char':
        return this.validateChar(value);
      case 'card':
        return this.validateCard(value);
      case 'ip':
        return this.validateIp(value);

      default:
        break;
    }
  },

  /**
   * @description: 验证文本是否为空
   * @param {string} value
   * @return {boolean} 不为空时返回false，为空时返回错误信息
   */
  validateRequired(value) {
    return !value && '文本不能为空';
  },

  /**
   * @description: 验证文本长度是否符合要求
   * @param {string} value
   * @param {number|array} range 数字或者是一个表示范围的数组
   * @return {boolean} 符合要求时返回false，不符合要求时返回错误信息
   */
  validateLength(value, range) {
    const length = value.length;

    if (!isNaN(range) && range > 0) {
      if (length > range) {
        return `文本长度不能大于${range}`;
      }
    } else if (Array.isArray(range) && range[0] && range[1]) {
      if (length < range[0] || value.length > range[1]) {
        return `文本长度需在${range[0]}到${range[1]}之间`;
      }
    } else {
      throw new Error('文本长度验证格式错误');
    }
  },

  /**
   * @description: 验证文本是否为数字
   * @param {string} value
   * @return {boolean} 为数字时返回false，不为数字时返回错误信息
   */
  validateNumber(value) {
    return isNaN(value) && '文本必须为数字';
  },

  /**
   * @description: 验证文本是否为整数
   * @param {string} value
   * @return {boolean} 为整数时返回false，不为整数时返回错误信息
   */
  validateInt(value) {
    const reg = /^-?[1-9][0-9]*$/;
    return (isNaN(value) || !reg.test(value)) && '文本必须为整数';
  },

  /**
   * @description: 验证用户名，必须以字母开头且长度不小于6，只能包含字母或数字
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateUsername(value) {
    const reg = /^[a-zA-Z]{1}([a-zA-Z0-9]){5,}$/;
    return !reg.test(value) && '用户名格式错误';
  },

  /**
   * @description: 密码验证，必须包含小写字母、大写字母、数字或特殊字符其中的三项
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validatePassword(value) {
    const rC = {
      lW: /[a-z]/,
      uW: /[A-Z]/,
      nW: /[0-9]/,
      sW: /[.\-_~!@#$%^&*]/
    };
    let typeCount = 0;
    for (let i in rC) {
      if (rC[i].test(value)) {
        typeCount++;
      }
    }
    return typeCount < 3 && '密码格式错误';
  },

  /**
   * @description: 验证空格
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateSpace(value) {
    return /\s/.test(value) && '文本中不能含有空格';
  },

  /**
   * @description: 验证邮箱
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateMail(value) {
    const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    return !reg.test(value) && '邮箱格式错误';
  },

  /**
   * @description: 验证手机号
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateMobile(value) {
    const reg = /^1[34578]\d{9}$/;
    return !reg.test(value) && '手机号格式错误';
  },

  /**
   * @description: 验证座机号
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateTel(value) {
    const reg = /^0\d{2,3}-?\d{7,8}-?\d{0,4}$/;
    return !reg.test(value) && '座机号格式错误';
  },

  /**
   * @description: 验证是否包含特殊字符
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateChar(value) {
    const reg = /[&#\\/:*?'"<>|]+/;
    return reg.test(value) && '不能含有特殊字符 & # \\ / : * ? \' " < > |';
  },

  /**
   * @description: 验证身份证
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateCard(value) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(value)) {
      return '身份证长度或格式错误';
    }
    const aCity = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    };
    if (!aCity[parseInt(value.substr(0, 2))]) {
      return '身份证地区非法';
    }
    const dateReg = /^(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/;
    if (!dateReg.test(value.length == 18 ? value.substr(6, 8) : value.substr(6, 6))) {
      return '身份证出生日期非法';
    }
    if (value.length == 18) {
      const birthdate = value.substr(6, 4) + '/' + value.substr(10, 2) + '/' + value.substr(12, 2);
      if (new Date(birthdate) > new Date() || new Date(birthdate).Format('yyyy/MM/dd') != birthdate) {
        return '身份证出生日期非法';
      }
      // 校验码判断
      const coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const checkDigitMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 除11取余的结果对应的校验位（最后一位）的值
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += value[i] * coefficient[i];
      }
      const code = checkDigitMap[sum % 11];
      if (code != value[17]) {
        return '身份证校验码非法';
      }
    }
  },

  /**
   * @description: 验证ip地址
   * @param {string} value
   * @return {boolean} 合法时返回false，不合法时返回错误信息
   */
  validateIp(value) {
    const reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return !reg.test(value) && 'IP地址格式错误';
  }
};

export default { ...utils, numberUtils };
