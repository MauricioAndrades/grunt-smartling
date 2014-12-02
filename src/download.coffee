baseUrl       = "https://api.smartling.com/v1/file/get?"

fs            = require 'fs'
request       = require 'request'
querystring   = require "querystring"
async         = require 'async'
path          = require 'path'


class SmartlingDownload

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
    @grunt.log.write "downloading #{locale} from smartling \n "

    file = "" + this.options.resourceId + "." + locale + ".json"
    dest = path.resolve(this.options.dest, file)
    ws = fs.createWriteStream(dest)
    url = baseUrl + this.generateQueryString(locale)
    res = request(url)

    handleResult = () ->
      # Waiting 1 second before triggering callback and ending write stream
      # Allowing the write stream enough time to finish writing the response
      setTimeout(callback, 1000)

    res.pipe(ws)
    res.on('end', handleResult)


module.exports = (grunt, options, callback) -> new SmartlingDownload(grunt, options, callback)
