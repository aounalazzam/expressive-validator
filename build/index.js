"use strict";
/**
 * This Source Code Is Written By Aoun Alazzam And Under The MIT License
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var email_validator_1 = __importDefault(require("email-validator"));
var EMPTY_STRING = "";
function validate(schema, res, data, checkXSS) {
    return __awaiter(this, void 0, void 0, function () {
        var pushErrorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pushErrorMessage = function (errorMessage, errorType) {
                        res.status(500);
                        if (!errorMessage)
                            return res.end();
                        var message = errorMessage[errorType];
                        if (!message)
                            return;
                        res.send({ message: message });
                    };
                    return [4 /*yield*/, new Promise(function (resolve) {
                            for (var key in schema) {
                                var value = data[key];
                                var _a = schema[key], type = _a.type, require_1 = _a.require, maxLength = _a.maxLength, minLength = _a.minLength, errorMessage = _a.errorMessage;
                                // Not Require
                                if (require_1 === false && value === undefined) {
                                    continue;
                                }
                                // Require Checking
                                if (require_1 === true && !value) {
                                    console.log("There Is Required Value And Not Implemented '".concat(key, "'"));
                                    pushErrorMessage(errorMessage, "isRequireErrorMessage");
                                    return resolve(false);
                                }
                                var stringValueSpecification = type.indexOf("(") && type.indexOf(")")
                                    ? type.substring(type.indexOf("(") + 1, type.indexOf(")"))
                                    : "";
                                var typeWithoutSpecification = type.replace("(" + stringValueSpecification + ")", EMPTY_STRING);
                                var typeofValue = typeof value;
                                // Type Checking
                                if (typeofValue !== typeWithoutSpecification) {
                                    pushErrorMessage(errorMessage, "notSameTypeErrorMessage");
                                    console.log("expressive-validator  :Typeof '".concat(key, "' not equal '").concat(type, "' received '").concat(typeofValue, "'"));
                                    return resolve(false);
                                }
                                if (typeofValue === "string" && stringValueSpecification !== "") {
                                    // Email
                                    if (stringValueSpecification === "email") {
                                        if (!email_validator_1.default.validate(value)) {
                                            return resolve(false);
                                        }
                                    }
                                    // No Symbols
                                    if (stringValueSpecification === "no-symbols") {
                                        var symbols = value.replace(/^[0-9A-z ]+?$/g, "");
                                        if (symbols.length > 0) {
                                            return resolve(false);
                                        }
                                    }
                                }
                                if (checkXSS &&
                                    typeofValue === "string" &&
                                    (value.includes("<") || value.includes(">"))) {
                                    value = value.replaceAll(/\<|\>/gm, "_");
                                    console.log("expressive-validator  : Query XSS Detected ('".concat(type, "')"));
                                }
                                // Minlength Checking
                                if (minLength) {
                                    // String
                                    if (typeofValue === "string") {
                                        var lengthOfValue = value.length;
                                        if (lengthOfValue < minLength) {
                                            pushErrorMessage(errorMessage, "lessThanMinLengthErrorMessage");
                                            console.log("expressive-validator  : Length of '".concat(key, "' must be greater than ").concat(minLength, " received ").concat(lengthOfValue));
                                            return;
                                        }
                                    }
                                    if (typeofValue === "number") {
                                        if (value < minLength) {
                                            pushErrorMessage(errorMessage, "lessThanMinLengthErrorMessage");
                                            console.log("expressive-validator : Length of '".concat(key, "' must be greater than ").concat(minLength, " received ").concat(value));
                                            return;
                                        }
                                    }
                                }
                                // Minlength Checking
                                if (maxLength) {
                                    // String
                                    if (typeofValue === "string") {
                                        var lengthOfValue = value.length;
                                        if (lengthOfValue > maxLength) {
                                            pushErrorMessage(errorMessage, "overMaxLengthErrorMessage");
                                            console.log("expressive-validator  : Length of '".concat(key, "' must be less than ").concat(minLength, " received ").concat(lengthOfValue));
                                            return;
                                        }
                                    }
                                    // Number
                                    if (typeofValue === "number") {
                                        if (value > maxLength) {
                                            pushErrorMessage(errorMessage, "overMaxLengthErrorMessage");
                                            console.log("expressive-validator : Length of '".concat(key, "' must be less than ").concat(minLength, " received ").concat(value));
                                            return;
                                        }
                                    }
                                }
                            }
                            resolve(true);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function expressiveValidator(schema, errorLogger) {
    var _this = this;
    var errLogger = function (req, res) {
        if (errorLogger) {
            errorLogger(req, res);
            res.end();
            return;
        }
        res.status(500).end();
    };
    return function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var body, query, params, headers, originalUrl, method, routeSchema, routeSchemaParams, _a, routeSchemaQueryParams, _b, routeSchemaBody, _c, routeSchemaHeaders, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    body = request.body, query = request.query, params = request.params, headers = request.headers, originalUrl = request.originalUrl, method = request.method;
                    routeSchema = schema[originalUrl];
                    if (!routeSchema) {
                        console.log("No Schema For Route :" + originalUrl);
                        return [2 /*return*/, next()];
                    }
                    if (Array.isArray(routeSchema)) {
                        routeSchema = routeSchema.find(function (_a) {
                            var currentHTTPMethod = _a.method;
                            return currentHTTPMethod.includes("|")
                                ? currentHTTPMethod
                                    .trim()
                                    .split("|")
                                    .find(function (m) { return m === method; })
                                : currentHTTPMethod === method;
                        });
                        if (!routeSchema) {
                            console.log("No Schema For Route : <" + method + " > " + originalUrl);
                            return [2 /*return*/, next()];
                        }
                    }
                    routeSchemaParams = routeSchema.params;
                    _a = routeSchemaParams;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, validate(routeSchemaParams, response, params)];
                case 1:
                    _a = !(_e.sent());
                    _e.label = 2;
                case 2:
                    // Params Checking
                    if (_a) {
                        return [2 /*return*/, errLogger(request, response)];
                    }
                    routeSchemaQueryParams = routeSchema.query;
                    _b = routeSchemaQueryParams;
                    if (!_b) return [3 /*break*/, 4];
                    return [4 /*yield*/, validate(routeSchemaQueryParams, response, query, true)];
                case 3:
                    _b = !(_e.sent());
                    _e.label = 4;
                case 4:
                    // Query Checking
                    if (_b) {
                        return [2 /*return*/, errLogger(request, response)];
                    }
                    routeSchemaBody = routeSchema.body;
                    _c = routeSchemaBody;
                    if (!_c) return [3 /*break*/, 6];
                    return [4 /*yield*/, validate(routeSchemaBody, response, body)];
                case 5:
                    _c = !(_e.sent());
                    _e.label = 6;
                case 6:
                    // Body Checking
                    if (_c) {
                        return [2 /*return*/, errLogger(request, response)];
                    }
                    routeSchemaHeaders = routeSchema.headers;
                    _d = routeSchemaHeaders;
                    if (!_d) return [3 /*break*/, 8];
                    return [4 /*yield*/, validate(routeSchemaHeaders, response, headers)];
                case 7:
                    _d = !(_e.sent());
                    _e.label = 8;
                case 8:
                    // Headers Checking
                    if (_d) {
                        return [2 /*return*/, errLogger(request, response)];
                    }
                    next();
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.default = expressiveValidator;
