# FitnessTrackr API Documentation

## Introduction

Here at FitnessTrackr we strive to provide you with an easy to consume API, so you can build out beautiful front end experiences and leave the Data management to us.

We have a small handful of endpoints, each documented below.

### Authentication through JSON Web Tokens

When using the API, many calls are made in the context of a registered user. The API protects itself by requiring a token string passed in the Header for requests made in that context.

A sample request **with** an authorization token looks like this:

```js
fetch('https://fitnesstrac-kr.herokuapp.com/api/activities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
  body: JSON.stringify({ /* whatever things you need to send to the API */ })
})
```

It is **crucial** that the value for `Authorization` is a string starting with `Bearer`, followed by a space, and finished with the `token` you receive either by registering or logging in. Deviating from this format will cause the API to not recognize the token, and will result in an error.

If the token is malformed, missing, or has been revoked, you will get a response specific to that.

```js
{
  "name": "MissingUserError",
  "message": "You must be logged in to perform this action"
}
```

### General Return Schema

ERROR
```js
{
  "name": "MissingUserError",
  "message": "You must be logged in to perform this action"
}
```
SUCCESS (sends back created/updated entity)
```js
{
    "id": 9,
    "name": "bench press 4",
    "description": "4 sets of 10. Lift a safe amount, but push yourself!"
}
```


## User Endpoints

### `POST /api/users/register`

This route is used to create a new user account. On success, you will be given a JSON Web Token to be passed to the server for requests requiring authentication.

#### Request Parameters

* `username` (`string`, required): the desired username for the new user
* `password` (`string`, required): the desired password for the new user

#### Return Parameters

* `user` (`object`)
  * `id` (`number`): the database identifier of the user
  * `username` (`string`): the username of the user
* `message` (`string`): the success message
* `token` (`string`): the JSON Web Token which is used to authenticate the user with any future calls

#### Sample Call

```js
fetch('http://fitnesstrac-kr.herokuapp.com/api/users/register', {
  method: "POST",
  body: JSON.stringify({
    username: 'superman27',
    password: 'krypt0n0rbust'
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

If the API creates a new user, the following object will be returned:

```js
{
  "user": {
    "id": 5,
    "username": "superman27"
  },
  "message": "you're signed up!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJzdXBlcm1hbjI3MTIiLCJpYXQiOjE2MDE3OTcwNDIsImV4cCI6MTYwMjQwMTg0Mn0.8q2B4oCtL3Dx-fRk_K0YTZaCgzrYXXeCqU6G1AI9JT0"
}
```

### `POST /api/users/login`

This route is used for a user to login when they already have an account. On success, you will be given a JSON Web Token to be passed to the server for requests requiring authentication.

#### Request Parameters

* `username` (`string`, required): the registered username for the user
* `password` (`string`, required): the matching password for the user

#### Return Parameters

* `user` (`object`)
  * `id` (`string`): the database identifier of the user
  * `username` (`string`): the username of the user
* `message` (`string`): the success message
* `token` (`string`): the JSON Web Token which is used to authenticate the user with any future calls

#### Sample Call

```js
fetch('http://fitnesstrac-kr.herokuapp.com/api/users/login', {
  method: "POST",
  body: JSON.stringify({
    username: 'superman27',
    password: 'krypt0n0rbust'
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

If the API authenticates the username and password, the following object will be returned:

```js
{
  "user": {
    "id": 5,
    "username": "superman27"
  },
  "message": "you're logged in!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJzdXBlcm1hbjI3MTIiLCJpYXQiOjE2MDE3OTczNTcsImV4cCI6MTYwMjQwMjE1N30.ZCWu6iI7u-GrchkK0vhxTH3ZD7RV56vJNvc_azBB9C0"
}
```

### `GET /api/users/me`

This route is used to grab an already logged in user's relevant data. It is mostly helpful for verifying the user has a valid token (and is thus logged in). You must pass a valid token with this request, or it will be rejected.

#### Request Parameters

No request parameters are necessary for this route.

#### Return Parameters

* `id` (`string`): the database identifier of the user
* `username` (`string`): the username of the user

#### Sample Call

```js
fetch('http://fitnesstrac-kr.herokuapp.com/api/users/me', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  },
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);
```

#### Sample Response

```js
{
  "id": 5,
  "username": "superman27"
}
```

### `GET /users/:username/routines`

Get a list of public routines for a particular user.
 
## Activities Endpoints

### `GET /activities`

Just returns a list of all activities in the database

### `POST /activities` `(*)`

Create a new activity

### `PATCH /activities/:activityId` `(*)`

Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)

### `GET /activities/:activityId/routines`

Get a list of all public routines which feature that activity

## Routines Endpoints

### `GET /routines`

Return a list of public routines, include the activities with them

### `POST /routines` `(*)`

Create a new routine

### `PATCH /routines/:routineId` `(**)`

Update a routine, notably change public/private, the name, or the goal

### `DELETE /routines/:routineId` `(**)`

Hard delete a routine. Make sure to delete all the `routineActivities` whose routine is the one being deleted.

### `POST /routines/:routineId/activities`

Attach a single activity to a routine. Prevent duplication on `(routineId, activityId)` pair.

## routine_activities Endpoints

### `PATCH /routine_activities/:routineActivityId` `(**)`

Update the count or duration on the routine activity

### `DELETE /routine_activities/:routineActivityId` `(**)`

Remove an activity from a routine, use hard delete