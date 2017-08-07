/**
 * Created by Yulia on 2017/6/1.
 */

export default {

  // 去除前后空格
  fnTrim (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },

  // 获取字符长度,一个汉字按2个字符计算
  fnCnLength (str) {
    var escStr = escape(str);
    var numI = 0;
    var escStrlen = escStr.length;
    for (var i = 0; i < escStrlen; i++) {
      if (escStr.charAt(i) === '%') {
        if (escStr.charAt(++i) === 'u') {
          numI++;
        }
      }
    }
    return str.length + numI;
  },

  // 生成随机数
  fnGetRandom (length, min) {
    return Math.floor(Math.random() * length + min);
  },
  // 阻止事件冒泡
  stopBubble (e) {
    if (e && e.stopPropagation)
      e.stopPropagation();
    else
      window.event.cancelBubble = true;
    };
  },
  // 获取url路径里，请求参数值，如type=123
  fnGetQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
  // 获取url路径中的id，如/wager/id
  fnGetPathString () {
    var pathname = window.location.pathname;
    return pathname.substr(pathname.lastIndexOf('/') + 1);
  },
  // 格式化参数
  fnFormatParams (data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    };
    return arr.join('&');
  },
  // 生成指定区间范围的length个不重复随机数
  generateRandomNum (min,max,length){
    var arr = [],
        obj = {};

    while (arr.length < length){
        var ranNum = Math.floor(Math.random()*max + min);

        if(!obj[ranNum]){
            obj[ranNum] = true;
            arr.push(ranNum);
        }
    }
    return arr;
};
  /* 文字输入框字数限制
     * @ str : 需要检测的字符串
     * @ num限制的字数(一个测字按2个字符计算)
     * @ gt 条件是否大于限制字数
     * */
  fnWordsVerify (str, num, gt) {
    var words = str.replace(/[\s\n\r]/g, '');
    var wordsCount = Math.ceil(this.fnCnLength(words) / 2);
    var flag = true;
    if (gt && wordsCount < num) {
      // 不能小于num个汉字
      flag = false;
    } else if (!gt && wordsCount > num) {
      // 不能大于num个汉字
      flag = false;
    }
    return flag;
  },

  // 动态添加script文件
  loadScript (url,cb) {
    var script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0];
    script.async = true ;
    var loaded = false ;
    script.onload = script.onreadystatechange = function () {
        if (!loaded && (!script.readyState || "loaded" === script.readyState || "complete" === script.readyState)) {
            loaded = true;
            setTimeout(function () {
                if(cb && typeof cb == 'function') cb();
            }, 0);
        }
    };
    script.src = url ;
    head.appendChild(script);
  },

  // 封闭jsonp跨域请求方法
  jsonp (params) {
    params = Object.assign({
      data: {},
      cache: false,
      jsonp: 'jsoncallback',
      timeout: 1000
    }, params);
    var callbackName = 'response';
    var head = document.getElementsByTagName('head')[0];

    // 设置传递给后台的回调参数名
    params.data.format = 'jsonp';
    params.data[params.jsonp] = callbackName;

    var data = this.fnFormatParams(params.data);
    if (!params.cache) {
      data = data + '&v=' + this.fnGetRandom(10000, 500);
    };

    var script = document.createElement('script');
    head.appendChild(script);

    // 创建jsonp回调函数
    window[callbackName] = function (json) {
      head.removeChild(script);
      clearTimeout(script.timer);
      window[callbackName] = null;
      params.success && params.success(json);
    };

    // 发送请求
    script.src = params.url + '&' + data;
    // 为了得知此次请求是否成功，设置超时处理
    if (params.timeout) {
      script.timer = setTimeout(function () {
        window[callbackName] = null;
        head.removeChild(script);
        params.error && params.error({
          message: '超时'
        });
      }, params.timeout);
    }
  },
  /* 悬浮弹层动态定位
  * @param el 鼠标悬浮对象
  * @param target 需要设置动态定位的弹层
  * @param offset 弹层距离悬浮对象的偏移量
  * */
  showHoverLayer (el, target, offset) {
    // 偏移量, 默认值为0
    let ofs = offset || 0;
    // 获取触发悬浮元素距离窗口左边距离
    let eLeft = el.offsetLeft;
    // 获取触发悬浮元素自身高度
    let eHeight = el.offsetHeight;
    // 获取悬浮弹层高度
    let targetHeight = target.offsetHeight;
    // 获取元素距离窗口顶部距离
    let eTop = el.offsetTop;
    // 获取窗口可视高度
    let windowHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
    // 获取页面被卷走的高度
    let eScrollTop = document.body.scrollTop;
    // 获取触发悬浮元素距离窗口底部距离
    let bottom = windowHeight + eScrollTop - eTop;
    // 设置悬浮弹层的左偏移量
    target.style.left = eLeft + 'px';
    // 设置悬浮弹层的上偏移量，如果触发悬浮元素距离窗口底部的高度大于悬浮弹窗的高度，悬浮弹窗显示在触发悬浮元素， 反之则在上方
    if (bottom >= targetHeight) {
      target.style.top = eTop + eHeight + ofs + 'px';
    } else {
      target.style.top = eTop - targetHeight - ofs + 'px';
    }
  }
};
