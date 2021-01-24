let project_folder = "dist";
let source_folder = "#src";

let path = {
    build:{
        html: project_folder+"/",
        css:project_folder+"/css/",
        js:project_folder+"/js/",
        img:project_folder+"/img/",
        fonts:project_folder+"/fonts/"
    },
    src:{
        html: [source_folder+"/*.html", "!"+source_folder+"/_*.html"],
        css:source_folder+"/scss/*.scss",
        js:source_folder+"/js/*.js",
        img:source_folder+"/img/**/*.+(png|jpg|gif|ico|svg|webp)",
        fonts:source_folder+"/fonts/*.ttf",
        fonts_icons:source_folder+"/fonts/icons/*.*"
    },
    // То что нужно слушать постоянно
    watch:{
        html: source_folder+"/**/*.html",
        css:source_folder+"/scss/**/*.scss",
        js:source_folder+"/js/**/*.js",
        img:source_folder+"/img/**/*.+(png|jpg|gif|ico|svg|webp)"
    },
    //То чо бдет удалятся каждый раз, когда будет запскатся gulp
    clean:"./"+project_folder+"/"
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    // fileinclude=require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    // webphtml = require('gulp-webp-html'),
    // webpcss = require('gulp-webpcss'),
    // svgSprite = require('gulp-svg-sprite'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter');

let fs = require('fs')

function browserSync(params){
    browsersync.init({
        server:{
            baseDir:"./"+project_folder+"/"
        },
        port:3001,
    })
}

function html(){
    return src(path.src.html)
        // .pipe(fileinclude())
        // .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css(){
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle:"expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        // .pipe(webpcss({
        //         webpClass: '.webp',
        //         noWebpClass: '.no-webp'
        //     })
        // )
        // .pipe(dest(path.build.css))
        // .pipe(clean_css())
        // .pipe(
        //     rename({
        //         extname:".min.css"
        //     })
        // )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

// Сюда вписвывается пути к используемым css-библиотекам
function css_libs(){
    return src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/bootstrap/dist/css/bootstrap-grid.css', 
        'node_modules/fancybox/dist/css/jquery.fancybox.css',
        'node_modules/magnific-popup/dist/magnific-popup.css'
        // 'node_modules/slick-carousel/slick/slick.css',
        // 'node_modules/animate.css/animate.css'
        // 'node_modules/wow.js/css/libs/animate.css'
    ])
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js(){
    return src(path.src.js)
        // .pipe(fileinclude())
        .pipe(dest(path.build.js))
        // .pipe(
        //     uglify()
        // )
        .pipe(
            rename({
                extname:".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

// Сюда вписвывается пути к используемым js-библиотекам
function js_libs(){
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/fancybox/dist/js/jquery.fancybox.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
        'node_modules/sticky-js/dist/sticky.min.js'
        // 'node_modules/slick-carousel/slick/slick.js',
        // 'node_modules/wow.js/dist/wow.js'
      ])
        // .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img)
        // .pipe(
        //     webp({
        //         quality:70
        //     })
        // )
        // .pipe(dest(path.build.img))
        // .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive:true,
                svgoPlugins:[{removeViewBox: false}],
                interlaced:true,
                optimizationLevel: 3 //1 - 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function fonts(){
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

function fontsIcons(){
    return src(source_folder+'/fonts/icons/*')
        .pipe(dest(project_folder+'/fonts/icons/'));
}

// gulp.task('svgSprite', function(){
//     return gulp.src([source_folder+'/iconsprite/*.svg'])
//         .pipe(svgSprite({
//             mode:{
//                 stack:{
//                     sprite:"../icons/icons.svg",
//                     example:true
//                 }
//             }
//         }))
//         .pipe(dest(path.build.img))
// })

// Отдельный таск(не выполняетс по дефолту) для преобразования orf -> ttf
gulp.task('otf2ttf', function(){
    return gulp.src([source_folder+'/fonts/*.otf'])
        .pipe(
            fonter({
                formats:['ttf']
            })
        )
        .pipe(dest(source_folder+'/fonts/'));
});

// Функция добавляет в файл _fontFaces.scss(если он не пуст) font-face для всех шрифтов из папки #src/fonts/
// ВНИМАНИЕ!!! корректный font-weight и font-style надо будет прописать самостоятельно в скомпилированном файле dist/css/fonts.css
function fontsStyle(params) {
    let file_content = fs.readFileSync(source_folder + '/scss/_fontFaces.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/_fontFaces.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                // console.log('Item ', i, ':', items[i]);
                let fontname = items[i].split('.');
                fontname = fontname[0];
                if (c_fontname != fontname) {
                    fs.appendFile(source_folder + '/scss/_fontFaces.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
        })
    }
}
    
function cb() { }

function watchFiles(){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js_libs, js, css_libs, css, html, images, fonts, fontsIcons), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsIcons = fontsIcons;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;