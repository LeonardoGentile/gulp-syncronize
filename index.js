var del = require('del');
var glob = require("glob");

function main(options) {
    console.log('hello');
    var src = options.src;
    var dest = options.target;
    var srcFiles = glob.sync(src + '/**/*');
    var destFiles = glob.sync(dest + '/**/*');
    var oldFiles = [];
    var getExt = function(fname) { return fname.substr((~-fname.lastIndexOf('.') >>> 0) + 2); };
    var getNoExt = function (fname) { return fname.slice(0, ~(getExt(fname).length))};
    var pre = options.extensions;
    if (pre === undefined || pre === null) pre = {};
    for (var i = 0; i < srcFiles.length; i++) { srcFiles[i] = srcFiles[i].replace(src + '/', ''); }
    for (var i = 0; i < destFiles.length; i++) { destFiles[i] = destFiles[i].replace(dest + '/', ''); }
    for (var destFile of destFiles) { //Checks that every file in the folder also exists in the src folder
        if (srcFiles.indexOf(destFile) == -1) { //File does not exist in the src folder; file might be old
            console.log('file!')
            console.log(getExt(destFile));
            if (Object.keys(pre).indexOf(getExt(destFile)) != -1) { //File matches one of the preprocessor extensions
                console.log('match!');
                if (pre[getExt(destFile)] != '' && srcFiles.indexOf(getNoExt(destFile) + '.' + pre[getExt(destFile)]) == -1) {
                    console.log('fileRIP!')
                    oldFiles.push(destFile); //Pushes file into oldFiles list
                } else if (pre[getExt(destFile)] === '' && srcFiles.indexOf(getNoExt(destFile)) == -1) {
                    console.log('fileRIP!')
                    oldFiles.push(destFile); //Pushes file into oldFiles list
                }
                continue;
            }
            console.log('fileRIP!')
            oldFiles.push(destFile); //Adds file to the oldFiles list if file doesn't exist in src and doesn't match any preprocessor extension
        }
    }
    for (var i = 0; i < oldFiles.length; i++) { oldFiles[i] = dest + '/' + oldFiles[i]; }
    del(oldFiles);
}
module.exports = main;
