# Expressive Validator

A Schema Based Validation Middleware For Body, Query, Params, Cookies & Headers In Express JS

## Usage

```bash
npm i expressive-validator
```

## Features

- Schema-Based & Memory Efficient
- More extensibility features
- Better JSON schema compliance
- More String Validation Types Like (Emails, Without Symbols)
- Can Validate Body, Query, Params, Cookies & Headers In Same Time

## Dev Timeline

- [x] Body
- [x] Query
- [x] Params
- [ ] Cookies
- [x] Headers
- [x] Email Validation
- [x] No Symbols Validation
- [x] Query XSS Detection

> .... More Features (In Planning)

## Example

Schema `schema.json`

```json
{
  // Any HTTP Method
  "/api/login": {
    "body": {
      "username": { "type": "string(no-symbols)", "require": true },
      "email": { "type": "string(email)", "require": true },
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
      "method": "GET|DELETE",
      "body": {
        "id": { "type": "string", "require": true }
      }
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

## Documentation

Under Construction

## License

This Project Is Under The MIT License
Copyright (c) 2023 Aoun Alazzam
