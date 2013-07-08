# api_500px [![Build Status](https://secure.travis-ci.org/alexindigo/node-api_500px.png)](http://travis-ci.org/alexindigo/node-api_500px) [![Dependency Status](https://gemnasium.com/alexindigo/node-api_500px.png)](https://gemnasium.com/alexindigo/node-api_500px)

Helper (simple wrapper) for 500px API.

*Focused on authenticated user photo manipulations, including upload*

## Installation

```
npm install api_500px
```


## Examples


* Include module

```
var Api500px = require('api_500px');
```

* Create instance

```
var api = new Api500px(
    {
      key: 'your_500px_key_token',
      secret: 'your_500px_secret_token',
      callback: 'http://example.com/oauth_callback'
    });
```

* Request auth token

```
api.authRequest(function(err, authToken, authSecret, results)
{
  if (err) return callback(err);

  // redirect client to OAuth page
  callback(null, 'https://api.500px.com/v1/oauth/authorize?oauth_token='+authToken);
});
```

* Upon client's return with verification token, request access token

```
api.getAccessToken('api_500px_auth_verifier_token', function(err, accessToken, accessSecret, results)
{
  if (err) return callback(err);

  // access token's been stored within the api instance as well
  callback(null, {status: 'ready'});
});
```

* Get authenticated user's info

```
api.getUser(function(err, userData)
{
  if (err) return callback(err);

  // user's info has been stored within the api instance
  // - normalized: api.data.user.id and api.data.user.username
  // - original: api.data.user._details
  // "returned" userData has same format

  callback(null, userData);
});
```

* Get user's photos (first page up to 100 photos)

```
api.getPhotos(1, function(err, photos)
{
  if (err) return callback(err);

  // "returned" photos is unparsed JSON string
  callback(null, photos);
});
```

* Custom photo search

```
var params =
{
    feature: 'popular',
    user_id: 26,
    rpp: 50,
    page: 4,
    image_size: 2
};
api.getPhotos(params, function(err, photos)
{
  if (err) return callback(err);

  // "returned" photos is unparsed JSON string
  callback(null, photos);
});
```

* Get simple photo info

```
var photoId = 12539831;
api.getPhotoInfo(photoId, function(err, info)
{
  if (err) return callback(err);

  // "returned" info is normalized photo object
  callback(null, info);
});
```

* Get customized photo info

```
var photoId = 12539831
  , params =
    {
      image_size: 2,
      tags: 0,
      comments: 1,
      comments_page: 4
    };
api.getPhotoInfo(photoId, params, function(err, info)
{
  if (err) return callback(err);

  // "returned" info is normalized photo object
  callback(null, info);
});
```

*Normalized photo object:*

```
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
```

* Upload photo from remote photo hosting to 500px

*TODO: Refactor it.*

```
var photoUrl = 'http://farm9.staticflickr.com/8438/7789275832_3ab0e23be3_o.png';

api.uploadPhoto(photoUrl, flickrNormalizedPhotoInfoData, function(err, result)
{
  if (err) return callback(err);

  // result consists of two properties
  // - result.message: upload status message
  // - result.photo: parsed, non-normalized created photo object
  callback(null, result.photo);
});

```

## Everything else

TBD

## License

(The MIT License)

Copyright (c) 2012 Alex Indigo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
