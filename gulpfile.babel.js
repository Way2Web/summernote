/* eslint-env node, es6 */

'use strict';

/*
 * Setup Gulp and our Task class
 */
import gulp from 'gulp';
import gutil from 'gulp-util';
import Task from './gulp/bootstrap/task';
import { packageOptions, gulpOptions } from './gulp/bootstrap/config';

/*
 * Configure
 */

const paths = {
    root: './',
    dist: `./dist/`
};

export const folders = {
    scripts: `${paths.root}js/`,
    styles: `${paths.root}css/`,
    test: `${paths.root}test/`,
    npm: 'node_modules/'
};

export const dist = {
    root: `${paths.dist}`,
    scripts: `${paths.dist}js/`,
    styles: `${paths.dist}css/`,
    fonts: `${paths.dist}fonts/`
};

/*
 * Change default options like:
 *
 * packageOptions.postcssUrls.rules.push({
 *       from: 'font/winternote',
 *       to: '../fonts/winternote/winternote'
 * });
 */
export { packageOptions, gulpOptions };

/*
 * Import all our tasks
 */
import { lintStyles, lintScripts } from './gulp/lint';
import { scripts } from './gulp/scripts';
import { styles } from './gulp/styles';
import { copy } from './gulp/copy';
import { clean } from './gulp/clean';
import { bust } from './gulp/rev';
import { modernizr } from './gulp/modernizr';

/*
 * Define the tasks
 */
export const taskConfig = {
    styles: [
        new Task(
            ['main.scss'],
            folders.styles,
            dist.styles + 'main.css'
        )
    ],
    scripts: [
        new Task(
            [
                'jquery/dist/jquery.js',
                'popper.js/dist/umd/popper.js',
                'bootstrap/dist/js/bootstrap.js',
                'summernote/dist/summernote-bs4.js',
            ],
            folders.npm,
            dist.scripts + 'vendor.js'
        ),
        new Task(
            [
                'summernote.core.js',
            ],
            folders.scripts,
            dist.scripts + 'app.js'
        )
    ],
    copy: [
        new Task(
            ['bootstrap-sass/assets/fonts/**/*'],
            folders.npm,
            dist.fonts
        ),
        new Task(
            ['summernote/dist/font/*'],
            folders.npm,
            dist.fonts + '/summernote'
        ),
        new Task(
            ['*'],
            folders.test,
            dist.root
        )
    ],
};

/*
 * Task: Watch files and perform task when changed
 */
function watch() {
    gutil.env.continue = true;
    gulp.watch(folders.styles + '**/*.{scss,css}', gulp.parallel(styles, lintStyles));
    gulp.watch(folders.scripts + '**/*.js', gulp.parallel(scripts, lintScripts));
}

/*
 * Combine tasks
 */
const lint = gulp.parallel(lintStyles, lintScripts);
const build = gulp.series(
    clean,
    gulp.parallel(lint, styles, scripts, copy),
    bust
);

/*
 * All tasks
 */
export {
    watch,
    build,
    styles,
    scripts,
    lint,
    lintStyles,
    lintScripts,
    copy,
    modernizr
};

/*
 * Export a default task
 */
export default build;
