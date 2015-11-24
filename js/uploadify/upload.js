/**
 * @appName : 上传控件扩展
 * @created : tommyshao
 * @date    : 2015-11-23
 *
 * 说明：依赖jquery.uploadify
 *      选择器一定要是id
 */
!(function(root, $) {
  // 文件上传
  var FileUpload = function(el, option){
    this.$el = $(el);
    this.$parent = this.$el.parent();
    this.option = $.extend({}, FileUpload.DEFAULTS, option);
    this.$input = $(this.option.inputText);
    this.$queue = null;
    if(!this.$input.length && !this.option['itemTemplate']) {
      alert('FileUpload:配置参数input尚未配置');
      return;
    }

    this.init();
    return this;
  };

  FileUpload.errMsg = {
    '-100': '超出上传限制个数',
    '-110' : '超出了文件大小',
    '-120': '文件为空',
    '-130': '文件格式有误',
    '-200': '网络断开',
    '-210': '上传地址有误',
    '-220': '文件读写错误',
    '-230': '权限不足',
    '-240': '上传限制超过',
    '-250': '上传失败',
    '-260': '未找到指定文件',
    '-270': '文件验证失败',
    '-280': '文件被取消',
    '-290': '上传中断'
  };

  FileUpload.DEFAULTS = {
    auto: true,
    // verify 上传之前验证
    beforeUpload: function() {
      return true;
    },
    // 文本框，最后存放文件上传成功的路径，且做进度条的定位作用
    inputText: '#j-uploadfile',
    // dom元素，显示文件名
    fileName: '',
    buttonText: '选择图片',
    multi     : false,
    removeCompleted: false,
    fileSizeLimit : '200KB',
    //uploadLimit : 1,
    //queueSizeLimit: 1,
    // flash所在地址
    swf       : 'javascript/uploadify/uploadify.swf',
    // 图片上传地址
    uploader  : 'javascript/uploadify/uploadify.php',
    fileTypeExts: "*.jpg;*.png",
    fileTypeDesc: "请选择 jpg png 文件",
    // 允许重写
    'overrideEvents': ['onUploadError', 'onSelectError', 'onUploadStart', 'onSelect'],
    queueID: 'j-uploadfile-queue',
    //itemTemplate:''
    onDialogClose: function(filesSelected, filesQueued, queueLength) {
      // return;
    },
    onSelectError: function(file, errorCode, errorMsg) {
      var errorMsg = FileUpload.errMsg[errorCode];
      var jumpTips = [-280];
      switch (errorCode) {
        case -110:
          errorMsg +='(200Kb)';
          break;
        case -130:
          errorMsg +='(请选择jpg,png类型文件)';
          break;
      }

      if(!$.inArray(jumpTips, errorCode)) {
        alert(errorMsg+',错误代码：'+errorCode);
      }

    },
    // 错误提示
    onUploadError: function(file, errorCode, errorMsg, errorString) {
      var errorMsg = FileUpload.errMsg[errorCode];
      var jumpTips = [-280];
      switch (errorCode) {
        case -110:
          errorMsg +='(200Kb)';
          break;
        case -130:
          errorMsg +='(请选择jpg,png类型文件)';
          break;
      }

      if(!$.inArray(jumpTips, errorCode)) {
        alert(errorMsg+',错误代码：'+ errorCode +','+ errorString);
      }
    }
  };

  FileUpload.prototype = {
    init: function() {
      var that = this;

      // 重置选中队列
      this.option.onSelect = function(file) {
        that.queueId = file.id;
        file['name'] && that.queueComplete();
        if(!that.option.auto) that.upload();
      };

      // 上传进度
      this.option.onUploadProgress = function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal){
        that.uploadProgress(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal);
      };

      // 上传成功
      this.option.onUploadSuccess = function() {
        that.success.call(that, arguments);
      };

      this.option.onQueueComplete = function() {
        that.clear();
      }

      this.$el.uploadify(this.option);
      this.$queue = $('<div id="'+this.$el[0].id+'-queue" class="uploadify-queue"><div class="uploadify-queue-bg"></div><b>0%</b></div>').appendTo(document.body);
      this.render();

    },
    run: function(method) {
      var args = [].slice.apply(arguments, 1);
      if(method) this.$el.uploadify(method, args);
    },
    render: function() {
      if(!this.option['itemTemplate']) {
        var offset = this.$input.offset();
        var w = this.$input.outerWidth();
        var h = this.$input.outerHeight();
        if(this.$queue.length > 0) {
          this.$queue.css({
            top: offset.top,
            left: offset.left,
            width: w,
            height: h,
            'line-height': h+'px'
          });
        }
      }
    },
    queueComplete: function() {
      this.$queue.show();
    },
    upload: function() {
      // 上传前验证通过才可以上传
      if(this.option.beforeUpload()) {
        this.$el.uploadify('upload', '*');
      } else { // 重置
        this.clear();
      }
    },
    uploadProgress: function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
      var percentage = Math.floor(bytesUploaded * 100 / bytesTotal);
      this.$queue.find('b').html(percentage+'%');
      this.$queue.find('div').css('width', percentage+'%');
    },
    success: function(file, data, response) {
      var that = this;
      this.$queue.fadeOut(1000);
      this.$input.val(file[0].name);
      if(this.$parent.find('.ticon-attach').length > 0) {
        this.$parent.find('.ticon-attach').html('<img src="'+ file[1] +'" alt=""><b>'+ file[0].name +'</b>');
      } else {
        this.$parent.prepend('<span class="ticon-attach"><img src="'+ file[1] +'" alt=""><b>'+ file[0].name +'</b></span>');
      }

      // file[1] 后端输出信息，可拼接图片url

      // 成功后清除堆栈
      setTimeout(function(){
        that.clear();
      }, 2000);
    },
    clear: function() {
      var that = this;
      this.$queue.fadeOut(300, function(){
        that.$queue.find('b').html('0%');
        that.$queue.find('div').css('width', '0%');
      });

      this.$el.uploadify('cancel', '*');
    }
  };

  var Handler = function(option) {
    return $(this).each(function() {
      var that = $(this);
      var data = that.data('uploadFile');
      if(!data) that.data('uploadFile', (data = new FileUpload(that, option)));
      if(typeof option === 'string') data[option] && data[option]();
    });
  };

  $.fn.fileUpload = Handler;
  $.fn.fileUpload.constructor = FileUpload;

  root.FileUpload = FileUpload;

})(window, jQuery);