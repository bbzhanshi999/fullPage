/**
 * 功能：实现全屏滚动效果，并且可进行动画自动滚动
 * 1。鼠标滚动首页屏幕，页面自动跳转到下一个div
 * 2.自动计算div的大小以填满整个浏览器
 * 3. 带有css动画
 *
 */


/**
 * 参数对象：{
 *     el：String 渲染点
 *     duration:2s, 动画时长
 *     hasNav:true ,是否有导航条
 * }
 * @constructor
 */
function FullPage(config) {
    if (config && config instanceof Object) {
        this.config = _mixin({}, FullPage.prototype.config, config);
    } else {
        this.config = FullPage.prototype.config;
    }

    this.container = document.querySelector(this.config.el);
    this.sectionList = this.container.querySelectorAll(".section");
    this.index = 0;
    this.size = this.sectionList.length;
    this._render();

    //当窗口大小被重新调整后，启动重新渲染
    var that = this;
    window.onresize = function () {
        that._resize();
        //that._reLocation();
    };
}

/**
 * 对象混入
 * @private
 */
function _mixin() {
    var no, o1, o2;
    if (arguments.length === 3) {
        no = arguments[0];
        o1 = arguments[1];
        o2 = arguments[2];
        for (var key in o1) {
            no[key] = o1[key];
        }
        for (var key in o2) {
            no[key] = o2[key];
        }
        return no;
    } else {
        o1 = arguments[0];
        o2 = arguments[1];
        for (var key in o2) {
            o1[key] = o2[key];
        }
        return o1;
    }
}


FullPage.prototype.config = {
    el: ".fp",
    duration: 1,
    hasNav:true
};

/**
 * 渲染入口
 * @param config
 * @private
 */
FullPage.prototype._render = function () {

    this._initCss();
    this._resize();

    this._onWheel();
    if(this.config.hasNav){
        this._intNav();
    }
};

/**
 * 创建导航条
 * @private
 */
FullPage.prototype._intNav = function(){
    var navBox = document.createElement("div");
    this.container.appendChild(navBox);

    this._navBox = navBox;
    navBox.style.position = "fixed";
    navBox.style.right = "0px";
    navBox.style.width = "50px";
    navBox.style.height = window.innerHeight+"px";
    navBox.style.zIndex = "2";
    navBox.classList.add("fp-nav-box");
    navBox.style.margin = "0 auto";
    navBox.style.verticalAlign = "middle";


    var navList = document.createElement("ul");
    navList.classList.add("fp-nav-list");
    navList.style.margin = "0 auto";
    navList.style.padding = "0";
    navList.style.listStyleType = "none";
    navBox.appendChild(navList);
    var that = this;
    for(var i=0;i<this.size;i++){
        var navLi = document.createElement("li");
        navLi.style.width="10px";
        navLi.style.height="10px";
        navLi.style.textAlign = "center";
        navLi.style.margin = "5px auto";
        navLi.style.cursor = "pointer";
        navLi.classList.add("fp-nav-pointer");


        navList.appendChild(navLi);

        var pointer = document.createElement("span");
        pointer.style.display = "inline-block";
        pointer.style.width = "5px";
        pointer.style.height = "5px";
        pointer.style.backgroundColor = "white";
        navLi.appendChild(pointer);

        pointer.style.borderRadius = "100%";

        pointer.onmouseover = function () {
            this.style.width = "10px";
            this.style.height = "10px";
        };



        pointer.onmouseout = function () {
            //todo
            if(this.classList.filter(function (clazz) {
                return clazz==='fp-nav-pointer';
            }).size()>0){
                this.style.width = "5px";
                this.style.height = "5px";
            }
        };

        if(i===this.index){
            pointer.style.width = "10px";
            pointer.style.height = "10px";
            pointer.classList.add("fp-nav-active");
        }
    }

    navList.style.margin = ((window.innerHeight/2)-22*this.size)+"px auto";
};


/**
 * 初始化css样式,以获得全屏效果
 */
FullPage.prototype._initCss = function () {
    document.body.style.margin = "0";
    var that = this;
    this.sectionList.forEach(function (section, key) {
        section.style.position = 'absolute';
        //section.style.transition = "all "+that.config.duration+"s";
        if (key === 0) {
            section.style.zIndex = "1";
            section.style.opacity = "1";
        } else {
            section.style.zIndex = "0";
            section.style.opacity = "0";

        }
    });

};

/**
 * 对于内容的重定位
 * @private
 */
FullPage.prototype._reLocation = function () {
    var index = this.index;
    this.sectionList.forEach(function (section, key) {
        if (key === index) {
            section.style.top = "0px";
        } else {
            section.style.top = "0px";
        }
    })
};

/**
 * 设置窗口大小
 */
FullPage.prototype._resize = function () {
    document.body.style.overflow = "hidden";
    this.container.style.overflow = "hidden";
    this.container.style.width = window.innerWidth + "px";
    this.container.style.height = window.innerHeight + "px";
    this.sectionList.forEach(function (section) {
        section.style.width = window.innerWidth + "px";
        section.style.height = window.innerHeight + "px";
    });

    if(this._navBox){
        this._navBox.style.height = window.innerHeight+"px";
        this._navBox.querySelector("ul").style.margin = ((window.innerHeight/2)-22*this.size)+"px auto";
    }
};

/**
 * 滚轮触发事件
 * @private
 */
FullPage.prototype._onWheel = function () {
    var that = this, oldSection, currSection;
    var _wheelHandler = function (event) {
        if (event.deltaY > 0 && that.index < that.size - 1) {
            that.index += 1;
            oldSection = that.sectionList[that.index - 1];
            currSection = that.sectionList[that.index];

            oldSection.style.transition = "opacity "+that.config.duration+"s";
            oldSection.style.zIndex = "0";
            oldSection.style.opacity = "0";
            oldSection.style.top = "0px";

            currSection.style.transition = "all 0 ease 0";
            currSection.style.zIndex = "1";
            currSection.style.opacity = "1";
            currSection.style.top = window.innerHeight + "px";
            setTimeout(function () {
                currSection.style.transition = "all " + that.config.duration + "s";
                currSection.style.top = "0px";
            }, 1);


            that.container.onwheel = undefined;
            setTimeout(function () {
                that.container.onwheel = _wheelHandler;
                currSection.style.transition = "none";
            }, that.config.duration * 1000);
        } else if (event.deltaY < 0 && that.index > 0) {
            that.index -= 1;
            oldSection = that.sectionList[that.index + 1];
            currSection = that.sectionList[that.index];

            oldSection.style.transition = "opacity "+that.config.duration+"s";
            oldSection.style.zIndex = "0";
            oldSection.style.opacity = "0";
            oldSection.style.top = "0px";

            currSection.style.transition = "all 0 ease 0";
            currSection.style.zIndex = "1";
            currSection.style.opacity = "1";
            currSection.style.top = "-" + window.innerHeight + "px";
            setTimeout(function () {
                currSection.style.transition = "all " + that.config.duration + "s";
                currSection.style.top = "0px";
            }, 1);
            that.container.onwheel = undefined;
            setTimeout(function () {
                that.container.onwheel = _wheelHandler;
                currSection.style.transition = "none";
            }, that.config.duration * 1000);
        }
    };
    this.container.onwheel = _wheelHandler;


};
