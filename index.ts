/**
 * This Source Code Is Written By Aoun Alazzam And Under The MIT License
 */

import emailValidator from "email-validator";
import { NextFunction, Request, Response } from "express";

type HTTPMethod = "GET" | "PATCH" | "POST" | "PUT" | "DELETE";

type ErrorMessages =
  | "isRequireErrorMessage"
  | "notSameTypeErrorMessage"
  | "overMaxLengthErrorMessage"
  | "lessThanMinLengthErrorMessage";

type ValidationParams = {
  type:
    | "string"
    | "string(email)"
    | "string(no-symbols)"
    | "string(not-empty)"
    | "number"
    | "boolean"
    | "array"
    | "object"
    | "null"
    | "undefined";
  require?: boolean;
  minLength?: number;
  maxLength?: number;
  errorMessage?: {
    [E in ErrorMessages]: string;
  };
};

type ValidationRule = {
  method: HTTPMethod;
  body?: { [item: string]: ValidationParams };
  params?: { [param: string]: ValidationParams };
  query?: { [queryParam: string]: ValidationParams };
};

type Schema = {
  [url: string]: Array<ValidationRule> | ValidationRule;
};

const EMPTY_STRING = "";

const pathToRegex = (path: string) => {
  return new RegExp(
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$",
    "gi"
  );
};

async function validate(
  schema: { [item: string]: ValidationParams },
  res: Response,
  data: any,
  checkXSS?: true
) {
  const pushErrorMessage = (
    errorMessage: ValidationParams["errorMessage"],
    errorType: ErrorMessages
  ) => {
    res.status(500);

    if (!errorMessage) return res.end();

    const message = errorMessage[errorType];

    if (!message) return;

    res.send({ message });
  };

  return await new Promise((resolve) => {
    for (const key in schema) {
      let value = data[key];
      const { type, require, maxLength, minLength, errorMessage } = schema[key];

      // Not Require
      if (require === false && (value === undefined || value === "undefined")) {
        continue;
      }

      // Require Checking
      if (require === true && !value) {
        console.log(`There Is Required Value And Not Implemented '${key}'`);

        pushErrorMessage(errorMessage, "isRequireErrorMessage");

        return resolve(false);
      }

      const stringValueSpecification =
        type.indexOf("(") && type.indexOf(")")
          ? type.substring(type.indexOf("(") + 1, type.indexOf(")"))
          : "";

      const typeWithoutSpecification = type.replace(
        "(" + stringValueSpecification + ")",
        EMPTY_STRING
      );

      const typeofValue = typeof value;

      // Type Checking
      if (
        type === "array" &&
        !Array.isArray(value) &&
        typeofValue !== typeWithoutSpecification
      ) {
        pushErrorMessage(errorMessage, "notSameTypeErrorMessage");

        console.log(
          `expressive-validator : Typeof '${key}' not equal '${type}' received '${typeofValue}'`
        );

        return resolve(false);
      }

      if (typeofValue === "string" && stringValueSpecification !== "") {
        // Email
        if (stringValueSpecification === "email") {
          if (!emailValidator.validate(value)) {
            return resolve(false);
          }
        }

        // Empty
        if (stringValueSpecification === "not-empty") {
          if (value.length === 0) {
            return resolve(false);
          }
        }

        // No Symbols
        if (stringValueSpecification === "no-symbols") {
          const symbols = value.replace(/^[0-9A-z ]+?$/g, "");

          if (symbols.length > 0) {
            return resolve(false);
          }
        }
      }

      if (
        checkXSS &&
        typeofValue === "string" &&
        (value.includes("<") || value.includes(">"))
      ) {
        value = value.replaceAll(/\<|\>/gm, "_");

        console.log(`expressive-validator : Query XSS Detected ('${type}')`);
      }

      // Minlength Checking
      if (minLength) {
        // String
        if (typeofValue === "string") {
          const lengthOfValue = value.length;

          if (lengthOfValue < minLength) {
            pushErrorMessage(errorMessage, "lessThanMinLengthErrorMessage");

            console.log(
              `expressive-validator : Length of '${key}' must be greater than ${minLength} received ${lengthOfValue}`
            );

            return;
          }
        }

        if (typeofValue === "number") {
          if (value < minLength) {
            pushErrorMessage(errorMessage, "lessThanMinLengthErrorMessage");

            console.log(
              `expressive-validator : Length of '${key}' must be greater than ${minLength} received ${value}`
            );

            return;
          }
        }
      }

      // Minlength Checking
      if (maxLength) {
        // String
        if (typeofValue === "string") {
          const lengthOfValue = value.length;

          if (lengthOfValue > maxLength) {
            pushErrorMessage(errorMessage, "overMaxLengthErrorMessage");

            console.log(
              `expressive-validator : Length of '${key}' must be less than ${minLength} received ${lengthOfValue}`
            );

            return;
          }
        }

        // Number
        if (typeofValue === "number") {
          if (value > maxLength) {
            pushErrorMessage(errorMessage, "overMaxLengthErrorMessage");

            console.log(
              `expressive-validator : Length of '${key}' must be less than ${minLength} received ${value}`
            );

            return;
          }
        }
      }
    }

    resolve(true);
  });
}

function expressiveValidator(
  schema: Schema,
  errorLogger?: (req: Request, res: Response) => void
) {
  const errLogger = (req: Request, res: Response) => {
    if (errorLogger) {
      errorLogger(req, res);
      res.end();
      return;
    }

    res.status(500).end();
  };

  return async (request: Request, response: Response, next: NextFunction) => {
    const { body, query, params, originalUrl, method } = request;

    const route = Object.entries(schema).find(([url]) =>
      pathToRegex(url).test(originalUrl)
    );

    let routeSchema = route ? (route[1] as ValidationRule) : null;

    if (!(routeSchema && method == routeSchema.method)) {
      console.log("No Schema For Route " + " <" + method + "> " + originalUrl);
      return next();
    }

    if (routeSchema && Array.isArray(routeSchema)) {
      routeSchema = routeSchema.find(({ method: currentHTTPMethod }) =>
        currentHTTPMethod.includes("|")
          ? currentHTTPMethod
              .trim()
              .split("|")
              .find((m: HTTPMethod) => m === method)
          : currentHTTPMethod === method
      );

      if (!routeSchema) {
        console.log("No Schema For Route : <" + method + " > " + originalUrl);
        return next();
      }
    }

    const routeSchemaParams = routeSchema.params;

    // Params Checking
    if (
      routeSchemaParams &&
      !(await validate(routeSchemaParams, response, params))
    ) {
      return errLogger(request, response);
    }

    const routeSchemaQueryParams = routeSchema.query;

    // Query Checking
    if (
      routeSchemaQueryParams &&
      !(await validate(routeSchemaQueryParams, response, query, true))
    ) {
      return errLogger(request, response);
    }

    const routeSchemaBody = routeSchema.body;

    // Body Checking
    if (routeSchemaBody && !(await validate(routeSchemaBody, response, body))) {
      return errLogger(request, response);
    }

    next();
  };
}

export default expressiveValidator;
