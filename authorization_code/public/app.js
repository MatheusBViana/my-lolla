/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
const mytoken = 'Bearer BQC3-bPMRd3cMo5UNYJBwTadz0dG_9hFodOyfNvnWPNuhyShBUiEXohjpk5D8Mk6249GdpaNtOYNFTcEUdpWP1xlAOnxiQbv8nqLEFy0V126EtruSsM5DoMiKVSztRueWJMe_Ow3SVKnDrQo09_6iZWUUQjiz1DQTfjn-j46ICR9kg'
var bodyParser = require('body-parser');
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var client_id = 'c995f23d75d649b9b8a05f97d5fb0c4b'; // Your client id
var client_secret = 'd5b4391426d54a6c8e8ee93c19f5ea6c'; // Your secret
var redirect_uri = 'https://my-lolla.herokuapp.com/callback'; // Your redirect uri

// var path = require('path');
var meu_token = 'BQAH9GkbcRtphpecZ93QHo2UET9p3y3pWX8UJPqBmMUwCm9qW-BCYlkNZvVpEkAQwk0kiPhUwXscy6fU76LBRRbkyTsBTt55ijKvJ9bVOMbuQ29lRsqamuaQUqyKUBkhgTKrOQ4IB5qn5_kd2sUkQB3PvN8A9k0tI0oCZvQmXktPVg'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
// app.engine('html', require('ejs').renderFile);
// app.set('views', __dirname);
// app.set('view engine', 'html');
var engines = require('consolidate');

app.set('views', __dirname);
// app.engine('html', engines.mustache);
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');

// app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read user-follow-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  // console.log(req);
  // console.log(res);
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        meu_token = body.access_token;
        res.send({
          'access_token': meu_token
        });
      }
    });

  console.log(meu_token);
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
      request.post(authOptions, function(error, response, body) {
        // console.log(response);
      // console.log(body.access_token)
      if (!error && response.statusCode === 200) {
        // console.log(body)
        var access_token = body.access_token, 
            refresh_token = body.refresh_token;;
        // console.log(access_token);
        
        var options = {
          url: 'https://api.spotify.com/v1/me/top/artists?limit=18',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          // console.log(body);
          // console.log(body.items[0].external_urls);
          // res.send(body);
          // console.log(body);
          var artistas = [];
          var imgURL = [];
          // console.log(body);
          // var imgURL = [];
          let contador = 0;
         
          // console.log("tamanho: " + body.items);
          console.log("tamanho: " + body.items.length);
          // console.log("tamanho: " + body.items[0].length);
          var tamanho = body.items.length;

          for (var i = 0; i < body.items.length; i++) {
            artistas[i] = body.items[i].name;
          }
          console.log(artistas[0]);
          console.log(artistas[1]);
          console.log(artistas[2]);


          // const artistas_final = artistas.map(element => {
          //   return element.toLowerCase();
          // });

          console.log("chegou");
          res.render(__dirname + '/resultado2.html', {artistas: artistas, tamanho: tamanho});
          
          });

      } else{
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/teste', function(req, res) {
  var options = {
    url: 'https://api.spotify.com/v1/me/top/artists?time_range=short_term',
    headers: { 'Authorization': 'Bearer BQC3-bPMRd3cMo5UNYJBwTadz0dG_9hFodOyfNvnWPNuhyShBUiEXohjpk5D8Mk6249GdpaNtOYNFTcEUdpWP1xlAOnxiQbv8nqLEFy0V126EtruSsM5DoMiKVSztRueWJMe_Ow3SVKnDrQo09_6iZWUUQjiz1DQTfjn-j46ICR9kg'
      },
    json: true
  };
  request.get(options, function(error, response, body) {
    console.log(body);
    var art1 = body.items[0].name;
    res.render(__dirname + '/resultado2.html', {art1: art1});
    // res.send("opaa");
    // console.log(art1)
  });

});


function enviar(res, artistas){
  res.render(__dirname + '/resultado2.html', {artistas: artistas});
}
app.listen(process.env.PORT || 8888, function () {
  console.log('listening');
});