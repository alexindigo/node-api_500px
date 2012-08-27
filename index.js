var util         = require('util')
  , EventEmitter = require('events').EventEmitter
  , queryString  = require('querystring')

  // third-party modules
  , OAuth        = require('oauth').OAuth
  , FormData     = require('form-data')
//  , request    = require('request')

  // globals
  , basePoint    = 'https://api.500px.com/v1/'
  , endPoints    =
    {
      user       : basePoint + 'users',
      photos     : basePoint + 'photos',
      upload     : basePoint + 'upload'
    }
  , config       =
    {
      request    : basePoint + 'oauth/request_token',
      access     : basePoint + 'oauth/access_token',
      version    : '1.0A',
      signature  : 'HMAC-SHA1',
      separator  : ', ',

      key        : '',
      secret     : '',
      callback   : ''
    }
  ;

module.exports = api_500px;
util.inherits(api_500px, EventEmitter);

function api_500px(options)
{
  // house keeping
  if (!(this instanceof api_500px)) throw new Error('usage: var apiInstance = new api_500px(config);');
  EventEmitter.call(this);

  options = options || {};

  this.OA = new OAuth
  (
    options.request   || config.request,
    options.access    || config.access,
    options.key       || config.key,
    options.secret    || config.secret,
    options.version   || config.version,
    options.callback  || config.callback,
    options.signature || config.signature
  );

  // prepare place for user's info
  this.data = {};

  // change header separator to make it work with 500px
  this.OA._oauthParameterSeperator = options.separator || config.separator;

  return this;
};

// Sends auth request
api_500px.prototype.authRequest = function api500pxAuthRequest(callback)
{
  // request token
  this.OA.getOAuthRequestToken(function handler_api500pxAuthRequest(err, auth_token, auth_secret, results)
  {
    if (err) return callback(err);

    // TODO: Check if there is any overlapping
    this.data.auth_token  = auth_token;
    this.data.auth_secret = auth_secret;

    callback(null, auth_token, auth_secret, results);
  }.bind(this));
}

// Sends access token request
api_500px.prototype.getAccessToken = function api500pxGetAccessToken(verifier, callback)
{
  // get access token
  this.OA.getOAuthAccessToken(this.data.auth_token, this.data.auth_secret, verifier, function handler_api500pxGetAccessToken(err, access_token, access_secret, results)
  {
    if (err) return callback(err);

    // cleanup auth token
    delete this.data.auth_token;
    delete this.data.auth_secret;

    // store access token and secret
    this.data.access_token  = access_token;
    this.data.access_secret = access_secret;
    // it's not normalized data, therefore underscore
    this.data._details      = results;

    callback(null, access_token, access_secret, results);
  }.bind(this));
}

api_500px.prototype.getUser = function api500pxGetUser(callback)
{
  // TODO: make callbacks optional
  // JSONStream + .emit('error')

  // TODO: Make it real fallback, just fail at this point
  if (!this.data.access_token) return callback('Missing access token');

  this._get(endPoints.user, function handler_api500pxGetUser(err, data)
  {
    if (err) return callback(err);

    try
    {
      data = JSON.parse(data);
    }
    catch (e)
    {
      console.error(['Parse error:', e, 'in handler_api500pxGetUser'])
      return callback('Cannot parse 500px user data');
    }

    // update user info
    this.data.user =
    {
      id      : data.user.id,
      username: data.user.username,
      // not normalized
      _details: data.user
    };

    callback(null, this.data.user);

  }.bind(this));
}

// TODO: Should it parsed? (not at the moment)
api_500px.prototype.getPhotos = function api500pxGetPhotos(options_or_page, callback)
{
  var params;

  // check for user data
  if (!this.data.user)
  {
    return callback('Missing user data');
  }

  params =
  {
    feature   : 'user',
    user_id   : this.data.user.id,
    rpp       : 100,
    page      : 1,
    image_size: 4
  };

  if (typeof options_or_page == 'object')
  {
    for (var key in options_or_page)
    {
      params[key] = options_or_page[key];
    }
  }
  else
  {
    params.page = parseInt(options_or_page, 10) || params.page;
  }

  this._get(endPoints.photos, params, callback);
}

api_500px.prototype.getPhotoInfo = function api500pxGetPhotoInfo(id, options, callback)
{
  var params=
  {
    image_size: 4,
    tags      : 1
  };

  // again go prototypejs style, do magic
  if (typeof options == 'function')
  {
    callback = options;
  }
  else
  {
    for (var key in options)
    {
      params[key] = options[key];
    }
  }

  this._get(endPoints.photos+'/'+id, params, function handler_api500pxGetPhotoInfo(err, data)
  {
    var info;

    if (err) return callback(err);

    try
    {
      data = JSON.parse(data);
    }
    catch (e)
    {
      console.error(['Parse error:', e, 'in handler_api500pxGetPhotoInfo'])
      return callback('Cannot parse 500px photo info data');
    }

    // normalize data
    info =
    {
      id         : data.photo.id,
      title      : data.photo.name,
      description: data.photo.description,
      private    : data.photo.privacy,
      url        : data.photo.image_url,
      tags       : data.photo.tags,
      safety     : !data.photo.nsfw,
      license    : null,
      dates      : data.photo.taken_at,
      // exif    : data.photo.shutter_speed,
      latitude   : data.photo.latitude,
      longitude  : data.photo.longitude
    };

    callback(null, info, data);
  });
}


// TODO: This one goes to refactoring for sure
api_500px.prototype.uploadPhoto = function api500pxUploadPhoto(photo, options, callback)
{
  var params;

  if (typeof options == 'function')
  {
    callback = options;
    options  = null;
  }

  // Justin Case
  options = options || {};

  // get essentials
  params =
  {
    name: options.title || '',
    description: options.description || '',
    category: 0,
    privacy: options.private || 0
  }

  // TODO: add extra
  // for (var key in options)
  // {
  //   params[key] = options[key];
  // }

  // send post to get upload key
  this._post(endPoints.photos, params, function handler_api500pxUploadPhoto(err, data)
  {

    if (err) return callback(err);

    try
    {
      data = JSON.parse(data);
    }
    catch (e)
    {
      console.error(['Parse error:', e, 'in handler_api500pxGetPhotoInfo'])
      return callback('Cannot parse 500px upload photo data');
    }

    // notify stalkers
    this.emit('uploadkey', data);

    // start uploading
    this.upload(photo, data, callback)

  }.bind(this));
}

// TODO: This one goes to refactoring for sure
api_500px.prototype.upload = function api500pxUpload(photo, info, callback)
{
  var form = new FormData();

  form.append('photo_id', ''+info.photo.id);
  form.append('consumer_key', this.OA._consumerKey);
  form.append('access_key', this.data.access_token);
  form.append('upload_key', info.upload_key);
  form.append('file', request(photo));

  form.submit(endPoints.upload, function handler_api500pxUpload(err, res)
  {
    var body = '';

    if (err) return callback(err);

    res.setEncoding('utf8');

    res.on('data', function(data)
    {
      body += data;
    });

    res.on('end', function()
    {
      try
      {
        body = JSON.parse(body);
      }
      catch (e)
      {
        console.error(['Parse error:', e, 'in handler_api500pxUpload']);
        return callback('Cannot parse 500px upload photo response');
      }

      // serious check
      if (body.error != 'None.') return callback(body.status);

      // finally everything is good
      callback(null, {message: body.status, photo: info.photo});
    });

  });
}

/*
 * Tool functions
 */

// TODO: Streaming JSON parser?
api_500px.prototype._get = function api500pxGet(url, options, callback)
{
  // again go prototypejs style, do magic
  if (typeof options == 'function')
  {
    callback = options;
  }
  else
  {
    url += '?' + queryString.stringify(options);
  }

  return this.OA.get(url, this.data.access_token, this.data.access_secret, callback);
}

api_500px.prototype._post = function api500pxPost(url, body, contentType, callback)
{
  // check for callback
  if (typeof body == 'function')
  {
    callback = body;
    body     = null;
  }
  else if (typeof contentType == 'function')
  {
    callback    = contentType;
    contentType = null;
  }

  // content type
  contentType = contentType || 'application/json';

  // {{{ Guys, you just killing me
  if (body) url += '?' + ((typeof body == 'object') ? queryString.stringify(body) : body);

  // Seriously? POST method?
  return this.OA.post(url, this.data.access_token, this.data.access_secret, null, contentType, callback);
  // }}}

  // TODO: Don't use until 500px fix their API
  // return this.OA.post(url, this.data.access_token, this.data.access_secret, body, contentType, callback);
}
