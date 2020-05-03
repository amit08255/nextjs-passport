var proto = {};



/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */

const merge = function(a, b){
    if (a && b) {
      for (var key in b) {
        a[key] = b[key];
      }
    }
    return a;
};

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

function createServer() {
    function app(req, res, next){ app.handle(req, res, next); }
    merge(app, proto);
    app.route = '/';
    app.stack = [];
    return app;
}


/**
 * Utilize the given middleware `handle` to the given `route`,
 * defaulting to _/_. This "route" is the mount-point for the
 * middleware, when given a value other than _/_ the middleware
 * is only effective when that segment is present in the request's
 * pathname.
 *
 * For example if we were to mount a function at _/admin_, it would
 * be invoked on _/admin_, and _/admin/settings_, however it would
 * not be invoked for _/_, or _/posts_.
 *
 * @param {String|Function|Server} route, callback or server
 * @param {Function|Server} callback or server
 * @return {Server} for chaining
 * @public
 */

proto.use = function use(route, fn) {
    var handle = fn;
    var path = route;
  
    // default route to '/'
    if (typeof route !== 'string') {
      handle = route;
      path = '/';
    }
  
    // wrap sub-apps
    if (typeof handle.handle === 'function') {
      var server = handle;
      server.route = path;
      handle = function (req, res, next) {
        server.handle(req, res, next);
      };
    }
  
    // strip trailing slash
    if (path[path.length - 1] === '/') {
      path = path.slice(0, -1);
    }
  
    this.stack.push({ route: path, handle: handle });
  
    return this;
};


/**
 * Handle server requests, punting them down
 * the middleware stack.
 *
 * @private
 */

proto.handle = function handle(req, res, out) {
  var index = 0;
  var stack = this.stack;

  // final function handler
  var done = out;

  function next(err) {

    // next callback
    var layer = stack[index++];

    // all done
    if (!layer) {
      defer(done, err);
      return;
    }

    // route data
    var route = layer.route;

    // call the layer handle
    call(layer.handle, route, err, req, res, next);
  }

  next();
};



/**
 * Invoke a route handle.
 * @private
 */

function call(handle, route, err, req, res, next) {
  var arity = handle.length;
  var error = err;
  var hasError = Boolean(err);

  try {
    if (hasError && arity === 4) {
      // error-handling middleware
      handle(err, req, res, next);
      return;
    } else if (!hasError && arity < 4) {
      // request-handling middleware
      handle(req, res, next);
      return;
    }
  } catch (e) {
    // replace the error
    error = e;
  }

  // continue
  next(error);
}

  export default createServer;