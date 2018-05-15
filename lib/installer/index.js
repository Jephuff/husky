"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findUp = require("find-up");
var fs = require("fs");
var path = require("path");
var pkgDir = require("pkg-dir");
var getConf_1 = require("../getConf");
var getScript_1 = require("./getScript");
var is_1 = require("./is");
var resolveGitDir_1 = require("./resolveGitDir");
var hookList = [
    'applypatch-msg',
    'pre-applypatch',
    'post-applypatch',
    'pre-commit',
    'prepare-commit-msg',
    'commit-msg',
    'post-commit',
    'pre-rebase',
    'post-checkout',
    'post-merge',
    'pre-push',
    'pre-receive',
    'update',
    'post-receive',
    'post-update',
    'push-to-checkout',
    'pre-auto-gc',
    'post-rewrite',
    'sendemail-validate'
];
function writeHook(filename, script) {
    fs.writeFileSync(filename, script, 'utf-8');
    fs.chmodSync(filename, parseInt('0755', 8));
}
function createHook(filename, script) {
    // Get name, used for logging
    var name = path.basename(filename);
    // Check if hook exist
    if (fs.existsSync(filename)) {
        var hook = fs.readFileSync(filename, 'utf-8');
        // Migrate
        if (is_1.isGhooks(hook)) {
            console.log("migrating existing ghooks script: " + name);
            return writeHook(filename, script);
        }
        // Migrate
        if (is_1.isPreCommit(hook)) {
            console.log("migrating existing pre-commit script: " + name);
            return writeHook(filename, script);
        }
        // Update
        if (is_1.isHusky(hook) || is_1.isYorkie(hook)) {
            return writeHook(filename, script);
        }
        // Skip
        console.log("skipping existing user hook: " + name);
        return;
    }
    // Create hook if it doesn't exist
    writeHook(filename, script);
}
function createHooks(filenames, script) {
    filenames.forEach(function (filename) { return createHook(filename, script); });
}
function canRemove(filename) {
    if (fs.existsSync(filename)) {
        var data = fs.readFileSync(filename, 'utf-8');
        return is_1.isHusky(data);
    }
    return false;
}
function removeHook(filename) {
    fs.unlinkSync(filename);
}
function removeHooks(filenames) {
    filenames.filter(canRemove).forEach(removeHook);
}
// This prevents the case where someone would want to debug a node_module that has
// husky as devDependency and run npm install from node_modules directory
function isInNodeModules(dir) {
    // INIT_CWD holds the full path you were in when you ran npm install (supported also by yarn and pnpm)
    // See https://docs.npmjs.com/cli/run-script
    if (process.env.INIT_CWD) {
        return process.env.INIT_CWD.indexOf('node_modules') !== -1;
    }
    // Old technique
    return (dir.match(/node_modules/g) || []).length > 1;
}
function getHooks(gitDir) {
    var gitHooksDir = path.join(gitDir, 'hooks');
    return hookList.map(function (hookName) { return path.join(gitHooksDir, hookName); });
}
/**
 * @param huskyDir - e.g. /home/typicode/project/node_modules/husky/
 * @param requireRunNodePath - path to run-node resolved by require e.g. /home/typicode/project/node_modules/.bin/run-node
 * @param isCI - true if running in CI
 */
function install(huskyDir, requireRunNodePath, isCI) {
    if (requireRunNodePath === void 0) { requireRunNodePath = require.resolve('.bin/run-node'); }
    console.log('husky > setting up git hooks');
    // First directory containing user's package.json
    var userPkgDir = pkgDir.sync(path.join(huskyDir, '..'));
    // Get conf from package.json or .huskyrc
    var conf = getConf_1.default(userPkgDir);
    // Get directory containing .git directory or in the case of Git submodules, the .git file
    var gitDirOrFile = findUp.sync('.git', { cwd: userPkgDir });
    // Resolve git directory (e.g. .git/ or .git/modules/path/to/submodule)
    var resolvedGitDir = resolveGitDir_1.default(userPkgDir);
    // Checks
    if (gitDirOrFile === null) {
        console.log("Can't find .git, skipping Git hooks installation.");
        return;
    }
    if (resolvedGitDir === null) {
        console.log("Can't find resolved .git directory, skipping Git hooks installation.");
        return;
    }
    if (process.env.HUSKY_SKIP_INSTALL === 'true') {
        console.log("HUSKY_SKIP_INSTALL environment variable is set to 'true',", 'skipping Git hooks installation.');
        return;
    }
    if (isCI && conf.skipCI) {
        console.log('CI detected, skipping Git hooks installation.');
        return;
    }
    if (userPkgDir === null) {
        console.log("Can't find package.json, skipping Git hooks installation.");
        return;
    }
    if (isInNodeModules(huskyDir)) {
        console.log('Trying to install from node_modules directory, skipping Git hooks installation.');
        return;
    }
    if (!fs.existsSync(path.join(resolvedGitDir, 'hooks'))) {
        console.log("Can't find hooks directory in " + resolvedGitDir + ". You can try to fix this error by creating it manually.");
        console.log('Skipping Git hooks installation.');
        return;
    }
    // Create hooks
    // Get root dir based on the first .git directory of file found
    var rootDir = path.dirname(gitDirOrFile);
    var hooks = getHooks(resolvedGitDir);
    var script = getScript_1.default(rootDir, huskyDir, requireRunNodePath);
    createHooks(hooks, script);
    console.log("husky > done");
}
exports.install = install;
function uninstall(huskyDir) {
    console.log('husky > uninstalling git hooks');
    var userPkgDir = pkgDir.sync(path.join(huskyDir, '..'));
    var resolvedGitDir = resolveGitDir_1.default(userPkgDir);
    if (resolvedGitDir === null) {
        console.log("Can't find resolved .git directory, skipping Git hooks installation.");
        return;
    }
    if (isInNodeModules(huskyDir)) {
        console.log('Trying to uninstall from node_modules directory, skipping Git hooks uninstallation.');
        return;
    }
    // Remove hooks
    var hooks = getHooks(resolvedGitDir);
    removeHooks(hooks);
    console.log('husky > done');
}
exports.uninstall = uninstall;
