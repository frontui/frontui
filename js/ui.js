/*! 
*  frontui v1.0.2
*  by frontpay FE Team
*  (c) 5/17/2016 www.frontpay.cn
*  Licensed under Apache License
*/
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.Ui = factory(root.jQuery);
  }
}(this, function($) {
// entry
function Ui() {}

//     accordion 手风琴
//     依赖于 ui/switcher.js
//     tommyshao <jinhong.shao@frontpay.cn>

// API:
// -----
+(function($) {

    'use strict';

    $.fn.accordion = function(option){
        var defaults = {
            item: 'li',
            target: '>div',
            active: 'active',
            except: false
        };

        option = $.extend({}, defaults, option);

        // 直接调用
        $(this).switcher(option);

        // 事件监听
        return $(this).each(function(){
            var $items = $(this).find(option.item);
            $(this).on('select.ui.switcher', function(e){
                var $this = $(e.relatedTarget), has = $this.hasClass(option.active), $actived = $items.find(option.target), $target = $this.find(option.target);
                !!!(option.except) && $actived.slideUp();
                $target.stop()[!has ? 'slideUp': 'slideDown']();

                e.stopPropagation();
                e.preventDefault();
            });
        });
    };

})(jQuery);


//     警告框
//     tommyshao <jinhong.shao@frontpay.cn>
//     Reference bootstrap.alert.js
//     API:
//     $(element).on('closed.ui.alert', function(e, obj){});

+(function($) {
    'use strict';

    var dismiss = '[data-dismiss="alert"]';
    var closeBtn = 'em';

    // 构造函数
    // ------
    var Alert = function (el, callback) {
        var that = this;
        if (typeof callback === 'function') {
            $(el).on('click', closeBtn, function () {
                var $close = $(this);
                callback(function () {
                    that.close.call($close)
                });
            });
        } else {
            $(el).on('click', closeBtn, this.close);
        }
    };

    Alert.VERSION = '1.0.0';

    // 动画过渡时间
    Alert.TRANSITION_DURATION = 150;

    // 关闭
    // -----
    Alert.prototype.close = function (e) {
        var $this = $(this);
        var selector = $(this).attr('data-target');

        if (!selector) { // a[href=#test]关闭 id为test的alert
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        var $parent = $(selector);

        if (e) e.preventDefault();

        if (!$parent.length) {
            $parent = $this.closest('.alert');
        }

        $parent.trigger(e = $.Event('close.ui.alert'));

        if (e.isDefaultPrevented()) return;

        $parent.removeClass('in');

        function removeElement() {
            var ev = $.Event('closed.ui.alert', {relatedTarget: $parent});
            $parent.detach().remove();
            $this.trigger(ev);
        }

        if ($.support.transition && $parent.hasClass('fade')) { // css3
            $parent.one('uiTransitionEnd', removeElement)
                .emulateTransitionEnd(Alert.TRANSITION_DURATION)
        } else {
            $parent.fadeOut(Alert.TRANSITION_DURATION, removeElement)
        }
    };


    // 插件定义
    // -------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.alert');

            if (!data) $this.data('ui.alert', (data = new Alert(this, option)));
            if (typeof option == 'string') data[option].call($(this));
        })
    }


    // jQuery 插件扩展
    // --------------
    $.fn.alert = Plugin;
    $.fn.alert.Constructor = Alert;

    // 元素插件绑定
    // -----------
    $(function () {
        $(document).on('click.ui.alert', function (e) {
            var that = e.target;
            $(that).is(dismiss) && Alert.prototype.close.call(that, e);
        })
    })
})(jQuery);

//     @appName: checkAll 全选
//     @version: v1.0.0
//     @author: TommyShao
//     @Created 2015/12/22
//     @description:
//     @useage:

// **用法**
// ```
//      <input type="checkbox" data-toggle="checkAll" data-target="selector" />
//      $(element).on('checked.ui.checkAll', function(e){ e.relatedTarget; });
//      $(element).on('reversed.ui.checkAll', function(e){ e.relatedTarget; });
// ```

+(function($) {
    'use strict';

    // 全局绑定选择器
    var toggle = '[data-toggle="checkAll"]';

    // 构造函数
    // -------
    // * `element` dom元素对象

    var CheckAll = function (element) {
        var $this = this;
        $this.$el = $(element);
        $this.$target = $($this.$el.data('target'));
        $this.isReverse = $this.$el.data('reverse');

        // 监听 `click` 点击事件
        // 直接执行实例方法
        // * `reverse` 反选功能
        // * `activate` 全选
        $this.$el.on('click', $.proxy($this.isReverse ? this.reverse : this.activate, this));
    };

    // 插件版本号
    // --------
    // 1.0.0
    CheckAll.VERSION = '1.0.0';

    // 全选功能
    // --------
    // Function activate
    CheckAll.prototype.activate = function () {
        // 当前dom元素是否勾选
        var isCheck = this.$el.is(':checked');
        // 创建选中事件
        // `relatedTarget` 绑定为当前dom元素
        var e = $.Event('checked.ui.checkAll', {relatedTarget: this.$el});
        // 设置所有目标元素属性为选中
        this.$target.prop('checked', isCheck);
        // 触发用户自定义选中事件
        this.$el.trigger(e);
    };

    // 反选功能
    // -------
    CheckAll.prototype.reverse = function () {
        // 定义反选事件类型
        var e = $.Event('reversed.ui.checkAll', {relatedTarget: this.$el});
        // 遍历所有目标元素，将他们选中属性反转
        this.$target.map(function () {
            return $(this).prop('checked', !this.checked)
        });
        // 触发反选事件api
        this.$el.trigger(e);
    };


    // 插件定义
    // -------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.checkAll');

            if (!data) $this.data('ui.checkAll', (data = new CheckAll(this)));
            if (typeof option == 'string') data[option]();
        })
    }


    // jQuery 插件扩展
    // -------------
    $.fn.checkAll = Plugin;
    $.fn.checkAll.Constructor = CheckAll;

    // 全局绑定插件
    // -------------
    $(function () {
        $(toggle).checkAll()
    });
})(jQuery);

//     菜单下拉|select
//     tommyshao <jinhong.shao@frontpay.cn>
//     Reference bootstrap.dropdown.js

// API
// -----
// $(element).on('selected.ui.dropdown', function(e, obj){});

+(function($) {
    'use strict';

    // 默认高亮类
    var active = 'active';
    // 绑定默认选择器
    var wrap = '.form-control-dropdown';
    var toggle = '[data-toggle="dropdown"],.form-control-dropdown-value';
    var toggleBtn = '.form-control-dropdown-btn, [data-toggle="dropdown-btn"]';
    var toggleIBtn = '.form-control-dropdown-btn > i, [data-toggle="dropdown-btn"] > i';
    var ul = '.form-control-dropdown-menu';
    var list = '.form-control-dropdown-menu li, [role="list"] li';

    // 构造函数
    // -------
    var Dropdown = function (el) {
        $(el).on('click.ui.dropdown', this.toggle);

        if (/input/i.test(el.tagName)) {
            $(el).on('keyup.ui.dropFilter', this.filter)

            //.on('focusin.ui.dropFilter', this.focusIn)
        }


        var $target = getParent(el);
        $target.on('click.ui.dropSelect', list, this.selected($target))
    };

    // 版本
    // ----------
    // 1.0.0

    Dropdown.VERSION = '1.0.0';

    // 鼠标点击
    // ---------
    Dropdown.prototype.toggle = function (e) {
        var $this = $(this);

        if ($this.is('.disabled,:disabled')) return;

        dropMenus($this);

        return false
    };

    // 键盘按键 focus
    // -------------
    //Dropdown.prototype.CURRENT_ITEM = -1;
    Dropdown.prototype.keydown = function (e) {
        //console.log(e.which)
        if (e.which === 27) { // esc
            clearMenus(e);
            return;
        }
        if (!/(38|40|27|32|13|46|8)/.test(e.which)) return;

        var $this = $(this);
        var currentItem = $this.data('currentItem') === undefined ? -1 : $this.data('currentItem');

        //e.preventDefault();
        e.stopPropagation();

        if ($this.is('.disabled, :disabled')) return;

        var $target = getParent($this);
        active = $this.data('active') || active;

        var isActive = $target.hasClass(active);

        //console.log(e.which)
        if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
            //console.log(e.which);
            if (e.which == 27) $target.find(toggle).trigger('focus');
            return $this.trigger('click');
        }

        var $items = $target.find(list).filter(':visible');

        if (!$items.length) return;

        if (e.which == 13 && $items.filter('.hover').length) { // enter
            $items.filter('.hover').trigger('click.ui.dropSelect');
            return;
        }

        var index = $items.index(e.target) > -1 ? $items.index(e.target) : currentItem;


        if (e.which == 38 && index >= 0)  index--;  // up
        if (e.which == 40 && index < $items.length) index++; // down
        //if (!~index) index = 0;
        //console.log(index);
        if (index < 0) index = $items.length - 1;
        if (index >= $items.length) index = 0;

        scrollTop($items, index);

        $this.data('currentItem', index);

        $items.removeClass('hover').eq(index).addClass('hover').trigger('focus')
    };

    // 下拉菜单选中
    // ---------
    Dropdown.prototype.selected = function (el) {
        var $target = el.find(toggle);
        return function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isInput = /input/i.test($target[0].tagName);
            var option = $.trim($(this)[isInput ? 'text' : 'html']());
            $target[isInput ? 'val' : 'html'](option).trigger('selected.ui.dropdown', this).trigger('blur');
            clearMenus();
            return false;
        }
    };

    // input输入过滤
    // -----------
    Dropdown.prototype.filter = function (e) {
        if (!/input/i.test(e.target.tagName)) return;

        var $this = $(this);
        var inputText = $.trim($this.val());
        var $list = getList($this);
        if (inputText === '') {
            $list.show();
            return;
        }

        if ($list.length) {
            $list.map(function () {
                var text = $(this).text();
                if (text.indexOf(inputText) > -1) {
                    return $(this).show();
                } else {
                    return $(this).hide();
                }
            })
        }
    };

    Dropdown.prototype.focusIn = function (e) {
        var $this = $(this);
        dropMenus($this, true)
        //Dropdown.prototype.filter.call(this, e);
    };

    // 显示当前展开dropdown
    // -------------------

    function dropMenus($this, always) {
        var $target = getParent($this);
        active = $this.data('active') || active;

        var isActive = $target.hasClass(active);

        always === undefined && clearMenus();

        if (!isActive) {
            $target.addClass(active);
            $this.attr('aria-expanded', true).trigger('show.ui.dropdown', this)
        }
    }

    // 清除页面所有dropdown
    // ------------------
    function clearMenus(e, auto) {
        $(toggle).each(function () {
            var $this = $(this);
            var $target = getParent($this);
            var $input = $target.find(toggle);
            var isAuto = $this.attr('data-auto');
            active = $this.data('active') || active;

            if (!$target.hasClass(active)) return;
            if (e && e.isDefaultPrevented()) return;

            // 隐藏之前自动赋值
            // console.log(isAuto)
            auto && isAuto && autoFill($this, $input);

            $target.removeClass(active).find(list).removeClass('hover').show();
            $this.attr('aria-expanded', 'false').trigger('hide.ui.dropdown', this).data('currentItem', -1);

            $input.length && $input.trigger('blur');

        })
    }

    function hideAllMenus(e) {
        clearMenus(e, 1)
    }

    // 默认选中
    // -----------
    function autoFill(element, input) {
        var $Li = getList(element), $vLi, isMatch = 0, txt = '', value = $.trim(input.val());

        $vLi = $Li.filter(function () {
            if ($(this).is(':visible')) {
                if (isMatch === 0) {
                    txt = $.trim($(this).text());
                    isMatch = txt == value ? 1 : 0;
                }
                return true;
            }
            return false;
        });

        if (!isMatch) {
            if ($vLi.length === 0) {
                $Li.eq(0).trigger('click')
            } else {
                $vLi.eq(0).trigger('click.ui.dropSelect')
            }
        }
    }

    // 匹配
    // -----------
    function chkMatch() {
        var $this = $(this),
            placeholder = $this.attr('placeholder'),
            value = $.trim($this.val()),
            $items = getList($this);

        if (value === '' || value === placeholder) {
            return;
        }

        $items.hide()
            .filter(function () {
                var txt = $.trim($(this).text()) || '';

                if (txt == value) {
                    $(this).addClass('hover');
                }

                return txt.indexOf(value) > -1;
            })
            .show();
    }


    // 获取响应的元素
    // --------------
    function getParent(el) {
        var $parent = $(el).data('target') || $(el).parent();
        return $parent;
    }

    // 获取列表项
    // -----------
    function getList(el) {
        var $parent = getParent(el);
        return $parent.find(list);
    }

    // 滚动条自动跳到某位置
    // -----------------
    function scrollTop(el, i) {
        var $parent = el.parent();
        var top = el.eq(i).position().top;
        $parent.scrollTop(top);
    }

    // 插件定义
    // ------------
    function Plugin(option) {
        var args = [].slice.call(arguments, 1);
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.dropdown');

            if (!data) $this.data('ui.dropdown', (data = new Dropdown(this)));
            if (typeof option == 'string') data[option].apply(this, args);
        })
    }

    // jQuery 插件扩展
    // --------------
    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;

    // 元素插件绑定
    // --------------
    $(function () {
        $(toggle).dropdown();
        $(document)
        // 点击页面其他地方收起
            .on('click.ui.dropdown', hideAllMenus)
            // 按钮触发
            .on('click.ui.dropdown-btn', function (e) {
                var that = e.target;
                if ($(that).is(toggleBtn) || $(that).is(toggleIBtn)) {
                    var $wrap = $(that).closest(wrap);
                    var $target = $wrap.find(toggle);
                    //console.log($wrap);
                    //$target.length && $target.dropdown('toggle');
                    dropMenus($target)
                    //console.log($target);
                    //$target.dropdown('selected', $target[0]);
                    //$target.trigger('toggle')
                    //Dropdown.prototype.selected($target)();
                    return false;
                }

            })
            // .on('click.ui.dropdown', ul, function(e){
            .on('click.ui.dropdown', function (e) {
                var that = e.target;
                if ($(that).is(ul)) {
                    e.stopPropagation();
                    return false;
                }

            })
            // .on('click.ui.dropdown', list, function(e){
            //     var $toggle = $(e.target).closest(wrap);
            //     console.log($toggle);
            //     var $target = getParent($toggle.find(ul));
            //     $target.trigger('click.ui.dropSelect');
            //     e.stopPropagation();
            //     return false;
            // })
            // focus
            // .on('focus.ui.dropdown', toggle, chkMatch)
            .on('focus.ui.dropdown', function (e) {
                var that = e.target;
                $(that).is(toggle) && chkMatch(that, e);
            })
            // .on('keydown.ui.dropdown', toggle, Dropdown.prototype.keydown);
            .on('keydown.ui.dropdown', function (e) {
                var that = e.target;
                $(that).is(toggle) && Dropdown.prototype.keydown.call(that, e);
            });
    })
})(jQuery);

/*!
 * 弹层
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference bootstrap.modal.js
 * API:
 *      // 监听打开
 *      $(element).on('show.ui.modal', function(e, obj){});
 *      $(element).on('shown.ui.modal', function(e, obj){});
 *
 *      // 监听关闭
 *      $(element).on('hide.ui.modal', function(){});
 *      $(element).on('hidden.ui.modal', function(){});

        // 绑定一个弹窗
 *      $(element).modal();
 *
 *      // 自定义弹窗
 *      $(id).modal({title: '提示', content: 'abc'});
        $(id).modal('setContent', 'cdfg');

        // loading
 */

/**
 * log:
 * 1. 加属性`tabindex=-1`解决聚焦问题
 * 2. 增加方法
 *   $.successModalLayer({id:string, title: string, content: string, link: string, callback: function})
     $.confirmModalLayer({id: string, title: string, content: string, callback: function})
     $.alertModalLayer({id: string, icon: string, title: string, content: string})
     $.closeModalLayer(id)
 * 3. 增加支持 iframe
 */

+(function($) {
    'use strict';

    // 构造函数
    // --------
    var Modal = function (element, options) {
        this.$el = $(element);
        this.options = options;
        this.$body = $(document.body);
        //this.$container = this.$el.parents('.modal-background');
        this.$dialog = this.$el.find('.modal-wrap');
        this.$backdrop = null;
        this.isShown = null;
        this.originalBodyPad = null;
        this.scrollbarWidth = 0;

        if (this.options.remote) {
            this.$el
                .find('.modal-body')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.ui.modal');
                }, this))
        }
    };

    Modal.VERSION = '1.0.0';

    // 动画过渡时间
    Modal.TRANSITION_DURATION = 150;

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };

    // 自定义弹框模板
    Modal.TEMPLATE = [
        '<div class="modal-background fade" id="{{mid}}">',
        '<div class="modal-layer">',
        '<div class="modal-position">',
        '<div class="modal-wrap">',
        '<div class="modal-head">',
        '<span class="modal-title">{{title}}</span>',
        '<button class="modal-close">',
        '<i></i>',
        '</button>',
        '</div>',
        '<div class="modal-body">',
        '{{content}}',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');

    Modal.CreateModal = function (option) {
        var $body = $(document.body), element;
        if (option && typeof option == "object") {
            element = Modal.TEMPLATE.replace(/{{(\w*)}}/gi, function (match, key) {
                if (option[key] && typeof option[key] == "string") return /^(\.|#)\w*/gi.test(option[key]) ? $(option[key]).html() : option[key];
                // dom元素
                if (option[key] && option[key].length && option.length > 0) return option[key].html();
            });

            element = $(element).hide().appendTo($body)
        }
        return element;
    };

    // 打开
    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget);
    };


    // 显示
    Modal.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.ui.modal', {relatedTarget: _relatedTarget});

        //this.$el.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass('modal-open');

        this.escape();
        this.resize();

        this.$el.on('click.dismiss.ui.modal', '[data-dismiss="modal"],.modal-close', $.proxy(this.hide, this));


        var transition = $.support.transition && that.$el.hasClass('fade');
        that.$el.show().scrollTop(0).attr('tabindex', -1);

        that.adjustDialog();

        if (transition) {
            that.$el[0].offsetWidth;
        }

        that.enforceFocus();

        //var e = $.Event('shown.ui.modal', {relatedTarget: _relatedTarget});

        if (transition) {
            that.$el.addClass('in').attr('aria-hidden', false);
            that.$dialog.one('uiTransitionEnd', function () {
                that.$el.trigger('focus').trigger(e)
            }).emulateTransitionEnd(Modal.TRANSITION_DURATION)
        } else {
            that.$el.hide().addClass('in').attr('aria-hidden', false).fadeIn(Modal.TRANSITION_DURATION, function () {
                $(this).trigger('focus').trigger(e);
            }).attr('aria-hidden', false);
        }
    };

    // 隐藏
    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault();

        var $this = this;

        if (!this.$el.is(':visible') && !this.isShown) return;

        this.isShown = false;

        this.escape();
        this.resize();

        $(document).off('focusin.ui.modal').off('keydown.ui.modal');

        this.$el.removeClass('in').attr('aria-hidden', true).off('click.dismiss.ui.modal').off('mouseup.dismiss.ui.modal');

        this.$dialog.off('mousedown.dismiss.ui.modal');

        $.support.transition && this.$el.hasClass('fade') ?
            this.$el.one('uiTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION)
            : (function () {
            $this.$el.fadeOut(Modal.TRANSITION_DURATION, function () {
                $this.hideModal()
            })
        })();
    };

    Modal.prototype.close = function (id) {
        $(id).data('ui.modal').hide();
    };

    // esc关闭
    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$el.on('keydown.dismiss.ui.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$el.off('keydown.dismiss.ui.modal');
        }
    };

    Modal.prototype.hideModal = function () {
        var that = this;
        var e = $.Event('hide.ui.modal', {relatedTarget: that.$el});
        that.$el.hide();
        that.$body.removeClass('modal-open');
        that.resetAdjustments();
        that.resetScrollbar();
        that.$el.trigger(e);
    };
    // 重新缩放
    Modal.prototype.resize = function () {
    };
    // 调整弹框位置
    Modal.prototype.handleUpdate = function () {
        this.adjustDialog();
    };
    Modal.prototype.adjustDialog = function () {
        return;
        var modalIsOverflowing = this.$el[0].scrollHeight > document.documentElement.clientHeight;

        this.$el.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
    };
    Modal.prototype.resetAdjustments = function () {
        this.$el.css({
            paddingLeft: '',
            paddingRight: ''
        })
    };
    // 获取焦点
    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.ui.modal')
            .on('focusin.ui.modal', $.proxy(function (e) {
                if (this.$el[0] !== e.target && !this.$el.has(e.target).length) {
                    this.$el.trigger('focus');
                }
            }, this))
    };

    // 滚动条
    Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth; //$(window).width();
        if (!fullWindowWidth) {
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
        }

        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        this.scrollbarWidth = this.measureScrollbar();
    };

    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        this.originalBodyPad = document.body.style.paddingRight || '';
        if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
    };

    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', this.originalBodyPad);
    };

    Modal.prototype.measureScrollbar = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };

    // 扩展方法
    Modal.prototype.setContent = function (content) {
        var $content = this.$el.find('.modal-body');
        $content.length && $content.html(content || '');
    };

    // 设置标题
    Modal.prototype.setTitle = function (title) {
        var $title = this.$el.find('.modal-title');
        $title.length && $title.html(title || '')
    };

    // 设置对话框title
    /*Modal.prototype.layerUpdate = function(option){
     var $el = this.$el, $obj;
     for(var o in option) {
     if ( o != 'buttons') {
     $obj = $el.find('[role="'+ o +'"]');
     if(o == 'icon') {
     $obj.attr('class', 'notice-wrap '+ option[o] +' in-modal');
     } else {
     $el.find('[role="'+ o +'"]').html(option[o])
     }
     }
     }
     }*/


    // 插件定义
    //======================
    function Plugin(option, _relatedTarget) {
        if (!$(this).length && option && /^#(\w*)/gi.test($(this).selector)) { // js创建
            var data, fnName; //option = typeof option === 'string' ? {title: '\u6807\u9898', content: ''} : option;  //, uid = Math.random().toString(36).substring(2);
            //option.id = 'modal-'+uid;
            if (typeof option === 'string') {
                fnName = option;
                option = {title: '\u6807\u9898', content: ''};
            }
            option.mid = $(this).selector.replace(/^#/g, '');
            var $this = Modal.CreateModal(option);
            $this.data('mid', option.mid);
            var options = $.extend({}, Modal.DEFAULTS, typeof option == 'object' && option);
            $this.data('ui.modal', (data = new Modal($this, options)));

            if (fnName && typeof data[fnName] === 'function') {
                data[fnName](_relatedTarget);
            }

            if (option['callback']) option['callback'].call($this);

            //return data.show(_relatedTarget);
            data.show(_relatedTarget);
            return $(this);
        } else { // 模板
            return $(this).each(function () {
                var $this = $(this);
                var data = $this.data('ui.modal');
                var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
                if (!data) $this.data('ui.modal', (data = new Modal(this, options)));
                if (typeof option == 'string') {
                    data[option](_relatedTarget);
                } else if (options.show) {
                    // 重新设置标题
                    if (options.title) data.setTitle(options.title);
                    // 重新设置内容
                    if (options.content) data.setContent(options.content);

                    data.show(_relatedTarget);
                }
            })
        }
    }


    // jQuery 插件扩展
    $.fn.modal = Plugin;
    $.fn.modal.Constructor = Modal;

    //-------------------------
    //--- 扩展 ----------------
    //-------------------------
    // ajaxLoading
    $.fn.showLoading = function (title, content) {
        var $this, title = title || '处理中...', content = content || '请不要关闭浏览器，系统正在处理';
        if ($(this).length) {
            if (title) $(this).find('.modal-body h3').html(title);
            if (content) $(this).find('.loading-content').html(content);

            return $(this).modal('show');
        } else {
            var template = ['<div class="notice-wrap waiting in-modal">',
                '<div class="notice-box">',
                '<span class="notice-img"></span>',
                '<h3>' + title + '</h3>',
                '<div class="loading-content">' + content + '</div>',
                '</div>',
                '</div>'].join('');
            return $(this).modal({
                title: '提示', content: template, callback: function () {
                    $(this).find('.modal-close').hide();
                }
            });
        }
    };

    $.fn.hideLoading = function () {
        return $(this).length && $(this).modal('hide');
    }

    $.showLoading = function (title, content) {
        var id = '#ui-loading';
        return $(id).showLoading(title, content);
    }
    $.hideLoading = function () {
        var id = '#ui-loading';
        return $(id).hideLoading();
    }


    // --------
    // 自定义弹层
    // --------

    // alert,error,success
    $.fn.modalLayer = function (option) {
        var defaults = {
            icon: 'success',
            title: '成功',
            content: '',
            close: true, // 默认 true 可以关闭，false -不显示 x 关闭按钮 function关闭函数
            buttons: [
                {
                    text: '确定',
                    href: false,
                    style: 'btn primary',
                    target: false,
                    ok: $.noop
                }
            ]
        };


        var $that = $(this), opt;

        /*if($that.length) {
         var Instance = $that.data('ui.modal'), dfOption = $that.data('options');
         opt = $.extend(defaults, dfOption, option)
         // 重新设置title，content，icon
         Instance && typeof opt === "object" && Instance.layerUpdate(opt);
         $that.modal('show');
         } else { */
        /*
         * log: 隐藏即关闭
         * 2015-10-16
         */
        // 初始化
        opt = $.extend({}, defaults, option);
        var template = ['<div class="notice-wrap ' + opt.icon + ' in-modal" role="icon">',
            '<div class="modalLayer notice-box">',
            '<span class="notice-img"></span>',
            '<h3 role="title" class="modalLayer-title ' + ($.trim(opt.content) == '' ? 'fn-mt-20' : '') + '">' + opt.title + '</h3>',
            '<div class="modalLayer-content" role="content">' + opt.content + '</div>',
            '</div>',
            '</div>',
            '<div class="in-modal-btns text-align-center">',
            '</div>'];
        // 拼接按钮html结构
        var btnHtml = [], btns = opt.buttons;
        for (var i = 0; i < btns.length; i++) {
            if (btns[i].href) {
                btnHtml.push('<a href="' + btns[i].href + '" ' + (btns[i].target ? 'target="' + btns[i].target + '"' : '') + ' class="' + (btns[i].style || 'btn primary') + '" data-index="' + i + '">' + btns[i].text + '</a>');
            } else {
                btnHtml.push('<button type="button" class="' + (btns[i].style || 'btn primary') + '" data-index="' + i + '">' + btns[i].text + '</button>');
            }
        }

        // 添加自定义按钮html
        template.splice(-1, 0, btnHtml.join(''));

        // 自定义对话弹层实例
        $that = $(this).modal({
            title: '提示', content: template.join(''), callback: function (obj) {
                // 按钮点击触发配置回调函数，没有配置则默认关闭层
                $(this).on('click', '.in-modal-btns .btn', function () {
                        // 获取当前按钮位置, e 获取用户决定按钮是否可以关闭层，回调函数return false则不关闭层
                        var index = $(this).data('index'), e = true;
                        // 监测用户是否配置回调函数
                        if (opt.buttons.length && opt.buttons[index] && opt.buttons[index]['ok']) {
                            // ok为函数才执行
                            if (opt.buttons[index]['ok'] && typeof  opt.buttons[index]['ok'] === "function") {
                                // 获取用户是否关闭层指令，默认关闭
                                e = opt.buttons[index]['ok'].call(null, $(this), index) === false ? false : true;
                            }
                        }

                        $($that.selector).data('options', opt);
                        // 指令为true时关闭层
                        e && $($that.selector).modal('hide')
                    })
                    .on('hide.ui.modal', function () {  // 调用隐藏的时候删除dom
                        $(this).remove();
                    });
                void 0
                // 不显示关闭
                if (!opt.close) $($that.selector).find('.modal-close').hide();
                // 关闭回调
                if ($.isFunction(opt.close)) {
                    $(this).on('hide.ui.modal', opt.close)
                }
            }
        });
        /*  } */
    };


    // 元素插件绑定
    // ====================
    var Handler = function () {
        var $this = $(this);
        var href = $(this).attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
        var option = $target.data('ui.modal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        // 实例化
        Plugin.call($target, option, this);
    };
    var initModal = function () {
        $(document).on('click.ui.modal', '[data-toggle="modal"]', function (e) {
            var that = e.target;
            $(that).is('[data-toggle="modal"]') && Handler.call(that, e);
        });

        // 全局绑定，默认不显示
        //$('.modal-background:not(".display-none")').modal();
    };

    $(initModal);


    // --------
    // 扩展成功失败弹窗
    /**
     * 依赖 /js/ui/modal.js
     * @param {string} icon 图标样式
     * @param {string} title 提示标题
     * @param {string|html} 提示内容
     * @param {array} buttons 按钮定义
     */
    // 成功弹层
    var successModalLayer = (function ($) {
        return function (config) {
            var id = config['id'] ? config['id'] : '#j-modal-status';
            // 使用modalLayer api
            $(id).modalLayer({
                icon: 'success',
                title: (config['title'] || ''),
                content: (config['content'] || ''),
                buttons: [
                    {
                        text: '确认',
                        ok: function () {
                            if (config && typeof config['link'] == 'string') {
                                location.href = config['link'];
                            }
                            if (config && typeof config['callback'] == 'function') {
                                config['callback']();
                            }
                        }
                    }
                ]
            });
        }
    })(jQuery);

    // 确认询问弹层
    var confirmModalLayer = (function ($) {
        return function (config) {
            var id = config['id'] ? config['id'] : '#confirmModalLayer';
            $(id).modalLayer({
                icon: 'info',
                title: (config['title'] || ''),
                content: (config['content'] || ''),
                buttons: [
                    {
                        text: '确定',
                        ok: config['callback']
                    },
                    {
                        text: '取消',
                        href: 'javascript:void(0);',
                        style: 'btn links fn-ml-10'
                    }
                ]
            });
        }
    })(jQuery);

    // 警告弹层
    var alertModalLayer = (function ($) {
        return function (config) {
            var id = config['id'] ? config['id'] : '#alertModalLayer';
            $(id).modalLayer({
                icon: (config['icon'] || 'info'),
                title: (config['title'] || ''),
                content: (config['content'] || '')
            });
        }
    })(jQuery);

    // 关闭弹层不是隐藏
    var closeModalLayer = (function ($) {
        return function (id, fn) {
            $(id).modal('hide').on('hide.ui.modal', function () {
                $(this).remove();
                typeof fn === 'function' && fn();
            })
        }
    })(jQuery);


    // 外部
    $.successModalLayer = successModalLayer;
    $.confirmModalLayer = confirmModalLayer;
    $.alertModalLayer = alertModalLayer;
    $.closeModalLayer = closeModalLayer;


    // ---------------
    // --- 扩展 支持iframe

    /**
     * 扩展modal,iframe modal
     * 简单指
     * require ui.js(modal.js)
     */
    ~(function ($) {

        var APILIST = {};

        /**
         * iframe
         * @param selector
         */
        function dialogApi(selector, opt, next) {
            this.selector = selector;
            this.next = next;
            this.opt = opt;
            this.dialog = this.get(selector);

            this.showModal(opt);

        }

        /**
         * modal
         */
        dialogApi.prototype.showModal = function (opt) {
            var that = this;

            // 设置默认为hide
            opt.show = false;
            opt.content = '';

            opt.callback = function () {
                that.dialog = $(that.selector);
                that.$dom = $(this);
                if (opt && opt['url']) {
                    that.originalUrl = opt.url;
                    that.init();

                    typeof that.next == "function" && that.next.call(that, that.$dom);
                }
            }

            that.dialog.modal(opt);
        }

        /**
         * 初始化iframe对象
         */
        dialogApi.prototype.init = function (url) {
            var $body = this.$dom.find('.modal-body');
            this.$title = this.$dom.find('.modal-title');
            this.$iframe = $('<iframe />');
            this.$iframe.attr({
                src: (url || this.originalUrl),
                //name: api.id,
                width: (this.opt.width || '100%'),
                height: (this.opt.height || '100%'),
                allowtransparency: 'yes',
                frameborder: 'no',
                scrolling: 'no'
            }).on('load', $.proxy(this.adjustHeight, this));

            $body.empty().append(this.$iframe);
            //this.show();
        }

        // 重新设置 title,content
        dialogApi.prototype.setProp = function (config) {
            (config['title'] && this.$title.html(config['title']));
            (config['url'] && (this.$iframe[0].src = config['url']));
        }

        dialogApi.prototype.setUrl = function (url) {
            //this.$iframe && this.$iframe.attr('src', url);
            this.init(url);
            return true;
        }

        /**
         * iframe自适应高度
         */
        dialogApi.prototype.adjustHeight = function () {
            var test, h;

            try {
                // 跨域测试
                test = this.$iframe[0].contentWindow.frameElement;
            } catch (e) {
            }

            if (test) {
                h = this.$iframe.contents().height();
                this.$iframe.css({height: h + 'px'})
            }
        }

        /**
         * iframe调用父窗口
         * @param opt
         */

        /**
         * 显示
         */
        dialogApi.prototype.show = function () {
            this.dialog.modal('show');
        }

        /**
         * 隐藏
         */
        dialogApi.prototype.hide = function () {
            this.dialog.modal('hide');
        }

        /**
         * 获取父窗口
         * @param opt
         */
        dialogApi.get = dialogApi.prototype.get = function (id) {
            // 从iframe中传入window
            if (id && id.frameElement) {
                var iframe = id.frameElement;
                var api;
                var modalList = $('.modal-background', id.parent.document);
                modalList.each(function (i, item) {
                    var ifr = $(item).find('iframe');
                    if (ifr[0] === iframe) api = $(item);
                });
                return api;
            } else {
                return $(id);
            }
        }

        dialogApi.close = function (id) {
            var dialog = dialogApi.get(id);
            $(dialog).find('.modal-close').trigger('click');
            $(dialog).remove();
        }

        /**
         * 重复了，暂无方法优化
         * @param id
         */
        dialogApi.adjustHeight = function (id) {
            var dialog = dialogApi.get(id);
            var $iframe = $(dialog).find('iframe');
            var test, h;

            try {
                // 跨域测试
                test = $iframe[0].contentWindow.frameElement;
            } catch (e) {
            }

            if (test) {
                h = $iframe.contents().height();
                $iframe.css({height: h + 'px'})
            }
        }

        $.fn.iframeModal = function (opt, args) {
            var that = $(this);
            var selector = $(this).selector;

            if ((this[0] === window || this[0] === parent) && opt == 'hide') {
                dialogApi.close(window);
                return;
            }

            if (this[0] === window && opt == 'adjustHeight') {
                dialogApi.adjustHeight(window);
                return;
            }

            var data = that.data('ui.iframeModal');
            if (!data) {
                data = new dialogApi(selector, opt, function (obj) {
                    $(obj).data('ui.iframeModal', this);
                })
            } else {
                if (opt && opt['url'] && opt['reset']) {
                    data && data.setUrl(opt.url) && data.show();
                } else {
                    if ($.isPlainObject(opt)) {
                        data.setProp(opt);
                    }
                    data && data.show();
                }
            }

            // 调用关闭方法
            if (typeof opt === 'string') {
                data[opt] && data[opt](args)
            }
        };

        $(function () {
            $(document).on('click', '[data-toggle="iframeModal"]', function (e) {
                e.preventDefault();
                var title = $(this).attr('data-title') || '提示';
                var url = $(this).attr('data-url');

                url && title && $('#iframe-modal').iframeModal({
                    title: title,
                    url: url
                });
            })
        })
    })(jQuery);

})(jQuery);

/*!
 * Notify 通知
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference uikit.notify.js
 * API:
 *      $.notify({
 *          message: '',
 *          status:['success', 'warning', 'danger'],
 *          group: false,
 *          pos: 'top-center',
 *          opacity: .85,
 *          timeout: 5000,
 *          onClose: function(){}
 *      });
 */

+(function($) {

    'use strict';

    // 存放方位集合
    var containers = {};
    //  通知集合
    var messages = {};
    // 接口，扩展$.notify
    var notify = function (options) {
        if (typeof options === 'string') {
            options = {message: options};
        }

        if (arguments[1]) {
            options = $.extend(options, typeof arguments[1] === 'string' ? {status: arguments[1]} : arguments[1]);
        }

        return (new Notify(options)).show();
    };
    // 关闭所有接口
    var closeAll = function (group, instantly) {
        var id;

        if (group) {
            for (id in messages) {
                if (group === messages[id].group) messages[id].close(instantly)
            }
        } else {
            for (id in messages) {
                messages[id].close(instantly)
            }
        }
    };

    // 构造函数
    // ===============
    var Notify = function (options) {

        this.timeout = false;
        this.currentStatus = "";
        this.group = false;
        this.options = $.extend({}, Notify.DEFAULTS, options);

        // uuid 设置唯一id
        this.uuid = 'Notify_' + Math.random().toString(36).substr(2);

        // 创建元素
        this.$el = $([
            '<div class="notify-message">',
            '<a class="notify-close">&times;</a>',
            '<div></div>',
            '</div>'
        ].join('')).data('ui.notify', this);

        // 设置内容
        this.content(this.options.message);

        // 设置状态
        if (this.options.status) {
            this.$el.addClass('notify-message-' + this.options.status);
            this.currentStatus = this.options.status;
        }

        // 分组
        this.group = this.options.group;

        // 消息按uuid存放
        messages[this.uuid] = this;

        // 方位存放
        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="notify notify-' + this.options.pos + '"></div>')
                .appendTo($('body'))
                .on('click', '.notify-message', function () {
                    var message = $(this).data('ui.notify');
                    message.$el.trigger('manualclose.ui.notify', [message]);
                    message.close();
                });
        }
    };

    Notify.VERSION = '1.0.0';

    Notify.DEFAULTS = {
        message: "", // 提示内容
        status: "",  // 状态，样式颜色
        opacity: .85, // 层透明度
        timeout: 5000, // 定时延迟消失
        group: null,   // 是否分组
        pos: "top-center", // 定位
        onClose: function () {
        }  // 关闭触发事件
    };

    // Public Method
    // ===============
    /* 显示 */
    Notify.prototype.show = function () {
        if (this.$el.is(':visible')) return;

        var $this = this;

        // 方位添加元素
        containers[this.options.pos].show().prepend(this.$el);

        var marginbottom = parseInt(this.$el.css('margin-bottom'), 10);

        // 动画显示
        this.$el.css({opacity: 0, "margin-top": -1 * this.$el.outerHeight(), "margin-bottom": 0})
            .animate({opacity: this.options.opacity, "margin-top": 0, "margin-bottom": marginbottom}, function () {
                if ($this.options.timeout) { // 延时关闭
                    var closefn = function () {
                        $this.close()
                    };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.$el.hover(
                        function () {
                            clearTimeout($this.timeout)
                        },
                        function () {
                            $this.timeout = setTimeout(closefn, $this.options.timeout)
                        }
                    );
                }
            });

        return this;
    };

    /* 关闭 */
    Notify.prototype.close = function (instanly) {
        var $this = this,
            finalize = function () {
                $this.$el.remove();

                if (!containers[$this.options.pos].children().length) {
                    containers[$this.options.pos].hide();
                }

                $this.options.onClose.apply($this, []);
                $this.$el.trigger('close.ui.notify', [$this]);

                delete messages[$this.uuid];
            }

        if (this.timeout) clearTimeout(this.timeout);

        if (instanly) {
            finalize();
        } else {
            this.$el.animate({opacity: 0, "margin-top": -1 * this.$el.outerHeight(), "margin-bottom": 0}, function () {
                finalize();
            })
        }
    };

    /* 设置内容或获取 */
    Notify.prototype.content = function (html) {
        var container = this.$el.find('>div');

        if (!html) {
            return container.html();
        }

        container.html(html);

        return this;
    };

    /* 设置状态及样式 */
    Notify.prototype.status = function (status) {
        if (!status) {
            return this.currentStatus;
        }

        this.$el.removeClass('nofity-message-' + this.currentStatus).addClass('notify-message-' + status);

        this.currentStatus = status;

        return this;
    };


    // 插件定义
    //======================
    function Plugin(option) {
        return $(this).on('click', function () {
            option = typeof option === 'string' ? {message: option} : option;
            var data = new Notify(option);
            data.show();
        });
    }


    // jQuery 插件扩展
    $.notify = notify;
    $.notify.closeAll = closeAll;
    $.fn.notify = Plugin;
    $.fn.notify.Constructor = Notify;

})(jQuery);

/*!
 * 分页|pagination
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference uikit.pagination.js
 * API:
 *      $(element).pagination({ onSelectPage: function(index, instance){});
 *
 *      $(element).on('ui.select.pagination', function(e, index, instance){
            console.log(index)
         })

        $(element).pagination({ onSelectPage: function(index, instance){});

        $(element).pagination('selectPage', 2, 100);
 */

+(function($) {
    'use strict';

    // 默认高亮类
    var active = 'active';
    // 分页总码数模板
    var pageStr = '<p class="pull-left fs-12 lh-26">共{$pages}页，{$items}条记录，每页显示{$itemsOnPage}条。</p>';


    // 构造函数
    // @param {object} element 容器dom元素
    // @param {json}   options 配置参数面量
    // ===============
    var Pagination = function (element, options) {
        // 分页主容器
        this.$el = $(element);
        // 初始化
        this._init(options);
    };

    // 版本
    Pagination.VERSION = '1.0.0';
    // 分页默认参数
    Pagination.DEFAULTS = {
        // 总记录数
        items: 1,
        // 每页记录数
        itemsOnPage: 1,
        // 总页数
        pages: 0,
        // 只显示页数区间
        displayedPages: 8,
        // 到末页显示多少页码
        edges: 1,
        // 当前页
        currentPage: 0,
        // 分页总码数字符, 默认不显示, show-是否显示, template 字符模板
        pageStr: {show: false, template: ''},
        lblPrev: '\u4e0a\u4e00\u9875', //上一页
        lblNext: '\u4e0b\u4e00\u9875', //下一页
        // 选中触发事件
        onSelectPage: function () {
        }
    };

    // 初始化
    // =================
    Pagination.prototype._init = function (options, inited) {
        var $this = this;

        this._setOption(options);

        $this.itemsOnPage = this.options.itemsOnPage;
        $this.items = this.options.items;
        $this.current = this.options.currentPage;

        // 总页数
        $this.pages = $this.options.pages ? $this.options.pages : Math.ceil($this.items / this.itemsOnPage) ? Math.ceil($this.items / $this.itemsOnPage) : 1;

        // 当前页，从0开始
        $this.currentPage = $this.options.currentPage - 1;
        // 页数区间的一半
        $this.halfDisplayed = $this.options.displayedPages / 2;

        // dom 渲染
        $this._render();

        // 绑定点击切换页码
        !!!inited && $this.$el.on('click', 'a[data-page]', function (e) {
            e.preventDefault();
            $this.selectPage($(this).data('page'));
        });
    };

    Pagination.prototype.init = function (options) {
        this._init(options, true);
    };

    // 私有方法
    // 设置配置
    Pagination.prototype._setOption = function (options) {
        this.options = $.extend({}, Pagination.DEFAULTS, options);
    };

    // 切换页码
    Pagination.prototype.selectPage = function (pageIndex, pages) {
        // 切换到设置页
        this.currentPage = pageIndex - 1;
        this.current = pageIndex;
        // 重新渲染dom
        this.render(pages);

        // 触发切换选择函数
        this.options.onSelectPage(pageIndex, this);
        // 触发api接口
        this.$el.trigger('select.ui.pagination', [pageIndex, this]);
    };

    Pagination.prototype._render = function () {
        var o = this.options, interval = this._getInterval(), i;
        // 清空dom
        this.$el.empty().prevAll().remove();
        if (this.pages <= 1) return;

        // 上一页,false时不显示，当前页-1，text为显示文字，true为自定义label
        //console.log('currentPage:'+ o.currentPage)
        if (o.lblPrev && this.currentPage - 1 >= 0) this._append(this.currentPage - 1, {text: o.lblPrev}, true);


        // 左边首页显示边缘页数
        if (interval.start > 0 && o.edges > 0) { // 显示末页
            var end = Math.min(o.edges, interval.start);
            for (i = 0; i < end; i++) this._append(i);

            if (o.edges < interval.start && (interval.start - o.edges != 1)) {
                this.$el.append('<li><span>...</span></li>')
            } else if (interval.start - o.edges == 1) {
                this._append(o.edges);
            }
        }

        // 显示 (当前页-4, 当前页， 当前页+4)
        for (i = interval.start; i < interval.end; i++) this._append(i);

        // 右边末页显示边缘页数
        if (interval.end < this.pages && o.edges > 0) {
            if (this.pages - o.edges > interval.end && (this.pages - o.edges - interval.end != 1)) {
                this.$el.append('<li><span>...</span></li>')
            } else if (this.pages - o.edges - interval.end == 1) {
                this._append(interval.end++);
            }

            var begin = Math.max(this.pages - o.edges, interval.end);

            for (i = begin; i < this.pages; i++) this._append(i);
        }

        // 下一页,false时不显示，当前页+1，text为显示文字，true为自定义label
        //console.log(this.currentPage, this.pages)
        if (o.lblNext && this.currentPage < this.pages - 1) this._append(this.currentPage + 1, {text: o.lblNext}, true);

        this.renderPageStr();
    };

    // 渲染总页码
    Pagination.prototype.renderPageStr = function () {
        if (this.options.pageStr && this.options.pageStr.show) {
            var that = this;
            var oPageStr = that.$el.prevAll();
            var template = this.options.pageStr.template || pageStr;

            template = template.replace(/{\$(\w*)}/gi, function (matches, key, index) {
                return that[key] ? that[key] : 0;
            })

            oPageStr.length && oPageStr.remove();

            that.$el.before($(template));
        }
    }

    // 重新渲染,外部接口
    Pagination.prototype.render = function (pages) {
        this.pages = pages ? pages : this.pages;
        this._render();
    };

    // 获取显示页码范围
    Pagination.prototype._getInterval = function () {
        return {
            start: Math.ceil(
                // 当前页是否大于显示范围的一半
                this.currentPage > this.halfDisplayed
                    ? Math.max(
                    // 从当前页-显示一半范围开始
                    Math.min(this.currentPage - this.halfDisplayed, (this.pages - this.options.displayedPages))
                    // 当前页小于一半且总页数小于显示范围，从第一页开始
                    , 0)
                    // 从第一页开始
                    : 0),
            end: Math.ceil(
                // 当前页是否大于显示范围的一半
                this.currentPage > this.halfDisplayed
                    // 当前页+显示范围的一半
                    ? Math.min(this.currentPage + this.halfDisplayed, this.pages)
                    // 结束为最多显示，末页
                    : Math.min(this.options.displayedPages, this.pages))
        }
    };

    // 重新组织dom结构
    // pageIndex 渲染页码
    // opts 文本配置
    // islb 是否上一页下一页，是永不加active
    Pagination.prototype._append = function (pageIndex, opts, islb) {
        var $this = this, item, options;

        // 判断首页，末页，常规页
        pageIndex = pageIndex < 0 ? 0 : (pageIndex < this.pages ? pageIndex : this.pages - 1);
        options = $.extend({text: pageIndex + 1}, opts);

        // console.log(pageIndex, this.currentPage, islb)

        // 判断当前页与非当前页
        item = (pageIndex == this.currentPage) ?
            // 当前页， 上一页下一页不加active类
        '<li ' + (islb ? '' : 'class="' + active + '"') + '><a href="javascript:void(0);">' + (options.text) + '</a></li>'
            // 分当前页标识为可点击
            : '<li><a href="#page-' + (pageIndex + 1) + '" data-page="' + (pageIndex + 1) + '">' + options.text + '</a></li>';

        $this.$el.append(item);
    };

    // 插件定义
    //======================
    function Plugin(options) {
        // 获取传入参数，可能不止options一个参数
        var args = arguments;
        // jquery 链式
        return $(this).each(function () {
            var $this = $(this);
            if ($this.hasClass('no-js')) return;
            var data = $this.data('ui.pagination');

            // 创建一个新实例
            if (!data) $this.data('ui.pagination', (data = new Pagination($this, $.extend({}, $this.data(), options))));

            if (typeof options == 'string') { // 调用接口方法,第二个参数为方法传入参数
                data[options].apply(data, [].slice.call(args, 1));
            }
        })
    }

    // jQuery 插件扩展
    $.fn.pagination = Plugin;
    $.fn.pagination.Constructor = Pagination;

    // 元素插件绑定
    // ====================
    $(function () {
        $('[ui-pagination],.pagination').pagination();
    })

})(jQuery);

//     placeholder 占位符
//     tommyshao <jinhong.shao@frontpay.cn>

// API:
// ------
// $(element).placeholder();

+(function($) {
    'use strict';

    var toggle = 'input[placeholder]';

    var input = document.createElement('input');
    var isSupport = 'placeholder' in input;

    // 构造函数
    // ===============
    var Placeholder = function (element) {
        var $this = this;
        $this.$el = $(element);
        this.init();
    };

    Placeholder.VERSION = '1.0.0';

    Placeholder.prototype.init = function () {
        if (isSupport) return;
        var $this = this;
        this.$placeholder = $this.$el.data('placeholder');
        if (!isSupport && !this.$placeholder) {
            var text = $this.$el.attr('placeholder');
            $this.$placeholder = $('<label class="form-placeholder" />').html(text);
            $this.$el.data('placeholder', $this.$placeholder).before($this.$placeholder);
        }

        $this.$el.on('focus', $.proxy(this.focus, this));
        $this.$el.on('blur', $.proxy(this.blur, this));
        $this.$placeholder.on('click', $.proxy(this.focus, this));

        // 默认隐藏placeholder
        this.blur();
    };

    Placeholder.prototype.focus = function () {
        this.$placeholder.hide();
    };

    Placeholder.prototype.blur = function () {
        this.$placeholder[this.$el.val() === '' ? 'show' : 'hide']();
    };


    // 插件定义
    //======================
    function Plugin() {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.placeholder');
            if (!data) $this.data('ui.placeholder', (data = new Placeholder(this)));
        })
    }


    // jQuery 插件扩展
    $.fn.placeholder = Plugin;
    $.fn.placeholder.Constructor = Placeholder;

    // 元素插件绑定
    // ====================
    $(function () {
        $(toggle).placeholder()
    });


})(jQuery);

/*!
 * slider 图片轮播
 * tommyshao <jinhong.shao@frontpay.cn>
 * REFFRENCE: http://unslider.com
 * API:
 *      $(element).slider();
 */

;(function ($, f) {

	'use strict';

	var toggle = '[data-toggle="slider"]';
	//  If there's no jQuery, Unslider can't work, so kill the operation.
	if(typeof $ === 'undefined') return f;

	var Unslider = function() {
		//  Set up our elements
		this.el = f;
		this.items = f;

		//  Dimensions
		this.sizes = [];
		this.max = [0,0];

		//  Current inded
		this.current = 0;

		//  Start/stop timer
		this.interval = f;

		//  Set some options
		this.opts = {
			speed: 500,
			delay: f, // 3000, f for no autoplay
			complete: f, // when a slide's finished
			keys: f, // keyboard shortcuts - disable if it breaks things
			dots: f, // display 鈥⑩€⑩€⑩€鈥� pagination
			fluid: !f, // is it a percentage width?,
			prev: f,
			next: f,
			arrows: f
		};

		//  Create a deep clone for methods where context changes
		var _ = this;

		this.init = function(el, opts) {
			this.el = el;
			this.ul = el.children('ul');
			this.max = [(el.outerWidth() || el.parent().outerWidth()), (el.outerHeight() || el.parent().outerHeight())];
			this.items = this.ul.children('li').each(this.calculate);

			//  Check whether we're passing any options in to Unslider
			this.opts = $.extend(this.opts, opts);

			//  Set up the Unslider
			this.setup();

			return this;
		};

		//  Get the width for an element
		//  Pass a jQuery element as the context with .call(), and the index as a parameter: Unslider.calculate.call($('li:first'), 0)
		this.calculate = function(index) {
			var me = $(this),
					width = me.outerWidth(), height = me.outerHeight();

			//  Add it to the sizes list
			_.sizes[index] = [width, height];
			//  Set the max values
			if(width > _.max[0]) _.max[0] = width;
			if(height > _.max[1]) _.max[1] = height;
		};

		//  Work out what methods need calling
		this.setup = function() {
			var initEvent = $.Event('init.ui.slider', {relatedTarget: this.el });
			//  Set the main element
			this.el.css({
				overflow: 'hidden',
				width: _.max[0],
				height: this.items.first().outerHeight()
			});

			// console.log(_.max[0]);

			//  Set the relative widths
			this.ul.css({width: (this.items.length * 100) + '%', position: 'relative'});
			this.items.css('width', (100 / this.items.length) + '%');

			if(this.opts.delay !== f) {
				this.start();
				this.el.hover(this.stop, this.start);
			}

			//  Custom keyboard support
			this.opts.keys && $(document).keydown(this.keys);

			//  Dot pagination
			this.opts.dots && this.dots();

			//  Little patch for fluid-width sliders. Screw those guys.
			if(this.opts.fluid) {
				var resize = function() {
					_.el.css('width', Math.min(Math.round((_.el.width() / _.el.parent().width()) * 100), 100) + '%');
				};

				resize();
				$(window).off('resize.ui.slider').on('resize.ui.slider', resize);
			}

			if(this.opts.arrows) {
				this.el.parent().append('<p class="arrows"><span class="prev">'+ (this.opts.prevText || 'prev') +'</span><span class="next">'+ (this.opts.nextText || 'next') +'</span></p>')
						.find('.arrows span').off('click').on('click', function() {
					$.isFunction(_[this.className]) && _[this.className]();
				});
			};

			if(this.opts.prev) $(this.opts.prev).off('click').on('click', $.proxy(this.prev, this));
			if(this.opts.next) $(this.opts.next).off('click').on('click', $.proxy(this.next, this));

			//  Swipe support
			if($.event.swipe) {
				this.el.off('swipeleft').on('swipeleft', _.prev).off('swiperight').on('swiperight', _.next);
			}

			this.el.trigger(initEvent)
		};

		//  Move Unslider to a slide index
		this.move = function(index, cb) {
			//  If it's out of bounds, go to the first slide
			if(!this.items.eq(index).length) index = 0;
			if(index < 0) index = (this.items.length - 1);

			var target = this.items.eq(index);
			var obj = {height: target.outerHeight()};
			var speed = cb ? 5 : this.opts.speed;

			var moveEvent = $.Event('move.ui.slider', { relatedTarget: target, curIndex: index });

			if(!this.ul.is(':animated')) {
				//  Handle those pesky dots
				_.el.find('.dot:eq(' + index + ')').addClass('active').siblings().removeClass('active');

				this.el.animate(obj, speed).trigger(moveEvent) && this.ul.animate($.extend({left: '-' + index + '00%'}, obj), speed, function(data) {
					_.current = index;
					$.isFunction(_.opts.complete) && !cb && _.opts.complete(_.el);
				});
			}
		};

		//  Autoplay functionality
		this.start = function() {
			_.interval = setInterval(function() {
				_.move(_.current + 1);
			}, _.opts.delay);
		};

		//  Stop autoplay
		this.stop = function() {
			_.interval = clearInterval(_.interval);
			return _;
		};

		//  Keypresses
		this.keys = function(e) {
			var key = e.which;
			var map = {
				//  Prev/next
				37: _.prev,
				39: _.next,

				//  Esc
				27: _.stop
			};

			if($.isFunction(map[key])) {
				map[key]();
			}
		};

		//  Arrow navigation
		this.next = function(e) { e && e.preventDefault(); return _.stop().move(_.current + 1) };
		this.prev = function(e) {  e && e.preventDefault(); return _.stop().move(_.current - 1) };

		this.dots = function() {
			//  Create the HTML
			var html = '<ol class="dots">';
			$.each(this.items, function(index) { html += '<li class="dot' + (index < 1 ? ' active' : '') + '">' + (index + 1) + '</li>'; });
			html += '</ol>';

			//  Add it to the Unslider
			this.el.addClass('has-dots').append(html).find('.dot').off('click').on('click', function() {
				_.move($(this).index());
			});
		};
	};

	// 插件定义
	//======================
	function Plugin(o, s) {
		var len = this.length;

		//  Enable multiple-slider support
		return this.each(function(index) {
			//  Cache a copy of $(this), so it
			var me = $(this);
			var config = me.data();
			var instance = me.data('ui.slider');

			if(!instance) {
				o = $.extend({}, o, config);
				instance = (new Unslider).init(me, o);
				//  Invoke an Unslider instance
				me.data('ui.slider', instance);
			}
			s = $.extend({}, s, config);
			if(typeof o === 'string') instance[o] && instance[o](me, s);
		});
	}


	// jQuery 插件扩展
	$.fn.slider = Plugin;
	$.fn.slider.Constructor = Unslider;

	// 元素插件绑定
	// ====================
	$(function(){ $(toggle).slider() });

})(jQuery);

/*!
 * smooth-scroll 平滑滚动
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference uikit.smoothscroll.js
 * API:
 *      $(element).placeholder();
 */

+(function($) {

    'use strict';

    if (!$.easing.easeOutExpo) $.easing.easeOutExpo = function (x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };

    // 构造函数
    // ---------
    var SmoothScroll = function (element, options) {
        this.$el = $(element);
        this.options = options;
        this.init();
    };

    SmoothScroll.VERSION = '1.0.0';

    /**
     * 默认配置参数
     * @param duration 动画时间
     * @param transition 动画类型
     * @param offset 距离目标位置
     * @param complete 到达位置时完成执行
     * @type {{duration: number, transition: string, offset: number, complete: (*|number|noop|Function)}}
     */
    SmoothScroll.DEFAULTS = {
        duration: 500,
        transition: 'easeOutExpo',
        offset: 0,
        complete: $.noop
    };

    /**
     * init 初始化
     */
    SmoothScroll.prototype.init = function () {
        this.$el.on('click.ui.smoothScroll', this.scroll(this.$el, this.options));
    };


    /**
     * 滚条
     * @param options
     * @returns {Function}
     */
    SmoothScroll.prototype.scroll = function (elem, options) {
        return function (e) {
            e.preventDefault();
            scrollToElement(elem, $(this.hash).length ? $(this.hash) : $("body"), options);
        }
    };

    /**
     * 完成触发
     */
    function emit(elem) {
        return function () {
            var e = $.Event('done.ui.smoothscroll', {relatedTarget: elem});
            elem.trigger(e);
        }
    };

    /**
     * 滚动条跳转到某元素
     * @param elem 目的元素
     * @param options 配置参数
     */
    function scrollToElement(elem, targetElement, options) {
        options = $.extend({}, SmoothScroll.DEFAULTS, options);

        var target = targetElement.offset().top - options.offset,
            docH = $(document).height(),
            winH = $(window).height();

        if ((target + winH) > docH) {
            target = docH - winH;
        }

        $('html,body')
            .stop()
            .animate({scrollTop: target}, options.duration, options.transition)
            .promise()
            .done([options.complete, emit(elem)]);
    }


    // 插件定义
    // ---------
    function Plugin(options) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.smoothScroll');
            if (!data) {
                $this.data('ui.smoothScroll', (new SmoothScroll(this, $.extend({}, $this.data(), options))));
            } else {
                $this.trigger('click.ui.smoothScroll');
            }
        })
    }


    // jQuery 插件扩展
    $.fn.smoothScroll = Plugin;
    $.fn.smoothScroll.Constructor = SmoothScroll;

    $(function () {
        $('[data-toggle="smooth-scroll"]').smoothScroll()
    })

})(jQuery);

//     switcher 脟脨禄禄脝梅
//     tommyshao <jinhong.shao@frontpay.cn>

// API:
// ------
// <div data-toggle="switcher" [data-except="true"|data-item="a"|data-active="current"]/>
// $(element).switcher({except:true, item: 'a', active: 'current'});
// $(element).on('select.ui.switcher', function(e){ e.relatedTarget; });

+(function($) {

    'use strict';

    var toggle = '[data-toggle="switcher"]';

    // 构造函数
    // ----------
    var Switcher = function (element, option) {
        var $this = this;
        this.$el = $(element);
        this.option = $.extend({}, Switcher.DEFAULTS, option, this.$el.data());
        this.$el.on('click.ui.switcher', this.option.item, function (e) {
            e.stopPropagation();
            e.preventDefault();
            $this.select($(this));
        });
    };

    // 版本号
    // ------
    // 1.0.0
    Switcher.VERSION = '1.0.0';

    // 默认配置参数
    // ----------
    // * `item`
    // * `active`
    // * `except`
    // * `keep`
    Switcher.DEFAULTS = {
        item: 'li',
        active: 'active',
        except: false,
        keep: false
    };

    // 选中
    // -----
    Switcher.prototype.select = function ($target) {
        var o = this.option, e = $.Event('select.ui.switcher', {relatedTarget: $target});
        if (o.keep && $target.hasClass(o.active)) return;
        $target.toggleClass(o.active).trigger(e);
        if (!o.except) $target.siblings(o.item).removeClass(o.active);
    };


    // 插件接口
    // --------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.switcher');

            if (!data) $this.data('ui.switcher', (data = new Switcher(this, option)));
            if (typeof option == 'string') data[option]();
        })
    }


    // jQuery 虏氓录镁脌漏脮鹿
    $.fn.switcher = Plugin;
    $.fn.switcher.Constructor = Switcher;

    // 全局绑定
    // -----------
    $(function () {
        $(toggle).switcher()
    });

})(jQuery);

/*!
 * TAB 切换
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference bootstrap.tab.js
 * API:
 *      $(element).on('closed.ui.alert', function(e, obj){});
 */

+(function($) {
    'use strict';

    var tab = '[data-toggle="tab"],.tabs-btn';

    // 构造函数
    // ----------
    var Tab = function (element) {
        this.$el = $(element);
    };

    Tab.VERSION = '1.0.0';

    // 动画过渡时间
    Tab.TRANSITION_DURATION = 150;

    // 关闭
    // ---------
    Tab.prototype.show = function () {
        var $this = this.$el;
        var $ul = $this.closest('.tabs');
        var selector = $this.data('target');

        if (!selector) { // a标签
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.hasClass('active')) return;

        var $previous = $ul.find('.active a');
        var hideEvent = $.Event('hide.ui.tab', {
            relatedTarget: $this[0]
        });
        var showEvent = $.Event('show.ui.tab', {
            relatedTarget: $previous[0]
        });

        $previous.trigger(hideEvent);
        $this.trigger(showEvent);

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

        var $target = $(selector);

        this.activate($this.closest('li'), $ul);
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.ui.tab',
                relatedTarget: $this[0]
            });
            $this.trigger({
                type: 'shown.ui.tab',
                relatedTarget: $previous[0]
            })
        })
    };

    Tab.prototype.activate = function (element, container, callback) {
        var $active = container.find('> .active');
        var transition = callback
            && $.support.transition
            && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

        function next() {
            $active.removeClass('active').find(tab).attr('aria-expanded', false);

            element.addClass('active').find(tab).attr('aria-expanded', true);

            if (transition) {
                element[0].offsetWidth;
                element.addClass('in');
            } else {
                element.removeClass('fade');
            }

            callback && callback();
        }

        $active.length && transition ?
            $active.one('uiTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION)
            :
            next();
        $active.removeClass('in');
    };


    // 插件定义
    // ----------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.tab');

            if (!data) $this.data('ui.tab', (data = new Tab(this)));
            if (typeof option == 'string') data[option] && data[option]();
        })
    }


    // jQuery 插件扩展
    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;

    // 元素插件绑定
    // -------------
    var clickHandler = function (e) {
        if (!$(e.target).hasClass('tab-disabled')) {
            e.preventDefault();
            Plugin.call($(this), 'show')
        }
    };

    $(function () {
        // $(document).on('click.ui.tab', tab, clickHandler)
        $(document).on('click.ui.tab', function (e) {
            var that = e.target;
            $(that).is(tab) && clickHandler.call(that, e)
        })
    })

})(jQuery);

//     tip提示
//     tommyshao <jinhong.shao@frontpay.cn>
//     Reference uikit.tooltips.js

// API:
// -----
// $(element).tooltips(option);

+(function($) {
    'use strict';

    var toggle = '[data-toggle="tooltips"]';

    // 构造函数
    // ---------
    var Tooltips = function (el, option) {
        this.$el = $(el);
        this.options = $.extend({}, Tooltips.DEFAULTS, this.$el.data(), option && typeof option == "object");
        this.$tooltip = null;
        this.content = '';
        this.tooltipdelay = null;
        this.checkdelay = null;
        this.init();
    };

    Tooltips.VERSION = '1.0.0';

    // 动画过渡时间
    Tooltips.TRANSITION_DURATION = 150;

    Tooltips.DEFAULTS = {
        "offset": 9,
        "pos": "top",
        "animation": true,
        "delay": 0,
        "cls": "",
        "active": "active",
        "content": function (elem, title) {
            title = elem.attr('title');
            if (title) {
                elem.data('cached-title', title).removeAttr('title');
            }
            return elem.data('cached-title');
        }
    };

    // Public Method
    // --------------
    Tooltips.prototype.init = function () {
        var $this = this;

        if (!$this.$tooltip) {
            $this.$tooltip = $('<div class="tooltips"><div class="tooltips-inner"></div><span class="tips-arrow-border"></span><span class="tips-arrow"></span></div>').appendTo('body');
        }

        $this.$el.on({
            focus: function () {
                $this.show()
            },
            blur: function () {
                $this.hide()
            },
            mouseenter: function () {
                $this.show()
            },
            mouseleave: function () {
                $this.hide()
            }
        });
    };

    Tooltips.prototype.show = function () {
        this.content = typeof(this.options.content) === "function" ? this.options.content(this.$el) : this.options.content;

        if (this.tooltipdelay) clearTimeout(this.tooltipdelay);
        if (this.checkdelay) clearTimeout(this.checkdelay);

        if (!this.content.length) return;

        this.$tooltip.stop().css({"top": -2000, "visibility": "hidden"}).removeClass(this.options.active).show();
        this.$tooltip.find(".tooltips-inner").html(this.content);

        var $this = this,
            pos = $.extend({}, this.$el.offset(), {width: this.$el[0].offsetWidth, height: this.$el[0].offsetHeight}),
            width = this.$tooltip[0].offsetWidth,
            height = this.$tooltip[0].offsetHeight,
            offset = typeof(this.options.offset) === "function" ? this.options.offset.call(this.$el) : this.options.offset,
            position = typeof (this.options.pos) === "function" ? this.options.pos.call(this.$el) : this.options.pos,
            tmppos = position.split('-'),
            tcss = {
                "display": "none",
                "visibility": "visible",
                "top": (pos.top + pos.height + height),
                "left": pos.left
            };

        var variants = {
            "bottom": {top: pos.top + pos.height + offset, left: pos.left + pos.width / 2 - width / 2},
            "top": {top: pos.top - height - offset, left: pos.left + pos.width / 2 - width / 2},
            "left": {top: pos.top + pos.height / 2 - height / 2, left: pos.left - width - offset},
            "right": {top: pos.top + pos.height / 2 - height / 2, left: pos.left + pos.width + offset}
        };

        $.extend(tcss, variants[tmppos[0]]);

        if (tmppos.length == 2) tcss.left = (tmppos[1] == "left") ? pos.left : pos.left + pos.width - width;

        var boundary = this.checkBoundary(tcss.left, tcss.top, width, height);

        if (boundary) {
            switch (boundary) {
                case "x":

                    if (tmppos.length == 2) {
                        position = tmppos[0] + '-' + (tcss.left < 0 ? 'left' : 'right');
                    } else {
                        position = tcss.left < 0 ? 'right' : 'left';
                    }

                    break;
                case "y":

                    if (tmppos.length == 2) {
                        position = (tcss.top < 0 ? "bottom" : "top") + "-" + tmppos[1];
                    } else {
                        position = (tcss.top < 0 ? "bottom" : "top");
                    }

                    break;

                case "xy":

                    if (tmppos.length == 2) {
                        position = (tcss.top < 0 ? "bottom" : "top") + "-" + (tcss.left < 0 ? "left" : "right");
                    } else {
                        position = tcss.left < 0 ? "right" : "left";
                    }

                    break;
            }

            tmppos = position.split('-');

            $.extend(tcss, variants[tmppos[0]]);

            if (tmppos.length == 2) tcss.left = (tmppos[1] == "left") ? pos.left : pos.left + pos.width - width;
        }


        tcss.left -= $("body").position().left;

        this.tooltipdelay = setTimeout(function () {
            $this.$tooltip.css(tcss).attr("class", ['tooltips', 'tooltips-' + position, $this.options.cls].join(' '));

            if ($this.options.animation) {
                $this.$tooltip.css({
                    opacity: 0,
                    display: "block"
                }).addClass($this.options.active).animate({opacity: 1}, parseInt($this.options.animation, 10) || 400);
            } else {
                $this.$tooltip.show().addClass($this.options.active);
            }

            $this.tooltipdelay = false;

            $this.checkdelay = setInterval(function () {
                if (!$this.$el.is(':visible')) $this.hide();
            }, 150);

        }, parseInt(this.options.delay, 10) || 0);

    };

    Tooltips.prototype.hide = function () {
        if (this.$el.is('input') && this.$el[0] === document.activeElement) return;

        if (this.tooltipdelay) clearTimeout(this.tooltipdelay);
        if (this.checkdelay) clearTimeout(this.checkdelay);

        this.$tooltip.stop();

        if (this.options.animation) {
            var $this = this;

            this.$tooltip.fadeOut(parseInt(this.options.animation, 10) || 400, function () {
                $this.$tooltip.removeClass($this.options.active);
            })
        } else {
            this.$tooltip.hide().removeClass(this.options.active)
        }

    };

    Tooltips.prototype.checkBoundary = function (left, top, width, height) {
        var axis = "";

        if (left < 0 || (left - $(document).scrollLeft() + width > $(window).width())) {
            axis += "x";
        }

        if (top < 0 || (top - $(document).scrollTop() + height) > $(window).height()) {
            axis += "y";
        }

        return axis;
    };


    // 插件定义
    // ----------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.tooltips');
            if (!data) $this.data('ui.tooltips', (data = new Tooltips(this, option)));
            if (typeof option == 'string') data[option]();
        })
    }


    // jQuery 插件扩展
    // -------------
    $.fn.tooltips = Plugin;
    $.fn.tooltips.Constructor = Tooltips;

    // 元素插件绑定
    // ----------
    var handler = function () {
        $(this).tooltips('show');
    };

    $(function () {
        //$(document).on('mouseenter.tooltip.ui focus tooltip.ui', toggle, handler)
        //$(toggle).tooltips();
        $(document).on('mouseover.tooltip.ui focus.tooltip.ui', function (e) {
            var $this = $(e.target);
            $this.is(toggle) && handler.call($this);
        })
    })
})(jQuery);

//     动画支持判断扩展
//     tommyshao <jinhong.shao@frontpay.cn>
//     Reference bootstrap.transition.js
//     http://getbootstrap.com/javascript/#transitions

// API:
// -----
// $.support.transition
// $(element).one('uiTransitionEnd', fn).emulateTransitionEnd(duration)


+(function($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // --------------------------------------------

    function transitionEnd() {
        var el = document.createElement('ui')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {end: transEndEventNames[name]}
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('uiTransitionEnd', function () {
            called = true
        })
        var callback = function () {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.uiTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

})(jQuery);

return Ui;
}));
