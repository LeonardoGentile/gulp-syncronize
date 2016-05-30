var del = require('del');
var glob = require("glob");

function main(options) {
    var src = options.src;
    var dest = options.target;
    var srcFiles = glob.sync(src + '/**/*');
    var destFiles = glob.sync(dest + '/**/*');
    var oldFiles = [];
    var getExt = function(fname) { return fname.substr((~-fname.lastIndexOf('.') >>> 0) + 2); };
    var afterPeriod = str.substr(str.indexOf('.') + 1);
    var getNoExt = function (fname) { return fname.slice(0, ~(getExt(fname).length))};
    var pre = options.extensions;
    if (pre === undefined || pre === null) pre = {};
    for (var i = 0; i < srcFiles.length; i++) { srcFiles[i] = srcFiles[i].replace(src + '/', ''); } //Get rid of folders
    for (var i = 0; i < destFiles.length; i++) { destFiles[i] = destFiles[i].replace(dest + '/', ''); } //Get rid of folders
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    for (var destFile of destFiles) { //Checks that every file in the folder also exists in the src folder
        if (srcFiles.indexOf(destFile) == -1) { //File does not exist in the src folder; file might be old
            var destFile2 = destFile + '.';
            for (var key of Object.keys(pre)) {
                if (key != '') {
                    destFile2 = replaceAll(destFile2, '.' + key + '.', '.' + pre[key] + '.');
                }
                if (key === '') {
                    destFile2 = replaceAll(destFile2, '.' + key + '.', '' + '.');
                }
            }
            destFile2 = destFile2.slice(0, -1);
            if (srcFiles.indexOf(destFile2) == -1) {
                oldFiles.push(destFile); //Adds file to the oldFiles list if file doesn't exist in src and doesn't match any preprocessor extension
            }
        }
    }

    for (var i = 0; i < oldFiles.length; i++) { oldFiles[i] = dest + '/' + oldFiles[i]; }
    del(oldFiles);
}
module.exports = main;
