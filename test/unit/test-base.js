var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}
  ;

test('api_500px',
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
  },

  // Tool functions

  'check _get': function()
  {
    // set auth_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.get = function(url, token, secret, callback)
    {
      assert.equal(url, 'api_test_get_url');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.ok(typeof callback == 'function');

      return 'api_test_get_return';
    };

    var r = api._get('api_test_get_url', bareFunction);

    // check return values
    assert.equal(r, 'api_test_get_return');
  },

  'check _post, short version': function()
  {
    // set auth_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.post = function(url, token, secret, body, contentType, callback)
    {
      assert.equal(url, 'api_test_post_url');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.equal(body, null);
      assert.equal(contentType, 'application/json');
      assert.ok(typeof callback == 'function');

      return 'api_test_post_return';
    };

    var r = api._post('api_test_post_url', bareFunction);

    // check return values
    assert.equal(r, 'api_test_post_return');
  },

  'check _post, short +body version': function()
  {
    // set auth_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.post = function(url, token, secret, body, contentType, callback)
    {
      assert.equal(url, 'api_test_post_url');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.equal(body.param, 'value');
      assert.equal(contentType, 'application/json');
      assert.ok(typeof callback == 'function');

      return 'api_test_post_return';
    };

    var r = api._post('api_test_post_url', {param: 'value'}, bareFunction);

    // check return values
    assert.equal(r, 'api_test_post_return');
  },

  'check _post, full version': function()
  {
    // set auth_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.post = function(url, token, secret, body, contentType, callback)
    {
      assert.equal(url, 'api_test_post_url');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.equal(body, 'api_test_post_body');
      assert.equal(contentType, 'text/xml');
      assert.ok(typeof callback == 'function');

      return 'api_test_post_return';
    };

    var r = api._post('api_test_post_url', 'api_test_post_body', 'text/xml', bareFunction);

    // check return values
    assert.equal(r, 'api_test_post_return');
  }
});
