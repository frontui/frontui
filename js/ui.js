/*! 
*  frontui v1.0.2
*  by frontpay FE Team
*  (c) 2016-06-15 www.frontpay.cn
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

//     accordion \u624b\u98ce\u7434
//     \u4f9d\u8d56\u4e8e ui/switcher.js
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

        // \u76f4\u63a5\u8c03\u7528
        $(this).switcher(option);

        // \u4e8b\u4ef6\u76d1\u542c
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


//     \u8b66\u544a\u6846
//     tommyshao <jinhong.shao@frontpay.cn>
//     Reference bootstrap.alert.js
//     API:
//     $(element).on('closed.ui.alert', function(e, obj){});

+(function($) {
    'use strict';

    var dismiss = '[data-dismiss="alert"]';
    var closeBtn = 'em';

    // \u6784\u9020\u51fd\u6570
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

    // \u52a8\u753b\u8fc7\u6e21\u65f6\u95f4
    Alert.TRANSITION_DURATION = 150;

    // \u5173\u95ed
    // -----
    Alert.prototype.close = function (e) {
        var $this = $(this);
        var selector = $(this).attr('data-target');

        if (!selector) { // a[href=#test]\u5173\u95ed id\u4e3atest\u7684alert
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


    // \u63d2\u4ef6\u5b9a\u4e49
    // -------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.alert');

            if (!data) $this.data('ui.alert', (data = new Alert(this, option)));
            if (typeof option == 'string') data[option].call($(this));
        })
    }


    // jQuery \u63d2\u4ef6\u6269\u5c55
    // --------------
    $.fn.alert = Plugin;
    $.fn.alert.Constructor = Alert;

    // \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
    // -----------
    $(function () {
        $(document).on('click.ui.alert', function (e) {
            var that = e.target;
            $(that).is(dismiss) && Alert.prototype.close.call(that, e);
        })
    })
})(jQuery);

//     @appName: checkAll \u5168\u9009
//     @version: v1.0.0
//     @author: TommyShao
//     @Created 2015/12/22
//     @description:
//     @useage:

// **\u7528\u6cd5**
// ```
//      <input type="checkbox" data-toggle="checkAll" data-target="selector" />
//      $(element).on('checked.ui.checkAll', function(e){ e.relatedTarget; });
//      $(element).on('reversed.ui.checkAll', function(e){ e.relatedTarget; });
// ```

+(function($) {
    'use strict';

    // \u5168\u5c40\u7ed1\u5b9a\u9009\u62e9\u5668
    var toggle = '[data-toggle="checkAll"]';

    // \u6784\u9020\u51fd\u6570
    // -------
    // * `element` dom\u5143\u7d20\u5bf9\u8c61

    var CheckAll = function (element) {
        var $this = this;
        $this.$el = $(element);
        $this.$target = $($this.$el.data('target'));
        $this.isReverse = $this.$el.data('reverse');

        // \u76d1\u542c `click` \u70b9\u51fb\u4e8b\u4ef6
        // \u76f4\u63a5\u6267\u884c\u5b9e\u4f8b\u65b9\u6cd5
        // * `reverse` \u53cd\u9009\u529f\u80fd
        // * `activate` \u5168\u9009
        $this.$el.on('click', $.proxy($this.isReverse ? this.reverse : this.activate, this));
    };

    // \u63d2\u4ef6\u7248\u672c\u53f7
    // --------
    // 1.0.0
    CheckAll.VERSION = '1.0.0';

    // \u5168\u9009\u529f\u80fd
    // --------
    // Function activate
    CheckAll.prototype.activate = function () {
        // \u5f53\u524ddom\u5143\u7d20\u662f\u5426\u52fe\u9009
        var isCheck = this.$el.is(':checked');
        // \u521b\u5efa\u9009\u4e2d\u4e8b\u4ef6
        // `relatedTarget` \u7ed1\u5b9a\u4e3a\u5f53\u524ddom\u5143\u7d20
        var e = $.Event('checked.ui.checkAll', {relatedTarget: this.$el});
        // \u8bbe\u7f6e\u6240\u6709\u76ee\u6807\u5143\u7d20\u5c5e\u6027\u4e3a\u9009\u4e2d
        this.$target.prop('checked', isCheck);
        // \u89e6\u53d1\u7528\u6237\u81ea\u5b9a\u4e49\u9009\u4e2d\u4e8b\u4ef6
        this.$el.trigger(e);
    };

    // \u53cd\u9009\u529f\u80fd
    // -------
    CheckAll.prototype.reverse = function () {
        // \u5b9a\u4e49\u53cd\u9009\u4e8b\u4ef6\u7c7b\u578b
        var e = $.Event('reversed.ui.checkAll', {relatedTarget: this.$el});
        // \u904d\u5386\u6240\u6709\u76ee\u6807\u5143\u7d20\uff0c\u5c06\u4ed6\u4eec\u9009\u4e2d\u5c5e\u6027\u53cd\u8f6c
        this.$target.map(function () {
            return $(this).prop('checked', !this.checked)
        });
        // \u89e6\u53d1\u53cd\u9009\u4e8b\u4ef6api
        this.$el.trigger(e);
    };


    // \u63d2\u4ef6\u5b9a\u4e49
    // -------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.checkAll');

            if (!data) $this.data('ui.checkAll', (data = new CheckAll(this)));
            if (typeof option == 'string') data[option]();
        })
    }


    // jQuery \u63d2\u4ef6\u6269\u5c55
    // -------------
    $.fn.checkAll = Plugin;
    $.fn.checkAll.Constructor = CheckAll;

    // \u5168\u5c40\u7ed1\u5b9a\u63d2\u4ef6
    // -------------
    $(function () {
        $(toggle).checkAll()
    });
})(jQuery);

//     \u83dc\u5355\u4e0b\u62c9|select
//     tommyshao <jinhong.shao@frontpay.cn>
//     Reference bootstrap.dropdown.js

// API
// -----
// $(element).on('selected.ui.dropdown', function(e, obj){});

+(function($) {
    'use strict';

    // \u9ed8\u8ba4\u9ad8\u4eae\u7c7b
    var active = 'active';
    // \u7ed1\u5b9a\u9ed8\u8ba4\u9009\u62e9\u5668
    var wrap = '.form-control-dropdown';
    var toggle = '[data-toggle="dropdown"],.form-control-dropdown-value';
    var toggleBtn = '.form-control-dropdown-btn, [data-toggle="dropdown-btn"]';
    var toggleIBtn = '.form-control-dropdown-btn > i, [data-toggle="dropdown-btn"] > i';
    var ul = '.form-control-dropdown-menu';
    var list = '.form-control-dropdown-menu li, [role="list"] li';

    // \u6784\u9020\u51fd\u6570
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

    // \u7248\u672c
    // ----------
    // 1.0.0

    Dropdown.VERSION = '1.0.0';

    // \u9f20\u6807\u70b9\u51fb
    // ---------
    Dropdown.prototype.toggle = function (e) {
        var $this = $(this);

        if ($this.is('.disabled,:disabled')) return;

        dropMenus($this);

        return false
    };

    // \u952e\u76d8\u6309\u952e focus
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

    // \u4e0b\u62c9\u83dc\u5355\u9009\u4e2d
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

    // input\u8f93\u5165\u8fc7\u6ee4
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

    // \u663e\u793a\u5f53\u524d\u5c55\u5f00dropdown
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

    // \u6e05\u9664\u9875\u9762\u6240\u6709dropdown
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

            // \u9690\u85cf\u4e4b\u524d\u81ea\u52a8\u8d4b\u503c
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

    // \u9ed8\u8ba4\u9009\u4e2d
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

    // \u5339\u914d
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


    // \u83b7\u53d6\u54cd\u5e94\u7684\u5143\u7d20
    // --------------
    function getParent(el) {
        var $parent = $(el).data('target') || $(el).parent();
        return $parent;
    }

    // \u83b7\u53d6\u5217\u8868\u9879
    // -----------
    function getList(el) {
        var $parent = getParent(el);
        return $parent.find(list);
    }

    // \u6eda\u52a8\u6761\u81ea\u52a8\u8df3\u5230\u67d0\u4f4d\u7f6e
    // -----------------
    function scrollTop(el, i) {
        var $parent = el.parent();
        var top = el.eq(i).position().top;
        $parent.scrollTop(top);
    }

    // \u63d2\u4ef6\u5b9a\u4e49
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

    // jQuery \u63d2\u4ef6\u6269\u5c55
    // --------------
    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;

    // \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
    // --------------
    $(function () {
        $(toggle).dropdown();
        $(document)
        // \u70b9\u51fb\u9875\u9762\u5176\u4ed6\u5730\u65b9\u6536\u8d77
            .on('click.ui.dropdown', hideAllMenus)
            // \u6309\u94ae\u89e6\u53d1
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
 * \u5f39\u5c42
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference bootstrap.modal.js
 * API:
 *      // \u76d1\u542c\u6253\u5f00
 *      $(element).on('show.ui.modal', function(e, obj){});
 *      $(element).on('shown.ui.modal', function(e, obj){});
 *
 *      // \u76d1\u542c\u5173\u95ed
 *      $(element).on('hide.ui.modal', function(){});
 *      $(element).on('hidden.ui.modal', function(){});

        // \u7ed1\u5b9a\u4e00\u4e2a\u5f39\u7a97
 *      $(element).modal();
 *
 *      // \u81ea\u5b9a\u4e49\u5f39\u7a97
 *      $(id).modal({title: '\u63d0\u793a', content: 'abc'});
        $(id).modal('setContent', 'cdfg');

        // loading
 */

/**
 * log:
 * 1. \u52a0\u5c5e\u6027`tabindex=-1`\u89e3\u51b3\u805a\u7126\u95ee\u9898
 * 2. \u589e\u52a0\u65b9\u6cd5
 *   $.successModalLayer({id:string, title: string, content: string, link: string, callback: function})
     $.confirmModalLayer({id: string, title: string, content: string, callback: function})
     $.alertModalLayer({id: string, icon: string, title: string, content: string})
     $.closeModalLayer(id)
 * 3. \u589e\u52a0\u652f\u6301 iframe
 */

+(function($) {
    'use strict';

    // \u6784\u9020\u51fd\u6570
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

    // \u52a8\u753b\u8fc7\u6e21\u65f6\u95f4
    Modal.TRANSITION_DURATION = 150;

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };

    // \u81ea\u5b9a\u4e49\u5f39\u6846\u6a21\u677f
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
                // dom\u5143\u7d20
                if (option[key] && option[key].length && option.length > 0) return option[key].html();
            });

            element = $(element).hide().appendTo($body)
        }
        return element;
    };

    // \u6253\u5f00
    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget);
    };


    // \u663e\u793a
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

    // \u9690\u85cf
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

    // esc\u5173\u95ed
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
    // \u91cd\u65b0\u7f29\u653e
    Modal.prototype.resize = function () {
    };
    // \u8c03\u6574\u5f39\u6846\u4f4d\u7f6e
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
    // \u83b7\u53d6\u7126\u70b9
    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.ui.modal')
            .on('focusin.ui.modal', $.proxy(function (e) {
                if (this.$el[0] !== e.target && !this.$el.has(e.target).length) {
                    this.$el.trigger('focus');
                }
            }, this))
    };

    // \u6eda\u52a8\u6761
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

    // \u6269\u5c55\u65b9\u6cd5
    Modal.prototype.setContent = function (content) {
        var $content = this.$el.find('.modal-body');
        $content.length && $content.html(content || '');
    };

    // \u8bbe\u7f6e\u6807\u9898
    Modal.prototype.setTitle = function (title) {
        var $title = this.$el.find('.modal-title');
        $title.length && $title.html(title || '')
    };

    // \u8bbe\u7f6e\u5bf9\u8bdd\u6846title
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


    // \u63d2\u4ef6\u5b9a\u4e49
    //======================
    function Plugin(option, _relatedTarget) {
        if (!$(this).length && option && /^#(\w*)/gi.test($(this).selector)) { // js\u521b\u5efa
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
        } else { // \u6a21\u677f
            return $(this).each(function () {
                var $this = $(this);
                var data = $this.data('ui.modal');
                var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
                if (!data) $this.data('ui.modal', (data = new Modal(this, options)));
                if (typeof option == 'string') {
                    data[option](_relatedTarget);
                } else if (options.show) {
                    // \u91cd\u65b0\u8bbe\u7f6e\u6807\u9898
                    if (options.title) data.setTitle(options.title);
                    // \u91cd\u65b0\u8bbe\u7f6e\u5185\u5bb9
                    if (options.content) data.setContent(options.content);

                    data.show(_relatedTarget);
                }
            })
        }
    }


    // jQuery \u63d2\u4ef6\u6269\u5c55
    jQuery.fn.modal = Plugin;
    jQuery.fn.modal.Constructor = Modal;

    //-------------------------
    //--- \u6269\u5c55 ----------------
    //-------------------------
    // ajaxLoading
    jQuery.fn.showLoading = function (title, content) {
        var $this, title = title || '\u5904\u7406\u4e2d...', content = content || '\u8bf7\u4e0d\u8981\u5173\u95ed\u6d4f\u89c8\u5668\uff0c\u7cfb\u7edf\u6b63\u5728\u5904\u7406';
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
                title: '\u63d0\u793a', content: template, callback: function () {
                    $(this).find('.modal-close').hide();
                }
            });
        }
    };

    jQuery.fn.hideLoading = function () {
        return $(this).length && $(this).modal('hide');
    }

    jQuery.showLoading = function (title, content) {
        var id = '#ui-loading';
        return $(id).showLoading(title, content);
    }
    jQuery.hideLoading = function () {
        var id = '#ui-loading';
        return $(id).hideLoading();
    }


    // --------
    // \u81ea\u5b9a\u4e49\u5f39\u5c42
    // --------

    // alert,error,success
    jQuery.fn.modalLayer = function (option) {
        var defaults = {
            icon: 'success',
            title: '\u6210\u529f',
            content: '',
            close: true, // \u9ed8\u8ba4 true \u53ef\u4ee5\u5173\u95ed\uff0cfalse -\u4e0d\u663e\u793a x \u5173\u95ed\u6309\u94ae function\u5173\u95ed\u51fd\u6570
            buttons: [
                {
                    text: '\u786e\u5b9a',
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
         // \u91cd\u65b0\u8bbe\u7f6etitle\uff0ccontent\uff0cicon
         Instance && typeof opt === "object" && Instance.layerUpdate(opt);
         $that.modal('show');
         } else { */
        /*
         * log: \u9690\u85cf\u5373\u5173\u95ed
         * 2015-10-16
         */
        // \u521d\u59cb\u5316
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
        // \u62fc\u63a5\u6309\u94aehtml\u7ed3\u6784
        var btnHtml = [], btns = opt.buttons;
        for (var i = 0; i < btns.length; i++) {
            if (btns[i].href) {
                btnHtml.push('<a href="' + btns[i].href + '" ' + (btns[i].target ? 'target="' + btns[i].target + '"' : '') + ' class="' + (btns[i].style || 'btn primary') + '" data-index="' + i + '">' + btns[i].text + '</a>');
            } else {
                btnHtml.push('<button type="button" class="' + (btns[i].style || 'btn primary') + '" data-index="' + i + '">' + btns[i].text + '</button>');
            }
        }

        // \u6dfb\u52a0\u81ea\u5b9a\u4e49\u6309\u94aehtml
        template.splice(-1, 0, btnHtml.join(''));

        // \u81ea\u5b9a\u4e49\u5bf9\u8bdd\u5f39\u5c42\u5b9e\u4f8b
        $that = $(this).modal({
            title: '\u63d0\u793a', content: template.join(''), callback: function (obj) {
                // \u6309\u94ae\u70b9\u51fb\u89e6\u53d1\u914d\u7f6e\u56de\u8c03\u51fd\u6570\uff0c\u6ca1\u6709\u914d\u7f6e\u5219\u9ed8\u8ba4\u5173\u95ed\u5c42
                $(this).on('click', '.in-modal-btns .btn', function () {
                        // \u83b7\u53d6\u5f53\u524d\u6309\u94ae\u4f4d\u7f6e, e \u83b7\u53d6\u7528\u6237\u51b3\u5b9a\u6309\u94ae\u662f\u5426\u53ef\u4ee5\u5173\u95ed\u5c42\uff0c\u56de\u8c03\u51fd\u6570return false\u5219\u4e0d\u5173\u95ed\u5c42
                        var index = $(this).data('index'), e = true;
                        // \u76d1\u6d4b\u7528\u6237\u662f\u5426\u914d\u7f6e\u56de\u8c03\u51fd\u6570
                        if (opt.buttons.length && opt.buttons[index] && opt.buttons[index]['ok']) {
                            // ok\u4e3a\u51fd\u6570\u624d\u6267\u884c
                            if (opt.buttons[index]['ok'] && typeof  opt.buttons[index]['ok'] === "function") {
                                // \u83b7\u53d6\u7528\u6237\u662f\u5426\u5173\u95ed\u5c42\u6307\u4ee4\uff0c\u9ed8\u8ba4\u5173\u95ed
                                e = opt.buttons[index]['ok'].call(null, $(this), index) === false ? false : true;
                            }
                        }

                        $($that.selector).data('options', opt);
                        // \u6307\u4ee4\u4e3atrue\u65f6\u5173\u95ed\u5c42
                        e && $($that.selector).modal('hide')
                    })
                    .on('hide.ui.modal', function () {  // \u8c03\u7528\u9690\u85cf\u7684\u65f6\u5019\u5220\u9664dom
                        $(this).remove();
                    });

                // \u4e0d\u663e\u793a\u5173\u95ed
                if (!opt.close) $($that.selector).find('.modal-close').hide();
                // \u5173\u95ed\u56de\u8c03
                if ($.isFunction(opt.close)) {
                    $(this).on('hide.ui.modal', opt.close)
                }
            }
        });
        /*  } */
    };


    // \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
    // ====================
    var Handler = function () {
        var $this = $(this);
        var href = $(this).attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
        var option = $target.data('ui.modal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());

        // \u5b9e\u4f8b\u5316
        Plugin.call($target, option, this);
    };
    var initModal = function () {
        $(document).on('click.ui.modal', '[data-toggle="modal"]', function (e) {
            var that = e.target;
            $(that).is('[data-toggle="modal"]') && Handler.call(that, e);
        });

        // \u5168\u5c40\u7ed1\u5b9a\uff0c\u9ed8\u8ba4\u4e0d\u663e\u793a
        //$('.modal-background:not(".display-none")').modal();
    };

    $(initModal);


    // --------
    // \u6269\u5c55\u6210\u529f\u5931\u8d25\u5f39\u7a97
    /**
     * \u4f9d\u8d56 /js/ui/modal.js
     * @param {string} icon \u56fe\u6807\u6837\u5f0f
     * @param {string} title \u63d0\u793a\u6807\u9898
     * @param {string|html} \u63d0\u793a\u5185\u5bb9
     * @param {array} buttons \u6309\u94ae\u5b9a\u4e49
     */
    // \u6210\u529f\u5f39\u5c42
    var successModalLayer = (function () {
        return function (config) {
            var id = config['id'] ? config['id'] : '#j-modal-status';
            // \u4f7f\u7528modalLayer api
            $(id).modalLayer({
                icon: 'success',
                title: (config['title'] || ''),
                content: (config['content'] || ''),
                buttons: [
                    {
                        text: '\u786e\u8ba4',
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
    })();

    // \u786e\u8ba4\u8be2\u95ee\u5f39\u5c42
    var confirmModalLayer = (function () {
        return function (config) {
            var id = config['id'] ? config['id'] : '#confirmModalLayer';
            $(id).modalLayer({
                icon: 'info',
                title: (config['title'] || ''),
                content: (config['content'] || ''),
                buttons: [
                    {
                        text: '\u786e\u5b9a',
                        ok: config['callback']
                    },
                    {
                        text: '\u53d6\u6d88',
                        href: 'javascript:void(0);',
                        style: 'btn links fn-ml-10'
                    }
                ]
            });
        }
    })();

    // \u8b66\u544a\u5f39\u5c42
    var alertModalLayer = (function () {
        return function (config) {
            var id = config['id'] ? config['id'] : '#alertModalLayer';
            $(id).modalLayer({
                icon: (config['icon'] || 'info'),
                title: (config['title'] || ''),
                content: (config['content'] || ''),
                buttons: [
                    {
                        text: '\u786e\u5b9a',
                        ok: config['callback']
                    }
                ]
            });
        }
    })();

    // \u5173\u95ed\u5f39\u5c42\u4e0d\u662f\u9690\u85cf
    var closeModalLayer = (function () {
        return function (id, fn) {
            $(id).modal('hide').on('hide.ui.modal', function () {
                $(this).remove();
                typeof fn === 'function' && fn();
            })
        }
    })();


    // \u5916\u90e8
    jQuery.successModalLayer = successModalLayer;
    jQuery.confirmModalLayer = confirmModalLayer;
    jQuery.alertModalLayer = alertModalLayer;
    jQuery.closeModalLayer = closeModalLayer;


    // ---------------
    // --- \u6269\u5c55 \u652f\u6301iframe

    /**
     * \u6269\u5c55modal,iframe modal
     * \u7b80\u5355\u6307
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

            // \u8bbe\u7f6e\u9ed8\u8ba4\u4e3ahide
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
         * \u521d\u59cb\u5316iframe\u5bf9\u8c61
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

        // \u91cd\u65b0\u8bbe\u7f6e title,content
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
         * iframe\u81ea\u9002\u5e94\u9ad8\u5ea6
         */
        dialogApi.prototype.adjustHeight = function () {
            var test, h;

            try {
                // \u8de8\u57df\u6d4b\u8bd5
                test = this.$iframe[0].contentWindow.frameElement;
            } catch (e) {
            }

            if (test) {
                h = this.$iframe.contents().height();
                this.$iframe.css({height: h + 'px'})
            }
        }

        /**
         * iframe\u8c03\u7528\u7236\u7a97\u53e3
         * @param opt
         */

        /**
         * \u663e\u793a
         */
        dialogApi.prototype.show = function () {
            this.dialog.modal('show');
        }

        /**
         * \u9690\u85cf
         */
        dialogApi.prototype.hide = function () {
            this.dialog.modal('hide');
        }

        /**
         * \u83b7\u53d6\u7236\u7a97\u53e3
         * @param opt
         */
        dialogApi.get = dialogApi.prototype.get = function (id) {
            // \u4eceiframe\u4e2d\u4f20\u5165window
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
         * \u91cd\u590d\u4e86\uff0c\u6682\u65e0\u65b9\u6cd5\u4f18\u5316
         * @param id
         */
        dialogApi.adjustHeight = function (id) {
            var dialog = dialogApi.get(id);
            var $iframe = $(dialog).find('iframe');
            var test, h;

            try {
                // \u8de8\u57df\u6d4b\u8bd5
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

            // \u8c03\u7528\u5173\u95ed\u65b9\u6cd5
            if (typeof opt === 'string') {
                data[opt] && data[opt](args)
            }
        };

        $(function () {
            $(document).on('click', '[data-toggle="iframeModal"]', function (e) {
                e.preventDefault();
                var title = $(this).attr('data-title') || '\u63d0\u793a';
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
 * Notify \u901a\u77e5
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

    // \u5b58\u653e\u65b9\u4f4d\u96c6\u5408
    var containers = {};
    //  \u901a\u77e5\u96c6\u5408
    var messages = {};
    // \u63a5\u53e3\uff0c\u6269\u5c55$.notify
    var notify = function (options) {
        if (typeof options === 'string') {
            options = {message: options};
        }

        if (arguments[1]) {
            options = $.extend(options, typeof arguments[1] === 'string' ? {status: arguments[1]} : arguments[1]);
        }

        return (new Notify(options)).show();
    };
    // \u5173\u95ed\u6240\u6709\u63a5\u53e3
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

    // \u6784\u9020\u51fd\u6570
    // ===============
    var Notify = function (options) {

        this.timeout = false;
        this.currentStatus = "";
        this.group = false;
        this.options = $.extend({}, Notify.DEFAULTS, options);

        // uuid \u8bbe\u7f6e\u552f\u4e00id
        this.uuid = 'Notify_' + Math.random().toString(36).substr(2);

        // \u521b\u5efa\u5143\u7d20
        this.$el = $([
            '<div class="notify-message">',
            '<a class="notify-close">&times;</a>',
            '<div></div>',
            '</div>'
        ].join('')).data('ui.notify', this);

        // \u8bbe\u7f6e\u5185\u5bb9
        this.content(this.options.message);

        // \u8bbe\u7f6e\u72b6\u6001
        if (this.options.status) {
            this.$el.addClass('notify-message-' + this.options.status);
            this.currentStatus = this.options.status;
        }

        // \u5206\u7ec4
        this.group = this.options.group;

        // \u6d88\u606f\u6309uuid\u5b58\u653e
        messages[this.uuid] = this;

        // \u65b9\u4f4d\u5b58\u653e
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
        message: "", // \u63d0\u793a\u5185\u5bb9
        status: "",  // \u72b6\u6001\uff0c\u6837\u5f0f\u989c\u8272
        opacity: .85, // \u5c42\u900f\u660e\u5ea6
        timeout: 5000, // \u5b9a\u65f6\u5ef6\u8fdf\u6d88\u5931
        group: null,   // \u662f\u5426\u5206\u7ec4
        pos: "top-center", // \u5b9a\u4f4d
        onClose: function () {
        }  // \u5173\u95ed\u89e6\u53d1\u4e8b\u4ef6
    };

    // Public Method
    // ===============
    /* \u663e\u793a */
    Notify.prototype.show = function () {
        if (this.$el.is(':visible')) return;

        var $this = this;

        // \u65b9\u4f4d\u6dfb\u52a0\u5143\u7d20
        containers[this.options.pos].show().prepend(this.$el);

        var marginbottom = parseInt(this.$el.css('margin-bottom'), 10);

        // \u52a8\u753b\u663e\u793a
        this.$el.css({opacity: 0, "margin-top": -1 * this.$el.outerHeight(), "margin-bottom": 0})
            .animate({opacity: this.options.opacity, "margin-top": 0, "margin-bottom": marginbottom}, function () {
                if ($this.options.timeout) { // \u5ef6\u65f6\u5173\u95ed
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

    /* \u5173\u95ed */
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

    /* \u8bbe\u7f6e\u5185\u5bb9\u6216\u83b7\u53d6 */
    Notify.prototype.content = function (html) {
        var container = this.$el.find('>div');

        if (!html) {
            return container.html();
        }

        container.html(html);

        return this;
    };

    /* \u8bbe\u7f6e\u72b6\u6001\u53ca\u6837\u5f0f */
    Notify.prototype.status = function (status) {
        if (!status) {
            return this.currentStatus;
        }

        this.$el.removeClass('nofity-message-' + this.currentStatus).addClass('notify-message-' + status);

        this.currentStatus = status;

        return this;
    };


    // \u63d2\u4ef6\u5b9a\u4e49
    //======================
    function Plugin(option) {
        return $(this).on('click', function () {
            option = typeof option === 'string' ? {message: option} : option;
            var data = new Notify(option);
            data.show();
        });
    }


    // jQuery \u63d2\u4ef6\u6269\u5c55
    $.notify = notify;
    $.notify.closeAll = closeAll;
    $.fn.notify = Plugin;
    $.fn.notify.Constructor = Notify;

})(jQuery);

/*!
 * \u5206\u9875|pagination
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

    // \u9ed8\u8ba4\u9ad8\u4eae\u7c7b
    var active = 'active';
    // \u5206\u9875\u603b\u7801\u6570\u6a21\u677f
    var pageStr = '<p class="pull-left fs-12 lh-26">\u5171{$pages}\u9875\uff0c{$items}\u6761\u8bb0\u5f55\uff0c\u6bcf\u9875\u663e\u793a{$itemsOnPage}\u6761\u3002</p>';


    // \u6784\u9020\u51fd\u6570
    // @param {object} element \u5bb9\u5668dom\u5143\u7d20
    // @param {json}   options \u914d\u7f6e\u53c2\u6570\u9762\u91cf
    // ===============
    var Pagination = function (element, options) {
        // \u5206\u9875\u4e3b\u5bb9\u5668
        this.$el = $(element);
        // \u521d\u59cb\u5316
        this._init(options);
    };

    // \u7248\u672c
    Pagination.VERSION = '1.0.0';
    // \u5206\u9875\u9ed8\u8ba4\u53c2\u6570
    Pagination.DEFAULTS = {
        // \u603b\u8bb0\u5f55\u6570
        items: 1,
        // \u6bcf\u9875\u8bb0\u5f55\u6570
        itemsOnPage: 1,
        // \u603b\u9875\u6570
        pages: 0,
        // \u53ea\u663e\u793a\u9875\u6570\u533a\u95f4
        displayedPages: 8,
        // \u5230\u672b\u9875\u663e\u793a\u591a\u5c11\u9875\u7801
        edges: 1,
        // \u5f53\u524d\u9875
        currentPage: 0,
        // \u5206\u9875\u603b\u7801\u6570\u5b57\u7b26, \u9ed8\u8ba4\u4e0d\u663e\u793a, show-\u662f\u5426\u663e\u793a, template \u5b57\u7b26\u6a21\u677f
        pageStr: {show: false, template: ''},
        lblPrev: '\u4e0a\u4e00\u9875', //\u4e0a\u4e00\u9875
        lblNext: '\u4e0b\u4e00\u9875', //\u4e0b\u4e00\u9875
        // \u9009\u4e2d\u89e6\u53d1\u4e8b\u4ef6
        onSelectPage: function () {
        }
    };

    // \u521d\u59cb\u5316
    // =================
    Pagination.prototype._init = function (options, inited) {
        var $this = this;

        this._setOption(options);

        $this.itemsOnPage = this.options.itemsOnPage;
        $this.items = this.options.items;
        $this.current = this.options.currentPage;

        // \u603b\u9875\u6570
        $this.pages = $this.options.pages ? $this.options.pages : Math.ceil($this.items / this.itemsOnPage) ? Math.ceil($this.items / $this.itemsOnPage) : 1;

        // \u5f53\u524d\u9875\uff0c\u4ece0\u5f00\u59cb
        $this.currentPage = $this.options.currentPage - 1;
        // \u9875\u6570\u533a\u95f4\u7684\u4e00\u534a
        $this.halfDisplayed = $this.options.displayedPages / 2;

        // dom \u6e32\u67d3
        $this._render();

        // \u7ed1\u5b9a\u70b9\u51fb\u5207\u6362\u9875\u7801
        !!!inited && $this.$el.on('click', 'a[data-page]', function (e) {
            e.preventDefault();
            $this.selectPage($(this).data('page'));
        });
    };

    Pagination.prototype.init = function (options) {
        this._init(options, true);
    };

    // \u79c1\u6709\u65b9\u6cd5
    // \u8bbe\u7f6e\u914d\u7f6e
    Pagination.prototype._setOption = function (options) {
        this.options = $.extend({}, Pagination.DEFAULTS, options);
    };

    // \u5207\u6362\u9875\u7801
    Pagination.prototype.selectPage = function (pageIndex, pages) {
        // \u5207\u6362\u5230\u8bbe\u7f6e\u9875
        this.currentPage = pageIndex - 1;
        this.current = pageIndex;
        // \u91cd\u65b0\u6e32\u67d3dom
        this.render(pages);

        // \u89e6\u53d1\u5207\u6362\u9009\u62e9\u51fd\u6570
        this.options.onSelectPage(pageIndex, this);
        // \u89e6\u53d1api\u63a5\u53e3
        this.$el.trigger('select.ui.pagination', [pageIndex, this]);
    };

    Pagination.prototype._render = function () {
        var o = this.options, interval = this._getInterval(), i;
        // \u6e05\u7a7adom
        this.$el.empty().prevAll().remove();
        if (this.pages <= 1) return;

        // \u4e0a\u4e00\u9875,false\u65f6\u4e0d\u663e\u793a\uff0c\u5f53\u524d\u9875-1\uff0ctext\u4e3a\u663e\u793a\u6587\u5b57\uff0ctrue\u4e3a\u81ea\u5b9a\u4e49label
        //console.log('currentPage:'+ o.currentPage)
        if (o.lblPrev && this.currentPage - 1 >= 0) this._append(this.currentPage - 1, {text: o.lblPrev}, true);


        // \u5de6\u8fb9\u9996\u9875\u663e\u793a\u8fb9\u7f18\u9875\u6570
        if (interval.start > 0 && o.edges > 0) { // \u663e\u793a\u672b\u9875
            var end = Math.min(o.edges, interval.start);
            for (i = 0; i < end; i++) this._append(i);

            if (o.edges < interval.start && (interval.start - o.edges != 1)) {
                this.$el.append('<li><span>...</span></li>')
            } else if (interval.start - o.edges == 1) {
                this._append(o.edges);
            }
        }

        // \u663e\u793a (\u5f53\u524d\u9875-4, \u5f53\u524d\u9875\uff0c \u5f53\u524d\u9875+4)
        for (i = interval.start; i < interval.end; i++) this._append(i);

        // \u53f3\u8fb9\u672b\u9875\u663e\u793a\u8fb9\u7f18\u9875\u6570
        if (interval.end < this.pages && o.edges > 0) {
            if (this.pages - o.edges > interval.end && (this.pages - o.edges - interval.end != 1)) {
                this.$el.append('<li><span>...</span></li>')
            } else if (this.pages - o.edges - interval.end == 1) {
                this._append(interval.end++);
            }

            var begin = Math.max(this.pages - o.edges, interval.end);

            for (i = begin; i < this.pages; i++) this._append(i);
        }

        // \u4e0b\u4e00\u9875,false\u65f6\u4e0d\u663e\u793a\uff0c\u5f53\u524d\u9875+1\uff0ctext\u4e3a\u663e\u793a\u6587\u5b57\uff0ctrue\u4e3a\u81ea\u5b9a\u4e49label
        //console.log(this.currentPage, this.pages)
        if (o.lblNext && this.currentPage < this.pages - 1) this._append(this.currentPage + 1, {text: o.lblNext}, true);

        this.renderPageStr();
    };

    // \u6e32\u67d3\u603b\u9875\u7801
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

    // \u91cd\u65b0\u6e32\u67d3,\u5916\u90e8\u63a5\u53e3
    Pagination.prototype.render = function (pages) {
        this.pages = pages ? pages : this.pages;
        this._render();
    };

    // \u83b7\u53d6\u663e\u793a\u9875\u7801\u8303\u56f4
    Pagination.prototype._getInterval = function () {
        return {
            start: Math.ceil(
                // \u5f53\u524d\u9875\u662f\u5426\u5927\u4e8e\u663e\u793a\u8303\u56f4\u7684\u4e00\u534a
                this.currentPage > this.halfDisplayed
                    ? Math.max(
                    // \u4ece\u5f53\u524d\u9875-\u663e\u793a\u4e00\u534a\u8303\u56f4\u5f00\u59cb
                    Math.min(this.currentPage - this.halfDisplayed, (this.pages - this.options.displayedPages))
                    // \u5f53\u524d\u9875\u5c0f\u4e8e\u4e00\u534a\u4e14\u603b\u9875\u6570\u5c0f\u4e8e\u663e\u793a\u8303\u56f4\uff0c\u4ece\u7b2c\u4e00\u9875\u5f00\u59cb
                    , 0)
                    // \u4ece\u7b2c\u4e00\u9875\u5f00\u59cb
                    : 0),
            end: Math.ceil(
                // \u5f53\u524d\u9875\u662f\u5426\u5927\u4e8e\u663e\u793a\u8303\u56f4\u7684\u4e00\u534a
                this.currentPage > this.halfDisplayed
                    // \u5f53\u524d\u9875+\u663e\u793a\u8303\u56f4\u7684\u4e00\u534a
                    ? Math.min(this.currentPage + this.halfDisplayed, this.pages)
                    // \u7ed3\u675f\u4e3a\u6700\u591a\u663e\u793a\uff0c\u672b\u9875
                    : Math.min(this.options.displayedPages, this.pages))
        }
    };

    // \u91cd\u65b0\u7ec4\u7ec7dom\u7ed3\u6784
    // pageIndex \u6e32\u67d3\u9875\u7801
    // opts \u6587\u672c\u914d\u7f6e
    // islb \u662f\u5426\u4e0a\u4e00\u9875\u4e0b\u4e00\u9875\uff0c\u662f\u6c38\u4e0d\u52a0active
    Pagination.prototype._append = function (pageIndex, opts, islb) {
        var $this = this, item, options;

        // \u5224\u65ad\u9996\u9875\uff0c\u672b\u9875\uff0c\u5e38\u89c4\u9875
        pageIndex = pageIndex < 0 ? 0 : (pageIndex < this.pages ? pageIndex : this.pages - 1);
        options = $.extend({text: pageIndex + 1}, opts);

        // console.log(pageIndex, this.currentPage, islb)

        // \u5224\u65ad\u5f53\u524d\u9875\u4e0e\u975e\u5f53\u524d\u9875
        item = (pageIndex == this.currentPage) ?
            // \u5f53\u524d\u9875\uff0c \u4e0a\u4e00\u9875\u4e0b\u4e00\u9875\u4e0d\u52a0active\u7c7b
        '<li ' + (islb ? '' : 'class="' + active + '"') + '><a href="javascript:void(0);">' + (options.text) + '</a></li>'
            // \u5206\u5f53\u524d\u9875\u6807\u8bc6\u4e3a\u53ef\u70b9\u51fb
            : '<li><a href="#page-' + (pageIndex + 1) + '" data-page="' + (pageIndex + 1) + '">' + options.text + '</a></li>';

        $this.$el.append(item);
    };

    // \u63d2\u4ef6\u5b9a\u4e49
    //======================
    function Plugin(options) {
        // \u83b7\u53d6\u4f20\u5165\u53c2\u6570\uff0c\u53ef\u80fd\u4e0d\u6b62options\u4e00\u4e2a\u53c2\u6570
        var args = arguments;
        // jquery \u94fe\u5f0f
        return $(this).each(function () {
            var $this = $(this);
            if ($this.hasClass('no-js')) return;
            var data = $this.data('ui.pagination');

            // \u521b\u5efa\u4e00\u4e2a\u65b0\u5b9e\u4f8b
            if (!data) $this.data('ui.pagination', (data = new Pagination($this, $.extend({}, $this.data(), options))));

            if (typeof options == 'string') { // \u8c03\u7528\u63a5\u53e3\u65b9\u6cd5,\u7b2c\u4e8c\u4e2a\u53c2\u6570\u4e3a\u65b9\u6cd5\u4f20\u5165\u53c2\u6570
                data[options].apply(data, [].slice.call(args, 1));
            }
        })
    }

    // jQuery \u63d2\u4ef6\u6269\u5c55
    $.fn.pagination = Plugin;
    $.fn.pagination.Constructor = Pagination;

    // \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
    // ====================
    $(function () {
        $('[ui-pagination],.pagination').pagination();
    })

})(jQuery);

//     placeholder \u5360\u4f4d\u7b26
//     tommyshao <jinhong.shao@frontpay.cn>

// API:
// ------
// $(element).placeholder();

+(function($) {
    'use strict';

    var toggle = 'input[placeholder]';

    var input = document.createElement('input');
    var isSupport = 'placeholder' in input;

    // \u6784\u9020\u51fd\u6570
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

        // \u9ed8\u8ba4\u9690\u85cfplaceholder
        this.blur();
    };

    Placeholder.prototype.focus = function () {
        this.$placeholder.hide();
    };

    Placeholder.prototype.blur = function () {
        this.$placeholder[this.$el.val() === '' ? 'show' : 'hide']();
    };


    // \u63d2\u4ef6\u5b9a\u4e49
    //======================
    function Plugin() {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.placeholder');
            if (!data) $this.data('ui.placeholder', (data = new Placeholder(this)));
        })
    }


    // jQuery \u63d2\u4ef6\u6269\u5c55
    $.fn.placeholder = Plugin;
    $.fn.placeholder.Constructor = Placeholder;

    // \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
    // ====================
    $(function () {
        $(toggle).placeholder()
    });


})(jQuery);

/*!
 * slider \u56fe\u7247\u8f6e\u64ad
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
			dots: f, // display \u9225\u2469\u20ac\u2469\u20ac\u2469\u20ac\ue555\u9225\ufffd pagination
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

	// \u63d2\u4ef6\u5b9a\u4e49
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


	// jQuery \u63d2\u4ef6\u6269\u5c55
	$.fn.slider = Plugin;
	$.fn.slider.Constructor = Unslider;

	// \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
	// ====================
	$(function(){ $(toggle).slider() });

})(jQuery);

/*!
 * smooth-scroll \u5e73\u6ed1\u6eda\u52a8
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

    // \u6784\u9020\u51fd\u6570
    // ---------
    var SmoothScroll = function (element, options) {
        this.$el = $(element);
        this.options = options;
        this.init();
    };

    SmoothScroll.VERSION = '1.0.0';

    /**
     * \u9ed8\u8ba4\u914d\u7f6e\u53c2\u6570
     * @param duration \u52a8\u753b\u65f6\u95f4
     * @param transition \u52a8\u753b\u7c7b\u578b
     * @param offset \u8ddd\u79bb\u76ee\u6807\u4f4d\u7f6e
     * @param complete \u5230\u8fbe\u4f4d\u7f6e\u65f6\u5b8c\u6210\u6267\u884c
     * @type {{duration: number, transition: string, offset: number, complete: (*|number|noop|Function)}}
     */
    SmoothScroll.DEFAULTS = {
        duration: 500,
        transition: 'easeOutExpo',
        offset: 0,
        complete: $.noop
    };

    /**
     * init \u521d\u59cb\u5316
     */
    SmoothScroll.prototype.init = function () {
        this.$el.on('click.ui.smoothScroll', this.scroll(this.$el, this.options));
    };


    /**
     * \u6eda\u6761
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
     * \u5b8c\u6210\u89e6\u53d1
     */
    function emit(elem) {
        return function () {
            var e = $.Event('done.ui.smoothscroll', {relatedTarget: elem});
            elem.trigger(e);
        }
    };

    /**
     * \u6eda\u52a8\u6761\u8df3\u8f6c\u5230\u67d0\u5143\u7d20
     * @param elem \u76ee\u7684\u5143\u7d20
     * @param options \u914d\u7f6e\u53c2\u6570
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


    // \u63d2\u4ef6\u5b9a\u4e49
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


    // jQuery \u63d2\u4ef6\u6269\u5c55
    $.fn.smoothScroll = Plugin;
    $.fn.smoothScroll.Constructor = SmoothScroll;

    $(function () {
        $('[data-toggle="smooth-scroll"]').smoothScroll()
    })

})(jQuery);

//     switcher \u811f\u8128\u7984\u7984\u811d\u6885
//     tommyshao <jinhong.shao@frontpay.cn>

// API:
// ------
// <div data-toggle="switcher" [data-except="true"|data-item="a"|data-active="current"]/>
// $(element).switcher({except:true, item: 'a', active: 'current'});
// $(element).on('select.ui.switcher', function(e){ e.relatedTarget; });

+(function($) {

    'use strict';

    var toggle = '[data-toggle="switcher"]';

    // \u6784\u9020\u51fd\u6570
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

    // \u7248\u672c\u53f7
    // ------
    // 1.0.0
    Switcher.VERSION = '1.0.0';

    // \u9ed8\u8ba4\u914d\u7f6e\u53c2\u6570
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

    // \u9009\u4e2d
    // -----
    Switcher.prototype.select = function ($target) {
        var o = this.option, e = $.Event('select.ui.switcher', {relatedTarget: $target});
        if (o.keep && $target.hasClass(o.active)) return;
        $target.toggleClass(o.active).trigger(e);
        if (!o.except) $target.siblings(o.item).removeClass(o.active);
    };


    // \u63d2\u4ef6\u63a5\u53e3
    // --------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.switcher');

            if (!data) $this.data('ui.switcher', (data = new Switcher(this, option)));
            if (typeof option == 'string') data[option]();
        })
    }


    // jQuery \u864f\u6c13\u5f55\u9541\u810c\u6f0f\u812e\u9e7f
    $.fn.switcher = Plugin;
    $.fn.switcher.Constructor = Switcher;

    // \u5168\u5c40\u7ed1\u5b9a
    // -----------
    $(function () {
        $(toggle).switcher()
    });

})(jQuery);

/*!
 * TAB \u5207\u6362
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference bootstrap.tab.js
 * API:
 *      $(element).on('closed.ui.alert', function(e, obj){});
 */

+(function($) {
    'use strict';

    var tab = '[data-toggle="tab"],.tabs-btn';

    // \u6784\u9020\u51fd\u6570
    // ----------
    var Tab = function (element) {
        this.$el = $(element);
    };

    Tab.VERSION = '1.0.0';

    // \u52a8\u753b\u8fc7\u6e21\u65f6\u95f4
    Tab.TRANSITION_DURATION = 150;

    // \u5173\u95ed
    // ---------
    Tab.prototype.show = function () {
        var $this = this.$el;
        var $ul = $this.closest('.tabs');
        var selector = $this.data('target');

        if (!selector) { // a\u6807\u7b7e
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


    // \u63d2\u4ef6\u5b9a\u4e49
    // ----------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.tab');

            if (!data) $this.data('ui.tab', (data = new Tab(this)));
            if (typeof option == 'string') data[option] && data[option]();
        })
    }


    // jQuery \u63d2\u4ef6\u6269\u5c55
    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;

    // \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
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

//     tip\u63d0\u793a
//     tommyshao <jinhong.shao@frontpay.cn>
//     Reference uikit.tooltips.js

// API:
// -----
// $(element).tooltips(option);

+(function($) {
    'use strict';

    var toggle = '[data-toggle="tooltips"]';

    // \u6784\u9020\u51fd\u6570
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

    // \u52a8\u753b\u8fc7\u6e21\u65f6\u95f4
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


    // \u63d2\u4ef6\u5b9a\u4e49
    // ----------
    function Plugin(option) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.tooltips');
            if (!data) $this.data('ui.tooltips', (data = new Tooltips(this, option)));
            if (typeof option == 'string') data[option]();
        })
    }


    // jQuery \u63d2\u4ef6\u6269\u5c55
    // -------------
    $.fn.tooltips = Plugin;
    $.fn.tooltips.Constructor = Tooltips;

    // \u5143\u7d20\u63d2\u4ef6\u7ed1\u5b9a
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

//     \u52a8\u753b\u652f\u6301\u5224\u65ad\u6269\u5c55
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
