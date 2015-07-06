var compose = require('mw-compose');

var createRouter = require('http-router-fn');

var request = require('supertest');

var assert = require('assert');

var sendMw = require('./send');


describe('Middleware', function() {
	it('takes a request, response, and next function', function(done) {
		sendMw({}, {}, done);
	});

	it('adds a send function to res', function() {
		var res = {};
		sendMw({}, res, function() {});
		assert.equal(typeof res.send, 'function');
	});
});

describe('res.send()', function() {
	var app, stack;

	beforeEach(function() {
		app = createRouter();
		stack = compose(sendMw, app);
	});

	it('defaults to sending a 200 status', function(done) {
		app.get('/', function(req, res) {
			res.send('test');
		});

		request(stack).get('/').expect(200, 'testd', function(){
			done();
		});
	});

	it('defaults to text/html content type with utf-8 encoding', function(done) {
		app.get('/', function(req, res) {
			res.send('test');
		});

		request(stack).get('/').expect('Content-Type', 'text/html; charset=utf-8', done);
	});

	describe('%body_argument', function() {
		it('takes a body as the first argument', function(done) {
			app.get('/', function(req, res) {
				res.send('test');
			});

			request(stack).get('/').expect('test', done);
		});

		it('can take a buffer body', function(done) {
			app.get('/', function(req, res) {
				res.send(new Buffer('test2'));
			});

			request(stack).get('/').expect('test2', done);
		});
	});

	describe('%options_argument', function() {
		it('can change the status code based on options', function(done) {
			app.get('/', function(req, res) {
				res.send('test', {code: 201});
			});

			request(stack).get('/').expect('test').expect(201, done);
		});

		it('can change the content type based on options', function(done) {
			app.get('/', function(req, res) {
				res.send('test', {type: 'text/plain'});
			});

			request(stack).get('/').expect('Content-Type', 'text/plain; charset=utf-8', done);
		});

		it('can refuse to set a character encoding', function(done) {
			app.get('/', function(req, res) {
				res.send('test', {type: 'text/plain', charset: false});
			});

			request(stack).get('/').expect('Content-Type', 'text/plain', done);
		});

		it('can change the encoding based on options', function(done) {
			app.get('/', function(req, res) {
				res.send('test', {charset: 'ascii'});
			});

			request(stack).get('/').expect('Content-Type', 'text/html; charset=ascii', done);
		});

		it('should not set encoding for non-text mime types', function(done) {
			app.get('/', function(req, res) {
				res.send('test', {type: 'application/json'});
			});

			request(stack).get('/').expect('Content-Type', 'application/json', done);
		});

		it('correctly sets a content length header', function(done) {
			app.get('/', function(req, res) {
				res.send('testdata');
			});

			request(stack).get('/')
				.expect('Content-Length', 8)
				.expect(200, 'testdata', done);
		});

		it('should use type shorthand with string options', function(done) {
			app.get('/', function(req, res) {
				res.send('test', 'application/json');
			});

			request(stack).get('/')
				.expect('Content-Type', 'application/json')
				.expect(200, 'test', done);
		});

		it('should use code shorthand with number options', function(done) {
			app.get('/', function(req, res) {
				res.send('test', 201);
			});

			request(stack).get('/').expect(201, 'test', done);
		});
	});
});
