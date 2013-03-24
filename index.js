/**
 * Module dependencies
 */
var url = require("url")
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

    var base = {
      protocol: req.headers[protoHeader] || req.protocol || "http",
      hostname: req.headers[hostHeader] || hostParts[0] || "",
      port: req.headers[portHeader] || hostParts[1] || "",
      pathname: req.headers[pathHeader] || ""
    };
    if((base.port == 80 && base.protocol === "http") ||
       (base.port == 443 && base.protocol === "https")) delete base.port;

    debug("", base);

    // Expose req.base
    req.base = url.format(base);

    // Expose req.resolve
    req.resolve = function(path) {
      var resolvedPath = url.resolve(req.base, path);
      debug(resolvedPath);
      return resolvedPath;
    };
    next();
  }
};
