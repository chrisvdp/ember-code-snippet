/* jshint node: true */

var Writer = require('broccoli-writer');
var glob = require('glob');
var _Promise = require('es6-promise').Promise;
var fs = require('fs');
var path = require('path');


function findFiles(srcDir) {
  return new _Promise(function(resolve, reject) {
    glob(path.join(srcDir, "**/*.+(js|coffee|html|hbs|css|sass|scss|less|emblem)"), function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function extractSnippets(fileContent) { 
  return fileContent;
}


function SnippetFinder(inputTree){
  if (!(this instanceof SnippetFinder)){
    return new SnippetFinder(inputTree);
  }
  this.inputTree = inputTree;
}

SnippetFinder.prototype = Object.create(Writer.prototype);
SnippetFinder.prototype.constructor = SnippetFinder;

SnippetFinder.prototype.write = function (readTree, destDir) {
  return readTree(this.inputTree).then(findFiles).then(function(files){
    files.forEach(function(filename){
      var snippets = extractSnippets(fs.readFileSync(filename, 'utf-8'));
      for (var name in snippets){
        fs.writeFileSync(path.join(destDir, name)+path.extname(filename),
                         snippets[name]);
      }
    });
  });
};

module.exports = SnippetFinder;
