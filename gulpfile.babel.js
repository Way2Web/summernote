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
    npm: 'node_modules/'
};

export const dist = {
    scripts: `${paths.dist}js/`
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
import { lintScripts } from './gulp/lint';
import { scripts } from './gulp/scripts';
import { clean } from './gulp/clean';
import { bust } from './gulp/rev';
import { modernizr } from './gulp/modernizr';

/*
 * Define the tasks
 */
export const taskConfig = {
    scripts: [
        new Task(
            [
                'jquery/dist/jquery.js',
                'summernote/dist/summernote.js',
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
};

/*
 * Task: Watch files and perform task when changed
 */
function watch() {
    gutil.env.continue = true;
    gulp.watch(folders.scripts + '**/*.js', gulp.parallel(scripts, lintScripts));
}

/*
 * Combine tasks
 */
const lint = gulp.parallel(lintScripts);
const build = gulp.series(
    clean,
    gulp.parallel(lint, scripts),
    bust
);

/*
 * All tasks
 */
export {
    watch,
    build,
    scripts,
    lint,
    lintScripts,
    modernizr
};

/*
 * Export a default task
 */
export default build;
