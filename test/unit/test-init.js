var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}
  ;

test('api_500px-init',
{
  before: function()
  {
    api = new Api500px(
    {
      key: 'api_test_key_token',
      secret: 'api_test_secret_token',
      callback: 'http://api_test_callback_url',
    });
  },

  'check api instance': function()
  {
    assert.equal(api.OA._requestUrl, 'https://api.500px.com/v1/oauth/request_token');
    assert.equal(api.OA._accessUrl, 'https://api.500px.com/v1/oauth/access_token');
    assert.equal(api.OA._consumerKey, 'api_test_key_token');
    assert.equal(api.OA._consumerSecret, 'api_test_secret_token');
    assert.equal(api.OA._version, '1.0A');
    assert.equal(api.OA._authorize_callback, 'http://api_test_callback_url');
    assert.equal(api.OA._signatureMethod, 'HMAC-SHA1');
    assert.equal(api.OA._oauthParameterSeperator, ', ');
  }

});
