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

  // change header separator to make it work with 500px
  this.OA._oauthParameterSeperator = options.separator || config.separator;

  return this;
};

// Sends auth request to the api service,
// upon receiving verification token
// creates verification handler
api_500px.prototype.authRequest = function api500pxAuthRequest(callback)
{
  // request token
  return this.OA.getOAuthRequestToken(callback);
}


