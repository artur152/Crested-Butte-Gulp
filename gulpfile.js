var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    wiredep = require('wiredep').stream,
    rigger = require('gulp-rigger'),
    less = require('gulp-less'),
    clean = require('gulp-clean');



gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    });
});

// Добавление библиотек
gulp.task('bower', function () {
    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: "app/bower_components/"
        }))
        .pipe(gulp.dest('./app'))
        .pipe(connect.reload());
});

// Работа с HTML
gulp.task('html', function () {
    gulp.src('app/*.html')
        .pipe(connect.reload());
});

// Обертывает контент в хедер и футер
gulp.task('page', function () {
    gulp.src('app/page/*.html') //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest('app/')) //Выплюнем их в папку build
        .pipe(connect.reload());
});


// Работа с CSS
/*
gulp.task('css', function () {
    gulp.src('./app/Sass/!*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('app/css/!*.css'))
        .pipe(connect.reload());
});
*/

/*gulp.task('less', function () {
    gulp.src('app/less/!**!/!*.less')
        .pipe(less())
        .pipe(gulp.dest('app/css/'))
        .pipe(connect.reload());
});*/


 gulp.task('css', function () {
    gulp.src('app/css/!*.css')
     //.pipe(concatCss("all.css")) //Cоединяет в один файл
     .pipe(autoprefixer()) //Добавляем префиксы
     //.pipe(minifyCss()) //Минифицирует
     //.pipe(rename("main.min.css")) // Переименовивает
     .pipe(gulp.dest('app/css')) //Заливает по этому пути
     .pipe(connect.reload());
     // .pipe(notify('Done!'));
 });



// Работа с JS
gulp.task('js', function () {
    gulp.src('./app/js/*.js')
        .pipe(connect.reload());
});

// смотрим за изминением
gulp.task('watch', function () {
    gulp.watch('bower.json',['bower']);
    gulp.watch('app/css/*.css',['css']);
    gulp.watch('app/less/*.less',['less']);
    gulp.watch('app/*.html',['html']);
    gulp.watch('app/*.html');
    gulp.watch('app/header.html',['page']);
    gulp.watch('app/footer.html',['page']);
    gulp.watch('app/**/*.js',['js'])
});

// очищаем папку build
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// Работа с изображениями
gulp.task('img:build', function() {
    gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));
});

// Работа со шрифтами
gulp.task('fonts:build', function() {
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
});


// Создаем папку в продакшн (gulp build)

gulp.task('build', ['fonts:build','img:build'],function () {
    var assets = useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        //.pipe(gulpif('*.js', uglify()))
        //.pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['connect', 'html', 'css', 'page', 'watch']);



