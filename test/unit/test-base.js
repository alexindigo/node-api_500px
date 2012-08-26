var assert        = require('assert')
  , test          = require('utest')

  // package thingy
  , Api500px      = require('../../index')
  , api // instance
  , emptyFunction = function(){}
  ;

test('api_500px',
{
  before: function()
  {
    api = new Api500px(
    {
      key: 'api_500px_test_key_token',
      secret: 'api_500px_test_secret_token',
      callback: 'http://api_500px_test_callback_url',
    });
  },

  'check api instance': function()
  {

    assert.equal(api.OA._requestUrl, 'https://api.500px.com/v1/oauth/request_token');
    assert.equal(api.OA._accessUrl, 'https://api.500px.com/v1/oauth/access_token');
    assert.equal(api.OA._consumerKey, 'api_500px_test_key_token');
    assert.equal(api.OA._consumerSecret, 'api_500px_test_secret_token');
    assert.equal(api.OA._version, '1.0A');
    assert.equal(api.OA._authorize_callback, 'http://api_500px_test_callback_url');
    assert.equal(api.OA._signatureMethod, 'HMAC-SHA1');
    assert.equal(api.OA._oauthParameterSeperator, ', ');
  },

  'request auth token': function()
  {
    // override OAuth
    api.OA.getOAuthRequestToken = function(callback)
    {
      assert.ok(typeof callback == 'function');
    };

    api.authRequest(emptyFunction);
  }

});
