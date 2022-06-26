# Social Network API

![Mongoose](https://img.shields.io/badge/6.4.0-0?label=Mongoose&style=for-the-badge&labelColor=white&color=black) ![Express](https://img.shields.io/badge/4.18.1-0?label=Express&style=for-the-badge&labelColor=white&color=black) ![mongoDB](https://img.shields.io/badge/2.2.1-0?label=MongoDB&style=for-the-badge&labelColor=white&color=black)

## Introduction

This RESTful social network back end allows developers to perform CRUD API calls like view, add, update and delete. It would allow a developer to test requests using Insomnia to prepare for front-end integration.

This CLI application uses npm packages `Express`, `Mongoose` and `nodemon`.

I made this app in order to learn how to implement a MongoDB ODM using Mongoose.

## Installation

### 0. Required

| Programs   | Download links                                    |
| ---------- | ------------------------------------------------- |
| `Node`     | https://nodejs.org/en/download/                   |
| `MongoDB`  | https://www.mongodb.com/docs/manual/installation/ |
| `Insomnia` | https://insomnia.rest/download                    |

### 1. Git clone and go inside

```sh
git clone https://github.com/leoelicos/social-network-api.git

cd social-network-api
```

### 2. Install dependencies, (optionally) run seed

```sh
cd ..

npm install

```

## Usage

1. Start the server: `npm start`

2. Access the APIs with Insomnia

## Video Demo

_In progress_

## Social Network API

### Root endpoint and API endpoint

| Root endpoint           | Endpoint |
| ----------------------- | -------- |
| `http://localhost:3001` | `/api`   |

### Example

```sh
GET http://localhost:3001/api/users
```

### Users

#### Create, read, update and delete users

| Request | Endpoint | Parameter  | Function                                      | Example JSON body                                  |
| ------- | -------- | ---------- | --------------------------------------------- | -------------------------------------------------- |
| GET     | `/users` |            | Read all users                                |                                                    |
| GET     | `/users` | `/:userId` | Read a user with `userId`                     |                                                    |
| POST    | `/users` |            | Create a user with JSON body                  | `{"username": "harry",`<br>`"email": "hp@hw.com"}` |
| PUT     | `/users` | `/:userId` | Update a user with JSON body and its `userId` | `{"username": "harry",`<br>`"email": "hp@hw.com"}` |
| DELETE  | `/users` | `/:userId` | Delete a user with `userId`                   |                                                    |

### Friends

#### Attach and delete friends from a user's friend list

| Request | Endpoint | Parameter  | Endpoint   | Parameter    | Function                                                  |
| ------- | -------- | ---------- | ---------- | ------------ | --------------------------------------------------------- |
| POST    | `/users` | `/:userId` | `/friends` | `/:friendId` | Attach a friend with `friendId` to a user with `userId`   |
| DELETE  | `/users` | `/:userId` | `/friends` | `/:friendId` | Delete a friend with `friendId` from a user with `userId` |

### Thoughts

#### Create, read, update and delete thoughts

| Request | Endpoint    | Parameter     | Function                                        | Example body                                                                    |
| ------- | ----------- | ------------- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| GET     | `/thoughts` |               | Get all thoughts                                |                                                                                 |
| GET     | `/thoughts` |               | Get a thought by its `id`                       |                                                                                 |
| POST    | `/thoughts` |               | Create a thought with JSON body                 | `{"thoughtText": "Life's good",`<br>`"username": "harry",`<br>`"userId": 5edf}` |
| PUT     | `/thoughts` | `/:thoughtId` | Update a thought with JSON body and `thoughtId` | `{"email": "hp@hw.com"}`                                                        |
| DELETE  | `/thoughts` | `/:thoughtId` | Remove a thought with `thoughtId`               |                                                                                 |

<hr>

### Reactions

**Add or remove reactions to a thought**

| Request | Endpoint    | Parameter     | Endpoint     | Parameter      | Function                                                            | Example body                                              |
| ------- | ----------- | ------------- | ------------ | -------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| POST    | `/thoughts` | `/:thoughtId` | `/reactions` |                | Add a reaction to a thought with `thoughtId` and JSON body          | `{"reactionBody": "OMG really?",`<br>`"username": "ron",` |
| DELETE  | `/thoughts` | `/:thoughtId` | `/reactions` | `/:reactionId` | Remove a reaction with `reactionId` from a thought with `thoughtId` |                                                           |

## Example of API response

Request:

```sh
GET http://localhost:3001/api/users
```

Response:

```sh
[

]
```

## Screenshots

### Screenshot: Insomnia GET Users

TBA

## Credits

- BCS Resources

## License

&copy; Leo Wong <leoelicos@gmail.com>

Licensed under the [MIT License](./LICENSE).
