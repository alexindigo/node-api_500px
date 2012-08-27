var assert       = require('assert')
  , test         = require('utest')

  // package thingy
  , Api500px     = require('../../index')
  , api // instance
  , bareFunction = function(){}

  , userJSON = '{"user":{"id":13,"username":"alexindigo","firstname":"Alex","lastname":"Indigo","birthday":null,"sex":1,"city":"Palo Alto","state":"CA","country":"United States","registration_date":"1070-01-01T01:02:03-05:00","about":"Hallo, Earthlings!","domain":"alexindigo.500px.com","upgrade_status":2,"fotomoto_on":true,"locale":"en","show_nude":true,"store_on":true,"contacts":{"website":"www.alexindigo.com","flickr":"alexindigo","twitter":"alexindigo"},"equipment":{"camera":["iPhone 4","Canon 350D","Canon 20D"],"lens":["Hipstamatic","Canon 100-300mm f/5.6 L","Canon 50mm f/1.8","Canon 17-85mm f/4-5.6","Sigma 18-125mm f/3.5-5.6","Sigma 24-70mm f/2.8"]},"fullname":"Alex Indigo","userpic_url":"http://500px.com/graphics/userpic.png","email":"user@example.com","photos_count":159,"affection":992,"in_favorites_count":221,"friends_count":857,"followers_count":336,"upload_limit":null,"upload_limit_expiry":"2032-04-17T11:27:36-04:00","upgrade_status_expiry":"2033-12-25","auth":{"facebook":0,"twitter":0}}}'
  ;

test('api_500px-getUser',
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

  'get user object': function()
  {
    // set access_token
    api.data.access_token  = 'api_test_access_key_token';
    api.data.access_secret = 'api_test_access_key_token';

    // override OAuth
    api.OA.get = function(url, token, secret, callback)
    {
      assert.equal(url, 'https://api.500px.com/v1/users');
      assert.equal(token, 'api_test_access_key_token');
      assert.equal(secret, 'api_test_access_key_token');
      assert.ok(typeof callback == 'function');

      // emulate return data
      callback(null, userJSON);
    };

    api.getUser(function(err, userData)
    {
      // check return values
      assert.ifError(err);
      assert.equal(userData.id, 13);
      assert.equal(userData.username, 'alexindigo');
      assert.equal(userData._details.city, 'Palo Alto');

      // check stored values
      assert.equal(api.data.user.id, 13);
      assert.equal(api.data.user.username, 'alexindigo');
      assert.equal(api.data.user._details.about, 'Hallo, Earthlings!');
    });

  }
});
