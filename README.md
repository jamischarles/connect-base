connect-base
============

Get the base url for Express/Connect

```js
var app = connect();
    base = require("connect-base");

app.use(base());

app.use(function(req, res){
  res.send(req.base);
})
```

```sh
curl http://localhost:5000
> http://localhost:5000
```

```sh
curl http://example.com
> http://example.com
```

```sh
curl -H "X-Forwarded-Host: test.example.com" http://example.com
> http://test.example.com
```

```sh
curl -H "X-Forwarded-Host: test.example.com" -H "X-Forwarded-Path: /testing" http://example.com
> http://test.example.com/testing
```
