var util         = require('util')
  , EventEmitter = require('events').EventEmitter

  // third-party modules
  , OAuth        = require('oauth').OAuth

  // globals
  , basePoint    = 'https://api.500px.com/v1/'
  , endPoints    =
    {
      user       : basePoint + 'users',
      photos     : basePoint + 'photos',
      upload     : basePoint + 'upload'
    }
  , config       =
    {
      request    : basePoint + 'oauth/request_token',
      access     : basePoint + 'oauth/access_token',
      version    : '1.0A',
      signature  : 'HMAC-SHA1',
      separator  : ', ',

      key        : '',
      secret     : '',
      callback   : ''
    }
  , bareFunction = function(){}
  ;

module.exports = api_500px;
util.inherits(api_500px, EventEmitter);

function api_500px(options)
{
  // house keeping
  if (!(this instanceof api_500px)) throw new Error('usage: var apiInstance = new api_500px(config);');
  EventEmitter.call(this);

  options = options || {};

  this.OA = new OAuth
  (
    options.request   || config.request,
    options.access    || config.access,
    options.key       || config.key,
    options.secret    || config.secret,
    options.version   || config.version,
    options.callback  || config.callback,
    options.signature || config.signature
  );

  // prepare place for user's info
  this.data = {};

  // change header separator to make it work with 500px
  this.OA._oauthParameterSeperator = options.separator || config.separator;

  return this;
};

// Sends auth request
api_500px.prototype.authRequest = function api500pxAuthRequest(callback)
{
  // keep callbacks optional
  callback = callback || bareFunction;

  // request token
  this.OA.getOAuthRequestToken(function handler_api500pxAuthRequest(err, auth_token, auth_secret, results)
  {
    if (err) return callback(err);

    // TODO: Check if there is any overlapping
    this.data.auth_token  = auth_token;
    this.data.auth_secret = auth_secret;

    callback(null, auth_token, auth_secret, results);
  }.bind(this));
}

// Sends access token request
api_500px.prototype.getAccessToken = function api500pxGetAccessToken(verifier, callback)
{
  // keep callbacks optional
  callback = callback || bareFunction;

  // get access token
  this.OA.getOAuthAccessToken(this.data.auth_token, this.data.auth_secret, verifier, function handler_api500pxGetAccessToken(err, access_token, access_secret, results)
  {
    if (err) return callback(err);

    // cleanup auth token
    delete this.data.auth_token;
    delete this.data.auth_secret;

    // store access token and secret
    this.data.access_token  = access_token;
    this.data.access_secret = access_secret;
    // it's not normalized data, therefore underscore
    this.data._details      = results;

    callback(null, access_token, access_secret, results);
  }.bind(this));
}


/*
 * Tool functions
 */

// TODO: Streaming JSON parser?
api_500px.prototype._get = function api500pxGet(url, callback)
{
  return this.OA.get(url, this.data.access_token, this.data.access_secret, callback);
}

api_500px.prototype._post = function api500pxPost(url, body, contentType, callback)
{
  // check for callback
  if (typeof body == 'function')
  {
    callback = body;
    body     = null;
  }
  else if (typeof contentType == 'function')
  {
    callback    = contentType;
    contentType = null;
  }

  // content type
  contentType = contentType || 'application/json';

  return this.OA.post(url, this.data.access_token, this.data.access_secret, body, contentType, callback);
}
