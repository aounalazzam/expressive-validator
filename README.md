# Expressive Validator

A Schema Based Validation Middleware For Body, Query, Params In Express JS

Note : ⚠️⚠️⚠️ This Library In Development Don`t Use For Production

## Features

- More extensibility features
- Better JSON schema compliance

## Example

Schema `schema.json`

```json
{
  // Any HTTP Method
  "/api/login": {
    "body": {
      "username": { "type": "string", "require": true },
      "type": { "type": "string", "require": false },
      "password": { "type": "string", "require": true }
    },
    "query": {
      "sessionId": { "type": "string", "require": true }
    },
    "params":{
        ...
    },
  },
  // Specifying For HTTP Methods
  "/api/users": [
    {
      "method": "GET"
      ...
    },
    {
      "method": "POST"
      ...
    }
  ]
}
```

Middleware Usage `app.js`

```javascript
const express = require("express");
const expressiveValidator = require("expressive-validator");

const schema = require("./schema.json");

const app = express();

app.use(express.json());
app.use(expressiveValidator(schema));

..

```

## License

This Project Is Under The MIT License
Copyright (c) 2023 Aoun Alazzam
