function cookieParser (req, res, next) {
    if (req.cookies) {
      return next();
    }

    var cookies = req.headers.cookie;

    req.cookies = Object.create(null);

    // no cookies
    if (!cookies) {
      return next();
    }

    req.cookies = cookie.parse(cookies, options);

    // parse JSON cookies
    req.cookies = JSONCookies(req.cookies);

    next();
}


/**
 * Parse JSON cookie string.
 *
 * @param {String} str
 * @return {Object} Parsed object or undefined if not json cookie
 * @public
 */

function JSONCookie (str) {
    if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') {
      return undefined
    }
  
    try {
      return JSON.parse(str.slice(2))
    } catch (err) {
      return undefined
    }
  }


/**
 * Parse JSON cookies.
 *
 * @param {Object} obj
 * @return {Object}
 * @public
 */

function JSONCookies (obj) {
    var cookies = Object.keys(obj)
    var key
    var val
  
    for (var i = 0; i < cookies.length; i++) {
      key = cookies[i]
      val = JSONCookie(obj[key])
  
      if (val) {
        obj[key] = val
      }
    }
  
    return obj
  }


  export default cookieParser;