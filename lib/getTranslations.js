(function() {
  var SmartlingGetTranslations, async, baseUrl, fs, path, querystring, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  baseUrl = "https://api.smartling.com/v1/file/get-translations?";

  fs = require('fs');

  request = require('request');

  querystring = require("querystring");

  async = require('async');

  path = require('path');

  SmartlingGetTranslations = (function() {
    function SmartlingGetTranslations(grunt, options, callback) {
      this.grunt = grunt;
      this.options = options;
      this.callback = callback;
      this.getLocaleRequest = __bind(this.getLocaleRequest, this);
      this.run();
    }

    SmartlingGetTranslations.prototype.run = function() {
      var _this = this;
      return async.each(this.options.locales, this.getLocaleRequest, function(err) {
        return _this.callback();
      });
    };

    SmartlingGetTranslations.prototype.generateQueryString = function(locale) {
      return querystring.stringify({
        locale: locale,
        apiKey: this.options.apiKey,
        projectId: this.options.projectId,
        fileUri: this.options.resourceId
      });
    };

    SmartlingGetTranslations.prototype.getLocaleRequest = function(locale, callback, retry) {
      var form, handleResult, r, url, _this;
      this.grunt.log.writeln("Begin downloading " + locale + " from smartling");
      _this = this;
      handleResult = function(err, response, body) {
        var dest, file;
        if (err || response.statusCode !== 200) {
          if (response.statusCode === 500 && !retry) {
            return setTimeout(function() {
              _this.grunt.log.writeln("Retrying download for " + locale);
              return _this.getLocaleRequest(locale, callback, true);
            }, 100);
          } else {
            return _this.grunt.fail.warn("Locale: " + locale + " - Failed to download Error: " + (JSON.parse(body).code));
          }
        } else {
          _this.grunt.log.writeln("Downloading " + locale);
          file = "" + _this.options.resourceId + "." + locale + ".json";
          dest = path.resolve(_this.options.dest, file);
          return fs.writeFile(dest, body, callback);
        }
      };
      url = baseUrl + this.generateQueryString(locale);
      r = request.post({
        url: url
      }, handleResult);
      form = r.form();
      return form.append('file', fs.createReadStream(this.options.src));
    };

    return SmartlingGetTranslations;

  })();

  module.exports = function(grunt, options, callback) {
    return new SmartlingGetTranslations(grunt, options, callback);
  };

}).call(this);
