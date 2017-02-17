var download = require("../lib/download");
var upload = require("../lib/upload");
var importFile = require("../lib/importFile");
var getTranslations = require("../lib/getTranslations");

module.exports = function (grunt) {

  createTask = function(module) {
    return function() {
      options = this.options(this.data);
      callback = this.async();
      module(grunt, options, callback);
    };
  };

  grunt.registerMultiTask('smartling_download', 'downloads from smartling', createTask(download));
  grunt.registerMultiTask('smartling_upload', 'uploads to smartling', createTask(upload));
  grunt.registerMultiTask('smartling_import', 'imports to smartling', createTask(importFile));
  grunt.registerMultiTask('smartling_get_translations', 'posts and retrieves translations to smartling', createTask(getTranslations));

};