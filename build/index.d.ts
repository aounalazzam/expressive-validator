/**
 * This Source Code Is Written By Aoun Alazzam And Under The MIT License
 */
import { NextFunction, Request, Response } from "express";
type HTTPMethod = "GET" | "PATCH" | "POST" | "PUT" | "DELETE";
type ErrorMessages = "isRequireErrorMessage" | "notSameTypeErrorMessage" | "overMaxLengthErrorMessage" | "lessThanMinLengthErrorMessage";
type ValidationParams = {
    type: "string" | "string(email)" | "string(no-symbols)" | "number" | "boolean" | "array" | "object" | "null" | "undefined";
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
    headers: {
        [headerName: string]: ValidationParams;
    };
};
type Schema = {
    [url: string]: Array<ValidationRule & {
        method: HTTPMethod;
    }> | ValidationRule;
};
declare function expressiveValidator(schema: Schema, errorLogger?: (req: Request, res: Response) => void): (request: Request, response: Response, next: NextFunction) => Promise<void>;
export default expressiveValidator;
