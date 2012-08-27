var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}

  , photosJSON = '{"feature":"user","filters":{"category":false,"exclude":false,"user_id":"13"},"current_page":1,"total_pages":20,"total_items":159,"photos":[{"id":12539831,"name":"Toronto panorama","description":"Taken in Toronto, Ontario @ March 16, 2008","times_viewed":5,"rating":0.0,"created_at":"2012-08-26T14:29:43-04:00","category":9,"privacy":false,"width":9723,"height":2617,"votes_count":0,"favorites_count":0,"comments_count":0,"nsfw":false,"image_url":"http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg","images":[{"size":"4","url":"http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg"}]},{"id":11728095,"name":"Party","description":"","times_viewed":2,"rating":59.7,"created_at":"2012-08-15T01:41:32-04:00","category":6,"privacy":false,"width":2000,"height":1125,"votes_count":1,"favorites_count":1,"comments_count":1,"nsfw":false,"image_url":"http://pcdn.500px.net/11728095/31b8ff6b706b4146180213640fca8d039b184ebd/4.jpg","images":[{"size":"4","url":"http://pcdn.500px.net/11728095/31b8ff6b706b4146180213640fca8d039b184ebd/4.jpg"}]},{"id":11728081,"name":"Party","description":"","times_viewed":1,"rating":0,"created_at":"2012-08-15T01:40:51-04:00","category":7,"privacy":false,"width":2000,"height":1125,"votes_count":0,"favorites_count":0,"comments_count":0,"nsfw":false,"image_url":"http://pcdn.500px.net/11728081/4eb6c6c3b98ec6681441b5571e6f51969a186986/4.jpg","images":[{"size":"4","url":"http://pcdn.500px.net/11728081/4eb6c6c3b98ec6681441b5571e6f51969a186986/4.jpg"}]}]}'
  ;

test('api_500px-getPhotos',
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

  'get photos, simple': function()
  {
    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // set user data
    api.data.user = {id: 13};

    // override OAuth
    api.OA.get = function(url, token, secret, callback)
    {
      assert.equal(url, 'https://api.500px.com/v1/photos?feature=user&user_id=13&rpp=100&page=1&image_size=4');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.ok(typeof callback == 'function');

      // emulate return data
      callback(null, photosJSON);
    };

    api.getPhotos(1, function(err, photos)
    {
      // check return values
      assert.ifError(err);
      assert.equal(photos, photosJSON);
    });

  },

  'get photos, advanced': function()
  {
    var params =
    {
      feature: 'popular',
      user_id: 26,
      rpp: 50,
      page: 4,
      image_size: 2,
      extra: 'params'
    };

    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // set user data
    api.data.user = {id: 13};

    // override OAuth
    api.OA.get = function(url, token, secret, callback)
    {
      assert.equal(url, 'https://api.500px.com/v1/photos?feature=popular&user_id=26&rpp=50&page=4&image_size=2&extra=params');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.ok(typeof callback == 'function');

      // emulate return data
      callback(null, 'advanced'+photosJSON);
    };

    api.getPhotos(params, function(err, photos)
    {
      // check return values
      assert.ifError(err);
      assert.equal(photos, 'advanced'+photosJSON);
    });

  }
});
