var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}
  ;

test('api_500px-getAccessToken',
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

  'get access token': function()
  {
    // set auth_token
    api.data.auth_token  = 'api_test_auth_key_token';
    api.data.auth_secret = 'api_test_auth_secret_token';

    // override OAuth
    api.OA.getOAuthAccessToken = function(token, secret, verifier, callback)
    {
      assert.equal(token, 'api_test_auth_key_token');
      assert.equal(secret, 'api_test_auth_secret_token');
      assert.equal(verifier, 'api_test_auth_verifier_token');
      assert.ok(typeof callback == 'function');

      // emulate return data
      callback(null, 'api_test_access_key_token', 'api_test_access_secret_token', {user: 'user'});
    };

    api.getAccessToken('api_test_auth_verifier_token', function(err, access_token, access_secret, results)
    {
      // check return values
      assert.ifError(err);
      assert.equal(access_token, 'api_test_access_key_token');
      assert.equal(access_secret, 'api_test_access_secret_token');
      assert.equal(results.user, 'user');

      // check stored values
      assert.equal(api.data.access_token, 'api_test_access_key_token');
      assert.equal(api.data.access_secret, 'api_test_access_secret_token');
      assert.equal(api.data._details.user, 'user');
    });
  }

});
