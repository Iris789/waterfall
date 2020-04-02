//立即执行函数形式防止污染全局变量
//请求的地址与图片链接应为同一服务器
//此处为请求地址与页面为同一服务器上，然后请求地址不涉及浏览器同源策略影响去请求另一服务器图片信息
//请求数据为cpage-第几页 每次应等于请求的ajax次数
//注意点：
    //1、img图片的懒加载时可能出现插入到页面时并不是本身的高度 是一点点加载出来的
    //但这是后面的图片是找最短的li插到其后的 此时可能出现错误 位置不准
    //-故直接加载的时候给img标签设置好原有的高度
    //2、ajax请求未完成时 不允许反复请求
    //-加锁
    //3、几列是几个li 然后每一列里对应插div 好找是哪一列最短
    //4、因无服务器及后台文件 故是用本地文件-自己创建了数组-里面存放了点图片对象信息
(function () {
    var oLis = document.getElementsByTagName('li');
    var loadDiv = document.getElementsByClassName('load')[0];
    var flag = false, num = 1, imgWidth = 200;
    getPics();
    function getPics() {
        if (!flag) {
            flag = true;
            loadDiv.style.display = 'block';
            ajaxFunc('GET', './src/js/data.txt', 'cpage=' + num, true, addDom);
            num++;
        }
    }
    function addDom(data) {
        loadDiv.style.display = 'none';
        var addArr = JSON.parse(data);
        addArr.forEach(function (ele,index) {
            var oDiv = document.createElement('div'),
                oImg = new Image(),
                oP = document.createElement('p');
            oDiv.className = 'item';
            oImg.src = ele.preview;
            oImg.height = ele.height * imgWidth / ele.width;
            oP.innerHTML = ele.title;
            oDiv.appendChild(oImg)
            oDiv.appendChild(oP);
            var currIndex = getMinLi(oLis);
            oLis[currIndex].appendChild(oDiv);//看哪个li最短插到哪个后面
        });
        flag = false;
    }
    addEvent(window, 'scroll', function (e) {
        var scrollDisY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
            clientDisY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        //页面滚动的距离+首屏高 > 最短li高时
        if (oLis[getMinLi(oLis)].offsetHeight < scrollDisY + clientDisY) {
            getPics();
        }
    })
    function getMinLi(dom) {
        var minHeight = dom[0].offsetHeight,
            minIndex = 0;
        for (var i = 0; i < dom.length; i++){
            var h = dom[i].offsetHeight;
            if (h < minHeight) {
                minHeight = h;
                minIndex = i;
            }
        }
        return minIndex;
    }
    function addEvent(ele,type,handle) {
        if (ele.addEventLinstener) {
            ele.addEventLinstener(type, handle, false);
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, function () {
                handle.call(ele);
            })
        } else {
            ele['on' + type] = handle;
        }
    }
}())