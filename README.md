# Expressive Validator

A Schema Based Validation Middleware For Body, Query, Params, Cookies & Headers In Express JS

Note : ⚠️⚠️⚠️ This Library In Development Don`t Use For Production

## Features

- Schema-Based & Memory Efficient
- More extensibility features
- Better JSON schema compliance
- Can Validate Body, Query, Params, Cookies & Headers In Same Time

## Example

Schema `schema.json`

```json
{
  // Any HTTP Method
  "/api/login": {
    "body": {
      "username": { "type": "string", "require": true },
      "type": { "type": "string", "require": false },
      "password": { "type": "string", "require": true, "minLength": 8 }
    },
    "query": {
      "sessionId": { "type": "string", "require": true }
    },
    "params":{
        ...
    },
  },
  // Specifying For Multiple HTTP Methods Per Route
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
