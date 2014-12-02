(function() {
  var BaseUploader, SmartlingUpload, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseUploader = require("./BaseUploader");

  SmartlingUpload = (function(_super) {
    __extends(SmartlingUpload, _super);

    function SmartlingUpload() {
      _ref = SmartlingUpload.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SmartlingUpload.prototype.baseUrl = function() {
      return "https://api.smartling.com/v1/file/upload?";
    };

    SmartlingUpload.prototype.getParams = function() {
      return {
        apiKey: this.options.apiKey,
        projectId: this.options.projectId,
        fileUri: this.options.resourceId,
        approved: true,
        fileType: this.options.fileType || "json"
      };
    };

    return SmartlingUpload;

  })(BaseUploader);

  module.exports = function(grunt, options, callback) {
    return new SmartlingUpload(grunt, options, callback);
  };

}).call(this);
