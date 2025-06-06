'use strict';

var FormData = require('form-data');
var http = require('http');
var https = require('https');
var io = require('socket.io-client');
var uuid = require('uuid');
var CryptoJS = require('crypto-js');
var axios = require('axios');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var FormData__default = /*#__PURE__*/_interopDefault(FormData);
var http__default = /*#__PURE__*/_interopDefault(http);
var https__default = /*#__PURE__*/_interopDefault(https);
var io__default = /*#__PURE__*/_interopDefault(io);
var uuid__default = /*#__PURE__*/_interopDefault(uuid);
var CryptoJS__default = /*#__PURE__*/_interopDefault(CryptoJS);
var axios__default = /*#__PURE__*/_interopDefault(axios);

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
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

// src/common/config/index.ts
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
      headers: opts.body instanceof FormData__default.default ? (_c = (_b = (_a = opts.body).getHeaders) == null ? void 0 : _b.call(_a)) != null ? _c : { "Content-Type": "multipart/form-data" } : opts.headers ? opts.headers : {
        "Content-Type": "application/json"
      }
    };
    const func = opts.url.includes("https://", 0) ? https__default.default.request : http__default.default.request;
    return yield new Promise((resolve, reject) => {
      const req = func(opts.url, reqOptions, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data = data + chunk.toString();
        }).on("end", () => {
          resolve(JSON.parse(data));
        }).on("error", (err) => {
          reject(err);
        });
      });
      if (opts.body instanceof FormData__default.default) {
        opts.body.pipe(req);
      } else {
        req.write(opts.body);
      }
      req.on("error", (err) => {
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
var cryptoSecret = "$2$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3GbIubP2ME$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVGXfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3G";
function encrypt(data, secret2 = cryptoSecret) {
  return CryptoJS__default.default.AES.encrypt(
    JSON.stringify(data),
    // CryptoJS.lib.WordArray.create(serialize(data).buffer),
    secret2
  ).toString();
}
function decrypt(cipherText, secret2 = cryptoSecret) {
  const bytes = CryptoJS__default.default.AES.decrypt(cipherText, secret2);
  const originalText = bytes.toString(CryptoJS__default.default.enc.Utf8);
  if (originalText) {
    return JSON.parse(originalText);
  }
  return null;
}
var _tokenGetter, _isRefreshing, _refreshTokenUrl, _languageGetter, _retryQueues, _CustomAxiosInstance_instances, handleRefreshToken_fn, refreshTokenAndReRequest_fn, setInterceptor_fn;
var CustomAxiosInstance = class {
  /**
   *
   * @param axiosConfig - axios configuration
   */
  constructor(axiosConfig, {
    tokenGetter,
    refreshTokenUrl,
    languageGetter
  }) {
    __privateAdd(this, _CustomAxiosInstance_instances);
    __privateAdd(this, _tokenGetter);
    __privateAdd(this, _isRefreshing);
    __privateAdd(this, _refreshTokenUrl);
    __privateAdd(this, _languageGetter);
    __privateAdd(this, _retryQueues);
    __privateSet(this, _languageGetter, languageGetter);
    this.instance = axios__default.default.create(axiosConfig);
    __privateSet(this, _isRefreshing, false);
    __privateSet(this, _retryQueues, []);
    __privateSet(this, _refreshTokenUrl, refreshTokenUrl);
    __privateMethod(this, _CustomAxiosInstance_instances, setInterceptor_fn).call(this);
  }
};
_tokenGetter = new WeakMap();
_isRefreshing = new WeakMap();
_refreshTokenUrl = new WeakMap();
_languageGetter = new WeakMap();
_retryQueues = new WeakMap();
_CustomAxiosInstance_instances = new WeakSet();
handleRefreshToken_fn = function() {
  return __async(this, null, function* () {
    var _a, _b;
    if (!((_a = localStg.get("messengerToken")) == null ? void 0 : _a.refresh)) {
      let token;
      if (typeof __privateGet(this, _tokenGetter) === "function") {
        token = yield __privateGet(this, _tokenGetter).call(this);
      } else {
        token = __privateGet(this, _tokenGetter);
      }
      localStg.set("messengerToken", token);
    }
    const {
      data: { data }
    } = yield axios__default.default.create(this.instance.defaults).get(__privateGet(this, _refreshTokenUrl), {
      headers: { Authorization: `Bearer ${((_b = localStg.get("messengerToken")) == null ? void 0 : _b.refresh) || ""}` }
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
  this.instance.interceptors.request.use((config) => __async(this, null, function* () {
    var _a;
    const handleConfig = __spreadValues({}, config);
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
var secret = "fdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeq";
function createLocalStorage() {
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;
  function set(key, value, expire = DEFAULT_CACHE_TIME) {
    const storageData = {
      value,
      expire: expire !== null ? (/* @__PURE__ */ new Date()).getTime() + expire * 1e3 : null
    };
    localStorage.setItem(key, encrypt(storageData, secret));
  }
  function get(key) {
    const json = localStorage.getItem(key);
    if (!json) {
      return null;
    }
    let storageData = null;
    try {
      storageData = decrypt(json, secret);
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
var uid = localUid ? localUid : uuid__default.default.v1();
localStg.set("messengerDeviceUid", uid);
var appVersion = "1.5.6";
var getDeviceModel = () => {
  if (ENV.isBrowser && typeof navigator !== "undefined") {
    return `${navigator.userAgent} | ${navigator.platform}`;
  } else if (ENV.isNode && typeof process !== "undefined") {
    return `${process.platform} | ${process.arch} | Nodejs: ${process.version}`;
  }
  return "Unknown";
};
var requiredHeaders = {
  "x-device-type": "web" /* WEB */,
  "x-device-model": getDeviceModel(),
  // 'x-app-lang': (languageGetter() || 'Uz-Latin') as I18nType.LangType, // dynamically fetching language info
  "x-app-version": appVersion,
  "x-app-uid": uid
};
function queryStringify(obj, parentKey) {
  if (!obj) {
    return "";
  }
  return Object.keys(obj).map((key) => {
    if (Array.isArray(obj[key])) {
      if (parentKey) {
        return obj[key].map((item) => `${parentKey}[${key}]=${encodeURIComponent(item)}`).join("&");
      }
      return obj[key].map((item) => `${key}=${encodeURIComponent(item)}`).join("&");
    }
    if (typeof obj[key] === "object") {
      if (parentKey) {
        return queryStringify(obj[key], `${parentKey}[${key}]`);
      }
      return queryStringify(obj[key], key);
    }
    if (obj[key] === null || obj[key] === void 0) {
      return null;
    }
    if (parentKey) {
      return `${parentKey}[${key}]=${encodeURIComponent(obj[key])}`;
    }
    return `${key}=${encodeURIComponent(obj[key])}`;
  }).filter(Boolean).join("&");
}
var _pollingInterval, _polling, _socket, _axiosInstance, _events, _updatesHash, _baseURL, _token, _tokenGetter2;
var Messenger = class {
  constructor({
    baseURL,
    token,
    polling = null,
    socket = null,
    languageGetter = () => "Uz-Latin",
    headers = {}
  }, options = {}) {
    __privateAdd(this, _pollingInterval);
    __privateAdd(this, _polling);
    __privateAdd(this, _socket);
    __privateAdd(this, _axiosInstance);
    __privateAdd(this, _events);
    // Record<
    // EventName extends keyof IEvents,
    //   (EventName extends keyof IEvents ? IEvents[EventName] : (...args: any[]) => void)[]
    // >
    __privateAdd(this, _updatesHash, "");
    __privateAdd(this, _baseURL);
    __privateAdd(this, _token);
    __privateAdd(this, _tokenGetter2);
    this.uid = uid;
    __privateSet(this, _polling, polling);
    __privateSet(this, _socket, socket);
    __privateSet(this, _baseURL, baseURL);
    __privateSet(this, _events, { update: [], updateUser: [], updateMessage: [] });
    __privateSet(this, _token, { access: "", refresh: "" });
    __privateSet(this, _tokenGetter2, token);
    __privateSet(this, _axiosInstance, new CustomAxiosInstance(
      { baseURL, headers: requiredHeaders },
      {
        refreshTokenUrl: "/v1/auth/refresh-token",
        languageGetter,
        tokenGetter: token
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
        const { updates } = yield getUpdates({ limit: polling.limit });
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
      if (typeof __privateGet(this, _tokenGetter2) === "function") {
        __privateSet(this, _token, yield __privateGet(this, _tokenGetter2).call(this));
      } else {
        __privateSet(this, _token, __privateGet(this, _tokenGetter2));
      }
      localStg.set("messengerToken", __privateGet(this, _token));
      const { data: me } = yield __privateGet(this, _axiosInstance).get("/v1/auth/me").catch((err) => ({ data: { success: false } }));
      if (me.success) {
        this.user = me.data;
      }
      if (__privateGet(this, _socket) !== null) {
        this.socket = io__default.default(__privateGet(this, _socket).baseUrl, {
          path: __privateGet(this, _socket).path,
          auth: (cb) => cb(__spreadProps(__spreadValues({}, requiredHeaders), {
            token: __privateGet(this, _token).access
          })),
          autoConnect: true,
          reconnection: true,
          // default setting at present
          reconnectionDelay: 1e3,
          // default setting at present
          reconnectionDelayMax: 5e3,
          // default setting at present
          reconnectionAttempts: Infinity
          // default setting at present
          // extraHeaders: { ...requiredHeaders, token: this.#token.access },
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
      const events = __privateGet(this, _events);
      return this.socket.connect().on("connect", () => {
        if (!Array.isArray(events["connect"])) {
          return;
        }
        events["connect"].map(
          (cb) => cb({
            message: `Socket successfully connected. socket.id: ${this.socket.id}`,
            socket: this.socket
          })
        );
      }).on("disconnect", (reason, details) => {
        if (!Array.isArray(events["disconnect"])) {
          return;
        }
        events["disconnect"].map(
          (cb) => cb({
            reason,
            details,
            message: `Socket disconnected: id: ${this.socket.id}, reason: ${reason}, details: ${JSON.stringify(details)}`,
            socket: this.socket
          })
        );
      }).on("connect_error", (err) => {
        if (!events["socketConnectionError"] || !Array.isArray(events["socketConnectionError"])) {
          return;
        }
        if (this.socket.active) {
          events["socketConnectionError"].map(
            (cb) => cb({
              message: "temporary failure, the socket will automatically try to reconnect",
              error: err
            })
          );
        } else {
          events["socketConnectionError"].map(
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
      }).onAny((eventName, ...updates) => {
        switch (eventName) {
          case "message:new":
            updates.map((update) => this.socket.emit("message:received", update.message._id));
            events.update.map((cb) => cb.apply(null, updates));
            return;
          case "message:read":
            events.updateMessage.map((cb) => cb.apply(null, updates));
            return;
          case "user:update":
            events.updateUser.map((cb) => cb.apply(null, updates));
            return;
        }
        if (!events[eventName]) {
          return;
        }
        events[eventName].map((cb) => cb.apply(null, updates));
      });
    });
  }
  // public on<EventName extends keyof IEvents = 'update'>(
  //   event: EventName,
  //   cb: IEvents[EventName],
  // ): this;
  on(event, cb) {
    if (__privateGet(this, _events)[event] && Array.isArray(__privateGet(this, _events)[event])) {
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
    return __async(this, arguments, function* (query = {
      limit: 20,
      page: 1,
      search: ""
    }) {
      const { data } = yield __privateGet(this, _axiosInstance).get(
        `/v1/users?${queryStringify(query)}`
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
    return __async(this, arguments, function* (chatId, query = {
      limit: 20,
      page: 1,
      search: ""
    }) {
      const { data } = yield __privateGet(this, _axiosInstance).get(
        `/v1/chats/${chatId}/messages?${queryStringify(query)}`
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
      allowedUpdates = []
    } = {}) {
      const { data } = yield __privateGet(this, _axiosInstance).get(`/v1/users/updates?limit=${limit}&hash=${__privateGet(this, _updatesHash)}`).catch(() => ({
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
    return __async(this, arguments, function* (query = { limit: 20, page: 1, type: null }) {
      const { data } = yield __privateGet(this, _axiosInstance).get(`/v1/chats?${queryStringify(query)}`);
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
_socket = new WeakMap();
_axiosInstance = new WeakMap();
_events = new WeakMap();
_updatesHash = new WeakMap();
_baseURL = new WeakMap();
_token = new WeakMap();
_tokenGetter2 = new WeakMap();
var messenger;
function getMessenger(customOptions, options = {}) {
  if (messenger) {
    return messenger;
  }
  messenger = new Messenger(customOptions, options);
  return messenger;
}

exports.CustomAxiosInstance = CustomAxiosInstance;
exports.ENV = ENV;
exports.RESPONSE_CODES = RESPONSE_CODES;
exports.decrypt = decrypt;
exports.encrypt = encrypt;
exports.getDateDDMMYYYY = getDateDDMMYYYY;
exports.getDateDayDiff = getDateDayDiff;
exports.getDateMMDDYYYY = getDateMMDDYYYY;
exports.getDateYYYYMMDD = getDateYYYYMMDD;
exports.getMessenger = getMessenger;
exports.localStg = localStg;
exports.numberFormat = numberFormat;
exports.numberToText = numberToText;
exports.numberWithZero = numberWithZero;
exports.regexps = regexps;
exports.request = request;
exports.sessionStg = sessionStg;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map