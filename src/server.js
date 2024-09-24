const http = require('http');
const query = require('querystring');
const jsonResponses = require('./jsonResponses.js');
const staticResponses = require('./staticResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// for handling the POST
const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.log(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    handler(request, response);
  });
};

// handle the POST requests (/addUser)
const handlePost = (request, response, url) => {
  if (url.pathname === '/addUser') {
    parseBody(request, response, jsonResponses.addUser);
  }
};

// handle the GET/HEAD requests (/getUsers, /notReal)
const handleGet = (request, response, url) => {
  if (url.pathname === '/') {
    staticResponses.getIndex(request, response);
  } else if (url.pathname === '/style.css') {
    staticResponses.getStyles(request, response);
  } else if (url.pathname === '/getUsers') {
    jsonResponses.getUsers(request, response);
  } else if (url.pathname === '/notReal') {
    jsonResponses.getNotReal(request, response);
  } else {
    jsonResponses.getNotReal(request, response);
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // if the method is POST, handle post - else handle GET/HEAD
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port ${port}`);
});
