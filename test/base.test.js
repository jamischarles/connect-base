var should = require("should"),
    connect = require("connect"),
    request = require("supertest"),
    base = require("..");

var app = connect();

app.use(base());

app.use("/port", function(req, res) {
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({
    port: req.headers.host.split(":")[1],
    base: req.base
  }));
});

app.use(function(req, res) {
  res.end(req.base);
});

describe("Connect Base", function() {

  it("should return the base url", function(done) {
    request(app)
      .get("/")
      .expect(/http:\/\/127.0.0.1:/)
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        done();
      });
  });

  it("should return the forwarded host", function(done) {
    request(app)
      .get("/")
      .set("X-Forwarded-Host", "example.com")
      // Supertest binds to a random port
      .expect(/http:\/\/example.com*/)
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        done();
      });
  });

  it("should return the forwarded host and port", function(done) {
    request(app)
      .get("/")
      .set("X-Forwarded-Host", "example.com")
      .set("X-Forwarded-Port", "8080")
      .expect("http://example.com:8080")
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        done();
      });
  });

  it("should return the forwarded host, port and path", function(done) {
    request(app)
      .get("/")
      .set("X-Forwarded-Host", "example.com")
      .set("X-Forwarded-Port", "8080")
      .set("X-Forwarded-Path", "/testing")
      .expect("http://example.com:8080/testing")
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        done();
      });
  });

  it("should return the forwarded proto, host, port and path", function(done) {
    request(app)
      .get("/")
      .set("X-Forwarded-Proto", "https")
      .set("X-Forwarded-Host", "example.com")
      .set("X-Forwarded-Port", "8080")
      .set("X-Forwarded-Path", "/testing")
      .expect("https://example.com:8080/testing")
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        done();
      });
  });

  it("should not send the port if not specified", function(done) {
    request(app)
      .get("/port")
      .set("X-Forwarded-Proto", "http")
      .set("X-Forwarded-Host", "example.com")
      .set("X-Forwarded-Path", "/testing")
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        res.body.base.should.eql("http://example.com:"+res.body.port+"/testing");
        done();
      });
  });

  it("should not send the port on http and port 80", function(done) {
    request(app)
      .get("/")
      .set("X-Forwarded-Proto", "http")
      .set("X-Forwarded-Host", "example.com")
      .set("X-Forwarded-Port", "80")
      .set("X-Forwarded-Path", "/testing")
      .expect("http://example.com/testing")
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        done();
      });
  });

  it("should not send the port on https and port 443", function(done) {
    request(app)
      .get("/")
      .set("X-Forwarded-Proto", "https")
      .set("X-Forwarded-Host", "example.com")
      .set("X-Forwarded-Port", "443")
      .set("X-Forwarded-Path", "/testing")
      .expect("https://example.com/testing")
      .end(function(err, res) {
        if(err) done(err);
        res.ok.should.be.ok;
        done();
      });
  });

});