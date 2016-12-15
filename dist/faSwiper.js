;(function ($,w){
    /**
     * 动态轮播图(至少三个item)
     * @param obj {
     *      [time:时间(默认)],
     *      [speed:鼠标弹起后item到达目标位置的速度（默认ease-in）],
     *      [direction:item的排列方向(默认row横向,可以是column,column-reverse,row-reverse)],
     *      [precentage:滑动多少之后进入下一个item,值为0~1之间的浮点数或分数（默认1/3）],
     *      [callback:回调函数(默认返回'',当返回空值的时候不会动态添加item,
     *      当返回其他值的时候该值为动态添加item的内容，一般配合ajax使用
     *      ,callback有一个参数，是此时刻的item的总数)]
     * }
     * @constructor
     */
    function FaSwiper(obj) {
        obj = obj || {};

        //获取dom
        this.domObj = {};
        this.domObj.itemContainer = $('.item_container');
        this.domObj.itemBox = $('.item_box');
        this.domObj.item = $('.item');

        //初始化
        this.initialize = {};
        this.initialize.startX = 0;
        this.initialize.startY = 0;
        this.initialize.moveX = 0;
        this.initialize.moveY = 0;
        this.initialize.distanceX = 0;
        this.initialize.distanceY = 0;
        this.initialize.translateX = 0;
        this.initialize.translateY = 0;
        this.initialize.nextSibling = false;
        this.initialize.prevSibling = false;
        this.initialize.nextDableSibling = false;
        this.initialize.prevDableSibling = false;
        this.initialize.time = obj.time ? obj.time : 500;
        this.initialize.speed = obj.speed ? obj.speed : 'easein';
        this.initialize.direction = obj.direction ? obj.direction : 'row';
        this.initialize.percentage = obj.percentage ? obj.percentage : 1 / 3;
        this.initialize.callback = obj.callback || function () {return ''};
        this.initialize.containerX = this.domObj.itemContainer.offset().left;
        this.initialize.containerY = this.domObj.itemContainer.offset().top;
        this.initialize.itemLength = this.domObj.itemBox.children().length;
        this.initialize.containerW = this.domObj.itemContainer.width();
        this.initialize.containerH = this.domObj.itemContainer.height();
        //变量对象
        this.varObj = {};
        //回调函数

        //样式
        this.domObj.itemContainer.css({
            'overflow': 'hidden'
        });
        this.domObj.itemBox.css({
            'display': 'flex'

        });
        this.domObj.item.css({
            'width': this.initialize.containerW, 'height': this.initialize.containerH
        });
        //横向滑动
        if (this.initialize.direction == 'row' || this.initialize.direction == 'row-reverse') {
            this.initialize.slipDirection = true;
            this.domObj.itemBox.css({
                'width': this.initialize.containerW * this.initialize.itemLength + 'px',
                'height': this.initialize.containerH + 'px',
                'transform': 'translate(-' + this.initialize.containerW + 'px,0px)',
                'flex-direction': this.initialize.direction

            });
        }
        //竖向滑动
        if (this.initialize.direction == 'column' || this.initialize.direction == 'column-reverse') {
            this.initialize.slipDirection = false;
            this.domObj.itemBox.css({
                'width': this.initialize.containerW + 'px',
                'height': this.initialize.containerH * this.initialize.itemLength + 'px',
                'transform': 'translate(0px,-' + this.initialize.containerH + 'px)',
                'flex-direction': this.initialize.direction

            });
        }

    }
    FaSwiper.prototype = {
        'constructor': FaSwiper,
        init: function () {
            var _this = this;
            _this.domObj.itemBox.on('touchstart', '.item', function (e) {
                _this.touchstartInit(e, this)
            });
            _this.domObj.itemBox.on('touchmove', '.item', function (e) {
                _this.touchmoveInit(e)
            });
            _this.domObj.itemBox.on('touchend', '.item', function () {
                _this.touchendInit()
            });
        },
        touchstartInit: function (e, t) {
            var _this = this;
            if ($(t).next().length == 1 ) {
                _this.initialize.nextSibling = true;
            }
            if($(t).prev().length == 1){
                _this.initialize.prevSibling = true;
            }
            if ($(t).next().next().length == 1 ) {
                _this.initialize.nextDableSibling = true;
            }
            if($(t).prev().prev().length == 1){
                _this.initialize.prevDableSibling = true;
            }
            _this.initialize.itemLength = _this.domObj.itemBox.children().length;
            _this.initialize.startX = e.changedTouches[0].clientX - _this.initialize.containerX;
            _this.initialize.startY = e.changedTouches[0].clientY - _this.initialize.containerY;
            _this.initialize.translateX = parseInt(_this.domObj.itemBox.css('transform').match(/[-]?\d+/)[0]);
            _this.initialize.translateY = parseInt(_this.domObj.itemBox.css('transform').match(/[,][\s]*([-]?\d+)/)[1]);
        },
        touchmoveInit: function (e) {
            var _this = this;

            _this.initialize.moveX = e.changedTouches[0].clientX - _this.initialize.containerX;
            _this.initialize.moveY = e.changedTouches[0].clientY - _this.initialize.containerY;
            _this.initialize.moveX = _this.initialize.moveX < 0 ? 0 : _this.initialize.moveX;
            _this.initialize.moveY = _this.initialize.moveY < 0 ? 0 : _this.initialize.moveY;
            _this.initialize.moveX = _this.initialize.moveX > _this.initialize.containerW ? _this.initialize.containerW : _this.initialize.moveX;
            _this.initialize.moveY = _this.initialize.moveY > _this.initialize.containerH ? _this.initialize.containerH : _this.initialize.moveY;
            _this.initialize.distanceX = _this.initialize.translateX + _this.initialize.moveX - _this.initialize.startX;
            _this.initialize.distanceY = _this.initialize.translateY + _this.initialize.moveY - _this.initialize.startY;

            if (_this.initialize.slipDirection) {
                _this.domObj.itemBox.css({
                    transform: 'translate(' + _this.initialize.distanceX + 'px,0px)'
                });
            } else {
                _this.domObj.itemBox.css({
                    transform: 'translate(0px,' + _this.initialize.distanceY + 'px)'
                });
            }
        },
        touchendInit: function () {
            var _this = this;
            if (_this.initialize.slipDirection) {
                if (_this.initialize.moveX - _this.initialize.startX > 0) {
                    _this.rightMove()

                } else {
                    _this.leftMove()
                }
            } else {
                if (_this.initialize.moveY - _this.initialize.startY > 0) {
                    _this.bottomMove()

                } else {
                    _this.topMove()
                }
            }

            //初始化
            _this.initialize.nextSibling = false;
            _this.initialize.prevSibling = false;
            _this.initialize.nextDableSibling = false;
            _this.initialize.prevDableSibling = false;
            _this.initialize.startX = 0;
            _this.initialize.moveX = 0;
            _this.initialize.distanceX = 0;
            _this.initialize.translateY = 0;
            _this.initialize.startY = 0;
            _this.initialize.moveY = 0;
            _this.initialize.distanceY = 0;
            _this.initialize.translateY = 0;
        },
        //右滑动
        rightMove: function () {
            var _this = this;
            if (_this.initialize.moveX - _this.initialize.startX > _this.initialize.containerW * _this.initialize.percentage && _this.initialize.prevSibling) {
                _this.varObj.newTranslateX = parseInt(_this.initialize.translateX + _this.initialize.containerW);
                _this.varObj.newPosition = _this.varObj.newTranslateX - _this.initialize.containerW;
                _this.varObj.domPosition = 'prepend';
                _this.varObj.transLateAnV = 'translate(' + _this.varObj.newTranslateX + 'px,0px)';
                _this.varObj.transLateEnV = 'translate(' + _this.varObj.newPosition + 'px,0px)';
                _this.varObj.prevDSibling=_this.initialize.prevDableSibling;
                _this.addDom(_this.varObj.domPosition, _this.varObj.transLateAnV, _this.varObj.transLateEnV,_this.varObj.prevDSibling);
            } else {
                _this.domObj.itemBox.animate({
                    transform: 'translate(' + _this.initialize.translateX + 'px,0px)'
                }, _this.initialize.time, _this.initialize.speed)
            }
        },
        //左滑动
        leftMove: function () {
            var _this = this;
            if (_this.initialize.startX - _this.initialize.moveX > _this.initialize.containerW * _this.initialize.percentage && _this.initialize.nextSibling) {
                _this.varObj.newTranslateX = parseInt(_this.initialize.translateX - _this.initialize.containerW);
                _this.varObj.newPosition = _this.varObj.newTranslateX;
                _this.varObj.domPosition = 'append';
                _this.varObj.transLateAnV = 'translate(' + _this.varObj.newTranslateX + 'px,0px)';
                _this.varObj.transLateEnV = 'translate(' + _this.varObj.newPosition + 'px,0px)';
                _this.varObj.nextDSibling=_this.initialize.nextDableSibling;
                _this.addDom(_this.varObj.domPosition, _this.varObj.transLateAnV, _this.varObj.transLateEnV,_this.varObj.nextDSibling);
            } else {
                _this.domObj.itemBox.animate({
                    transform: 'translate(' + _this.initialize.translateX + 'px,0px)'
                }, _this.initialize.time, _this.initialize.speed)
            }
        },
        //上滑动
        topMove: function () {
            var _this = this;
            if (_this.initialize.startY - _this.initialize.moveY > _this.initialize.containerH * _this.initialize.percentage && _this.initialize.nextSibling) {
                _this.varObj.newTranslateY = parseInt(_this.initialize.translateY - _this.initialize.containerH);
                _this.varObj.newPosition = _this.varObj.newTranslateY;
                _this.varObj.domPosition = 'append';
                _this.varObj.transLateAnV = 'translate(0px,' + _this.varObj.newTranslateY + 'px)';
                _this.varObj.transLateEnV = 'translate(0px,' + _this.varObj.newPosition + 'px)';
                _this.varObj.nextDSibling=_this.initialize.nextDableSibling;
                _this.addDom(_this.varObj.domPosition, _this.varObj.transLateAnV, _this.varObj.transLateEnV,_this.varObj.nextDSibling);

            } else {
                _this.domObj.itemBox.animate({
                    transform: 'translate(0px,' + _this.initialize.translateY + 'px)'
                }, _this.initialize.time, _this.initialize.speed)
            }
        },
        //下滑动
        bottomMove: function () {
            var _this = this;
            if (_this.initialize.moveY - _this.initialize.startY > _this.initialize.containerH * _this.initialize.percentage && _this.initialize.prevSibling) {
                _this.varObj.newTranslateY = parseInt(_this.initialize.translateY + _this.initialize.containerH);
                _this.varObj.newPosition = _this.varObj.newTranslateY - _this.initialize.containerH;
                _this.varObj.domPosition = 'prepend';
                _this.varObj.transLateAnV = 'translate(0px,' + _this.varObj.newTranslateY + 'px)';
                _this.varObj.transLateEnV = 'translate(0px,' + _this.varObj.newPosition + 'px)';
                _this.varObj.prevDSibling=_this.initialize.prevDableSibling;
                _this.addDom(_this.varObj.domPosition, _this.varObj.transLateAnV, _this.varObj.transLateEnV,_this.varObj.prevDSibling);
            } else {
                _this.domObj.itemBox.animate({
                    transform: 'translate(0px,' + _this.initialize.translateY + 'px)'
                }, _this.initialize.time, _this.initialize.speed)
            }
        },
        //添加item
        addDom: function (domPositon, transLateV, transLateEnV,sibling) {
            var _this = this;
            var content='';
            if(!sibling){
                content = _this.initialize.callback(_this.initialize.itemLength+1);
            }
            _this.domObj.itemBox.animate({
                transform: transLateV
            }, _this.initialize.time, _this.initialize.speed, function () {
                if (content != '') {
                    if (domPositon == 'prepend') {
                        _this.domObj.itemBox.prepend('<div class="item">' + content + '</div>');
                    } else if (domPositon == 'append') {
                        _this.domObj.itemBox.append('<div class="item">' + content + '</div>');
                    }

                    _this.domObj.item = $('.item');
                    _this.initialize.itemLength += 1;
                    _this.domObj.item.css({
                        width: _this.initialize.containerW + 'px',
                        height: _this.initialize.containerH + 'px'
                    });
                    _this.domObj.itemBox.css({
                        width: _this.initialize.containerW * _this.initialize.itemLength + 'px',
                        height: _this.initialize.containerH * _this.initialize.itemLength + 'px',
                        transform: transLateEnV
                    })
                }

            })
        }
    };
    w.FaSwiper=FaSwiper;
})(Zepto,window);
