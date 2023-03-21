/**
 * This Source Code Is Written By Aoun Alazzam And Under The MIT License
 */

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
  body: { [item: string]: ValidationParams };
  params: { [param: string]: ValidationParams };
  query: { [queryParam: string]: ValidationParams };
};

type Schema = {
  [url: string]:
    | Array<ValidationRule & { method: HTTPMethod }>
    | ValidationRule;
};

async function validate(
  schema: { [item: string]: ValidationParams },
  res: Response,
  data: any
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
      const value = data[key];
      const { type, require, maxLength, minLength, errorMessage } = schema[key];

      // Not Require
      if (require === false && value === undefined) {
        continue;
      }

      // Require Checking
      if (require === true && !value) {
        console.log(`There Is Required Value And Not Implemented '${key}'`);

        pushErrorMessage(errorMessage, "isRequireErrorMessage");

        return resolve(false);
      }

      const typeofValue = typeof value;

      // Type Checking
      if (typeofValue !== type) {
        pushErrorMessage(errorMessage, "notSameTypeErrorMessage");

        console.log(
          `expressive-validator  :Typeof '${key}' not equal '${type}' received '${typeofValue}'`
        );

        return resolve(false);
      }

      // Minlength Checking
      if (minLength) {
        // String
        if (typeofValue === "string") {
          const lengthOfValue = value.length;

          if (lengthOfValue < minLength) {
            pushErrorMessage(errorMessage, "lessThanMinLengthErrorMessage");

            console.log(
              `expressive-validator  : Length of '${key}' must be greater than ${minLength} received ${lengthOfValue}`
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
              `expressive-validator  : Length of '${key}' must be less than ${minLength} received ${lengthOfValue}`
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

function expressiveValidator(schema: Schema) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { body, query, params, originalUrl, method } = request;

    let routeSchema: ValidationRule = schema[originalUrl] as ValidationRule;

    if (!routeSchema) {
      console.log("No Schema For Route :" + originalUrl);
      return next();
    }

    if (Array.isArray(routeSchema)) {
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
      return;
    }

    const routeSchemaQueryParams = routeSchema.query;

    // Query Checking
    if (
      routeSchemaQueryParams &&
      !(await validate(routeSchemaQueryParams, response, query))
    ) {
      return;
    }

    const routeSchemaBody = routeSchema.body;

    // Body Checking
    if (routeSchemaBody && !(await validate(routeSchemaBody, response, body))) {
      return;
    }

    next();
  };
}

export default expressiveValidator;
