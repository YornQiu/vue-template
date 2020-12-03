const numberUtils = {
  // 数值格式化的单位映射
  formatUnit: {
    1: '',
    10000: '万',
    100000000: '亿',
    1000000000000: '万亿',
    1000: 'k',
    1000000: 'M',
    1000000000: 'G'
  },

  /**
   * 增加千分位
   * @method addKannma
   * @param {Number} number 数值
   * @param {Number} deg 保留小数点位数,默认2位
   * @return {string}
   */
  addKannma(number, deg) {
    deg = deg || deg === 0 ? deg : 2;
    let num = `${number}`;
    num = num.replace(new RegExp(',', 'g'), '');
    // 正负号处理
    let symble = '';
    if (/^([-+]).*$/.test(num)) {
      symble = num.replace(/^([-+]).*$/, '$1');
      num = num.replace(/^([-+])(.*)$/, '$2');
    }

    if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
      num = num.replace(new RegExp('^[0]+', 'g'), '');
      if (/^\./.test(num)) {
        num = `0${num}`;
      }

      const decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, '$1');
      let integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, '$1');

      const re = /(\d+)(\d{3})/;

      while (re.test(integer)) {
        integer = integer.replace(re, '$1,$2');
      }
      const result = symble + integer + (decimal && decimal.length > 3 ? this.toFixed(parseFloat(decimal), deg).substring(1) : decimal);
      return result === '' ? '0' : result;
    }
    return number;
  },

  /**
   * 数值格式化
   * @method format
   * @param {Number} value 数值
   * @param {option} 格式化参数集合, 默认增加千分位,保留2位小数
   * @param {string} option.type 格式化类型 num 数值, percent 百分比, flowNum 容量
   * @param {Number} option.deg 保留几位小数
   * @param {boolean} option.kannma 是否增加千分位
   * @param {boolean} option.autoUnit 是否自动进行数值单位换算
   * @param {Number} option.unit 指定单位换算值
   * @return {string}
   */
  format(value, option) {
    if (Number.isNaN(value) || value === Infinity || value === -Infinity || value === undefined || value === null) {
      return '-';
    }
    if (!Number.isNaN(value)) {
      if (!option) {
        option = {
          type: 'num',
          deg: 2,
          kannma: true,
          datum: 1
        };
      }
      value = Number(value);
      let deg = option.deg || 0;
      // deg为负数时，处理为0
      deg = deg < 0 ? 0 : deg;
      if (option.type === 'num') {
        if (option.autoUnit) {
          const datum = option.datum || 1;
          if (Math.abs(value / 10 ** 12) >= datum) {
            return `${this.toFixed(value / 10 ** 12, deg)}万亿`;
          }
          if (Math.abs(value / 10 ** 8) >= datum) {
            return `${this.toFixed(value / 10 ** 8, deg)}亿`;
          }
          if (Math.abs(value / 10 ** 4) >= datum) {
            return `${this.toFixed(value / 10 ** 4, deg)}万`;
          }
          return value;
        }
        if (option.unit) {
          value /= option.unit;
        }
        value = this.toFixed(value, deg);
        if (option.kannma) {
          value = this.addKannma(value, deg);
        }
        if (option.unit) {
          value += this.formatUnit[option.unit];
        }
        return value;
      }
      if (option.type === 'percent') {
        return `${this.toFixed(value * 100, deg)}%`;
      }
      if (option.type === 'flowNum') {
        const datum = option.datum || 1;
        if (Math.abs(value / 1024 ** 4) >= datum) {
          return `${this.toFixed(value / 1024 ** 4, deg)}TB`;
        }
        if (Math.abs(value / 1024 ** 3) >= datum) {
          return `${this.toFixed(value / 1024 ** 3, deg)}GB`;
        }
        if (Math.abs(value / 1024 ** 2) >= datum) {
          return `${this.toFixed(value / 1024 ** 2, deg)}MB`;
        }
        if (Math.abs(value / 1024 ** 1) >= datum) {
          return `${this.toFixed(value / 1024 ** 1, deg)}KB`;
        }
        return `${value.toFixed(deg)}B`;
      }
    }
    return value;
  },

  /**
   * 保留小数位,不足补0. 避免默认的double补成9999等问题
   */
  toFixed(num, deg) {
    let strNum = `${num}`;
    const match = strNum.match(/\.(\d+)/);
    if (match && match[1].length < deg) {
      for (let i = 0; i < deg - match[1].length; i += 1) {
        strNum += '0';
      }
      return strNum;
    }
    return num.toFixed(deg);
  },

  // 增加千分位并保留两位小数
  numFormat(value, isPercent = false) {
    if (isPercent) {
      return this.format(value, {
        type: 'percent',
        kannma: true,
        deg: 2
      });
    }
    return this.format(value, {
      type: 'num',
      kannma: true,
      deg: 2
    });
  }
};

export default numberUtils;
