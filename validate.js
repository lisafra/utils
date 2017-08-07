export default {
  // 去除前后空格
  fnTrim (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },

  // 手机号验证
  fnMobileVerify: function (mobile) {
    let oValidate = {
      flag: true,
      errorTip: ''
    };

    mobile = this.fnTrim(mobile);

    if (!mobile) {
      oValidate.flag = false;
      oValidate.errorTip = '请输入手机号';
      return oValidate;
    }

    if (!/^1[0-9]{10}$/.test(mobile)) {
      oValidate.flag = false;
      oValidate.errorTip = '请输入正确的手机号';
      return oValidate;
    }

    return oValidate;
  },

  // 验证码验证
  fnAuthCodeVerify: function (authCode) {
    let oValidate = {
      flag: true,
      errorTip: ''
    };

    authCode = this.fnTrim(authCode);

    if (!authCode) {
      oValidate.flag = false;
      oValidate.errorTip = '请输入验证码';
      return oValidate;
    }

    if (!/^[0-9]{6}$/.test(authCode)) {
      oValidate.flag = false;
      oValidate.errorTip = '验证码格式不正确';
      return oValidate;
    }

    return oValidate;
  },
  // 邮箱验证
  fnEmailVerify (email) {
    let oValidate = {
      flag: true,
      errorTip: ''
    };
    email = this.fnTrim(email);

    if (!email) {
      oValidate.flag = false;
      oValidate.errorTip = '请输入邮箱';
      return oValidate;
    }

    if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
      oValidate.flag = false;
      oValidate.errorTip = '邮箱格式不正确';
      return oValidate;
    }

    return oValidate;
  },
  // 实名验证
  fnRealNameVerify (realName) {
    let oValidate = {
      flag: true,
      errorTip: ''
    };
    realName = this.fnTrim(realName);
    if (!realName) {
      oValidate.flag = false;
      oValidate.errorTip = '请输入真实姓名';
      return oValidate;
    }
    if (!/^[\u4E00-\u9FA5]+·?[\u4E00-\u9FA5]+$/.test(realName)) {
      oValidate.flag = false;
      oValidate.errorTip = '真实姓名输入有误';
      return oValidate;
    }
    return oValidate;
  },
  // 把字符串转化成数组
  fnStrToArr (str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
      arr.push(str.substr(i, 1));
    }
    return arr;
  },
  // 从身份证号上获取年龄
  fnGetAge (idcard) {
    var year = idcard.substr(6, 4);
    var mounth = idcard.substr(10, 2);
    var day = idcard.substr(12, 2);
    var bornTime = new Date(year + '/' + mounth + '/' + day).getTime();
    var age = (new Date().getTime() - bornTime) / (365 * 24 * 60 * 60 * 1000);
    return age;
  },
  // 获取身份证最后一位校验码
  fnGetIdCardAuth (idcard) {
    var coefficient = ['7', '9', '10', '5', '8', '4', '2', '1', '6', ' 3', '7', '9', '10', '5', '8', '4', '2'];
    var authCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var add = 0;
    var idArr = this.fnStrToArr(idcard); // 将idcard转化为数组
    for (var i = 0; i < coefficient.length; i++) {
      add += parseInt(idArr[i]) * parseInt(coefficient[i]);
    }
    return authCode[parseInt(add % 11)];
  },
  // 身份证验证
  fnIdCardVerify (IdCard) {
    let oValidate = {
      flag: true,
      errorTip: ''
    };

    IdCard = this.fnTrim(IdCard);

    // 非空校i验
    if (!IdCard) {
      // oValidate.flag = false;
      // oValidate.errorTip = '请输入身份证号码';
      return oValidate;
    }

    var date = IdCard.substr(10, 4);
    var authCode = IdCard.substr(17, 1);
    var age = this.fnGetAge(IdCard);
    var auth = this.fnGetIdCardAuth(IdCard);
    var condition1 = /^\d{6}(19|20|21)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(IdCard);
    var condition2 = /0[469]31|1131|02(30|31)/i.test(date);

    if (!condition1 || condition2 || age > 100 || authCode !== auth) {
      oValidate.flag = false;
      oValidate.errorTip = '身份证号码输入有误';
      return oValidate;
    }
    if (age < 18) {
      oValidate.flag = false;
      oValidate.errorTip = '很抱歉，18周岁以下不能注册购彩！';
      return oValidate;
    }
    return oValidate;
  },

  // 金额校验
  fnMoneyVerify (money, obj, max, min) {
    let oValidate = {
      flag: false,
      errorTip: ''
    };

    obj = obj || '';
    max = max || 10000;
    min = min || '';
    obj = this.fnTrim(obj);

    // console.log(!money);
    if (money === '') {
      oValidate.errorTip = `请输入${obj}金额`;
      return oValidate;
    }

    money = money - 0;

    if (isNaN(money)) {
      oValidate.errorTip = `请输入正确的${obj}金额`;
      return oValidate;
    }

    if (money > max) {
      oValidate.errorTip = `${obj}金额不能大于${max}元`;
      return oValidate;
    }

    console.log(min);
    if (money < min) {
      oValidate.errorTip = `${obj}金额不能小于${min}元`;
      return oValidate;
    }

    if (!/^\d+\d*(\.\d{1,2})?$/g.test(money)) {
      oValidate.errorTip = `${obj}金额最多只能有两位小数`;
      return oValidate;
    }

    oValidate.flag = true;
    return oValidate;
  }
}
