var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}
  ;

test('api_500px-authRequest',
{
  before: function()
  {
    api = new Api500px(
    {
      key: 'api_test_key_token',
      secret: 'api_test_secret_token',
      callback: 'http://api_test_callback_url'
    });
  },

  'request auth token': function()
  {
    // override OAuth
    api.OA.getOAuthRequestToken = function(callback)
    {
      assert.ok(typeof callback == 'function');

      // emulate return data
      callback(null, 'api_test_auth_key_token', 'api_test_auth_secret_token', {status: 'ok'});
    };

    api.authRequest(function(err, auth_token, auth_secret, results)
    {
      // check return values
      assert.ifError(err);
      assert.equal(auth_token, 'api_test_auth_key_token');
      assert.equal(auth_secret, 'api_test_auth_secret_token');
      assert.equal(results.status, 'ok');

      // check stored values
      assert.equal(api.data.auth_token, 'api_test_auth_key_token');
      assert.equal(api.data.auth_secret, 'api_test_auth_secret_token');
    });
  }

});
