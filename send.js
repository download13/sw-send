function send(body, opts) {
	var code, type, charset;

	switch(typeof opts) {
	case 'string':
		type = opts;
		break;

	case 'number':
		code = opts;
		break;

	case 'object':
		code = opts.code;
		type = opts.type;
		charset = opts.charset;
	}

	code = code || 200;
	type = type || 'text/html';

	// MIME type is text, might need encoding parameter
	if(charset !== false) {
		if(typeof charset !== 'string') {
			charset = 'utf-8';
		}
	}

	if(charset && type.indexOf('text/') === 0) {
		type += '; charset=' + charset;
	}

	var length = (body instanceof Buffer) ? body.length : Buffer.byteLength(body);

	this.writeHead(code, {'Content-Type': type, 'Content-Length': length});
	this.end(body);
}

module.exports = function(req, res, next) {
	res.send = send;

	next();
}
