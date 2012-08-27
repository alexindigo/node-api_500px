var assert         = require('assert')
  , test           = require('utest')

  // package thingy
  , Api500px       = require('../../index')
  , api // instance
  , bareFunction   = function(){}

  , photoUploadKey = '{"upload_key":"a8728e70694a2f846b63ef1b202d717d","photo":{"id":12572743,"user_id":13,"name":"alexindigo-356","description":"","camera":null,"lens":null,"focal_length":null,"iso":null,"shutter_speed":null,"aperture":null,"times_viewed":0,"rating":null,"status":0,"created_at":"2012-08-27T01:47:15-04:00","category":0,"location":null,"privacy":true,"latitude":null,"longitude":null,"taken_at":null,"hi_res_uploaded":0,"for_sale":false,"width":null,"height":null,"votes_count":0,"favorites_count":0,"comments_count":0,"positive_votes_count":0,"nsfw":false,"sales_count":0,"for_sale_date":null,"highest_rating":0.0,"highest_rating_date":null}}'
  , photoInfoData  =
    {
      id           : 12539831,
      title        : 'Toronto panorama',
      description  : 'Taken in Toronto, Ontario @ March 16, 2008',
      private      : 0,
      url          : 'http://pcdn.500px.net/12539831/805beb838eafaf9253ff176b366af6f9fb31d593/4.jpg',
      tags         : [ 'toronto', 'night', 'skyline' ],
      safety       : 1,
      license      : null,
      dates        : '2008-03-15T00:00:00-04:00',
      latitude     : 43.685650966634206,
      longitude    : -79.41691160202026
    }
  , photoUploadData =
    {
      id: 12572743,
      user_id: 13,
      name: 'alexindigo-356',
      description: '',
      camera: null,
      lens: null,
      focal_length: null,
      iso: null,
      shutter_speed: null,
      aperture: null,
      times_viewed: 0,
      rating: null,
      status: 0,
      created_at: '2012-08-27T01:47:15-04:00',
      category: 0,
      location: null,
      privacy: true,
      latitude: null,
      longitude: null,
      taken_at: null,
      hi_res_uploaded: 0,
      for_sale: 0,
      width: null,
      height: null,
      votes_count: 0,
      favorites_count: 0,
      comments_count: 0,
      positive_votes_count: 0,
      nsfw: 0,
      sales_count: 0,
      for_sale_date: null,
      highest_rating: 0,
      highest_rating_date: null
    }
  ;

test('api_500px-uploadPhoto',
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

  'upload photo, get upload key': function()
  {
    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.post = function(url, token, secret, body, contentType, callback)
    {
      // TODO: Update it from 500px fix their API
      assert.equal(url, 'https://api.500px.com/v1/photos?name=Toronto%20panorama&description=Taken%20in%20Toronto%2C%20Ontario%20%40%20March%2016%2C%202008&category=0&privacy=0');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.equal(body, null);
      assert.equal(contentType, 'application/json');
      assert.ok(typeof callback == 'function');

      callback(null, photoUploadKey);
    };

    // override upload
    api.upload = function(photo, info, callback)
    {
      assert.equal(photo, photoInfoData.url);

      // check options
      assert.equal(info.upload_key, 'a8728e70694a2f846b63ef1b202d717d');
      assert.deepEqual(info.photo, photoUploadData);
    }

    api.uploadPhoto(photoInfoData.url, photoInfoData, bareFunction);
  }


});
