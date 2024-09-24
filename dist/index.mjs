var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.4.5",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        "test:coverage": "tap --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    var fs = __require("fs");
    var path = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt2(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt: decrypt2,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// src/common/config/index.ts
var import_dotenv = __toESM(require_main());
(0, import_dotenv.config)();
var ENV = {
  isBrowser: typeof window === "object" && "[object Window]" === window.toString.call(window),
  isNode: typeof global === "object" && "[object global]" === global.toString.call(global)
};

// src/common/constant/response.codes.ts
var RESPONSE_CODES = {
  REFRESH_TOKEN_CODES: [401, 104401]
};

// src/common/constant/regex.ts
var regexps = {
  DATE_FORMAT_YYYY_MM_DD: /^([2-9][0-9][0-9][0-9])\-(0[1-9]|10|11|12)\-([012][1-9]|10|20|30|31)$/,
  UZ_PHONE_NUMBER: /^\+998(33|50|55|65|67|71|77|88|9[01345789])[0-9]{7}$/
};

// src/common/utility/date-diff.ts
function getDateDayDiff(date1, date2 = /* @__PURE__ */ new Date()) {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  return (date1.getTime() - date2.getTime()) / 864e5;
}

// src/common/utility/date-formatter.ts
var correctDate = (num) => num < 10 ? `0${num}` : num;
function getDateYYYYMMDD(date, separator = "-") {
  return `${date.getFullYear()}${separator}${correctDate(
    date.getMonth() + 1
  )}${separator}${correctDate(date.getDate())}`;
}
function getDateMMDDYYYY(date, separator = "-") {
  date = new Date(date);
  return `${correctDate(date.getMonth() + 1)}${separator}${correctDate(
    date.getDate()
  )}${separator}${date.getFullYear()}`;
}
function getDateDDMMYYYY(date, separator = "-") {
  return `${correctDate(date.getDate())}${separator}${correctDate(
    date.getMonth() + 1
  )}${separator}${date.getFullYear()}`;
}

// src/common/utility/num-format.ts
function numberFormat(number, fractionDigits = 0, dsep = ".", tsep = ",") {
  if (isNaN(number) || typeof number !== "number" && typeof number !== "bigint")
    return "";
  const numStr = number.toFixed(fractionDigits);
  let pindex = numStr.indexOf("."), fnums, decimals;
  const parts = [];
  if (pindex > -1) {
    fnums = numStr.substring(0, pindex).split("");
    decimals = dsep + numStr.substr(pindex + 1);
  } else {
    fnums = numStr.split("");
    decimals = "";
  }
  do {
    parts.unshift(fnums.splice(-3, 3).join(""));
  } while (fnums.length);
  return parts.join(tsep) + decimals;
}
function numberWithZero(num, zeroLen) {
  if (isNaN(num)) return "";
  let zeros = "";
  for (let i = 0; i < zeroLen; i++) {
    zeros += "0";
  }
  return `${zeros}${num}`;
}

// src/common/utility/num-to-text.ts
var lettersKril = {
  0: "\u043D\u043E\u043B\u044C",
  1: "\u0431\u0438\u0440",
  2: "\u0438\u043A\u043A\u0438",
  3: "\u0443\u0447",
  4: "\u0442\u045E\u0440\u0442",
  5: "\u0431\u0435\u0448",
  6: "\u043E\u043B\u0442\u0438",
  7: "\u0435\u0442\u0442\u0438",
  8: "\u0441\u0430\u043A\u043A\u0438\u0437",
  9: "\u0442\u045E\u049B\u049B\u0438\u0437"
};
var lettersLotin = {
  0: "nol",
  1: "bir",
  2: "ikki",
  3: "uch",
  4: "to'rt",
  5: "besh",
  6: "olti",
  7: "yetti",
  8: "sakkiz",
  9: "to'qqiz"
};
var decimalsKril = {
  0: "\u043D\u043E\u043B\u044C",
  1: "\u045E\u043D",
  2: "\u0439\u0438\u0433\u0438\u0440\u043C\u0430",
  3: "\u045E\u0442\u0442\u0438\u0437",
  4: "\u049B\u0438\u0440\u049B",
  5: "\u0435\u043B\u043B\u0438\u043A",
  6: "\u043E\u043B\u0442\u043C\u0438\u0448",
  7: "\u0435\u0442\u043C\u0438\u0448",
  8: "\u0441\u0430\u043A\u0441\u043E\u043D",
  9: "\u0442\u045E\u049B\u0441\u043E\u043D"
};
var decimalsLotin = {
  0: "nol",
  1: "o'n",
  2: "yigirma",
  3: "o'ttiz",
  4: "qirq",
  5: "ellik",
  6: "oltmish",
  7: "yetmish",
  8: "sakson",
  9: "to'qson"
};
var thousandsKril = [
  "",
  "\u043C\u0438\u043D\u0433",
  "\u043C\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u043C\u0438\u043B\u043B\u0438\u0430\u0440\u0434",
  "\u0442\u0440\u0438\u043B\u0438\u043E\u043D",
  "\u043A\u0432\u0430\u0434\u0440\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u043A\u0432\u0438\u043D\u0442\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u0441\u0435\u043A\u0441\u0442\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u0441\u0435\u043F\u0442\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u043E\u043A\u0442\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u043D\u043E\u043D\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u0434\u0435\u043A\u0430\u043B\u0438\u043E\u043D",
  "\u0443\u043D\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u0434\u043E\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u0442\u0440\u0435\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
  "\u043A\u0432\u0430\u0442\u0442\u0443\u043E\u0440\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D"
  // "квиндециллион",
  // "сексдециллион",
  // "септдециллион",
  // "октодециллион",
  // "новемдециллион",
  // "вигин",
];
var thousandsLotin = [
  "",
  "ming",
  "million",
  "milliard",
  "trilion",
  "kvadrillion",
  "kvintillion",
  "sekstillion",
  "septillion",
  "oktillion",
  "nonillion",
  "dekalion",
  "undetsillion",
  "dodetsillion",
  "tredetsillion",
  "kvattuordetsillion"
  // "квиндециллион",
  // "сексдециллион",
  // "септдециллион",
  // "октодециллион",
  // "новемдециллион",
  // "вигин",
];
function numberToText(num, alphabet) {
  let letters, decimals, thousands;
  let yuz = "yuz";
  if (alphabet === "lotin") {
    letters = lettersLotin;
    decimals = decimalsLotin;
    thousands = thousandsLotin;
  } else {
    letters = lettersKril;
    decimals = decimalsKril;
    thousands = thousandsKril;
    yuz = "\u044E\u0437";
  }
  num = Number(num);
  if (Number.isNaN(num) || typeof num !== "bigint" && typeof num !== "number") {
    return "Invalid number";
  }
  let beginStr = "";
  if (num < 0) {
    beginStr = "minus";
    num = Math.abs(num);
  }
  if (num === 0) {
    return letters[num];
  }
  let letterStr = "";
  let groupCount = 0;
  while (num > 0) {
    let group = num % 1e3;
    if (group > 0) {
      let groupLetterStr = "";
      if (group >= 100) {
        groupLetterStr += ` ${letters[Math.floor(group / 100)]} ${yuz}`;
        group %= 100;
        if (group > 0) {
          groupLetterStr += " ";
        }
      }
      if (group >= 10) {
        groupLetterStr += ` ${decimals[Math.floor(group / 10)]}`;
        group %= 10;
        if (group > 0) {
          groupLetterStr += " ";
        }
      }
      if (group > 0) {
        groupLetterStr += ` ${letters[group]}`;
      }
      if (groupCount > 0) {
        groupLetterStr += ` ${thousands[groupCount]}`;
      }
      letterStr = groupLetterStr + letterStr;
    }
    num = Math.floor(num / 1e3);
    groupCount++;
  }
  return `${beginStr}${letterStr}`.trim();
}

// src/common/utility/request/send-https-request.ts
import FormData from "form-data";
import http from "http";
import https from "https";
var bodyIsRequired = {
  GET: false,
  POST: true
};
function request(opts) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    if (bodyIsRequired[opts.method]) opts.body = opts.body || "{}";
    const reqOptions = {
      method: opts.method,
      headers: opts.body instanceof FormData ? (_c = (_b = (_a = opts.body).getHeaders) == null ? void 0 : _b.call(_a)) != null ? _c : { "Content-Type": "multipart/form-data" } : opts.headers ? opts.headers : {
        "Content-Type": "application/json"
      }
    };
    const func = opts.url.includes("https://", 0) ? https.request : http.request;
    return yield new Promise((resolve, reject) => {
      const req = func(opts.url, reqOptions, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data = data + chunk.toString();
        }).on("end", () => {
          resolve(JSON.parse(data));
        }).on("error", (err) => {
          console.log(err, "error while res");
          reject(err);
        });
      });
      if (opts.body instanceof FormData) {
        opts.body.pipe(req);
      } else {
        req.write(opts.body);
      }
      req.on("error", (err) => {
        console.log(err, "error while req");
        reject(err);
      }).end();
    });
  });
}

// src/common/utility/date-to-formatted.ts
function formatDate(date, separator = "-") {
  const locale = "uz-UZ";
  return {
    date,
    iso: date.toISOString(),
    hh_mm: date.toLocaleString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).replace(/\//g, separator),
    hh_mm_ss: date.toLocaleString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).replace(/\//g, separator),
    YYYY_MM_DD: date.toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).replace(/\//g, separator),
    YYYY_MM_DD_hh_mm_ss: date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).replace(/\//g, separator)
  };
}
Date.prototype.toFormatted = function(separator = "-") {
  return formatDate(this, separator);
};

// src/messenger.ts
import { io } from "socket.io-client";
import { v1 as uuidV12 } from "uuid";

// src/utils/crypto/index.ts
import CryptoJS from "crypto-js";
import { v1 as uuidV1 } from "uuid";
var cryptoSecret = uuidV1();
function encrypt(data) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    // CryptoJS.lib.WordArray.create(serialize(data).buffer),
    cryptoSecret
  ).toString();
}
function decrypt(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, cryptoSecret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (originalText) {
    return JSON.parse(originalText);
  }
  return null;
}

// src/utils/request/instance.ts
import axios from "axios";
var _isRefreshing, _refreshTokenUrl, _languageGetter, _retryQueues, _CustomAxiosInstance_instances, handleRefreshToken_fn, refreshTokenAndReRequest_fn, setInterceptor_fn;
var CustomAxiosInstance = class {
  /**
   *
   * @param axiosConfig - axios configuration
   */
  constructor(axiosConfig, {
    refreshTokenUrl,
    languageGetter
  }) {
    __privateAdd(this, _CustomAxiosInstance_instances);
    __privateAdd(this, _isRefreshing);
    __privateAdd(this, _refreshTokenUrl);
    __privateAdd(this, _languageGetter);
    __privateAdd(this, _retryQueues);
    __privateSet(this, _languageGetter, languageGetter);
    this.instance = axios.create(axiosConfig);
    __privateSet(this, _isRefreshing, false);
    __privateSet(this, _retryQueues, []);
    __privateSet(this, _refreshTokenUrl, refreshTokenUrl);
    __privateMethod(this, _CustomAxiosInstance_instances, setInterceptor_fn).call(this);
  }
};
_isRefreshing = new WeakMap();
_refreshTokenUrl = new WeakMap();
_languageGetter = new WeakMap();
_retryQueues = new WeakMap();
_CustomAxiosInstance_instances = new WeakSet();
handleRefreshToken_fn = function() {
  return __async(this, null, function* () {
    var _a;
    const {
      data: { data }
    } = yield axios.create(this.instance.defaults).get(__privateGet(this, _refreshTokenUrl), {
      headers: { Authorization: `Bearer ${((_a = localStg.get("messengerToken")) == null ? void 0 : _a.refresh) || ""}` }
    });
    if (data && data.token) {
      localStg.set("messengerToken", {
        access: data.token.accessToken,
        refresh: data.token.refreshToken
      });
    }
    return data.token.accessToken;
  });
};
refreshTokenAndReRequest_fn = function(response) {
  return __async(this, null, function* () {
    if (__privateGet(this, _isRefreshing)) {
      return;
    }
    try {
      __privateSet(this, _isRefreshing, true);
      const accessToken = yield __privateMethod(this, _CustomAxiosInstance_instances, handleRefreshToken_fn).call(this);
      if (accessToken) {
        response.config.headers.Authorization = `Bearer ${accessToken}`;
        __privateGet(this, _retryQueues).map((cb) => cb(response.config));
      }
      __privateSet(this, _retryQueues, []);
      __privateSet(this, _isRefreshing, false);
    } catch (error) {
      __privateSet(this, _retryQueues, []);
      __privateSet(this, _isRefreshing, false);
      throw error;
    }
  });
};
/** Set request interceptor */
setInterceptor_fn = function() {
  this.instance.interceptors.request.use((config2) => __async(this, null, function* () {
    var _a;
    const handleConfig = __spreadValues({}, config2);
    handleConfig.headers["x-app-lang"] = __privateGet(this, _languageGetter).call(this) || "Uz-Latin";
    if (handleConfig.headers) {
      handleConfig.headers.Authorization = `Bearer ${((_a = localStg.get("messengerToken")) == null ? void 0 : _a.access) || ""}`;
    }
    return handleConfig;
  }));
  this.instance.interceptors.response.use(
    (response) => response,
    (axiosError) => __async(this, null, function* () {
      var _a, _b, _c;
      if (((_a = axiosError.response) == null ? void 0 : _a.data["code"]) && RESPONSE_CODES.REFRESH_TOKEN_CODES.includes((_b = axiosError.response) == null ? void 0 : _b.data["code"]) || RESPONSE_CODES.REFRESH_TOKEN_CODES.includes((_c = axiosError.response) == null ? void 0 : _c.status)) {
        const originRequest = new Promise((resolve) => {
          __privateGet(this, _retryQueues).push((refreshConfig) => {
            resolve(this.instance.request(refreshConfig));
          });
        });
        yield __privateMethod(this, _CustomAxiosInstance_instances, refreshTokenAndReRequest_fn).call(this, axiosError.response);
        return originRequest;
      }
      throw axiosError;
    })
  );
};

// src/utils/storage/local.ts
var localStorage;
if (ENV.isBrowser) {
  localStorage = window.localStorage;
} else {
  const map = /* @__PURE__ */ new Map();
  localStorage = {
    clear() {
      map.clear();
      return map;
    },
    getItem(key) {
      return map.get(key);
    },
    removeItem(key) {
      map.delete(key);
      return map;
    },
    setItem(key, value) {
      map.set(key, value);
      return map;
    }
  };
}
function createLocalStorage() {
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;
  function set(key, value, expire = DEFAULT_CACHE_TIME) {
    const storageData = {
      value,
      expire: expire !== null ? (/* @__PURE__ */ new Date()).getTime() + expire * 1e3 : null
    };
    localStorage.setItem(key, encrypt(storageData));
  }
  function get(key) {
    const json = localStorage.getItem(key);
    if (!json) {
      return null;
    }
    let storageData = null;
    try {
      storageData = decrypt(json);
    } catch (e) {
    }
    if (!storageData) {
      remove(key);
      return null;
    }
    const { value, expire } = storageData;
    if (!(expire === null || expire >= Date.now())) {
      return null;
    }
    return value;
  }
  function remove(key) {
    localStorage.removeItem(key);
  }
  function clear() {
    localStorage.clear();
  }
  return {
    set,
    get,
    remove,
    clear
  };
}
var localStg = createLocalStorage();

// src/utils/storage/session.ts
function createSessionStorage() {
  function set(key, value) {
    sessionStorage.setItem(key, encrypt(value));
  }
  function get(key) {
    const json = sessionStorage.getItem(key);
    let data = null;
    if (json) {
      try {
        data = decrypt(json);
      } catch (e) {
      }
    }
    return data;
  }
  function remove(key) {
    window.sessionStorage.removeItem(key);
  }
  function clear() {
    window.sessionStorage.clear();
  }
  return {
    set,
    get,
    remove,
    clear
  };
}
var sessionStg = createSessionStorage();

// src/messenger.ts
var localUid = localStg.get("messengerDeviceUid");
var uid = localUid ? localUid : uuidV12();
localStg.set("messengerDeviceUid", uid);
var appVersion = "0.0.0";
var requiredHeaders = {
  "x-device-type": "web" /* WEB */,
  "x-device-model": ENV.isBrowser ? `${navigator.userAgent} | ${navigator.platform}` : ENV.isNode ? `${process.platform} | ${process.arch} | Nodejs: ${process.version}` : "Unknown",
  // dynamically fetching device model info
  // 'x-app-lang': (languageGetter() || 'Uz-Latin') as I18nType.LangType, // dynamically fetching language info
  "x-app-version": appVersion,
  "x-app-uid": uid
};
var _pollingInterval, _polling, _axiosInstance, _events, _updatesHash, _baseURL, _token, _tokenGetter;
var Messenger = class {
  constructor({
    baseURL,
    token,
    polling = null,
    languageGetter = () => "Uz-Latin",
    headers = {}
  }, options = {}) {
    __privateAdd(this, _pollingInterval);
    __privateAdd(this, _polling);
    __privateAdd(this, _axiosInstance);
    __privateAdd(this, _events);
    __privateAdd(this, _updatesHash, "");
    __privateAdd(this, _baseURL);
    __privateAdd(this, _token);
    __privateAdd(this, _tokenGetter);
    this.uid = uid;
    __privateSet(this, _polling, polling);
    __privateSet(this, _baseURL, baseURL);
    __privateSet(this, _events, {});
    __privateSet(this, _token, { access: "", refresh: "" });
    __privateSet(this, _tokenGetter, token);
    __privateSet(this, _axiosInstance, new CustomAxiosInstance(
      { baseURL, headers: requiredHeaders },
      {
        refreshTokenUrl: "/v1/auth/refresh-token",
        languageGetter
      }
    ).instance);
    this.init = this.init.bind(this);
    this.close = this.close.bind(this);
    this.initPolling = this.initPolling.bind(this);
    this.on = this.on.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.getChatMessages = this.getChatMessages.bind(this);
    this.getChatInfo = this.getChatInfo.bind(this);
    this.getChatMedia = this.getChatMedia.bind(this);
    this.getChatFiles = this.getChatFiles.bind(this);
    this.getChatAudios = this.getChatAudios.bind(this);
    this.getUpdates = this.getUpdates.bind(this);
    this.readMessage = this.readMessage.bind(this);
    this.getChats = this.getChats.bind(this);
    this.sendMessageToArea = this.sendMessageToArea.bind(this);
    this.init();
  }
  close() {
    if (this.socket) {
      this.socket.close();
      return;
    }
    clearInterval(__privateGet(this, _pollingInterval));
    __privateSet(this, _pollingInterval, void 0);
  }
  initPolling() {
    if (__privateGet(this, _pollingInterval)) {
      clearInterval(__privateGet(this, _pollingInterval));
    }
    const getUpdates = this.getUpdates;
    const polling = __privateGet(this, _polling);
    const events = __privateGet(this, _events);
    function intervalCallback() {
      return __async(this, null, function* () {
        const { updates, meta } = yield getUpdates({ limit: polling.limit });
        if (events["update"] && updates.updates) {
          updates.updates.map((update) => {
            events["update"].map((cb) => cb(update));
          });
        }
        if (events["updateUser"] && updates.users) {
          updates.users.map((user) => {
            events["updateUser"].map((cb) => cb(user));
          });
        }
        if (events["updateMessage"] && updates.messages) {
          updates.messages.map((message) => {
            events["updateMessage"].map((cb) => cb(message));
          });
        }
      });
    }
    __privateSet(this, _pollingInterval, setInterval(intervalCallback, polling.interval));
  }
  init() {
    return __async(this, null, function* () {
      if (typeof __privateGet(this, _tokenGetter) === "function") {
        __privateSet(this, _token, yield __privateGet(this, _tokenGetter).call(this));
      } else {
        __privateSet(this, _token, __privateGet(this, _tokenGetter));
      }
      localStg.set("messengerToken", __privateGet(this, _token));
      if (__privateGet(this, _polling) === null) {
        this.socket = io(__privateGet(this, _baseURL), {
          path: "/messenger",
          autoConnect: false,
          auth: (cb) => cb(__spreadProps(__spreadValues({}, requiredHeaders), {
            token: __privateGet(this, _token).access
          })),
          extraHeaders: __spreadProps(__spreadValues({}, requiredHeaders), { token: __privateGet(this, _token).access })
        });
      }
      if (__privateGet(this, _polling)) {
        this.initPolling();
        if (Array.isArray(__privateGet(this, _events)["connect"])) {
          __privateGet(this, _events)["connect"].map(
            (cb) => cb({
              message: `Polling successfully connected`,
              socket: this.socket
            })
          );
        }
        return this;
      }
      return this.socket.connect().on("connect", () => {
        if (!Array.isArray(__privateGet(this, _events)["connect"])) {
          return;
        }
        __privateGet(this, _events)["connect"].map(
          (cb) => cb({
            message: `Socket successfully connected. socket.id: ${this.socket.id}`,
            socket: this.socket
          })
        );
      }).on("disconnect", (reason, details) => {
        if (!Array.isArray(__privateGet(this, _events)["disconnect"])) {
          return;
        }
        __privateGet(this, _events)["disconnect"].map(
          (cb) => cb({
            reason,
            details,
            message: `Socket disconnected: id: ${this.socket.id}, reason: ${reason}, details: ${JSON.stringify(details)}`,
            socket: this.socket
          })
        );
      }).on("connect_error", (err) => {
        if (!__privateGet(this, _events)["socketConnectionError"] || !Array.isArray(__privateGet(this, _events)["socketConnectionError"])) {
          return;
        }
        if (this.socket.active) {
          __privateGet(this, _events)["socketConnectionError"].map(
            (cb) => cb({
              message: "temporary failure, the socket will automatically try to reconnect",
              error: err
            })
          );
        } else {
          __privateGet(this, _events)["socketConnectionError"].map(
            (cb) => cb({
              message: `
                the connection was denied by the server
                in that case, socket.connect() must be manually called in order to reconnect.
                Error: ${err.message}
              `,
              error: err
            })
          );
        }
      }).on("update", (update) => {
        if (!Array.isArray(__privateGet(this, _events)["update"])) {
          return;
        }
        __privateGet(this, _events)["update"].map((cb) => cb(update));
      });
    });
  }
  // public on(event: Ev, cb: Ev extends keyof IEvents ? IEvents[Ev] : (...args: any[]) => void): this;
  on(event, cb) {
    if (__privateGet(this, _events)[event]) {
      __privateGet(this, _events)[event].push(cb);
    } else {
      __privateGet(this, _events)[event] = [cb];
    }
    return this;
  }
  eventNames() {
    return Object.keys(__privateGet(this, _events));
  }
  removeAllListeners(event) {
    if (event) {
      __privateGet(this, _events)[event] = [];
      return;
    }
    __privateSet(this, _events, {});
    return this;
  }
  removeListener(event, callback) {
    if (!__privateGet(this, _events)[event] || !Array.isArray(__privateGet(this, _events)[event])) {
      return;
    }
    __privateGet(this, _events)[event].filter((cb) => cb.name !== callback.name);
    return this;
  }
  /**
   *
   * @param search id or username
   * @returns {[]}
   */
  searchUser() {
    return __async(this, arguments, function* ({ limit = 20, page = 1, search = "" } = {
      limit: 20,
      page: 1,
      search: ""
    }) {
      const { data } = yield __privateGet(this, _axiosInstance).get(
        `/v1/users?search=${search}&limit=${limit}&page=${page}`
      );
      return data;
    });
  }
  sendMessage(chatId, message) {
    return __async(this, null, function* () {
      const { data } = yield __privateGet(this, _axiosInstance).post(`/v1/chats/${chatId}/messages`, message);
      return data;
    });
  }
  sendMessageToNewUser(message) {
    return __async(this, null, function* () {
      const { data } = yield __privateGet(this, _axiosInstance).post(`/v1/users/message`, message);
      return data;
    });
  }
  sendMessageToArea(filter, message) {
    return __async(this, null, function* () {
      const { data } = yield __privateGet(this, _axiosInstance).post(`/v1/users/message-by-area`, {
        message,
        filter
      });
      return data;
    });
  }
  getChatMessages(_0) {
    return __async(this, arguments, function* (chatId, { limit = 20, page = 1, search = "" } = {
      limit: 20,
      page: 1,
      search: ""
    }) {
      const { data } = yield __privateGet(this, _axiosInstance).get(
        `/v1/chats/${chatId}/messages?search=${search}&limit=${limit}&page=${page}`
      );
      return data;
    });
  }
  getChatInfo(chatId) {
    return __async(this, null, function* () {
      const { data } = yield __privateGet(this, _axiosInstance).get(`/v1/chats/${chatId}`);
      return data;
    });
  }
  getChatMedia(_0) {
    return __async(this, arguments, function* (chatId, { limit = 20, page = 1 } = { limit: 20, page: 1 }) {
      return [];
    });
  }
  getChatFiles(_0) {
    return __async(this, arguments, function* (chatId, { limit = 20, page = 1 } = { limit: 20, page: 1 }) {
      return [];
    });
  }
  getChatAudios(_0) {
    return __async(this, arguments, function* (chatId, { limit = 20, page = 1 } = { limit: 20, page: 1 }) {
      return [];
    });
  }
  getUpdates() {
    return __async(this, arguments, function* ({
      limit = __privateGet(this, _polling).limit,
      page = 1,
      allowedUpdates = []
    } = {}) {
      const { data } = yield __privateGet(this, _axiosInstance).get(`/v1/users/updates?page=${page}&limit=${limit}&hash=${__privateGet(this, _updatesHash)}`).catch(() => ({
        data: {
          data: [],
          meta: {
            hash: null,
            currentPage: 1,
            limit: 100,
            totalCount: 0,
            totalPages: 0
          }
        }
      }));
      __privateSet(this, _updatesHash, data.meta.hash ? data.meta.hash : "");
      return { updates: data.data, meta: data.meta };
    });
  }
  readMessage(chatId, message) {
    return __async(this, null, function* () {
      const { data } = yield __privateGet(this, _axiosInstance).patch(`/v1/chats/${chatId}/messages`, message);
      return data;
    });
  }
  getChats() {
    return __async(this, arguments, function* ({
      limit = 100,
      page = 1,
      search,
      type = null
    } = { limit: 20, page: 1, type: null }) {
      const { data } = yield __privateGet(this, _axiosInstance).get(
        `/v1/chats?search=${search}&limit=${limit}&page=${page}${type ? `&type=${type}` : ""}`
      );
      return data;
    });
  }
  ping() {
    if (this.socket) {
      this.socket.emit("ping", (/* @__PURE__ */ new Date()).toISOString());
    } else {
      __privateGet(this, _axiosInstance).get("/check-health").catch();
    }
    return this;
  }
};
_pollingInterval = new WeakMap();
_polling = new WeakMap();
_axiosInstance = new WeakMap();
_events = new WeakMap();
_updatesHash = new WeakMap();
_baseURL = new WeakMap();
_token = new WeakMap();
_tokenGetter = new WeakMap();
var messenger;
function getMessenger(customOptions, options = {}) {
  if (messenger) {
    return messenger;
  }
  messenger = new Messenger(customOptions, options);
  return messenger;
}
export {
  CustomAxiosInstance,
  ENV,
  RESPONSE_CODES,
  decrypt,
  encrypt,
  getDateDDMMYYYY,
  getDateDayDiff,
  getDateMMDDYYYY,
  getDateYYYYMMDD,
  getMessenger,
  localStg,
  numberFormat,
  numberToText,
  numberWithZero,
  regexps,
  request,
  sessionStg
};
//# sourceMappingURL=index.mjs.map