var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}
  ;

test('api_500px-tools',
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

  'check _get, short version': function()
  {
    // set access_token
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

  'check _get, long version': function()
  {
    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.get = function(url, token, secret, callback)
    {
      assert.equal(url, 'api_test_get_url?param1=value1&param2=value2');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.ok(typeof callback == 'function');

      return 'api_test_get_return';
    };

    var r = api._get('api_test_get_url', {param1: 'value1', param2: 'value2'}, bareFunction);

    // check return values
    assert.equal(r, 'api_test_get_return');
  },

  'check _post, short version': function()
  {
    // set access_token
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
    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.post = function(url, token, secret, body, contentType, callback)
    {
      // Commented out until 500px fix their API
      //assert.equal(url, 'api_test_post_url');
      assert.equal(url, 'api_test_post_url?param=value');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      //assert.equal(body.param, 'value');
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
    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.post = function(url, token, secret, body, contentType, callback)
    {
      // Commented out until 500px fix their API
      //assert.equal(url, 'api_test_post_url');
      assert.equal(url, 'api_test_post_url?api_test_post_body');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      //assert.equal(body, 'api_test_post_body');
      assert.equal(contentType, 'text/xml');
      assert.ok(typeof callback == 'function');

      return 'api_test_post_return';
    };

    var r = api._post('api_test_post_url', 'api_test_post_body', 'text/xml', bareFunction);

    // check return values
    assert.equal(r, 'api_test_post_return');
  }
});
