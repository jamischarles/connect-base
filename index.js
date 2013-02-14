
module.exports = function() {
  return function base(req, res, next) {
    var hostParts = req.headers.host.split(":")
      , host = req.headers['x-forwarded-host'] || hostParts[0] || ""
      , path = req.headers['x-forwarded-path'] || ""
      , protocol = req.headers['x-forwarded-proto'] || req.protocol || "http"
      , port = req.headers['x-forwarded-port'] || hostParts[1] || null;

    if((port == 80 && protocol === "http") || (port == 443 && protocol === "https")) port = "";
    if(port) port = ":"+port;

    req.base = protocol+"://"+host+port+path;
    next();
  }
};