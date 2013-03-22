module.exports = function(options) {
  options = options || {};
  
  // Header names
  var host = options.host || 'x-forwarded-host'
    , path = options.path || 'x-forwarded-path'
    , port = options.port || 'x-forwarded-port'
    , proto = options.proto || 'x-forwarded-proto';
  
  return function base(req, res, next) {
    var hostParts = req.headers.host.split(":")
      , host = req.headers[host] || hostParts[0] || ""
      , path = req.headers[path] || ""
      , protocol = req.headers[proto] || req.protocol || "http"
      , port = req.headers[port] || hostParts[1] || "";

    if((port == 80 && protocol === "http") || (port == 443 && protocol === "https")) port = "";
    if(port) port = ":"+port;

    req.base = protocol+"://"+host+port+path;
    next();
  }
};
