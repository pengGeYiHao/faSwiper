# 介绍
* 这是一个基于zepto和zepto中fx插件的一个动态轮播图组件

##用法
* html
    * 最外层是一个className为item_container的盒子，里边是一个className为item_box 的盒子，最里边是className为item的盒子(item的的盒子最少3个)
* css
    * 只需要给 item_container 和 item 设置自己需要的样式即可
* js
    * 第一步引入相应的js文件
    * 第二步 实例FaSwiper，FaSwiper有一个可选的参数obj,obj的属性如下：
        * time:手指离开屏幕时item归位的时间(默认500毫秒)
        * speed:鼠标弹起后item到达目标位置的速度（默认ease-in
        * direction:item的排列方向(默认row横向,可以是column,column-reverse,row-reverse)
        * precentage:滑动多少之后进入下一个item,值为0~1之间的浮点数或分数（默认1/3）
        * callback:回调函数(默认返回'',当返回空值的时候不会动态添加item,当返回其他值的时候该值为动态添加item的html，一般配合ajax使用,callback有一个参数，是此时刻的item的总数)
    * 第三步 调用实例化函数的init方法

###相关事例请看example

## [git地址](https://github.com/pengGeYiHao/faSwiper)
