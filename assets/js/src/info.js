(function () {
  var memberBox = document.querySelector('.member'),
    photoBox = document.querySelector('.photo-box'),
    infoBox = document.querySelector('.info-box');

  var MEMBER = null;

  /**
   * 获取所有成员信息
   * 
   */
  function getMember () {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'data/member.json', true);
    xhr.onreadystatechange = function () {
      var status = xhr.status;

      if(xhr.readyState === 4) {
        if((status >= 200 && status < 300) || status === 304) {
          MEMBER = JSON.parse(xhr.responseText);
          showPhoto(MEMBER);
        }
      }
    }
    xhr.send(null);
  }

  /**
   * 显示成员照片
   * 
   * @param {Object} data 
   */
  function showPhoto(data) {
    var strArr = [],
      when = null,
      members = null;

    for(var key in data) {
      when = data[key][0]['when'];
      members = data[key];
      
      strArr.push('<div class="m ' + when + '">');
      members.forEach(function (m, index) {
        strArr.push('<img src="assets/images/photo/'+ when +'/'+ m.photo +'" alt="'+ m.name +'" data-when="'+ m.when +'" data-index="'+ index +'">');
      });
      strArr.push('</div>');
    }

    photoBox.innerHTML = strArr.join('');
  }

  /**
   * 显示成员具体信息
   * 
   * @param {Object} m 
   * @param {Number} tagIndex 目标成员的序号
   */
  function showInfo (m, tagIndex) {
    var strArr = [],
      when = m.when;

    strArr.push('<div class="close" id="close"></div>');
    strArr.push('<div class="content">');
    strArr.push('<img src="assets/images/photo/'+ when +'/'+ m.photo +'" alt="'+ m.name +'" data-when="'+ when +'">');
    strArr.push('<div class="info">');
    strArr.push('<h1>'+ m.name +' - '+ m.major +'</h1>');
    strArr.push('<p class="contact">');

    // 循环所有社交方式
    if(m.contact) {
      for(var key in m.contact) {
        strArr.push('<a href="'+ m.contact[key] +'"><i class="iconfont icon-'+ key +'"></i></a>');
      }
    }

    strArr.push('</p>');
    strArr.push('<p>'+ m.info +'</p>');
    strArr.push('</div></div>');

    strArr.push('<div class="footer">');
    strArr.push('<span>'+ when.slice(1) +'</span>');

    // 循环本届所有成员
    MEMBER[when].forEach(function (m, index) {
      if(index == tagIndex) {
        strArr.push('<img src="assets/images/photo/'+ when +'/'+ m.photo +'" alt="'+ m.name +'" data-when="'+ m.when +'" data-index="'+ index +'" class="current">');
      } else {
        strArr.push('<img src="assets/images/photo/'+ when +'/'+ m.photo +'" alt="'+ m.name +'" data-when="'+ m.when +'" data-index="'+ index +'">');
      }
    });

    strArr.push('</div>');

    infoBox.innerHTML = strArr.join('');
  }


  /**
   * 点击事件处理
   * 
   * @param {Object} e 
   */
  function clickHandler (e) {
    var timer = null,
      target = e.target,
      tagWhen = target.getAttribute('data-when'),
      tagIndex = target.getAttribute('data-index');

    // 成员信息展示
    if(tagIndex && target.className !== 'current') {
      showInfo(MEMBER[tagWhen][tagIndex], tagIndex);
      timer = setTimeout(function () {
        infoBox.className = 'info-box show';
        clearTimeout(timer);
      }, 0);
    }

    // 关闭成员信息展示
    if(target.id === 'close') {
      infoBox.className = 'info-box hide';
      timer = setTimeout(function () {
        infoBox.className = 'info-box';
        clearTimeout(timer);
      }, 300);
    }
  }

  getMember();

  // 委托处理
  memberBox.addEventListener('click', clickHandler, false);
}());