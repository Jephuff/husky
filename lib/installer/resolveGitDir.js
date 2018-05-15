"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findUp = require("find-up");
var fs = require("fs");
var path = require("path");
function default_1(cwd) {
    var foundPath = findUp.sync('.git', { cwd: cwd });
    if (foundPath) {
        var stats = fs.lstatSync(foundPath);
        // If it's a .git file resolve path
        if (stats.isFile()) {
            // Expect following format
            // git: pathToGit
            // On Windows pathToGit can contain ':' (example "gitdir: C:/Some/Path")
            var gitFileData = fs.readFileSync(foundPath, 'utf-8');
            var resolvedGitDir = gitFileData
                .split(':')
                .slice(1)
                .join(':')
                .trim();
            return path.resolve(path.dirname(foundPath), resolvedGitDir);
        }
        // Else return path to .git directory
        return foundPath;
    }
    return null;
}
exports.default = default_1;
