/*
 * @Author: YogurtQ
 * @Date: 2020-12-16 15:35:55
 * @LastEditors: YogurtQ
 * @LastEditTime: 2021-08-04 18:46:24
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
   * @description: 判断浏览器类型是否为IE
   * @return {boolean}
   */
  isIE() {
    const userAgent = navigator.userAgent;
    return userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && userAgent.indexOf('Opera') === -1;
  },

  /**
   * @description: 获取浏览器类型
   * @return {string} 浏览器类型：Edge、Firefox、Safari、Chrome、Opera、IE
   */
  getBrowser() {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('Edge') > -1) {
      return 'Edge';
    }
    if (userAgent.indexOf('Firefox') > -1) {
      return 'Firefox';
    }
    if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1) {
      return 'Safari';
    }
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
      return 'Chrome';
    }
    if (userAgent.indexOf('Opera') > -1 && userAgent.indexOf('MSIE') === -1) {
      return 'Opera';
    }

    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(userAgent);
      const IEVersion = parseFloat(RegExp['$1']);
      if (IEVersion === 7) {
        return 'IE7';
      } else if (IEVersion === 8) {
        return 'IE8';
      } else if (IEVersion === 9) {
        return 'IE9';
      } else if (IEVersion === 10) {
        return 'IE10';
      } else if (IEVersion === 11) {
        return 'IE11';
      } else {
        return 'IE';
      }
    }
  },

  /**
   * @description: 选择文件，使用input输入框选择文件
   * @param {object} option 配置选项，可选配置项为：multiple，是否支持多选，默认false；accept，接受的文件类型，默认全部
   * @return {promise} Promise对象，内容为input[file]返回的文件列表
   */
  selectFile(option = {}) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = option.multiple || false;
      input.accept = option.accept || '';

      input.onchange = function(e) {
        resolve(e.target.files);
      };
      input.onabort = function() {
        reject();
      };

      input.click();
    });
  },

  /**
   * @description: 通过xhr请求上传文件
   * @param {string} url 请求地址
   * @param {object} option 配置选项，支持multiple(多选)，accept(接受的文件类型)，params(请求参数)，beforeSelect(选择文件之前的钩子)，beforeUpload(上传文件之前的钩子)，onprogress(下载进度回调函数)
   * @return {promise} 包含请求结果的Promise对象
   */
  async uploadFile(url, option = {}) {
    const { beforeSelect, beforeUpload, onprogress, params } = option;

    beforeSelect && beforeSelect();

    const files = await this.selectFile(option);
    const fd = new FormData();
    files.forEach(file => fd.append('files', file, file.name));
    params && Object.keys(params).forEach(k => fd.append(k, params[k]));

    beforeUpload && beforeUpload();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = function() {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      };
      xhr.onerror = function() {
        reject(xhr.response);
      };

      if (onprogress) {
        xhr.upload.onprogress = e => onprogress(e);
      }

      xhr.send(fd);
    });
  },

  /**
   * @description: 通过xhr请求下载文件
   * @param {string} url 请求地址
   * @param {object} option 配置选项，支持 method(请求方法)，params(请求参数)，type(参数类型)，name(文件名)，onprogress(下载进度回调函数)
   * @return {promise} 包含请求结果的Promise对象
   */
  downloadFileAjax(url, option = {}) {
    const { method, type, params, name, onprogress } = option;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method || 'get', url, true);
      xhr.responseType = 'blob';
      xhr.setRequestHeader('Content-Type', type === 'json' ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded');

      const _params =
        typeof params === 'object'
          ? type === 'json'
            ? JSON.stringify(params)
            : Object.entries(params)
                .map(item => item.join('='))
                .join('&')
          : params;

      xhr.onload = function() {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const fileName = xhr.getResponseHeader('Content-Disposition').substring(20);
          this.downloadFile(name || decodeURIComponent(fileName), blob); //解码名称
          resolve();
        } else {
          reject(xhr.response);
        }
      };
      xhr.onerror = function() {
        reject(xhr.response);
      };

      if (onprogress) {
        xhr.onprogress = e => onprogress(e);
      }

      xhr.send(null || _params);
    });
  },

  /**
   * @description: 文件下载
   * @param {string} fileName 文件名
   * @param {object|string} content 文件内容或文件地址
   */
  downloadFile(fileName, content) {
    const a = document.createElement('a');
    a.download = fileName;
    a.style.display = 'none';

    if (typeof content === 'string') {
      a.href = content; // content为文件地址
    } else {
      const blob = new Blob([content]);
      a.href = URL.createObjectURL(blob); // content为文件内容
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  /**
   * @description: 将扁平数组转化为树或森林
   * @param {array} nodes 节点数组
   * @param {string} id 节点的id字段，默认为id
   * @param {string} pid 节点的父节点id字段，默认为pid
   * @param {string} children 节点的子节点字段，默认为children
   * @return {array} 树或森林
   */
  generateTree(nodes, id = 'id', pid = 'pid', children = 'children') {
    if (!Array.isArray(nodes)) {
      return [];
    }

    const tree = [];
    const treeMap = {};

    for (const node of nodes) {
      treeMap[node[id]] = node;
    }

    for (const node of nodes) {
      const pNode = treeMap[node[pid]];

      if (pNode) {
        (pNode[children] || (pNode[children] = [])).push(node);
      } else {
        tree.push(node);
      }
    }

    return tree;
  },

  /**
   * @description: 广度优先遍历树
   * @param {object|array} tree 树或森林
   * @param {function} handler 用来处理树节点的方法
   */
  BFSTree(tree, handler) {
    if (!tree || typeof tree !== 'object') return;

    const queue = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (queue.length) {
      node = queue.shift();
      handler && handler(node);
      node.children && node.children.foEach(child => queue.push(child));
    }
  },

  /**
   * @description: 广度优先遍历树
   * @param {object|array} tree 树或森林
   * @param {function} handler 用来处理树节点的方法
   */
  DFSTree(tree, handler) {
    if (!tree || typeof tree !== 'object') return;

    const stack = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (stack.length) {
      node = stack.pop();
      handler && handler(node);
      node.children && node.children.forEach(child => stack.push(child));
    }
  },

  /**
   * @description: 获取树中的某一个节点，得到一个节点后直接返回，不会继续查找
   * @param {object|array} tree 树或森林
   * @param {string} id 要获取的节点id
   * @return {object} 要获取的节点，未找到时返回undefined
   */
  getTreeNode(tree, id) {
    if (!tree || typeof tree !== 'object') return;

    const queue = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (queue.length) {
      node = queue.shift();
      if (node.id === id) return node;
      node.children && node.children.foEach(child => queue.push(child));
    }
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
