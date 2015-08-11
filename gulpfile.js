/**
 *! frontui  
 */

var config = require('./config.json')
var pkg    = require('./package.json')
var svn    = require('./svn.json')
var gulp   = require('gulp')
var path   = require('path')
var fs     = require('fs')
var $      = require('gulp-load-plugins')()
var tools  = require('./uiTool')
var connect = $.connect

var nunjucks = require('nunjucks')
var through2 = require('through2')
var pngquant = require('imagemin-pngquant')
var spritesmith = require('gulp.spritesmith')
var merge = require('merge-stream')
var del = require('del')

/*--- 公用函数 ---*/
//模板引擎
var template = nunjucks.configure(config.template);
var tpl = function(){
	return through2.obj(function(file, enc, next){
        template.render(file.path, config, function(err, html){
            if(err){
                return next(err)
            }
            file.contents = new Buffer(html)
            return next(null, file)
        })
    })  
}

// 静态文件头部注释banner
var banner = [
        '/*! <%=pkg.name%> v<%=pkg.version%>',
        '*  by <%=pkg.author%>',
        '*  (c) '+ $.util.date(Date.now(), 'UTC:yyyy') + ' www.frontpay.cn',
        '*  Licensed under <%= pkg.license %>',
        '*/',
        ''
    ].join('\n')

// 错误处理
function errrHandler( e ){
    // 控制台发声,错误时beep一下
    $.util.beep()
    $.util.log( e )
}

// 获取文件夹
function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}


/*--- 任务 ---*/

// 模板
gulp.task('template', function(){
	return gulp.src([config.template + '/**/**.html', '!'+ config.template + '/**/_**.html', '!'+ config.template +'/_**/*.html'])
                .pipe($.plumber( { errorHandler: errrHandler } ))
                .pipe($.changed(config.destPath))
                .pipe($.newer(config.destPath))
				.pipe(tpl())
				.pipe(gulp.dest(config.destPath))
                .pipe(connect.reload())
});

// less
gulp.task('less', function(){
    return gulp.src([config.staticPath+'/less/**/**.less', '!'+ config.staticPath +'/_**/**', '!'+ config.staticPath + '/**/_*.less'])
                .pipe($.plumber( { errorHandler: errrHandler } ))
                .pipe($.changed(config.staticPath+'/css'))
                .pipe($.newer(config.staticPath+'/css'))
                .pipe($.less())
                .pipe(gulp.dest(config.staticPath+'/css'))
                .pipe(connect.reload())
})

// sprite

gulp.task('merge-sprite', function(){
    var thisPath = config.staticPath+'/images/sprite'
    var folders = getFolders(thisPath)
    var tasks = folders.map(function(folder) {
        var spriteData = gulp.src(path.join(thisPath, folder, '/*.*'))
                        .pipe($.changed(config.staticPath+'/images/sprite'))
                        .pipe($.newer(config.staticPath+'/images/sprite'))
                        .pipe(spritesmith({
                            imgPath: '../images/sprite/'+ folder +'.png?v='+config.version,
                            imgName: folder+'.png',
                            cssName: '_'+ folder +'.css'
                            ,padding: config.sprite_padding
                          }))
        var imgPipe = spriteData.img.pipe(gulp.dest(config.staticPath+'/images/sprite'))
        var cssPipe = spriteData.css
                                    .pipe($.rename({ extname: '.less'}))
                                    .pipe(gulp.dest(config.staticPath+'/less/sprite-less'))

        return merge(imgPipe, cssPipe);
    })


    return merge(tasks)
});

gulp.task('sprite', ['merge-sprite'], function(next){
    var lessFile = [];
    fs.readdirSync(config.staticPath+'/less/sprite-less')
        .map(function(file) {
            /\.less$/.test(file) && lessFile.push('@import "sprite-less/'+ file +'";')
        })

    return gulp.src(config.staticPath+'/less/_sprite_all.less')
        .pipe($.changed(config.staticPath+'/less'))
        .pipe($.replace(/.*/g, lessFile.join('\n')))
        .pipe(gulp.dest(config.staticPath+'/less'))
        
})

// gulp.task('sprite', ['merge-sprite', 'sprite-less'], function(){
//     del([config.staticPath+'/less/sprite-less'])
// })

// 启动服务
gulp.task('server', function(){
    connect.server({
        root: __dirname,
        port: config.port,
        livereload: true
    });

    console.log('server start at: http://localhost:' + config.port + '/'+ config.destPath)

    tools.openURL('http://localhost:' + config.port + '/' + config.destPath)
})

//-- 文件监听

gulp.task('watch', function(){
    gulp.watch(config.template + '/**/**.html', ['template'])
    gulp.watch(config.staticPath + '/less/**/**', ['less'])
    gulp.watch(config.staticPath + '/images/sprite/sprite-*/**/**', ['sprite'])
})

/**
 * 安装依赖包
 * gulp install
 */
gulp.task('install', function() {
    gulp.src(['./bower.json', './package.json'])
        .pipe($.install());
})

/**
 * 默认任务
 * template, less, watch
 */
gulp.task('default', function(){
    gulp.start(['template', 'less', 'server', 'watch'])
})

/**
 * 生成环境，更新到SVN
 * 
 */
// 模板
gulp.task('svnTemplate', function(){
    return gulp.src(['./'+ config.destPath + '/**/**.html'])
            .pipe($.changed(svn.path))
            .pipe($.replace(/"(\/)bower_components\/(.*)\/([a-zA-Z0-9.]+\.js)(.*)"/g, config.static+'/js/$3$4'))
            .pipe(gulp.dest(svn.path))
});

// 拷贝
gulp.task('svnCopy', function(){
    return gulp.src([config.staticPath + '/iconfont/**/**', config.staticPath + '/iconfont-ie7/**/**'], {base: 'client'})
        .pipe($.changed(svn.staticPath))
        .pipe(gulp.dest(svn.staticPath))
})

// css
gulp.task('svnCss', function(){
    return gulp.src([config.staticPath+'/css/**/**.css'], {base: 'client'})
        .pipe($.plumber( { errorHandler: errrHandler } ))
        .pipe($.changed(svn.staticPath))
        .pipe($.minifyCss({compatibility: 'ie7'}))
        .pipe(gulp.dest(svn.staticPath))
})

// js
gulp.task('svnJs', function(){
    return gulp.src([config.staticPath+'/js/**/**.js'], {base: 'client'})
        .pipe($.plumber( { errorHandler: errrHandler } ))
        .pipe($.changed(svn.staticPath))
        .pipe($.uglify({mangle: false}))
        .pipe(gulp.dest(svn.staticPath))
})

gulp.task('svnBowerJs', function(){
    return gulp.src(config.jsPath)
            .pipe($.changed(svn.staticPath))
            .pipe(gulp.dest(svn.staticPath+'/js'))
})

// images
gulp.task('svnImage', function(){
    return gulp.src([config.staticPath+'/images/**/**', '!'+config.staticPath+'/images/sprite/sprite-**/', '!'+config.staticPath+'/images/sprite/sprite-**/**/**']) 
        .pipe($.plumber( { errorHandler: errrHandler } ))
        .pipe($.changed(svn.staticPath))
        .pipe($.imagemin({
                    optimizationLevel: 5,
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()]
                })
        )
        .pipe(gulp.dest(svn.staticPath+'/images'))
})

gulp.task('svnServer', ['svnTemplate', 'svnCopy', 'svnCss', 'svnJs', 'svnImage', 'svnBowerJs'], function(){
    connect.server({
        root: svn.path,
        port: svn.port
    });

    console.log('server start at: http://localhost:' + svn.port + '/')

    tools.openURL('http://localhost:' + svn.port + '/')
})

gulp.task('svn', function(){
    gulp.start(['svnServer']);
})