
module.exports = function() {
  return function base(req, res, next) {
    var host = req.headers['x-forwarded-host']?
                req.headers['x-forwarded-host']+
                  (req.headers['x-forwarded-port']?":"+req.headers['x-forwarded-port']:"")
                :req.headers.host,
        path = req.headers['x-forwarded-path'] || '',
        protocol = req.headers['x-forwarded-proto'] || req.protocol || "http";

    req.base = protocol+"://"+host+path;
    next();
  }
};