var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}

  , photoInfoJSON = '{"photo":{"id":12539831,"user_id":13,"name":"Toronto panorama","description":"Taken in Toronto, Ontario @ March 16, 2008","camera":"Canon EOS 20D","lens":"","focal_length":"100","iso":"100","shutter_speed":"5","aperture":"8","times_viewed":5,"rating":0.0,"status":1,"created_at":"2012-08-26T14:29:43-04:00","category":9,"location":null,"privacy":false,"latitude":43.685650966634206,"longitude":-79.41691160202026,"taken_at":"2008-03-15T00:00:00-04:00","hi_res_uploaded":2,"for_sale":true,"width":9723,"height":2617,"votes_count":0,"favorites_count":0,"comments_count":0,"nsfw":false,"sales_count":0,"for_sale_date":null,"highest_rating":0.0,"highest_rating_date":null,"tags":["toronto","night","skyline"],"image_url":"http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg","images":[{"size":"4","url":"http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg"}],"store_download":true,"store_print":true,"voted":false,"favorited":false,"purchased":false,"user":{"id":13,"username":"alexindigo","firstname":"Alex","lastname":"Indigo","city":"Palo Alto","country":"United States","fullname":"Alex Indigo","userpic_url":"http://500px.com/graphics/userpic.png","upgrade_status":2}},"comments":[]}'
  , photoInfoData =
    {
      id         : 12539831,
      title      : 'Toronto panorama',
      description: 'Taken in Toronto, Ontario @ March 16, 2008',
      private    : false,
      url        : 'http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg',
      tags       : [ 'toronto', 'night', 'skyline' ],
      safety     : true,
      license    : null,
      dates      : '2008-03-15T00:00:00-04:00',
      latitude   : 43.685650966634206,
      longitude  : -79.41691160202026
    }
  , photoInfoRaw =
    {
      photo:
      {
        id: 12539831,
        user_id: 13,
        name: 'Toronto panorama',
        description: 'Taken in Toronto, Ontario @ March 16, 2008',
        camera: 'Canon EOS 20D',
        lens: '',
        focal_length: '100',
        iso: '100',
        shutter_speed: '5',
        aperture: '8',
        times_viewed: 5,
        rating: 0,
        status: 1,
        created_at: '2012-08-26T14:29:43-04:00',
        category: 9,
        location: null,
        privacy: false,
        latitude: 43.685650966634206,
        longitude: -79.41691160202026,
        taken_at: '2008-03-15T00:00:00-04:00',
        hi_res_uploaded: 2,
        for_sale: true,
        width: 9723,
        height: 2617,
        votes_count: 0,
        favorites_count: 0,
        comments_count: 0,
        nsfw: false,
        sales_count: 0,
        for_sale_date: null,
        highest_rating: 0,
        highest_rating_date: null,
        tags:
        [
          'toronto',
          'night',
          'skyline'
        ],
        image_url: 'http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg',
        images:
        [
          {
            size: '4',
            url: 'http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg'
          }
        ],
        store_download: true,
        store_print: true,
        voted: false,
        favorited: false,
        purchased: false,
        user:
        {
          id: 13,
          username: 'alexindigo',
          firstname: 'Alex',
          lastname: 'Indigo',
          city: 'Palo Alto',
          country: 'United States',
          fullname: 'Alex Indigo',
          userpic_url: 'http://500px.com/graphics/userpic.png',
          upgrade_status: 2
        }
      },
      comments: []
    }
  ;

test('api_500px-getPhotoInfo',
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

  'get photo info, simple': function()
  {
    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.get = function(url, token, secret, callback)
    {
      assert.equal(url, 'https://api.500px.com/v1/photos/12539831?image_size=4&tags=1');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.ok(typeof callback == 'function');

      // emulate return data
      callback(null, photoInfoJSON);
    };

    api.getPhotoInfo(12539831, function(err, info)
    {
      // check return values
      assert.ifError(err);
      assert.deepEqual(info, photoInfoData);
    });

  },

  'get photo info, advanced': function()
  {
    var params =
    {
      image_size: 2,
      tags: 0,
      comments: 1,
      comments_page: 4,
      extra: 'params'
    };

    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.get = function(url, token, secret, callback)
    {
      assert.equal(url, 'https://api.500px.com/v1/photos/12539831?image_size=2&tags=0&comments=1&comments_page=4&extra=params');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.ok(typeof callback == 'function');

      // emulate return data
      callback(null, photoInfoJSON);
    };

    api.getPhotoInfo(12539831, params, function(err, info, raw)
    {
      // check return values
      assert.ifError(err);
      assert.deepEqual(info, photoInfoData);

      // check raw data
      assert.deepEqual(raw, photoInfoRaw);
    });

  }
});
