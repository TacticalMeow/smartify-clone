# my-smarter-playlists
Hi there!
This is an open source web application written in pure TS with React (and MongoDB) 
that lets you generate and discover new playlist in Spotify.
The app has 2 main features.
1) Generate a playlist fine tuned to your needs using the sandbox mode 
  by defining a flow that takes spotify sources (playlists,radios,artists etc..) , processes them using actions provided by the app
  (shuffle,filter,recommend etc...) and finally produces a playlist directly into your spotify account.
2) Auto Generate lets you generate this entire flow in just a few clicks. <br />
![alt text](https://i.imgur.com/SlW6h4D.png) <br />
![alt text](https://i.imgur.com/fU2QOQY.png) <br />
![alt text](https://i.imgur.com/2ztWm68.png) <br />

Usage: <br />
If you want to run the app locally,
use the Docker images provided for the client, server and database with the following Enviroment Variables: <br />
  for client: <br />
  REACT_APP_SPOTIFY_CLIENT_ID: your spotify developer client ID (https://developer.spotify.com/). <br />
  REACT_APP_REDIRECT_URI: the spotify redirect uri http://hostname/callback where hostname is where you host the client (e.g. http://localhost:3000/callback) <br />
  *note: you should add your desired callback uri through the spotify developer dashboard
 
  for server:<br />
  DB_HOST: the MongoDB hostname <br />
  DB_PORT: the MongoDB port <br />
  SPOTIFY_REDIRECT_URL: same as client <br />
  TS_NODE_BASEURL: should be 'src' <br />
  CLIENT_DOMAIN: if done locally should be 'localhost' <br />
  DB_USER: username for MongoDB user <br />
  DB_PASSWORD: password for the MongoDB user <br />
  DB_NAME: name of the db for the application (could be anything) <br />
  SPOTIFY_CLIENT_ID: your spotify developer client ID <br />
  SPOTIFY_CLIENT_SECRET: your spotify developer client secret <br />
  optional*: <br />
  GENIUS_CLIENT_API_KEY: if you want to use language detection , provide a genius API client key (https://docs.genius.com/). <br />
  
  for the database: <br /> 
    MONGO_INITDB_ROOT_USERNAME: the MongoDB username to create.<br />
    MONGO_INITDB_ROOT_PASSWORD: the MongoDB main user password.<br />
  
 
