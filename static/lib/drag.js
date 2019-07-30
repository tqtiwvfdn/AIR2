/*===================================
 *-------------常量及方法-------------
 ====================================*/
//控件的基本配置
var G_PARAMS = {
    SIZE: {
        top: 0,
        left: 0,
        height: 1,
        width: 1,
        title: 2
    },
    MAX_Z_INDEX: 10000,
    MIN_Z_INDEX: 3,
    TOOLS: {
        //柱状图
        'bar': {
            tooltip: {
                show: true
            },
            legend: {
                data: ['销量'],
                x: 'left'
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    "name": "销量",
                    "type": "bar",
                    "data": []
                }
            ]
        },
        //折线图
        'line': {
            tooltip: {
                show: true
            },
            legend: {
                data: ['销量'],
                x: 'left'
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    "name": "销量",
                    "type": "line",
                    "data": []
                }
            ]
        },
        //饼图
        'pie': {
            tooltip: {
                show: true,
            },
            legend: {
                data: ['第1部分', '第2部分', '第3部分'],
                x: 'left'
            },
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                    {value: 335, name: '第1部分'},
                    {value: 679, name: '第2部分'},
                    {value: 1548, name: '第3部分'}
                ]
            }]
        },
        //散点图
        'scatterplot': {
            title: {
                text: '女性身高体重分布'
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                formatter: function (params) {
                    if (params.value.length > 1) {
                        return params.seriesName + ' :<br/>'
                            + params.value[0] + 'cm '
                            + params.value[1] + 'kg ';
                    }
                    else {
                        return params.seriesName + ' :<br/>'
                            + params.name + ' : '
                            + params.value + 'kg ';
                    }
                },
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            legend: {
                data: ['女性'],
                x: 'left'
            },
            toolbox: {
                show: true
            },
            xAxis: [
                {
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} cm'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} kg'
                    }
                }
            ],
            series: [
                {
                    name: '女性',
                    type: 'scatter',
                    data: [],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        }
    },
    TOOLS_DEFAULT_CONFIG: {
        //此处命名法则
        //私有属性 __
        //私有方法 _
        //公有方法 
        //init中，obj为echart对象，option使用缺省值时，填null,必须填url,timeout,不更新时timeout设为0,
        init: function (id, type, obj, option, timeout, setData, url) {
            this.__obj = obj;
            this.__option = option || $.extend(true, {}, G_PARAMS.TOOLS[type]);
            this.__option.title = this.__option.title || {};
            this.__option.title.x = 'right';
            this.__option.series = this.__option.series || [];
            this.__option.series[0] = this.__option.series[0] || {};
            this.__option.series[0].data = this.__option.series[0].data || [];

            if (this.__option.title.text) {
                $('#' + id).closest('.tool-container').find('.tool-banner-title').text(this.__option.title.text);
                delete this.__option.title.text;
            }

            this._setData = setData || this._setData;
            this.__url = url || this.__url.replace('temp', type);
            this.__timeout = timeout;

            this._setData();

            //如果设置了更新的轮询时间，设置动态更新数据
            if (timeout) {
                this._updateMethod();
            }
        },
        _setData: function () {
            var that = this;

            if(that.__option.series[0].data){
                that.__option.series[0].data.splice(0, that.__option.series[0].data.length);    
            }
            
            $.ajax({
                url: that.__url + '?t=' + Math.random(),
                success: function (data, status) {
                    that.__option.title.subtext = '最近更新时间：' + (new Date()).format('yyyy-MM-dd HH:mm:ss');
                    that.__option.series[0].data = data.dataset;
                    that.__obj.clear().setOption(that.__option).hideLoading();
                }
            });
        },
        setTimeout: function (timeout) {
            window.clearInterval(this.__setInterval);
            this.__timeout = timeout;
            this._updateMethod();
        },
        _updateMethod: function () {
            this.__setInterval = window.setInterval(function (context, method) {
                return function () {
                    method.call(context);
                }
            }(this, this._setData), Math.abs(this.__timeout));
        },
        __url: './GetToolsData_tempData.do'
    },
    TOOL_DEFAULT_UPDATE_TIMEOUT: 10000,
    TOOL_DISPOSE: function (id) {
        window.clearInterval(g_dynamicToolList[id].__setInterval);
        g_dynamicToolList[id].__obj.dispose();
        delete g_dynamicToolList[id];
    },
    SHOW_WATERMARK: true,
};
//扩展-格式化时间
Date.prototype.format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "H+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//扩展自定义方法
var Methods = {
    /*get/set cookie*/
    setCookie: function (name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = name + "=" + escape(value || '') +
            (expiredays ? '' : '; expires=' + exdate.toGMTString());
    },
    getCookie: function (name) {
        try {
            return unescape(document.cookie.match(new RegExp(name + '=([^;]+)'))[1]);
        } catch (ex) {
            return null;
        }
    },
    //清理内存定时器
    CollectGarbage: function () {
        if (window.CollectGarbage) {
            setInterval(CollectGarbage, 20000);
        }
    },
    //改变背景
    changeBg: function () {
        var img = new Image();
        var that = this;
        img.src = this.getCookie('bgPath') || $('#changeBgIcon').attr('src').replace('changeBgIcon.png', 'defaultBg.jpg');
        img.onload = function () {
            $('#bg').add('.mask').css('background-image', 'url(' + this.src + ')');
            that.setBgWatermark(this.src);
            img = null;
            $('body').fadeIn();
        }
    },
    //设置水印
    setBgWatermark: function (src) {
        if (G_PARAMS.SHOW_WATERMARK) {
            $('#watermark').children('[data-role="bgPath"]').html('背景图：<a target="_blank" href="' + src + '">' + src.match(/([^\\\/]+)$/i)[1] + '</a>');
        }
    },
    //设置控件容器标题
    setTitle: function ($elem, title) {
        $elem.attr('title', title);
    },
    //添加侧边栏元素的标题
    addToolTitle: function () {
        $('.tool').each(function (index, elem) {
            this.title = $(elem).children('.tool-title').text();
        })
    },
    //侧边栏隐藏或显示
    toggleAside: function (type) {
        switch (type) {
            case 'show':
                $('#aside,#asideBtn').addClass('out');
                break;
            case 'hide':
                $('#aside,#asideBtn').removeClass('out');
                break;
            default:
                $('#aside,#asideBtn').toggleClass('out');
        }
    },
    //初始化动态控件
    initDynamicTool: function (type, chineseTitle, pointer, zIndex, option, timeout, setData, url, containerCSS, contentCss) {
        var $contentTemp = $('#toolTemp'.replace('tool', type));
        var id = type + (zIndex || g_zIndex), contentID = id + 'Content';

        //替换ID、设置z-index、替换标题、替换控件内容
        var html = $('#toolTemp').html()
            .replace('{toolTempContainerID}', id)
            .replace(/\{toolBannerTitle\}/g, chineseTitle)
            .replace('{toolTempContent}',
            $contentTemp.length ?
                $contentTemp.html() :
            '<div id="' + contentID + '" style="height:' + (contentCss && contentCss.height || '300px;width:400px') + '"></div>');

        $('#article').append(html);

        var $elem = $('#' + id),
            $content = $('#' + contentID, $elem);

        if (pointer) {
            $elem.css({
                top: Math.abs(pointer.y - $elem.height() / 2),
                left: Math.abs(pointer.x - $elem.width() / 3 * 2),
                right: '',
                'z-index': g_zIndex
            });
        } else if (containerCSS) {
            $elem.css({
                top: containerCSS.top,
                left: containerCSS.left,
                right: '',
                'z-index': zIndex,
                width: containerCSS.width,
                heigth: containerCSS.height
            });
        } else {
            $elem.css({
                top: $elem.offset().top,
                left: $elem.offset().left,
                right: '',
                'z-index': zIndex || g_zIndex
            });
        }

        //初始化控件对象
        if (!$contentTemp.length) {
            if (containerCSS) {
                $content.width($elem.width() - parseInt($content.parent().css('padding-left')) * 2);
            }
            //复制、克隆默认配置
            g_dynamicToolList[id] = $.extend(true, {}, G_PARAMS.TOOLS_DEFAULT_CONFIG);
            //初始化对象
            g_dynamicToolList[id].init(
                id,
                type,
                echarts.init(document.getElementById(contentID), 'macarons'),
                option,
                timeout || G_PARAMS.TOOL_DEFAULT_UPDATE_TIMEOUT,//如果不更新，timeout值设为0
                setData,
                url);
            if (!containerCSS) {
                $elem.width($content.width() + parseInt($content.parent().css('padding-left')) * 2);
            }
        }
        g_zIndex++;
    },
    //改变控件container位置、大小或重命名控件标题
    resizeToolContainer: function ($container, param, value, event) {
        //$container，目标容器
        //$content，目标容器内置控件
        //param:top,left,width,height
        //value目标值
        //如果由input框输入的话，event为input的change事件
        switch (G_PARAMS.SIZE[param]) {
            case 0://设置top、left
                if (0 <= value) {
                    $container.css(param, value + 'px');
                    $container.parent()['scroll' + param[0].toUpperCase() + param.substr(1)](value);
                } else {
                    event && this.undoInputerChange(event);
                }
                break;
            case 1://设置width、height
                if (parseInt($container.css('min-' + param)) < value) {
                    $container.css(param, value);
                    if (param === 'height') {
                        $content = $container.children('.tool-content');
                        $content.css('height', value - parseInt($content.css('padding-top')));
                    }
                    this.resizeDynamicTool($container);
                } else {
                    event && this.undoInputerChange(event);
                }
                break;
            case 2://设置标题
                //限制长度为20
                $container.find('[data-role=title]').text(value.substr(0, 20));
                this.setTitle($container.children('.tool-banner'), value.substr(0, 20));
                break;
        }
    },
    //改变控件content大小
    //@$container 控件容器
    resizeDynamicTool: function ($container) {
        var id = $container[0].id + 'Content',
            $elem = $('#' + id, $container),
            tool = g_dynamicToolList[$container[0].id];
        if (tool) {
            //重新设置父容器的大小
            $elem.height($elem.parent().height());
            $elem.width($elem.parent().width());
            //销毁重建
            tool.__obj.dispose();
            tool.__obj = echarts.init($elem[0], 'macarons');
            tool.__obj.clear().setOption(tool.__option);
            tool = null;
        }
    },
    //撤销不符格式的更改，并阻住原事件的发生
    //@e Event
    undoInputerChange: function (e) {
        e.preventDefault();
        e.stopPropagation();
        document.execCommand('undo', false, 0);
    },
    //函数字符串化
    //@obj Object
    functionStringifty: function (obj) {
        if (obj !== undefined && typeof (obj) === "object") {
            var newObj = (obj instanceof Array) ? [] : {};

            for (var name in obj) {
                if (obj[name] instanceof Function) {
                    newObj[name] = obj[name].toString().replace(/[\n\r\t]/g, '').replace(/(\s)+/g, ' ').replace(/\+/g, '##plus##');
                } else {
                    newObj[name] = this.functionStringifty(obj[name]);
                }
            }
            return newObj;
        } else {
            return obj;
        }
    },
    //字符串函数化
    //@obj String
    stringFunctional: function (obj) {
        for (var name in obj) {
            if (typeof (obj[name]) === 'string' && obj[name].indexOf('function') === 0) {
                obj[name] = eval('(' + obj[name].replace(/##plus##/g, '+') + ')');
            } else if (typeof (obj[name]) === 'object') {
                obj[name] = this.stringFunctional(obj[name]);
            }
        }
        return obj;
    },
    //ajax 配置的方法
    //type 修改的方法包括 CRUD create、retrieve、update、delete
    //data 数据的{key:value}JS对象
    //success 可选 ajax成功返回的函数
    //error 可选ajax失败处理函数
    configHandler: function (type, data, success, error) {
        var that = this;
        $.ajax({
            url: './ConfigMgrAction_' + type + 'Config.do',
            type: 'post',
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            //函数字符串化→对象字符串化→使用jQuery的params转化非法字符，防止无法上传
            data: $.param(data),
            success: function (data, status) {
                if (status === 'success') {
                    success(data, status);

                    var $fileList = $('#fileList');
                    switch (type) {
                        case 'create':
                            $fileList
                                .prepend(that.configTempReplace($('#fileListTemp').children(':first')[0].outerHTML, data.name))
                                .children('[data-role=noRecord]').remove();
                            break;
                        case 'retrieve':
                            if ($fileList.children().length === 0) {
                                $fileList.append($('#fileListTemp').children(':last')[0].outerHTML);
                            }
                            break;
                        case 'delete':
                            setTimeout(function () {
                                if ($fileList.children().length === 0) {
                                    $fileList.append($('#fileListTemp').children(':last')[0].outerHTML);
                                }
                            }, 500);
                            break;
                    }
                } else {
                    console.log(type + '失败！');
                }
            },
            error: error || function (error, data, status) {
                console.log('保存失败，服务器错误！');
                console.log(error, data, status);
            }
        });
    },
    //获取配置文件列表
    retrieveConfigs: function () {
        var that = this;
        this.configHandler('retrieve', {}, function (data, success) {
            var configFileList = data.configFileList,
                i = configFileList && configFileList.length,
                $fileListTemp = $('#fileListTemp'),
                htmlTemp,
                html = '';
            if (i) {
                htmlTemp = $fileListTemp.children(':first')[0].outerHTML;
                for (; (--i) >= 0;) {
                    html += that.configTempReplace(htmlTemp, configFileList[i]);
                }
            }
            $('#fileList').append(html);
        });
    },
    //配置文件temp替换
    //@temp String 需要替换的html模板
    //@config String 配置的完整文件名 日期-名称.json
    //@partOf String 需要获取的部分元素
    configTempReplace: function (temp, config, partOf) {
        if (partOf === 'title') {
            return config.replace(/^\d+-(.*).json$/, '$1');
        } else {
            return (temp
                .replace(/\{href\}/g, config)
                .replace(/\{title\}/g, config.replace(/^\d+-(.*).json$/, '$1'))
                .replace(/\{time\}/g, config.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2}).*$/, '$1/$2/$3 $4:$5:$6')));
        }
    },
    //加载配置
    loadConfig: function () {
        var regex = /loadConfig=([^&$]+)/;
        
        if (location.search && location.search.match(regex)) {
            configName = location.search.match(regex)[1];

            document.location.href = location.pathname;

        }
    }
};
/*===================================
 *------------自动定义变量------------
 ====================================*/
//动态控件列表
//以容器container的ID为索引，保存控件工具的基本信息
var g_dynamicToolList = {};
//初始化z-index
var g_zIndex = G_PARAMS.MIN_Z_INDEX;
//移动控件对象
var $g_moveObj = null, g_pointer = null;
//改变控件大小
var $g_resizeObj = null;
//触屏时，模拟拖放的对象
var $g_touchToolIcon = null, g_touchToolIconSize = null;
/*===================================
 *---------------主程序---------------
 ====================================*/
var App = {
    //初始化，程序入口
    init: function () {
        //加载配置文件
        Methods.loadConfig();

        //加载配置文件列表
        Methods.retrieveConfigs();

        //更换背景
        Methods.changeBg();

        //添加标题
        Methods.addToolTitle();

        //监听
        this.listen();

        //清理内存
        Methods.CollectGarbage();
    },
    //监听
    listen: function () {
        /*
         *全局监听
         */
        //移动控件和改变控件大小的监听
        var e_article = document.getElementById('article');
        var bindMoveUpHandler = function (type) {
                if (type === 'touchstart') {
                    window.addEventListener('touchmove', moveHandler, false);
                    window.addEventListener('touchend', upHandler, false);
                } else {
                    window.addEventListener('mousemove', moveHandler, false);
                    window.addEventListener('mouseup', upHandler, false);
                }
            },
            toggleBindMoveHandler = function (type) {
                if (type=== 'touchmove') {
                    //console.log('remove');
                    //window.removeEventListener('touchmove', moveHandler, false);
                    //setTimeout(function () {
                    //    console.log('bind');
                    //    window.addEventListener('touchmove', moveHandler, false);
                    //}, 40);
                    console.log('toggle');
                } else {
                    window.removeEventListener('mousemove', moveHandler, false);
                    setTimeout(function () {
                        window.addEventListener('mousemove', moveHandler, false);
                    }, 30);
                }

            },
            unbindMoveUpHandler = function (type) {
                if (type === 'touchend') {
                    window.removeEventListener('touchmove', moveHandler, false);
                    window.removeEventListener('touchend', upHandler, false);
                } else {
                    window.removeEventListener('mousemove', moveHandler, false);
                    window.removeEventListener('mouseup', upHandler, false);
                }
            };

        var downHandler = function (e) {
                var target = e.target || event.srcElement;
                e = event.touches && event.touches[0] || event;
                if (target.className.indexOf('tool-banner') >= 0) {
                    $g_moveObj = $(target).closest('.tool-container');
                    g_pointer = {
                        top: e.clientY - parseInt($g_moveObj.css('top')),
                        //注意此处的left与下面改变大小的left取值保持一致
                        left: e.clientX - parseInt($g_moveObj.css('left'))
                    };
                    bindMoveUpHandler(event.type);
                } else if (target.className.indexOf('resize-') >= 0) {
                    $g_resizeObj = $(target).closest('.tool-container');
                    g_pointer = {
                        target: target.className.match(/resize-(\w+)/)[1],
                        width: e.clientX - $g_resizeObj.width(),
                        height: e.clientY - $g_resizeObj.height(),
                        //注意此处的left与移动的left取值保持一致
                        left: e.clientX - parseInt($g_resizeObj.css('left')),
                        leftWidth: $g_resizeObj.width() + e.clientX
                    }
                    bindMoveUpHandler(event.type);
                }
            },
            moveHandler = function (e) {
                if ($g_moveObj) {
                    e.preventDefault();
                    e = event.touches && event.touches[0] || event;
                    $g_moveObj.css({
                        'left': (e.clientX - g_pointer.left) > 0 ? (e.clientX - g_pointer.left) : 0,
                        'top': (e.clientY - g_pointer.top) > 0 ? (e.clientY - g_pointer.top) : 0
                    });

                    toggleBindMoveHandler(event.type);
                } else if ($g_resizeObj) {
                    e = event.touches && event.touches[0] || event;
                    switch (g_pointer.target) {
                        case 'left':
                            $g_resizeObj.css({
                                'left': (e.clientX - g_pointer.left) > 0 ? (e.clientX - g_pointer.left) : 0,
                                'width': g_pointer.leftWidth - e.clientX,
                            });
                            g_dynamicToolList[$g_resizeObj[0].id].__obj.resize(e);
                            break;
                        case 'right':
                            $g_resizeObj.css({
                                'width': e.clientX - g_pointer.width,
                            });
                            break;
                        case 'bottom':
                            $g_resizeObj.css({
                                'height': e.clientY - g_pointer.height
                            });
                            var $toolContent = $g_resizeObj.children('.tool-content');
                            $toolContent.css(
                                'height', Math.ceil($g_resizeObj.height() - parseInt($toolContent.css('padding-top')))
                            );
                            break;
                    }

                    toggleBindMoveHandler(event.type);
                }
            },
            upHandler = function (e) {
                if ($g_moveObj) {
                    $g_moveObj = null;
                    g_pointer = null;
                } else if ($g_resizeObj) {
                    Methods.resizeDynamicTool($g_resizeObj);
                    $g_resizeObj = null;
                    g_pointer = null;
                }
                unbindMoveUpHandler(event.type);
            };

        //移动控件-移动版
        e_article.addEventListener('touchstart', downHandler, false);
        e_article.addEventListener('mousedown', downHandler, false);


        //其他全局监听事件
        $(window).on({
            //隐藏未隐藏的菜单,移动控件时发生
            'touchstart': function (e) {
                e = e.target || event.srcElement;
                var $menu = $(e).closest('.menu-option');
                $('.menu-option', '#article').not($menu).hide();
            },
            'mousedown': function (e) {
                e = e.target || event.srcElement;
                //监听主面板的菜单点击事件
                if (e.className.indexOf('hamburger-') >= 0 && $(e).closest('.tool-container').length) {
                    var $container = $(e).closest('.tool-container'),
                        $menu = $(e).closest('.tool-container').children('.menu-option');
                    //隐藏其他的
                    $('.menu-option', '#article').not($menu).hide();
                    //显示菜单栏
                    $menu.css('display') === 'none' ? $menu.fadeIn(100) : $menu.fadeOut(100);
                    //显示里面的参数
                    $('[data-id=toolContainerTitle]', $menu).val($('[data-role=title]', $container).text());
                    $('[data-id=toolContainerHeight]', $menu).val(Math.round($container.height()));
                    $('[data-id=toolContainerWidth]', $menu).val(Math.round($container.width()));
                    $('[data-id=toolContainerTop]', $menu).val(parseInt($container.css('top')));
                    $('[data-id=toolContainerLeft]', $menu).val(parseInt($container.css('left')));
                } else if (!$(e).closest('.menu-option').length) {
                    //隐藏菜单栏
                    $('.menu-option', '#article').hide();
                }
            }
        });

        /*
         * 背景
         */
        //监听更换背景
        $('#changeBgIcon').click(function () {
            var $this = $(this),
                r = Math.round(Math.random() * 2000 + 1),
                img = new Image();

            $this.addClass('turn-around');

            img.src = 'http://img.infinitynewtab.com/wallpaper/{num}.jpg'.replace('{num}', r)
            img.onload = function () {
                $('#bg').css('background-image', 'url(' + this.src + ')');
                Methods.setCookie('bgPath', this.src, 1000);
                $this.removeClass('turn-around');
                Methods.setBgWatermark(this.src);
                $this = null;
                img = null;
            }
        });

        /*
         *侧边栏部分
         */
        //显示隐藏侧边栏
        $('#asideBtn').click(function () {
            Methods.toggleAside('toggle');
        });
        //切换工作区
        $('.aside-title', '#aside').click(function (e) {
            var elem = e.target || event.srcElement;
            if (elem.tagName === 'SPAN' && elem.className.indexOf('active') < 0) {
                $('.aside-content', '#aside').add('span', this).toggleClass('active');
            }
        });
        //点击菜单栏，滚动工具栏
        $('.menu-list').click(function (e) {
            e = e.target || window.event.srcElement;
            var $target = $('[data-role=' + e.dataset['target'] + ']', '#toolList'),
                $parent;
            if ($target.length) {
                $parent = $('#toolList');
                $parent.animate({scrollTop: $parent.scrollTop() + $target.offset().top - 50}, 500);
            }
        });
        //拉拽工具栏上的控件时
        var toolEnterHandler = function (e) {
                var elem = e.target || event.srcElement;
                if (elem.className.indexOf('tool-icon') >= 0) {
                    $g_touchToolIcon = $('<div class="' + elem.className + '"></div>');
                    g_touchToolIconSize = {
                        x: $(elem).width() / 2,
                        y: $(elem).height() / 2
                    }
                    e = event.touches && event.touches[0] || event;
                    $g_touchToolIcon.css({
                        position: 'absolute',
                        top: e.clientY - g_touchToolIconSize.y,
                        left: e.clientX - g_touchToolIconSize.x,
                        opacity: .8,
                        'z-index': 10001
                    });
                    $('body').append($g_touchToolIcon);
                }
            },
            toolMoveHandler = function (e) {
                var elem = e.target || event.srcElement;
                if (elem.className.indexOf('tool-icon') >= 0) {
                    e.preventDefault();
                    e = event.touches && event.touches[0] || event;
                    $g_touchToolIcon && $g_touchToolIcon.css({
                        top: e.clientY - g_touchToolIconSize.y,
                        left: e.clientX - g_touchToolIconSize.x,
                    });
                }
            },
            toolDragHandler = function (e) {
                e = e.target || event.srcElement;
                var className = (e).className;
                if (className.match(/tool-icon-(\w+)/)) {
                    var elem = event.changedTouches && event.changedTouches[0] || event;
                    $('body').children('.tool-icon').remove();
                    if ($g_touchToolIcon) {
                        $g_touchToolIcon = null;
                        g_touchToolIconSize = null;
                    }
                    if (elem.clientX > $('#aside').width()) {
                        Methods.initDynamicTool(className.match(/tool-icon-(\w+)?/)[1], $(e).next().text(), {
                            x: elem.clientX - window.screenLeft + document.getElementById('article').scrollLeft,
                            y: elem.clientY - window.screenTop + document.getElementById('article').scrollTop
                        });
                    }

                }
            };
        $('#toolList').on({
            'touchstart': toolEnterHandler,
            'touchmove': toolMoveHandler,
            'touchend': toolDragHandler,
            'dragend': toolDragHandler
        });
        //保存配置文件
        $('#saveConfigBtn').click(function () {
            var $configName = $(this).prev();
            if (!$configName.val()) {
                $configName.addClass('error');
            } else {
                var config, tools = {}, $container, $content, obj;
                for (var id in g_dynamicToolList) {
                    $container = $('#' + id, '#article');
                    $content = $container.children('.tool-content');
                    obj = g_dynamicToolList[id];
                    //填充配置参数
                    tools[id] = {
                        __option: $.extend(true, {}, obj.__option),
                        _setData: obj._setData,
                        __url: obj.__url,
                        __timeout: obj.__timeout,
                        container: {
                            title: $container.find('[data-role="title"]').text(),
                            css: {
                                top: $container.css('top'),
                                left: $container.css('left'),
                                width: $container.css('width'),
                                height: $container.css('height'),
                                'z-index': $container.css('z-index')
                            },
                        },
                        content: {
                            css: {
                                height: $content.css('height')
                            }
                        }
                    };
                    //移除数据-减少流量
                    if (tools[id].__option && tools[id].__option.series) {
                        for (var i = 0, elems = tools[id].__option.series, elem; elem = elems[i]; i++) {
                            if (elem.data) {
                                elem.data.splice(0, elem.data.length);
                                delete elem.data;
                            }
                        }
                    }
                }
                config = {
                    'g_zIndex': g_zIndex,
                    tools: tools
                }
                //上传配置控件
                Methods.configHandler('create',
                    {config: JSON.stringify(Methods.functionStringifty(config)), name: $configName.val()},
                    function (data, status) {
                        if (data && data.isSuccess) {
                            $configName.val('');
                        } else {
                            console.log('上传成功，但返回失败');
                            if (data && data.errorMsg) {
                                console.log('错误信息：' + data.errorMsg);
                            } else {
                                console.log('无错误信息返回');
                            }
                        }
                    });
            }
        });
        $(':input').focus(function () {
            $(this).removeClass('error');
        });
        //配置列表点击事件
        $('#fileList').click(function (e) {
            e.preventDefault();
            e = e.target || event.srcElement;
            var configName = $(e).closest('li').attr('data-href');
            if (e.className.indexOf('close') >= 0) {
                //删除配置文件
                var $config = $(e).closest('li');
                Methods.configHandler('delete', {name: $config.attr('data-href')}, function (data, status) {
                    if (data && data.isSuccess) {
                        $config.animate({'left': '-200%'}, 500, function () {
                            $(this).remove();
                        });
                    } else {
                        console.log(data && data.errorMsg ? data.errorMsg : '删除失败未知错误！');
                    }
                });
            } else if (configName) {
                window.open(location.pathname + '?loadConfig=' + configName, '_blank');
            }
        });
        /*
         * 主界面部分
         */
        var articledownHandler = function (e) {
            var $container, id;
            //焦点在article时，隐藏侧边栏
            Methods.toggleAside('hide');

            e = e.target || event.srcElement;
            $container = $(e).closest('.tool-container');
            if (e.className.indexOf('close') >= 0) {
                //点击关闭时，移除控件
                //手动清理内存，销毁对象
                id = $container[0].id;
                if (g_dynamicToolList[id]) {
                    G_PARAMS.TOOL_DISPOSE(id);
                }
                $container.remove();
            } else if ($container.length) {
                //选中的控件置顶
                if ($container.css('z-index') !== g_zIndex - 1) {
                    var minZIndex = G_PARAMS.MIN_Z_INDEX;
                    $('.tool-container', '#article').not($container).each(function (i, elem) {
                        elem.style.zIndex = elem.style.zIndex - 1 > minZIndex ? elem.style.zIndex - 1 : minZIndex;
                    });
                    $container.css('z-index', g_zIndex - 1);
                }
            }

        };
        $('#article').on({
            'change': function (e) {
                var target = e.target || event.srcElement;
                if (target.dataset && target.dataset['inputer']) {
                    Methods.resizeToolContainer($(target).closest('.tool-container'), target.dataset['inputer'], target.value, e);
                }
            },
            'touchstart': articledownHandler,
            'mousedown': articledownHandler
        });
    }
};
App.init();