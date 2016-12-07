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

  getLocaleRequest: (locale, callback, retry) =>
    @grunt.log.writeln "Begin downloading #{locale} from smartling"

    _this = @

    handleResult = (err, response, body) ->
      if err or response.statusCode isnt 200
        if response.statusCode is 500 and !retry
          setTimeout(() ->
            _this.grunt.log.writeln "Retrying download for #{locale}"
            _this.getLocaleRequest locale, callback, true
          , 1000)
        else
          _this.grunt.fail.warn "Locale: #{locale} - Failed to download Error: #{JSON.parse(body).code}"
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

