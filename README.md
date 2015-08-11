# frontui

欢迎使用frontpay前端脚手架

## 初始项目

指定项目放置目录

	c:>type null > .bowerrc

创建`.bowerrc`文件并编辑
	
	{
		"directory": "github"
	}


配置好项目目录后(不配置默认为bower_components ) `-0-!!!`

	bower install myproject=frontui


## 目录简介

* `template` 模板目录
* `static` 前端静态资源目录
* `www` server目录，模板编译目录
* `bower_components` 第三方依赖js组件，ui库目录
* `node_modules` gulp依赖组件
* `gulpfile.js` gulp构建环境主文件
* `package.json` 组件包配置文件
* `config.json`  项目配置文件
* `svn.json`  SVN目录配置文件


## 安装依赖组件

先安装`npm`依赖包
	
	npm install

安装`bower`组件

	bower install

执行安装`npm_modules`, `bower_components`


## 模板

模板引擎是试用`nunjucks`,优点是具有`layout`功能。

官方模板API文档[http://mozilla.github.io/nunjucks/cn/templating.html](http://mozilla.github.io/nunjucks/cn/templating.html)

* `_layout` 页面布局框架文件目录
	* `base` 基本document框架
	* `layout` 页面layout框架
* `_components` 组件模板

模板全局配置变量主要读取`config.json`文件。

比如 `{{static}}` 输出静态文件目录

## 静态资源

### less

注意`iamges`路径定义变量

保持原来`frontui`文件结构和内容，方便更新版本，一切其他操作只需引入新的文件，通过`less` 语法继承重载即可。

### js

开发阶段不做任何处理

### css

`less`编译后目录

### images

开发阶段不做操作

**sprite**

需sprite合并的icon小图标统一放置在`static/images/sprite`目录

比如合并成`sprite-index.png`文件需新建文件夹`sprite-index`，然后将其放在该目录下，构建环境将`sprite-*`的文件夹各自合并成sprite的png图片。 同时生成`static/less/sprite-less/sprite-*.less`文件，更新到`_sprite_all.less`文件引用中

**_sprite_all.less生成后**

	@import "sprite-less/sprite-index"
	@import "sprite-less/sprite-header"
    @import "sprite-less/sprite-helper"
	@import "sprite-less/sprite-login"
    // ...


> sprite图标间隙默认是20px，可以通过config.json来设置`sprite_padding`


### server

启动`gulp server`，浏览器自动打开服务`http://localhost:8520/www`

端口号默认为`8520`可以通过config.json来配置。

### watch

只要在chrome浏览器中安装了`liveReload`可以开启自动刷新，无论是修改了`less`,`template`都会自动刷新,其他如`JS`则不加自动刷新，请手动。降低构建环境鸭梨占内存来不及自动刷新问题。


## config配置

	{
		"port": 8520,
		"staticPath": "./static",
		"static": "/static",
		"template": "./template/",
		"destPath" : "www",
		"bower_components": "/bower_components",
		"version": "1.0.0",
		"sprite_padding": 20,
		"jsPath": ["./bower_components/jquery/dist/jquery.min.js", "./bower_components/html5shiv/dist/html5shiv.min.js", "./bower_components/respond/dest/respond.min.js"]
	}


* `port` server服务启动端口号
* `staticPath` 静态资源目录
* `static` server的静态资源绝对路径
* `template` 模板目录
* `destPath` 模板编译目录，server启动访问的目录
* `bower_components` 第三方通过bower管理的组件目录
* `version` 当前静态文件开发的版本号，静态资源浏览器去缓存
* `sprite_padding` sprite图标间隙
* `jsPath` bower第三方组件发布时需拷贝到`static/js/`目录下的文件 


## 默认任务

	gulp.task('default', function(){
	    gulp.start(['template', 'less', 'server', 'watch'])
	})

执行模板编译，less编译，启动服务，自动刷新

## SVN发布

	'svnServer', ['svnTemplate', 'svnCopy', 'svnCss', 'svnJs', 'svnImage', 'svnBowerJs']


* `svnTemplate` 拷贝模板替换`bower_components`路径
* `svnCopy` 字体及ie7
* `svnCss` 复制及压缩
* `svnJs`  复制及压缩
* `svnImage` 复制及压缩
* `svnBowerJs` 拷贝bower到`static/js`下
* `svnServer` 预览发布内容

