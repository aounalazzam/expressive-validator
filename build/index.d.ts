/**
 * This Source Code Is Written By Aoun Alazzam And Under The MIT License
 */
import { NextFunction, Request, Response } from "express";
type ErrorMessages = "isRequireErrorMessage" | "notSameTypeErrorMessage" | "overMaxLengthErrorMessage" | "lessThanMinLengthErrorMessage";
type ValidationParams = {
    type: "string" | "number" | "boolean" | "array" | "object" | "null" | "undefined";
    require?: boolean;
    minLength?: number;
    maxLength?: number;
    errorMessage?: {
        [E in ErrorMessages]: string;
    };
};
type ValidationRule = {
    body: {
        [item: string]: ValidationParams;
    };
    params: {
        [param: string]: ValidationParams;
    };
    query: {
        [queryParam: string]: ValidationParams;
    };
};
type Schema = {
    [url: string]: Array<ValidationRule & {
        method: "POST" | "PUT" | "GET" | "DELETE";
    }> | ValidationRule;
};
declare function expressiveValidator(schema: Schema): (request: Request, response: Response, next: NextFunction) => Promise<void>;
export default expressiveValidator;
