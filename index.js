/**
 * Module dependencies
 */
var url = require("url")
  , resolve = require("path").resolve
  , debug = require("debug")("connect-base");

module.exports = function(options) {
  options = options || {};
  
  // Header names
  var hostHeader = options.host || 'x-forwarded-host'
    , pathHeader = options.path || 'x-forwarded-path'
    , portHeader = options.port || 'x-forwarded-port'
    , protoHeader = options.proto || 'x-forwarded-proto';
  
  return function base(req, res, next) {
    var hostParts = req.headers.host.split(":");

    // Construct the base
    var base = {
      protocol: req.headers[protoHeader] || req.protocol || "http",
      hostname: req.headers[hostHeader] || hostParts[0] || "",
      port: req.headers[portHeader] || hostParts[1] || "",
      pathname: req.headers[pathHeader] || ""
    };

    // Remove standard ports
    if((base.port == 80 && base.protocol === "http") ||
       (base.port == 443 && base.protocol === "https")) delete base.port;

    debug("", base);

    // Expose req.base
    req.base = url.format(base);

    // Expose req.resolve
    req.resolve = function(path) {
      // It's an absolue path
      if(url.parse(path).protocol) return path;

      // It's a relative path
      var resolvedPath = url.format({
        protocol: base.protocol,
        hostname: base.hostname,
        port: base.port,
        pathname: resolve(base.pathname || "/", path)
      });

      debug("Resolving path",base.pathname || "/","+",path,"->",resolvedPath);

      return resolvedPath;
    };
    next();
  }
};
