# sw-send

Simple, dependency-free `send` middleware

## Install

`npm install sw-send`

## Example

```javascript
var send = require('sw-send');

// With express
app.use(send);

// or use it as you would any middlware
app.get('/example/page', send, function(req, res) {
	if(req.query.n) {
		res.send('NOT FOUND!', 404); // The status code can be passed in place of options
	} else {
		res.send('Some text', 'text/plain'); // and so can the Content-Type
	}
});
```

## API

`res.send(body, [options])`

* body - String or buffer holding the response body
* options - Options object, optional
 * code - Status code, defaults to 200
 * type - Content-Type, defaults to `text/html`
 * charset - Character encoding, defaults to `utf-8` for `text/*` MIME types, null otherwise
