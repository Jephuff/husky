"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var os = require("os");
var path = require("path");
var pupa = require("pupa");
var slash = require("slash");
// Used to identify scripts created by Husky
exports.huskyIdentifier = '# husky';
/**
 * @param rootDir - e.g. /home/typicode/project/
 * @param huskyDir - e.g. /home/typicode/project/node_modules/husky/
 * @param requireRunNodePath - path to run-node resolved by require e.g. /home/typicode/project/node_modules/.bin/run-node
 * @param platform - platform husky installer is running on (used to produce win32 specific script)
 */
function default_1(rootDir, huskyDir, requireRunNodePath, 
// Additional param used for testing only
platform) {
    if (platform === void 0) { 
    // Additional param used for testing only
    platform = os.platform(); }
    var runNodePath = slash(path.relative(rootDir, requireRunNodePath));
    // On Windows do not rely on run-node
    var node = platform === 'win32' ? 'node' : runNodePath;
    var version = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')).version;
    var script = slash(path.join(path.relative(rootDir, huskyDir), 'lib/runner/bin'));
    var template = fs.readFileSync(path.join(__dirname, '../../templates/hook.sh'), 'utf-8');
    return pupa(template, { huskyIdentifier: exports.huskyIdentifier, node: node, platform: platform, script: script, version: version });
}
exports.default = default_1;
