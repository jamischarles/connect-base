module.exports = function(options) {
  options = options || {};
  
  // Header names
  var hostHeader = options.host || 'x-forwarded-host'
    , pathHeader = options.path || 'x-forwarded-path'
    , portHeader = options.port || 'x-forwarded-port'
    , protoHeader = options.proto || 'x-forwarded-proto';
  
  return function base(req, res, next) {
    var hostParts = req.headers.host.split(":")
      , host = req.headers[hostHeader] || hostParts[0] || ""
      , path = req.headers[pathHeader] || ""
      , protocol = req.headers[protoHeader] || req.protocol || "http"
      , port = req.headers[portHeader] || hostParts[1] || "";

    if((port == 80 && protocol === "http") || (port == 443 && protocol === "https")) port = "";
    if(port) port = ":"+port;

    req.base = protocol+"://"+host+port+path;
    next();
  }
};
