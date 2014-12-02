(function() {
  var BaseUploader, SmartlingImport, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseUploader = require("./BaseUploader");

  SmartlingImport = (function(_super) {
    __extends(SmartlingImport, _super);

    function SmartlingImport() {
      _ref = SmartlingImport.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SmartlingImport.prototype.baseUrl = function() {
      return "https://api.smartling.com/v1/file/import?";
    };

    SmartlingImport.prototype.action = function() {
      return "importing";
    };

    SmartlingImport.prototype.getParams = function() {
      return {
        apiKey: this.options.apiKey,
        projectId: this.options.projectId,
        fileUri: this.options.resourceId,
        locale: this.options.locale,
        overwrite: this.options.overwrite || false,
        translationState: this.options.translationState || "IN_EDITING",
        fileType: this.options.fileType || "json"
      };
    };

    return SmartlingImport;

  })(BaseUploader);

  module.exports = function(grunt, options, callback) {
    return new SmartlingImport(grunt, options, callback);
  };

}).call(this);
