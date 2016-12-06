baseUrl       = "https://api.smartling.com/v1/file/get-translations?"

fs            = require 'fs'
request       = require 'request'
querystring   = require "querystring"
async         = require 'async'
path          = require 'path'


class SmartlingGetTranslations

  constructor:(@grunt, @options, @callback) ->
    @run()

  run: ->
    async.each @options.locales, @getLocaleRequest, (err) =>
      @callback()

  generateQueryString: (locale) ->
    querystring.stringify {
      locale:     locale
      apiKey:     @options.apiKey
      projectId:  @options.projectId
      fileUri:    @options.resourceId
    }

  getLocaleRequest: (locale, callback) =>
    @grunt.log.writeln "Begin downloading #{locale} from smartling"

    _this = @

    handleResult = (err, response, body) ->
      if err or response.statusCode isnt 200
        _this.grunt.log.writeln "Error", body
      else
        _this.grunt.log.writeln "Downloading #{locale}"
        file = "#{_this.options.resourceId}.#{locale}.json"
        dest = path.resolve(_this.options.dest, file)
        fs.writeFile(dest, body, callback);

    url = baseUrl + @generateQueryString(locale)
    r = request.post {
      url:url
    }, handleResult

    form = r.form()
    form.append 'file', fs.createReadStream(@options.src)


module.exports = (grunt, options, callback) -> new SmartlingGetTranslations(grunt, options, callback)

