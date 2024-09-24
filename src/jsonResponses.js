// local object we'll get/add users from
const users = {};

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // ONLY write response if request is GET
  if (request.method !== 'HEAD' || status !== 204) {
    response.write(content);
  }

  response.end();
};

// will return 200 success at /getUsers
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// return 404 (both on /notReal and any other page)
const getNotReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// return 201 when adding new user, 204 when updating age of user, 400 if missing name/age/both
const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  const { name, age } = request.body;

  // if no name/age, send back 400
  if (!name || !age) {
    responseJSON.id = 'addUserMissingParams';
    respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204; // "no content"

  // If user does not exist, create new -> 201
  if (!users[name]) {
    responseCode = 201; // "created"
    users[name] = { name };
    responseJSON.message = 'Created Successfully';
  }
  // update user's age
  users[name].age = age;

  if (responseCode === 201) {
    return respondJSON(request, response, responseCode, /* users[name] */ responseJSON);
  }

  // for the 204
  return respondJSON(request, response, responseCode, {});
};

module.exports = {
  getUsers, getNotReal, addUser,
};
