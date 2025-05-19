var i0 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function fn(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function hs(r) {
  if (Object.prototype.hasOwnProperty.call(r, "__esModule")) return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
var xe = { exports: {} };
const E0 = {}, ds = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: E0
}, Symbol.toStringTag, { value: "Module" })), $e = /* @__PURE__ */ hs(ds), ps = "16.5.0", vs = {
  version: ps
};
var tr;
function Es() {
  if (tr) return xe.exports;
  tr = 1;
  const r = $e, e = $e, t = $e, n = $e, i = vs.version, a = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function f(m) {
    const A = {};
    let _ = m.toString();
    _ = _.replace(/\r\n?/mg, `
`);
    let D;
    for (; (D = a.exec(_)) != null; ) {
      const S = D[1];
      let B = D[2] || "";
      B = B.trim();
      const b = B[0];
      B = B.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), b === '"' && (B = B.replace(/\\n/g, `
`), B = B.replace(/\\r/g, "\r")), A[S] = B;
    }
    return A;
  }
  function u(m) {
    const A = g(m), _ = v.configDotenv({ path: A });
    if (!_.parsed) {
      const b = new Error(`MISSING_DATA: Cannot parse ${A} for an unknown reason`);
      throw b.code = "MISSING_DATA", b;
    }
    const D = E(m).split(","), S = D.length;
    let B;
    for (let b = 0; b < S; b++)
      try {
        const w = D[b].trim(), k = x(_, w);
        B = v.decrypt(k.ciphertext, k.key);
        break;
      } catch (w) {
        if (b + 1 >= S)
          throw w;
      }
    return v.parse(B);
  }
  function o(m) {
    console.log(`[dotenv@${i}][WARN] ${m}`);
  }
  function c(m) {
    console.log(`[dotenv@${i}][DEBUG] ${m}`);
  }
  function E(m) {
    return m && m.DOTENV_KEY && m.DOTENV_KEY.length > 0 ? m.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : "";
  }
  function x(m, A) {
    let _;
    try {
      _ = new URL(A);
    } catch (w) {
      if (w.code === "ERR_INVALID_URL") {
        const k = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        throw k.code = "INVALID_DOTENV_KEY", k;
      }
      throw w;
    }
    const D = _.password;
    if (!D) {
      const w = new Error("INVALID_DOTENV_KEY: Missing key part");
      throw w.code = "INVALID_DOTENV_KEY", w;
    }
    const S = _.searchParams.get("environment");
    if (!S) {
      const w = new Error("INVALID_DOTENV_KEY: Missing environment part");
      throw w.code = "INVALID_DOTENV_KEY", w;
    }
    const B = `DOTENV_VAULT_${S.toUpperCase()}`, b = m.parsed[B];
    if (!b) {
      const w = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${B} in your .env.vault file.`);
      throw w.code = "NOT_FOUND_DOTENV_ENVIRONMENT", w;
    }
    return { ciphertext: b, key: D };
  }
  function g(m) {
    let A = null;
    if (m && m.path && m.path.length > 0)
      if (Array.isArray(m.path))
        for (const _ of m.path)
          r.existsSync(_) && (A = _.endsWith(".vault") ? _ : `${_}.vault`);
      else
        A = m.path.endsWith(".vault") ? m.path : `${m.path}.vault`;
    else
      A = e.resolve(process.cwd(), ".env.vault");
    return r.existsSync(A) ? A : null;
  }
  function l(m) {
    return m[0] === "~" ? e.join(t.homedir(), m.slice(1)) : m;
  }
  function y(m) {
    !!(m && m.debug) && c("Loading env from encrypted .env.vault");
    const _ = v._parseVault(m);
    let D = process.env;
    return m && m.processEnv != null && (D = m.processEnv), v.populate(D, _, m), { parsed: _ };
  }
  function h(m) {
    const A = e.resolve(process.cwd(), ".env");
    let _ = "utf8";
    const D = !!(m && m.debug);
    m && m.encoding ? _ = m.encoding : D && c("No encoding is specified. UTF-8 is used by default");
    let S = [A];
    if (m && m.path)
      if (!Array.isArray(m.path))
        S = [l(m.path)];
      else {
        S = [];
        for (const k of m.path)
          S.push(l(k));
      }
    let B;
    const b = {};
    for (const k of S)
      try {
        const P = v.parse(r.readFileSync(k, { encoding: _ }));
        v.populate(b, P, m);
      } catch (P) {
        D && c(`Failed to load ${k} ${P.message}`), B = P;
      }
    let w = process.env;
    return m && m.processEnv != null && (w = m.processEnv), v.populate(w, b, m), B ? { parsed: b, error: B } : { parsed: b };
  }
  function C(m) {
    if (E(m).length === 0)
      return v.configDotenv(m);
    const A = g(m);
    return A ? v._configVault(m) : (o(`You set DOTENV_KEY but you are missing a .env.vault file at ${A}. Did you forget to build it?`), v.configDotenv(m));
  }
  function d(m, A) {
    const _ = Buffer.from(A.slice(-64), "hex");
    let D = Buffer.from(m, "base64");
    const S = D.subarray(0, 12), B = D.subarray(-16);
    D = D.subarray(12, -16);
    try {
      const b = n.createDecipheriv("aes-256-gcm", _, S);
      return b.setAuthTag(B), `${b.update(D)}${b.final()}`;
    } catch (b) {
      const w = b instanceof RangeError, k = b.message === "Invalid key length", P = b.message === "Unsupported state or unable to authenticate data";
      if (w || k) {
        const q = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        throw q.code = "INVALID_DOTENV_KEY", q;
      } else if (P) {
        const q = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        throw q.code = "DECRYPTION_FAILED", q;
      } else
        throw b;
    }
  }
  function p(m, A, _ = {}) {
    const D = !!(_ && _.debug), S = !!(_ && _.override);
    if (typeof A != "object") {
      const B = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      throw B.code = "OBJECT_REQUIRED", B;
    }
    for (const B of Object.keys(A))
      Object.prototype.hasOwnProperty.call(m, B) ? (S === !0 && (m[B] = A[B]), D && c(S === !0 ? `"${B}" is already defined and WAS overwritten` : `"${B}" is already defined and was NOT overwritten`)) : m[B] = A[B];
  }
  const v = {
    configDotenv: h,
    _configVault: y,
    _parseVault: u,
    config: C,
    decrypt: d,
    parse: f,
    populate: p
  };
  return xe.exports.configDotenv = v.configDotenv, xe.exports._configVault = v._configVault, xe.exports._parseVault = v._parseVault, xe.exports.config = v.config, xe.exports.decrypt = v.decrypt, xe.exports.parse = v.parse, xe.exports.populate = v.populate, xe.exports = v, xe.exports;
}
var gs = Es();
gs.config();
const g0 = {
  isBrowser: typeof window == "object" && window.toString.call(window) === "[object Window]",
  isNode: typeof global == "object" && global.toString.call(global) === "[object global]"
}, rr = {
  REFRESH_TOKEN_CODES: [401, 104401]
}, yc = {
  DATE_FORMAT_YYYY_MM_DD: /^([2-9][0-9][0-9][0-9])\-(0[1-9]|10|11|12)\-([012][1-9]|10|20|30|31)$/,
  UZ_PHONE_NUMBER: /^\+998(33|50|55|65|67|71|77|88|9[01345789])[0-9]{7}$/
};
function mc(r, e = /* @__PURE__ */ new Date()) {
  return r.setHours(0, 0, 0, 0), e.setHours(0, 0, 0, 0), (r.getTime() - e.getTime()) / 864e5;
}
const we = (r) => r < 10 ? `0${r}` : r;
function Bc(r, e = "-") {
  return `${r.getFullYear()}${e}${we(
    r.getMonth() + 1
  )}${e}${we(r.getDate())}`;
}
function Ac(r, e = "-") {
  return r = new Date(r), `${we(r.getMonth() + 1)}${e}${we(
    r.getDate()
  )}${e}${r.getFullYear()}`;
}
function Cc(r, e = "-") {
  return `${we(r.getDate())}${e}${we(
    r.getMonth() + 1
  )}${e}${r.getFullYear()}`;
}
function _c(r, e = 0, t = ".", n = ",") {
  if (isNaN(r) || typeof r != "number" && typeof r != "bigint")
    return "";
  const s = r.toFixed(e);
  let i = s.indexOf("."), a, f;
  const u = [];
  i > -1 ? (a = s.substring(0, i).split(""), f = t + s.substr(i + 1)) : (a = s.split(""), f = "");
  do
    u.unshift(a.splice(-3, 3).join(""));
  while (a.length);
  return u.join(n) + f;
}
function bc(r, e) {
  if (isNaN(r)) return "";
  let t = "";
  for (let n = 0; n < e; n++)
    t += "0";
  return `${t}${r}`;
}
const ys = {
  0: "ноль",
  1: "бир",
  2: "икки",
  3: "уч",
  4: "тўрт",
  5: "беш",
  6: "олти",
  7: "етти",
  8: "саккиз",
  9: "тўққиз"
}, ms = {
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
}, Bs = {
  0: "ноль",
  1: "ўн",
  2: "йигирма",
  3: "ўттиз",
  4: "қирқ",
  5: "еллик",
  6: "олтмиш",
  7: "етмиш",
  8: "саксон",
  9: "тўқсон"
}, As = {
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
}, Cs = [
  "",
  "минг",
  "миллион",
  "миллиард",
  "трилион",
  "квадриллион",
  "квинтиллион",
  "секстиллион",
  "септиллион",
  "октиллион",
  "нониллион",
  "декалион",
  "ундециллион",
  "додециллион",
  "тредециллион",
  "кваттуордециллион"
  // "квиндециллион",
  // "сексдециллион",
  // "септдециллион",
  // "октодециллион",
  // "новемдециллион",
  // "вигин",
], _s = [
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
function Dc(r, e) {
  let t, n, s, i = "yuz";
  if (e === "lotin" ? (t = ms, n = As, s = _s) : (t = ys, n = Bs, s = Cs, i = "юз"), r = Number(r), Number.isNaN(r) || typeof r != "bigint" && typeof r != "number")
    return "Invalid number";
  let a = "";
  if (r < 0 && (a = "minus", r = Math.abs(r)), r === 0)
    return t[r];
  let f = "", u = 0;
  for (; r > 0; ) {
    let o = r % 1e3;
    if (o > 0) {
      let c = "";
      o >= 100 && (c += ` ${t[Math.floor(o / 100)]} ${i}`, o %= 100, o > 0 && (c += " ")), o >= 10 && (c += ` ${n[Math.floor(o / 10)]}`, o %= 10, o > 0 && (c += " ")), o > 0 && (c += ` ${t[o]}`), u > 0 && (c += ` ${s[u]}`), f = c + f;
    }
    r = Math.floor(r / 1e3), u++;
  }
  return `${a}${f}`.trim();
}
var o0, nr;
function bs() {
  return nr || (nr = 1, o0 = typeof self == "object" ? self.FormData : window.FormData), o0;
}
var Ds = bs();
const sr = /* @__PURE__ */ fn(Ds), Fs = {
  GET: !1,
  POST: !0
};
async function Fc(r) {
  Fs[r.method] && (r.body = r.body || "{}");
  const e = {
    method: r.method,
    headers: r.body instanceof sr ? r.body.getHeaders?.() ?? { "Content-Type": "multipart/form-data" } : r.headers ? r.headers : {
      "Content-Type": "application/json"
    }
  }, t = (r.url.includes("https://", 0), E0.request);
  return await new Promise((n, s) => {
    const i = t(r.url, e, (a) => {
      let f = "";
      a.on("data", (u) => {
        f = f + u.toString();
      }).on("end", () => {
        n(JSON.parse(f));
      }).on("error", (u) => {
        s(u);
      });
    });
    r.body instanceof sr ? r.body.pipe(i) : i.write(r.body), i.on("error", (a) => {
      s(a);
    }).end();
  });
}
function ws(r, e = "-") {
  const t = "uz-UZ";
  return {
    date: r,
    iso: r.toISOString(),
    hh_mm: r.toLocaleString(t, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    }).replace(/\//g, e),
    hh_mm_ss: r.toLocaleString(t, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !1
    }).replace(/\//g, e),
    YYYY_MM_DD: r.toLocaleString(t, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).replace(/\//g, e),
    YYYY_MM_DD_hh_mm_ss: r.toLocaleString(t, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !1
    }).replace(/\//g, e)
  };
}
Date.prototype.toFormatted = function(r = "-") {
  return ws(this, r);
};
const le = /* @__PURE__ */ Object.create(null);
le.open = "0";
le.close = "1";
le.ping = "2";
le.pong = "3";
le.message = "4";
le.upgrade = "5";
le.noop = "6";
const tt = /* @__PURE__ */ Object.create(null);
Object.keys(le).forEach((r) => {
  tt[le[r]] = r;
});
const y0 = { type: "error", data: "parser error" }, xn = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", un = typeof ArrayBuffer == "function", ln = (r) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(r) : r && r.buffer instanceof ArrayBuffer, T0 = ({ type: r, data: e }, t, n) => xn && e instanceof Blob ? t ? n(e) : ir(e, n) : un && (e instanceof ArrayBuffer || ln(e)) ? t ? n(e) : ir(new Blob([e]), n) : n(le[r] + (e || "")), ir = (r, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const n = t.result.split(",")[1];
    e("b" + (n || ""));
  }, t.readAsDataURL(r);
};
function or(r) {
  return r instanceof Uint8Array ? r : r instanceof ArrayBuffer ? new Uint8Array(r) : new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
}
let a0;
function ks(r, e) {
  if (xn && r.data instanceof Blob)
    return r.data.arrayBuffer().then(or).then(e);
  if (un && (r.data instanceof ArrayBuffer || ln(r.data)))
    return e(or(r.data));
  T0(r, !1, (t) => {
    a0 || (a0 = new TextEncoder()), e(a0.encode(t));
  });
}
const ar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ze = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let r = 0; r < ar.length; r++)
  ze[ar.charCodeAt(r)] = r;
const Rs = (r) => {
  let e = r.length * 0.75, t = r.length, n, s = 0, i, a, f, u;
  r[r.length - 1] === "=" && (e--, r[r.length - 2] === "=" && e--);
  const o = new ArrayBuffer(e), c = new Uint8Array(o);
  for (n = 0; n < t; n += 4)
    i = ze[r.charCodeAt(n)], a = ze[r.charCodeAt(n + 1)], f = ze[r.charCodeAt(n + 2)], u = ze[r.charCodeAt(n + 3)], c[s++] = i << 2 | a >> 4, c[s++] = (a & 15) << 4 | f >> 2, c[s++] = (f & 3) << 6 | u & 63;
  return o;
}, Ss = typeof ArrayBuffer == "function", O0 = (r, e) => {
  if (typeof r != "string")
    return {
      type: "message",
      data: hn(r, e)
    };
  const t = r.charAt(0);
  return t === "b" ? {
    type: "message",
    data: Ts(r.substring(1), e)
  } : tt[t] ? r.length > 1 ? {
    type: tt[t],
    data: r.substring(1)
  } : {
    type: tt[t]
  } : y0;
}, Ts = (r, e) => {
  if (Ss) {
    const t = Rs(r);
    return hn(t, e);
  } else
    return { base64: !0, data: r };
}, hn = (r, e) => {
  switch (e) {
    case "blob":
      return r instanceof Blob ? r : new Blob([r]);
    case "arraybuffer":
    default:
      return r instanceof ArrayBuffer ? r : r.buffer;
  }
}, dn = "", Os = (r, e) => {
  const t = r.length, n = new Array(t);
  let s = 0;
  r.forEach((i, a) => {
    T0(i, !1, (f) => {
      n[a] = f, ++s === t && e(n.join(dn));
    });
  });
}, Ns = (r, e) => {
  const t = r.split(dn), n = [];
  for (let s = 0; s < t.length; s++) {
    const i = O0(t[s], e);
    if (n.push(i), i.type === "error")
      break;
  }
  return n;
};
function Ps() {
  return new TransformStream({
    transform(r, e) {
      ks(r, (t) => {
        const n = t.length;
        let s;
        if (n < 126)
          s = new Uint8Array(1), new DataView(s.buffer).setUint8(0, n);
        else if (n < 65536) {
          s = new Uint8Array(3);
          const i = new DataView(s.buffer);
          i.setUint8(0, 126), i.setUint16(1, n);
        } else {
          s = new Uint8Array(9);
          const i = new DataView(s.buffer);
          i.setUint8(0, 127), i.setBigUint64(1, BigInt(n));
        }
        r.data && typeof r.data != "string" && (s[0] |= 128), e.enqueue(s), e.enqueue(t);
      });
    }
  });
}
let c0;
function Ge(r) {
  return r.reduce((e, t) => e + t.length, 0);
}
function Qe(r, e) {
  if (r[0].length === e)
    return r.shift();
  const t = new Uint8Array(e);
  let n = 0;
  for (let s = 0; s < e; s++)
    t[s] = r[0][n++], n === r[0].length && (r.shift(), n = 0);
  return r.length && n < r[0].length && (r[0] = r[0].slice(n)), t;
}
function qs(r, e) {
  c0 || (c0 = new TextDecoder());
  const t = [];
  let n = 0, s = -1, i = !1;
  return new TransformStream({
    transform(a, f) {
      for (t.push(a); ; ) {
        if (n === 0) {
          if (Ge(t) < 1)
            break;
          const u = Qe(t, 1);
          i = (u[0] & 128) === 128, s = u[0] & 127, s < 126 ? n = 3 : s === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (Ge(t) < 2)
            break;
          const u = Qe(t, 2);
          s = new DataView(u.buffer, u.byteOffset, u.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (Ge(t) < 8)
            break;
          const u = Qe(t, 8), o = new DataView(u.buffer, u.byteOffset, u.length), c = o.getUint32(0);
          if (c > Math.pow(2, 21) - 1) {
            f.enqueue(y0);
            break;
          }
          s = c * Math.pow(2, 32) + o.getUint32(4), n = 3;
        } else {
          if (Ge(t) < s)
            break;
          const u = Qe(t, s);
          f.enqueue(O0(i ? u : c0.decode(u), e)), n = 0;
        }
        if (s === 0 || s > r) {
          f.enqueue(y0);
          break;
        }
      }
    }
  });
}
const pn = 4;
function X(r) {
  if (r) return Ls(r);
}
function Ls(r) {
  for (var e in X.prototype)
    r[e] = X.prototype[e];
  return r;
}
X.prototype.on = X.prototype.addEventListener = function(r, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + r] = this._callbacks["$" + r] || []).push(e), this;
};
X.prototype.once = function(r, e) {
  function t() {
    this.off(r, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(r, t), this;
};
X.prototype.off = X.prototype.removeListener = X.prototype.removeAllListeners = X.prototype.removeEventListener = function(r, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + r];
  if (!t) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + r], this;
  for (var n, s = 0; s < t.length; s++)
    if (n = t[s], n === e || n.fn === e) {
      t.splice(s, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + r], this;
};
X.prototype.emit = function(r) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + r], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  if (t) {
    t = t.slice(0);
    for (var n = 0, s = t.length; n < s; ++n)
      t[n].apply(this, e);
  }
  return this;
};
X.prototype.emitReserved = X.prototype.emit;
X.prototype.listeners = function(r) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + r] || [];
};
X.prototype.hasListeners = function(r) {
  return !!this.listeners(r).length;
};
const Kt = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0), ie = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Hs = "arraybuffer";
function vn(r, ...e) {
  return e.reduce((t, n) => (r.hasOwnProperty(n) && (t[n] = r[n]), t), {});
}
const Us = ie.setTimeout, Is = ie.clearTimeout;
function Yt(r, e) {
  e.useNativeTimers ? (r.setTimeoutFn = Us.bind(ie), r.clearTimeoutFn = Is.bind(ie)) : (r.setTimeoutFn = ie.setTimeout.bind(ie), r.clearTimeoutFn = ie.clearTimeout.bind(ie));
}
const $s = 1.33;
function zs(r) {
  return typeof r == "string" ? Ms(r) : Math.ceil((r.byteLength || r.size) * $s);
}
function Ms(r) {
  let e = 0, t = 0;
  for (let n = 0, s = r.length; n < s; n++)
    e = r.charCodeAt(n), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (n++, t += 4);
  return t;
}
function En() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Vs(r) {
  let e = "";
  for (let t in r)
    r.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(r[t]));
  return e;
}
function Ws(r) {
  let e = {}, t = r.split("&");
  for (let n = 0, s = t.length; n < s; n++) {
    let i = t[n].split("=");
    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return e;
}
class js extends Error {
  constructor(e, t, n) {
    super(e), this.description = t, this.context = n, this.type = "TransportError";
  }
}
class N0 extends X {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, Yt(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, n) {
    return super.emitReserved("error", new js(e, t, n)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = O0(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = Vs(e);
    return t.length ? "?" + t : "";
  }
}
class Ks extends N0 {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      this.readyState = "paused", e();
    };
    if (this._polling || !this.writable) {
      let n = 0;
      this._polling && (n++, this.once("pollComplete", function() {
        --n || t();
      })), this.writable || (n++, this.once("drain", function() {
        --n || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const t = (n) => {
      if (this.readyState === "opening" && n.type === "open" && this.onOpen(), n.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(n);
    };
    Ns(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, Os(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = En()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
}
let gn = !1;
try {
  gn = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Ys = gn;
function Xs() {
}
class Gs extends Ks {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), typeof location < "u") {
      const t = location.protocol === "https:";
      let n = location.port;
      n || (n = t ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || n !== e.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, t) {
    const n = this.request({
      method: "POST",
      data: e
    });
    n.on("success", t), n.on("error", (s, i) => {
      this.onError("xhr post error", s, i);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, n) => {
      this.onError("xhr poll error", t, n);
    }), this.pollXhr = e;
  }
}
let Fe = class rt extends X {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t, n) {
    super(), this.createRequest = e, Yt(this, n), this._opts = n, this._method = n.method || "GET", this._uri = t, this._data = n.data !== void 0 ? n.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const t = vn(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this._opts.xd;
    const n = this._xhr = this.createRequest(t);
    try {
      n.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          n.setDisableHeaderCheck && n.setDisableHeaderCheck(!0);
          for (let s in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(s) && n.setRequestHeader(s, this._opts.extraHeaders[s]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          n.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        n.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this._opts.cookieJar) === null || e === void 0 || e.addCookies(n), "withCredentials" in n && (n.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (n.timeout = this._opts.requestTimeout), n.onreadystatechange = () => {
        var s;
        n.readyState === 3 && ((s = this._opts.cookieJar) === null || s === void 0 || s.parseCookies(
          // @ts-ignore
          n.getResponseHeader("set-cookie")
        )), n.readyState === 4 && (n.status === 200 || n.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof n.status == "number" ? n.status : 0);
        }, 0));
      }, n.send(this._data);
    } catch (s) {
      this.setTimeoutFn(() => {
        this._onError(s);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = rt.requestsCount++, rt.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(e) {
    this.emitReserved("error", e, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(e) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = Xs, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete rt.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const e = this._xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
};
Fe.requestsCount = 0;
Fe.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", cr);
  else if (typeof addEventListener == "function") {
    const r = "onpagehide" in ie ? "pagehide" : "unload";
    addEventListener(r, cr, !1);
  }
}
function cr() {
  for (let r in Fe.requests)
    Fe.requests.hasOwnProperty(r) && Fe.requests[r].abort();
}
const Qs = function() {
  const r = yn({
    xdomain: !1
  });
  return r && r.responseType !== null;
}();
class Js extends Gs {
  constructor(e) {
    super(e);
    const t = e && e.forceBase64;
    this.supportsBinary = Qs && !t;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new Fe(yn, this.uri(), e);
  }
}
function yn(r) {
  const e = r.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Ys))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new ie[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const mn = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Zs extends N0 {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), t = this.opts.protocols, n = mn ? {} : vn(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(e, t, n);
    } catch (s) {
      return this.emitReserved("error", s);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const n = e[t], s = t === e.length - 1;
      T0(n, this.supportsBinary, (i) => {
        try {
          this.doWrite(n, i);
        } catch {
        }
        s && Kt(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = En()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
}
const f0 = ie.WebSocket || ie.MozWebSocket;
class ei extends Zs {
  createSocket(e, t, n) {
    return mn ? new f0(e, t, n) : t ? new f0(e, t) : new f0(e);
  }
  doWrite(e, t) {
    this.ws.send(t);
  }
}
class ti extends N0 {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (e) {
      return this.emitReserved("error", e);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((e) => {
        const t = qs(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(t).getReader(), s = Ps();
        s.readable.pipeTo(e.writable), this._writer = s.writable.getWriter();
        const i = () => {
          n.read().then(({ done: f, value: u }) => {
            f || (this.onPacket(u), i());
          }).catch((f) => {
          });
        };
        i();
        const a = { type: "open" };
        this.query.sid && (a.data = `{"sid":"${this.query.sid}"}`), this._writer.write(a).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const n = e[t], s = t === e.length - 1;
      this._writer.write(n).then(() => {
        s && Kt(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this._transport) === null || e === void 0 || e.close();
  }
}
const ri = {
  websocket: ei,
  webtransport: ti,
  polling: Js
}, ni = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, si = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function m0(r) {
  if (r.length > 8e3)
    throw "URI too long";
  const e = r, t = r.indexOf("["), n = r.indexOf("]");
  t != -1 && n != -1 && (r = r.substring(0, t) + r.substring(t, n).replace(/:/g, ";") + r.substring(n, r.length));
  let s = ni.exec(r || ""), i = {}, a = 14;
  for (; a--; )
    i[si[a]] = s[a] || "";
  return t != -1 && n != -1 && (i.source = e, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = ii(i, i.path), i.queryKey = oi(i, i.query), i;
}
function ii(r, e) {
  const t = /\/{2,9}/g, n = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function oi(r, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, s, i) {
    s && (t[s] = i);
  }), t;
}
const B0 = typeof addEventListener == "function" && typeof removeEventListener == "function", nt = [];
B0 && addEventListener("offline", () => {
  nt.forEach((r) => r());
}, !1);
class ve extends X {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t) {
    if (super(), this.binaryType = Hs, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (t = e, e = null), e) {
      const n = m0(e);
      t.hostname = n.host, t.secure = n.protocol === "https" || n.protocol === "wss", t.port = n.port, n.query && (t.query = n.query);
    } else t.host && (t.hostname = m0(t.host).host);
    Yt(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, t.transports.forEach((n) => {
      const s = n.prototype.name;
      this.transports.push(s), this._transportsByName[s] = n;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Ws(this.opts.query)), B0 && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, nt.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const t = Object.assign({}, this.opts.query);
    t.EIO = pn, t.transport = e, this.id && (t.sid = this.id);
    const n = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new this._transportsByName[e](n);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const e = this.opts.rememberUpgrade && ve.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const t = this.createTransport(e);
    t.open(), this.setTransport(t);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (t) => this._onClose("transport close", t));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", ve.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this._onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const e = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this._getWritablePackets();
      this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let n = 0; n < this.writeBuffer.length; n++) {
      const s = this.writeBuffer[n].data;
      if (s && (t += zs(s)), n > 0 && t > this._maxPayload)
        return this.writeBuffer.slice(0, n);
      t += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const e = Date.now() > this._pingTimeoutTime;
    return e && (this._pingTimeoutTime = 0, Kt(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), e;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, n) {
    return this._sendPacket("message", e, t, n), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(e, t, n) {
    return this._sendPacket("message", e, t, n), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(e, t, n, s) {
    if (typeof t == "function" && (s = t, t = void 0), typeof n == "function" && (s = n, n = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    n = n || {}, n.compress = n.compress !== !1;
    const i = {
      type: e,
      data: t,
      options: n
    };
    this.emitReserved("packetCreate", i), this.writeBuffer.push(i), s && this.once("flush", s), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this._onClose("forced close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, n = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? n() : e();
    }) : this.upgrading ? n() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(e) {
    if (ve.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", e), this._onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(e, t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), B0 && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const n = nt.indexOf(this._offlineEventListener);
        n !== -1 && nt.splice(n, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
ve.protocol = pn;
class ai extends ve {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let e = 0; e < this._upgrades.length; e++)
        this._probe(this._upgrades[e]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(e) {
    let t = this.createTransport(e), n = !1;
    ve.priorWebsocketSuccess = !1;
    const s = () => {
      n || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (E) => {
        if (!n)
          if (E.type === "pong" && E.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            ve.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              n || this.readyState !== "closed" && (c(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const x = new Error("probe error");
            x.transport = t.name, this.emitReserved("upgradeError", x);
          }
      }));
    };
    function i() {
      n || (n = !0, c(), t.close(), t = null);
    }
    const a = (E) => {
      const x = new Error("probe error: " + E);
      x.transport = t.name, i(), this.emitReserved("upgradeError", x);
    };
    function f() {
      a("transport closed");
    }
    function u() {
      a("socket closed");
    }
    function o(E) {
      t && E.name !== t.name && i();
    }
    const c = () => {
      t.removeListener("open", s), t.removeListener("error", a), t.removeListener("close", f), this.off("close", u), this.off("upgrading", o);
    };
    t.once("open", s), t.once("error", a), t.once("close", f), this.once("close", u), this.once("upgrading", o), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      n || t.open();
    }, 200) : t.open();
  }
  onHandshake(e) {
    this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(e) {
    const t = [];
    for (let n = 0; n < e.length; n++)
      ~this.transports.indexOf(e[n]) && t.push(e[n]);
    return t;
  }
}
let ci = class extends ai {
  constructor(e, t = {}) {
    const n = typeof e == "object" ? e : t;
    (!n.transports || n.transports && typeof n.transports[0] == "string") && (n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map((s) => ri[s]).filter((s) => !!s)), super(e, n);
  }
};
function fi(r, e = "", t) {
  let n = r;
  t = t || typeof location < "u" && location, r == null && (r = t.protocol + "//" + t.host), typeof r == "string" && (r.charAt(0) === "/" && (r.charAt(1) === "/" ? r = t.protocol + r : r = t.host + r), /^(https?|wss?):\/\//.test(r) || (typeof t < "u" ? r = t.protocol + "//" + r : r = "https://" + r), n = m0(r)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const i = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + i + ":" + n.port + e, n.href = n.protocol + "://" + i + (t && t.port === n.port ? "" : ":" + n.port), n;
}
const xi = typeof ArrayBuffer == "function", ui = (r) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(r) : r.buffer instanceof ArrayBuffer, Bn = Object.prototype.toString, li = typeof Blob == "function" || typeof Blob < "u" && Bn.call(Blob) === "[object BlobConstructor]", hi = typeof File == "function" || typeof File < "u" && Bn.call(File) === "[object FileConstructor]";
function P0(r) {
  return xi && (r instanceof ArrayBuffer || ui(r)) || li && r instanceof Blob || hi && r instanceof File;
}
function st(r, e) {
  if (!r || typeof r != "object")
    return !1;
  if (Array.isArray(r)) {
    for (let t = 0, n = r.length; t < n; t++)
      if (st(r[t]))
        return !0;
    return !1;
  }
  if (P0(r))
    return !0;
  if (r.toJSON && typeof r.toJSON == "function" && arguments.length === 1)
    return st(r.toJSON(), !0);
  for (const t in r)
    if (Object.prototype.hasOwnProperty.call(r, t) && st(r[t]))
      return !0;
  return !1;
}
function di(r) {
  const e = [], t = r.data, n = r;
  return n.data = A0(t, e), n.attachments = e.length, { packet: n, buffers: e };
}
function A0(r, e) {
  if (!r)
    return r;
  if (P0(r)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(r), t;
  } else if (Array.isArray(r)) {
    const t = new Array(r.length);
    for (let n = 0; n < r.length; n++)
      t[n] = A0(r[n], e);
    return t;
  } else if (typeof r == "object" && !(r instanceof Date)) {
    const t = {};
    for (const n in r)
      Object.prototype.hasOwnProperty.call(r, n) && (t[n] = A0(r[n], e));
    return t;
  }
  return r;
}
function pi(r, e) {
  return r.data = C0(r.data, e), delete r.attachments, r;
}
function C0(r, e) {
  if (!r)
    return r;
  if (r && r._placeholder === !0) {
    if (typeof r.num == "number" && r.num >= 0 && r.num < e.length)
      return e[r.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(r))
    for (let t = 0; t < r.length; t++)
      r[t] = C0(r[t], e);
  else if (typeof r == "object")
    for (const t in r)
      Object.prototype.hasOwnProperty.call(r, t) && (r[t] = C0(r[t], e));
  return r;
}
const vi = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Ei = 5;
var I;
(function(r) {
  r[r.CONNECT = 0] = "CONNECT", r[r.DISCONNECT = 1] = "DISCONNECT", r[r.EVENT = 2] = "EVENT", r[r.ACK = 3] = "ACK", r[r.CONNECT_ERROR = 4] = "CONNECT_ERROR", r[r.BINARY_EVENT = 5] = "BINARY_EVENT", r[r.BINARY_ACK = 6] = "BINARY_ACK";
})(I || (I = {}));
class gi {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === I.EVENT || e.type === I.ACK) && st(e) ? this.encodeAsBinary({
      type: e.type === I.EVENT ? I.BINARY_EVENT : I.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === I.BINARY_EVENT || e.type === I.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = di(e), n = this.encodeAsString(t.packet), s = t.buffers;
    return s.unshift(n), s;
  }
}
function fr(r) {
  return Object.prototype.toString.call(r) === "[object Object]";
}
class q0 extends X {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const n = t.type === I.BINARY_EVENT;
      n || t.type === I.BINARY_ACK ? (t.type = n ? I.EVENT : I.ACK, this.reconstructor = new yi(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (P0(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const n = {
      type: Number(e.charAt(0))
    };
    if (I[n.type] === void 0)
      throw new Error("unknown packet type " + n.type);
    if (n.type === I.BINARY_EVENT || n.type === I.BINARY_ACK) {
      const i = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const a = e.substring(i, t);
      if (a != Number(a) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      n.attachments = Number(a);
    }
    if (e.charAt(t + 1) === "/") {
      const i = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      n.nsp = e.substring(i, t);
    } else
      n.nsp = "/";
    const s = e.charAt(t + 1);
    if (s !== "" && Number(s) == s) {
      const i = t + 1;
      for (; ++t; ) {
        const a = e.charAt(t);
        if (a == null || Number(a) != a) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      n.id = Number(e.substring(i, t + 1));
    }
    if (e.charAt(++t)) {
      const i = this.tryParse(e.substr(t));
      if (q0.isPayloadValid(n.type, i))
        n.data = i;
      else
        throw new Error("invalid payload");
    }
    return n;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case I.CONNECT:
        return fr(t);
      case I.DISCONNECT:
        return t === void 0;
      case I.CONNECT_ERROR:
        return typeof t == "string" || fr(t);
      case I.EVENT:
      case I.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && vi.indexOf(t[0]) === -1);
      case I.ACK:
      case I.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class yi {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = pi(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: q0,
  Encoder: gi,
  get PacketType() {
    return I;
  },
  protocol: Ei
}, Symbol.toStringTag, { value: "Module" }));
function ce(r, e, t) {
  return r.on(e, t), function() {
    r.off(e, t);
  };
}
const Bi = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class An extends X {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, n) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, n && n.auth && (this.auth = n.auth), this._opts = Object.assign({}, n), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      ce(e, "open", this.onopen.bind(this)),
      ce(e, "packet", this.onpacket.bind(this)),
      ce(e, "error", this.onerror.bind(this)),
      ce(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    var n, s, i;
    if (Bi.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const a = {
      type: I.EVENT,
      data: t
    };
    if (a.options = {}, a.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const c = this.ids++, E = t.pop();
      this._registerAckCallback(c, E), a.id = c;
    }
    const f = (s = (n = this.io.engine) === null || n === void 0 ? void 0 : n.transport) === null || s === void 0 ? void 0 : s.writable, u = this.connected && !(!((i = this.io.engine) === null || i === void 0) && i._hasPingExpired());
    return this.flags.volatile && !f || (u ? (this.notifyOutgoingListeners(a), this.packet(a)) : this.sendBuffer.push(a)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var n;
    const s = (n = this.flags.timeout) !== null && n !== void 0 ? n : this._opts.ackTimeout;
    if (s === void 0) {
      this.acks[e] = t;
      return;
    }
    const i = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let f = 0; f < this.sendBuffer.length; f++)
        this.sendBuffer[f].id === e && this.sendBuffer.splice(f, 1);
      t.call(this, new Error("operation has timed out"));
    }, s), a = (...f) => {
      this.io.clearTimeoutFn(i), t.apply(this, f);
    };
    a.withError = !0, this.acks[e] = a;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    return new Promise((n, s) => {
      const i = (a, f) => a ? s(a) : n(f);
      i.withError = !0, t.push(i), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const n = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((s, ...i) => n !== this._queue[0] ? void 0 : (s !== null ? n.tryCount > this._opts.retries && (this._queue.shift(), t && t(s)) : (this._queue.shift(), t && t(null, ...i)), n.pending = !1, this._drainQueue())), this._queue.push(n), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: I.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((n) => String(n.id) === e)) {
        const n = this.acks[e];
        delete this.acks[e], n.withError && n.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case I.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case I.EVENT:
        case I.BINARY_EVENT:
          this.onevent(e);
          break;
        case I.ACK:
        case I.BINARY_ACK:
          this.onack(e);
          break;
        case I.DISCONNECT:
          this.ondisconnect();
          break;
        case I.CONNECT_ERROR:
          this.destroy();
          const n = new Error(e.data.message);
          n.data = e.data.data, this.emitReserved("connect_error", n);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    e.id != null && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const n of t)
        n.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let n = !1;
    return function(...s) {
      n || (n = !0, t.packet({
        type: I.ACK,
        id: e,
        data: s
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    typeof t == "function" && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: I.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let n = 0; n < t.length; n++)
        if (e === t[n])
          return t.splice(n, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let n = 0; n < t.length; n++)
        if (e === t[n])
          return t.splice(n, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const n of t)
        n.apply(this, e.data);
    }
  }
}
function ke(r) {
  r = r || {}, this.ms = r.min || 100, this.max = r.max || 1e4, this.factor = r.factor || 2, this.jitter = r.jitter > 0 && r.jitter <= 1 ? r.jitter : 0, this.attempts = 0;
}
ke.prototype.duration = function() {
  var r = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * r);
    r = (Math.floor(e * 10) & 1) == 0 ? r - t : r + t;
  }
  return Math.min(r, this.max) | 0;
};
ke.prototype.reset = function() {
  this.attempts = 0;
};
ke.prototype.setMin = function(r) {
  this.ms = r;
};
ke.prototype.setMax = function(r) {
  this.max = r;
};
ke.prototype.setJitter = function(r) {
  this.jitter = r;
};
class _0 extends X {
  constructor(e, t) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, Yt(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((n = t.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new ke({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const s = t.parser || mi;
    this.encoder = new s.Encoder(), this.decoder = new s.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new ci(this.uri, this.opts);
    const t = this.engine, n = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const s = ce(t, "open", function() {
      n.onopen(), e && e();
    }), i = (f) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", f), e ? e(f) : this.maybeReconnectOnOpen();
    }, a = ce(t, "error", i);
    if (this._timeout !== !1) {
      const f = this._timeout, u = this.setTimeoutFn(() => {
        s(), i(new Error("timeout")), t.close();
      }, f);
      this.opts.autoUnref && u.unref(), this.subs.push(() => {
        this.clearTimeoutFn(u);
      });
    }
    return this.subs.push(s), this.subs.push(a), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(
      ce(e, "ping", this.onping.bind(this)),
      ce(e, "data", this.ondata.bind(this)),
      ce(e, "error", this.onerror.bind(this)),
      ce(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      ce(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    Kt(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let n = this.nsps[e];
    return n ? this._autoConnect && !n.active && n.connect() : (n = new An(this, e, t), this.nsps[e] = n), n;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const n of t)
      if (this.nsps[n].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const t = this.encoder.encode(e);
    for (let n = 0; n < t.length; n++)
      this.engine.write(t[n], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(e, t) {
    var n;
    this.cleanup(), (n = this.engine) === null || n === void 0 || n.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      this._reconnecting = !0;
      const n = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((s) => {
          s ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", s)) : e.onreconnect();
        }));
      }, t);
      this.opts.autoUnref && n.unref(), this.subs.push(() => {
        this.clearTimeoutFn(n);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const Ue = {};
function it(r, e) {
  typeof r == "object" && (e = r, r = void 0), e = e || {};
  const t = fi(r, e.path || "/socket.io"), n = t.source, s = t.id, i = t.path, a = Ue[s] && i in Ue[s].nsps, f = e.forceNew || e["force new connection"] || e.multiplex === !1 || a;
  let u;
  return f ? u = new _0(n, e) : (Ue[s] || (Ue[s] = new _0(n, e)), u = Ue[s]), t.query && !e.query && (e.query = t.queryKey), u.socket(t.path, e);
}
Object.assign(it, {
  Manager: _0,
  Socket: An,
  io: it,
  connect: it
});
var Q = [];
for (var x0 = 0; x0 < 256; ++x0)
  Q.push((x0 + 256).toString(16).slice(1));
function Ai(r, e = 0) {
  return (Q[r[e + 0]] + Q[r[e + 1]] + Q[r[e + 2]] + Q[r[e + 3]] + "-" + Q[r[e + 4]] + Q[r[e + 5]] + "-" + Q[r[e + 6]] + Q[r[e + 7]] + "-" + Q[r[e + 8]] + Q[r[e + 9]] + "-" + Q[r[e + 10]] + Q[r[e + 11]] + Q[r[e + 12]] + Q[r[e + 13]] + Q[r[e + 14]] + Q[r[e + 15]]).toLowerCase();
}
var Je, Ci = new Uint8Array(16);
function _i() {
  if (!Je && (Je = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Je))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Je(Ci);
}
var u0, Ze, l0 = 0, h0 = 0;
function bi(r, e, t) {
  var n = 0, s = new Array(16);
  r = r || {};
  var i = r.node, a = r.clockseq;
  if (r._v6 || (i || (i = u0), a == null && (a = Ze)), i == null || a == null) {
    var f = r.random || (r.rng || _i)();
    i == null && (i = [f[0], f[1], f[2], f[3], f[4], f[5]], !u0 && !r._v6 && (i[0] |= 1, u0 = i)), a == null && (a = (f[6] << 8 | f[7]) & 16383, Ze === void 0 && !r._v6 && (Ze = a));
  }
  var u = r.msecs !== void 0 ? r.msecs : Date.now(), o = r.nsecs !== void 0 ? r.nsecs : h0 + 1, c = u - l0 + (o - h0) / 1e4;
  if (c < 0 && r.clockseq === void 0 && (a = a + 1 & 16383), (c < 0 || u > l0) && r.nsecs === void 0 && (o = 0), o >= 1e4)
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  l0 = u, h0 = o, Ze = a, u += 122192928e5;
  var E = ((u & 268435455) * 1e4 + o) % 4294967296;
  s[n++] = E >>> 24 & 255, s[n++] = E >>> 16 & 255, s[n++] = E >>> 8 & 255, s[n++] = E & 255;
  var x = u / 4294967296 * 1e4 & 268435455;
  s[n++] = x >>> 8 & 255, s[n++] = x & 255, s[n++] = x >>> 24 & 15 | 16, s[n++] = x >>> 16 & 255, s[n++] = a >>> 8 | 128, s[n++] = a & 255;
  for (var g = 0; g < 6; ++g)
    s[n + g] = i[g];
  return Ai(s);
}
var Cn = /* @__PURE__ */ ((r) => (r.WEB = "web", r.APP = "app", r.DESKTOP = "desktop", r))(Cn || {}), ot = { exports: {} };
function Di(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var at = { exports: {} }, Fi = at.exports, xr;
function $() {
  return xr || (xr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n();
    })(Fi, function() {
      var t = t || function(n, s) {
        var i;
        if (typeof window < "u" && window.crypto && (i = window.crypto), typeof self < "u" && self.crypto && (i = self.crypto), typeof globalThis < "u" && globalThis.crypto && (i = globalThis.crypto), !i && typeof window < "u" && window.msCrypto && (i = window.msCrypto), !i && typeof i0 < "u" && i0.crypto && (i = i0.crypto), !i && typeof Di == "function")
          try {
            i = $e;
          } catch {
          }
        var a = function() {
          if (i) {
            if (typeof i.getRandomValues == "function")
              try {
                return i.getRandomValues(new Uint32Array(1))[0];
              } catch {
              }
            if (typeof i.randomBytes == "function")
              try {
                return i.randomBytes(4).readInt32LE();
              } catch {
              }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        }, f = Object.create || /* @__PURE__ */ function() {
          function d() {
          }
          return function(p) {
            var v;
            return d.prototype = p, v = new d(), d.prototype = null, v;
          };
        }(), u = {}, o = u.lib = {}, c = o.Base = /* @__PURE__ */ function() {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function(d) {
              var p = f(this);
              return d && p.mixIn(d), (!p.hasOwnProperty("init") || this.init === p.init) && (p.init = function() {
                p.$super.init.apply(this, arguments);
              }), p.init.prototype = p, p.$super = this, p;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function() {
              var d = this.extend();
              return d.init.apply(d, arguments), d;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function() {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function(d) {
              for (var p in d)
                d.hasOwnProperty(p) && (this[p] = d[p]);
              d.hasOwnProperty("toString") && (this.toString = d.toString);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function() {
              return this.init.prototype.extend(this);
            }
          };
        }(), E = o.WordArray = c.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function(d, p) {
            d = this.words = d || [], p != s ? this.sigBytes = p : this.sigBytes = d.length * 4;
          },
          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function(d) {
            return (d || g).stringify(this);
          },
          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function(d) {
            var p = this.words, v = d.words, m = this.sigBytes, A = d.sigBytes;
            if (this.clamp(), m % 4)
              for (var _ = 0; _ < A; _++) {
                var D = v[_ >>> 2] >>> 24 - _ % 4 * 8 & 255;
                p[m + _ >>> 2] |= D << 24 - (m + _) % 4 * 8;
              }
            else
              for (var S = 0; S < A; S += 4)
                p[m + S >>> 2] = v[S >>> 2];
            return this.sigBytes += A, this;
          },
          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function() {
            var d = this.words, p = this.sigBytes;
            d[p >>> 2] &= 4294967295 << 32 - p % 4 * 8, d.length = n.ceil(p / 4);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function() {
            var d = c.clone.call(this);
            return d.words = this.words.slice(0), d;
          },
          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function(d) {
            for (var p = [], v = 0; v < d; v += 4)
              p.push(a());
            return new E.init(p, d);
          }
        }), x = u.enc = {}, g = x.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function(d) {
            for (var p = d.words, v = d.sigBytes, m = [], A = 0; A < v; A++) {
              var _ = p[A >>> 2] >>> 24 - A % 4 * 8 & 255;
              m.push((_ >>> 4).toString(16)), m.push((_ & 15).toString(16));
            }
            return m.join("");
          },
          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function(d) {
            for (var p = d.length, v = [], m = 0; m < p; m += 2)
              v[m >>> 3] |= parseInt(d.substr(m, 2), 16) << 24 - m % 8 * 4;
            return new E.init(v, p / 2);
          }
        }, l = x.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function(d) {
            for (var p = d.words, v = d.sigBytes, m = [], A = 0; A < v; A++) {
              var _ = p[A >>> 2] >>> 24 - A % 4 * 8 & 255;
              m.push(String.fromCharCode(_));
            }
            return m.join("");
          },
          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function(d) {
            for (var p = d.length, v = [], m = 0; m < p; m++)
              v[m >>> 2] |= (d.charCodeAt(m) & 255) << 24 - m % 4 * 8;
            return new E.init(v, p);
          }
        }, y = x.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function(d) {
            try {
              return decodeURIComponent(escape(l.stringify(d)));
            } catch {
              throw new Error("Malformed UTF-8 data");
            }
          },
          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function(d) {
            return l.parse(unescape(encodeURIComponent(d)));
          }
        }, h = o.BufferedBlockAlgorithm = c.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function() {
            this._data = new E.init(), this._nDataBytes = 0;
          },
          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function(d) {
            typeof d == "string" && (d = y.parse(d)), this._data.concat(d), this._nDataBytes += d.sigBytes;
          },
          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function(d) {
            var p, v = this._data, m = v.words, A = v.sigBytes, _ = this.blockSize, D = _ * 4, S = A / D;
            d ? S = n.ceil(S) : S = n.max((S | 0) - this._minBufferSize, 0);
            var B = S * _, b = n.min(B * 4, A);
            if (B) {
              for (var w = 0; w < B; w += _)
                this._doProcessBlock(m, w);
              p = m.splice(0, B), v.sigBytes -= b;
            }
            return new E.init(p, b);
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function() {
            var d = c.clone.call(this);
            return d._data = this._data.clone(), d;
          },
          _minBufferSize: 0
        });
        o.Hasher = h.extend({
          /**
           * Configuration options.
           */
          cfg: c.extend(),
          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function(d) {
            this.cfg = this.cfg.extend(d), this.reset();
          },
          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function() {
            h.reset.call(this), this._doReset();
          },
          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function(d) {
            return this._append(d), this._process(), this;
          },
          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function(d) {
            d && this._append(d);
            var p = this._doFinalize();
            return p;
          },
          blockSize: 16,
          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function(d) {
            return function(p, v) {
              return new d.init(v).finalize(p);
            };
          },
          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function(d) {
            return function(p, v) {
              return new C.HMAC.init(d, v).finalize(p);
            };
          }
        });
        var C = u.algo = {};
        return u;
      }(Math);
      return t;
    });
  }(at)), at.exports;
}
var ct = { exports: {} }, wi = ct.exports, ur;
function Xt() {
  return ur || (ur = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(wi, function(t) {
      return function(n) {
        var s = t, i = s.lib, a = i.Base, f = i.WordArray, u = s.x64 = {};
        u.Word = a.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function(o, c) {
            this.high = o, this.low = c;
          }
          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },
          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },
          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;
          // return X64Word.create(high, low);
          // }
        }), u.WordArray = a.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function(o, c) {
            o = this.words = o || [], c != n ? this.sigBytes = c : this.sigBytes = o.length * 8;
          },
          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function() {
            for (var o = this.words, c = o.length, E = [], x = 0; x < c; x++) {
              var g = o[x];
              E.push(g.high), E.push(g.low);
            }
            return f.create(E, this.sigBytes);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function() {
            for (var o = a.clone.call(this), c = o.words = this.words.slice(0), E = c.length, x = 0; x < E; x++)
              c[x] = c[x].clone();
            return o;
          }
        });
      }(), t;
    });
  }(ct)), ct.exports;
}
var ft = { exports: {} }, ki = ft.exports, lr;
function Ri() {
  return lr || (lr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(ki, function(t) {
      return function() {
        if (typeof ArrayBuffer == "function") {
          var n = t, s = n.lib, i = s.WordArray, a = i.init, f = i.init = function(u) {
            if (u instanceof ArrayBuffer && (u = new Uint8Array(u)), (u instanceof Int8Array || typeof Uint8ClampedArray < "u" && u instanceof Uint8ClampedArray || u instanceof Int16Array || u instanceof Uint16Array || u instanceof Int32Array || u instanceof Uint32Array || u instanceof Float32Array || u instanceof Float64Array) && (u = new Uint8Array(u.buffer, u.byteOffset, u.byteLength)), u instanceof Uint8Array) {
              for (var o = u.byteLength, c = [], E = 0; E < o; E++)
                c[E >>> 2] |= u[E] << 24 - E % 4 * 8;
              a.call(this, c, o);
            } else
              a.apply(this, arguments);
          };
          f.prototype = i;
        }
      }(), t.lib.WordArray;
    });
  }(ft)), ft.exports;
}
var xt = { exports: {} }, Si = xt.exports, hr;
function Ti() {
  return hr || (hr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(Si, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.WordArray, a = n.enc;
        a.Utf16 = a.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function(u) {
            for (var o = u.words, c = u.sigBytes, E = [], x = 0; x < c; x += 2) {
              var g = o[x >>> 2] >>> 16 - x % 4 * 8 & 65535;
              E.push(String.fromCharCode(g));
            }
            return E.join("");
          },
          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function(u) {
            for (var o = u.length, c = [], E = 0; E < o; E++)
              c[E >>> 1] |= u.charCodeAt(E) << 16 - E % 2 * 16;
            return i.create(c, o * 2);
          }
        }, a.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function(u) {
            for (var o = u.words, c = u.sigBytes, E = [], x = 0; x < c; x += 2) {
              var g = f(o[x >>> 2] >>> 16 - x % 4 * 8 & 65535);
              E.push(String.fromCharCode(g));
            }
            return E.join("");
          },
          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function(u) {
            for (var o = u.length, c = [], E = 0; E < o; E++)
              c[E >>> 1] |= f(u.charCodeAt(E) << 16 - E % 2 * 16);
            return i.create(c, o * 2);
          }
        };
        function f(u) {
          return u << 8 & 4278255360 | u >>> 8 & 16711935;
        }
      }(), t.enc.Utf16;
    });
  }(xt)), xt.exports;
}
var ut = { exports: {} }, Oi = ut.exports, dr;
function Be() {
  return dr || (dr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(Oi, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.WordArray, a = n.enc;
        a.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function(u) {
            var o = u.words, c = u.sigBytes, E = this._map;
            u.clamp();
            for (var x = [], g = 0; g < c; g += 3)
              for (var l = o[g >>> 2] >>> 24 - g % 4 * 8 & 255, y = o[g + 1 >>> 2] >>> 24 - (g + 1) % 4 * 8 & 255, h = o[g + 2 >>> 2] >>> 24 - (g + 2) % 4 * 8 & 255, C = l << 16 | y << 8 | h, d = 0; d < 4 && g + d * 0.75 < c; d++)
                x.push(E.charAt(C >>> 6 * (3 - d) & 63));
            var p = E.charAt(64);
            if (p)
              for (; x.length % 4; )
                x.push(p);
            return x.join("");
          },
          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function(u) {
            var o = u.length, c = this._map, E = this._reverseMap;
            if (!E) {
              E = this._reverseMap = [];
              for (var x = 0; x < c.length; x++)
                E[c.charCodeAt(x)] = x;
            }
            var g = c.charAt(64);
            if (g) {
              var l = u.indexOf(g);
              l !== -1 && (o = l);
            }
            return f(u, o, E);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        };
        function f(u, o, c) {
          for (var E = [], x = 0, g = 0; g < o; g++)
            if (g % 4) {
              var l = c[u.charCodeAt(g - 1)] << g % 4 * 2, y = c[u.charCodeAt(g)] >>> 6 - g % 4 * 2, h = l | y;
              E[x >>> 2] |= h << 24 - x % 4 * 8, x++;
            }
          return i.create(E, x);
        }
      }(), t.enc.Base64;
    });
  }(ut)), ut.exports;
}
var lt = { exports: {} }, Ni = lt.exports, pr;
function Pi() {
  return pr || (pr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(Ni, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.WordArray, a = n.enc;
        a.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function(u, o) {
            o === void 0 && (o = !0);
            var c = u.words, E = u.sigBytes, x = o ? this._safe_map : this._map;
            u.clamp();
            for (var g = [], l = 0; l < E; l += 3)
              for (var y = c[l >>> 2] >>> 24 - l % 4 * 8 & 255, h = c[l + 1 >>> 2] >>> 24 - (l + 1) % 4 * 8 & 255, C = c[l + 2 >>> 2] >>> 24 - (l + 2) % 4 * 8 & 255, d = y << 16 | h << 8 | C, p = 0; p < 4 && l + p * 0.75 < E; p++)
                g.push(x.charAt(d >>> 6 * (3 - p) & 63));
            var v = x.charAt(64);
            if (v)
              for (; g.length % 4; )
                g.push(v);
            return g.join("");
          },
          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function(u, o) {
            o === void 0 && (o = !0);
            var c = u.length, E = o ? this._safe_map : this._map, x = this._reverseMap;
            if (!x) {
              x = this._reverseMap = [];
              for (var g = 0; g < E.length; g++)
                x[E.charCodeAt(g)] = g;
            }
            var l = E.charAt(64);
            if (l) {
              var y = u.indexOf(l);
              y !== -1 && (c = y);
            }
            return f(u, c, x);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        };
        function f(u, o, c) {
          for (var E = [], x = 0, g = 0; g < o; g++)
            if (g % 4) {
              var l = c[u.charCodeAt(g - 1)] << g % 4 * 2, y = c[u.charCodeAt(g)] >>> 6 - g % 4 * 2, h = l | y;
              E[x >>> 2] |= h << 24 - x % 4 * 8, x++;
            }
          return i.create(E, x);
        }
      }(), t.enc.Base64url;
    });
  }(lt)), lt.exports;
}
var ht = { exports: {} }, qi = ht.exports, vr;
function Ae() {
  return vr || (vr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(qi, function(t) {
      return function(n) {
        var s = t, i = s.lib, a = i.WordArray, f = i.Hasher, u = s.algo, o = [];
        (function() {
          for (var y = 0; y < 64; y++)
            o[y] = n.abs(n.sin(y + 1)) * 4294967296 | 0;
        })();
        var c = u.MD5 = f.extend({
          _doReset: function() {
            this._hash = new a.init([
              1732584193,
              4023233417,
              2562383102,
              271733878
            ]);
          },
          _doProcessBlock: function(y, h) {
            for (var C = 0; C < 16; C++) {
              var d = h + C, p = y[d];
              y[d] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360;
            }
            var v = this._hash.words, m = y[h + 0], A = y[h + 1], _ = y[h + 2], D = y[h + 3], S = y[h + 4], B = y[h + 5], b = y[h + 6], w = y[h + 7], k = y[h + 8], P = y[h + 9], q = y[h + 10], H = y[h + 11], j = y[h + 12], z = y[h + 13], V = y[h + 14], M = y[h + 15], R = v[0], O = v[1], N = v[2], T = v[3];
            R = E(R, O, N, T, m, 7, o[0]), T = E(T, R, O, N, A, 12, o[1]), N = E(N, T, R, O, _, 17, o[2]), O = E(O, N, T, R, D, 22, o[3]), R = E(R, O, N, T, S, 7, o[4]), T = E(T, R, O, N, B, 12, o[5]), N = E(N, T, R, O, b, 17, o[6]), O = E(O, N, T, R, w, 22, o[7]), R = E(R, O, N, T, k, 7, o[8]), T = E(T, R, O, N, P, 12, o[9]), N = E(N, T, R, O, q, 17, o[10]), O = E(O, N, T, R, H, 22, o[11]), R = E(R, O, N, T, j, 7, o[12]), T = E(T, R, O, N, z, 12, o[13]), N = E(N, T, R, O, V, 17, o[14]), O = E(O, N, T, R, M, 22, o[15]), R = x(R, O, N, T, A, 5, o[16]), T = x(T, R, O, N, b, 9, o[17]), N = x(N, T, R, O, H, 14, o[18]), O = x(O, N, T, R, m, 20, o[19]), R = x(R, O, N, T, B, 5, o[20]), T = x(T, R, O, N, q, 9, o[21]), N = x(N, T, R, O, M, 14, o[22]), O = x(O, N, T, R, S, 20, o[23]), R = x(R, O, N, T, P, 5, o[24]), T = x(T, R, O, N, V, 9, o[25]), N = x(N, T, R, O, D, 14, o[26]), O = x(O, N, T, R, k, 20, o[27]), R = x(R, O, N, T, z, 5, o[28]), T = x(T, R, O, N, _, 9, o[29]), N = x(N, T, R, O, w, 14, o[30]), O = x(O, N, T, R, j, 20, o[31]), R = g(R, O, N, T, B, 4, o[32]), T = g(T, R, O, N, k, 11, o[33]), N = g(N, T, R, O, H, 16, o[34]), O = g(O, N, T, R, V, 23, o[35]), R = g(R, O, N, T, A, 4, o[36]), T = g(T, R, O, N, S, 11, o[37]), N = g(N, T, R, O, w, 16, o[38]), O = g(O, N, T, R, q, 23, o[39]), R = g(R, O, N, T, z, 4, o[40]), T = g(T, R, O, N, m, 11, o[41]), N = g(N, T, R, O, D, 16, o[42]), O = g(O, N, T, R, b, 23, o[43]), R = g(R, O, N, T, P, 4, o[44]), T = g(T, R, O, N, j, 11, o[45]), N = g(N, T, R, O, M, 16, o[46]), O = g(O, N, T, R, _, 23, o[47]), R = l(R, O, N, T, m, 6, o[48]), T = l(T, R, O, N, w, 10, o[49]), N = l(N, T, R, O, V, 15, o[50]), O = l(O, N, T, R, B, 21, o[51]), R = l(R, O, N, T, j, 6, o[52]), T = l(T, R, O, N, D, 10, o[53]), N = l(N, T, R, O, q, 15, o[54]), O = l(O, N, T, R, A, 21, o[55]), R = l(R, O, N, T, k, 6, o[56]), T = l(T, R, O, N, M, 10, o[57]), N = l(N, T, R, O, b, 15, o[58]), O = l(O, N, T, R, z, 21, o[59]), R = l(R, O, N, T, S, 6, o[60]), T = l(T, R, O, N, H, 10, o[61]), N = l(N, T, R, O, _, 15, o[62]), O = l(O, N, T, R, P, 21, o[63]), v[0] = v[0] + R | 0, v[1] = v[1] + O | 0, v[2] = v[2] + N | 0, v[3] = v[3] + T | 0;
          },
          _doFinalize: function() {
            var y = this._data, h = y.words, C = this._nDataBytes * 8, d = y.sigBytes * 8;
            h[d >>> 5] |= 128 << 24 - d % 32;
            var p = n.floor(C / 4294967296), v = C;
            h[(d + 64 >>> 9 << 4) + 15] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, h[(d + 64 >>> 9 << 4) + 14] = (v << 8 | v >>> 24) & 16711935 | (v << 24 | v >>> 8) & 4278255360, y.sigBytes = (h.length + 1) * 4, this._process();
            for (var m = this._hash, A = m.words, _ = 0; _ < 4; _++) {
              var D = A[_];
              A[_] = (D << 8 | D >>> 24) & 16711935 | (D << 24 | D >>> 8) & 4278255360;
            }
            return m;
          },
          clone: function() {
            var y = f.clone.call(this);
            return y._hash = this._hash.clone(), y;
          }
        });
        function E(y, h, C, d, p, v, m) {
          var A = y + (h & C | ~h & d) + p + m;
          return (A << v | A >>> 32 - v) + h;
        }
        function x(y, h, C, d, p, v, m) {
          var A = y + (h & d | C & ~d) + p + m;
          return (A << v | A >>> 32 - v) + h;
        }
        function g(y, h, C, d, p, v, m) {
          var A = y + (h ^ C ^ d) + p + m;
          return (A << v | A >>> 32 - v) + h;
        }
        function l(y, h, C, d, p, v, m) {
          var A = y + (C ^ (h | ~d)) + p + m;
          return (A << v | A >>> 32 - v) + h;
        }
        s.MD5 = f._createHelper(c), s.HmacMD5 = f._createHmacHelper(c);
      }(Math), t.MD5;
    });
  }(ht)), ht.exports;
}
var dt = { exports: {} }, Li = dt.exports, Er;
function _n() {
  return Er || (Er = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(Li, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.WordArray, a = s.Hasher, f = n.algo, u = [], o = f.SHA1 = a.extend({
          _doReset: function() {
            this._hash = new i.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(c, E) {
            for (var x = this._hash.words, g = x[0], l = x[1], y = x[2], h = x[3], C = x[4], d = 0; d < 80; d++) {
              if (d < 16)
                u[d] = c[E + d] | 0;
              else {
                var p = u[d - 3] ^ u[d - 8] ^ u[d - 14] ^ u[d - 16];
                u[d] = p << 1 | p >>> 31;
              }
              var v = (g << 5 | g >>> 27) + C + u[d];
              d < 20 ? v += (l & y | ~l & h) + 1518500249 : d < 40 ? v += (l ^ y ^ h) + 1859775393 : d < 60 ? v += (l & y | l & h | y & h) - 1894007588 : v += (l ^ y ^ h) - 899497514, C = h, h = y, y = l << 30 | l >>> 2, l = g, g = v;
            }
            x[0] = x[0] + g | 0, x[1] = x[1] + l | 0, x[2] = x[2] + y | 0, x[3] = x[3] + h | 0, x[4] = x[4] + C | 0;
          },
          _doFinalize: function() {
            var c = this._data, E = c.words, x = this._nDataBytes * 8, g = c.sigBytes * 8;
            return E[g >>> 5] |= 128 << 24 - g % 32, E[(g + 64 >>> 9 << 4) + 14] = Math.floor(x / 4294967296), E[(g + 64 >>> 9 << 4) + 15] = x, c.sigBytes = E.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var c = a.clone.call(this);
            return c._hash = this._hash.clone(), c;
          }
        });
        n.SHA1 = a._createHelper(o), n.HmacSHA1 = a._createHmacHelper(o);
      }(), t.SHA1;
    });
  }(dt)), dt.exports;
}
var pt = { exports: {} }, Hi = pt.exports, gr;
function L0() {
  return gr || (gr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(Hi, function(t) {
      return function(n) {
        var s = t, i = s.lib, a = i.WordArray, f = i.Hasher, u = s.algo, o = [], c = [];
        (function() {
          function g(C) {
            for (var d = n.sqrt(C), p = 2; p <= d; p++)
              if (!(C % p))
                return !1;
            return !0;
          }
          function l(C) {
            return (C - (C | 0)) * 4294967296 | 0;
          }
          for (var y = 2, h = 0; h < 64; )
            g(y) && (h < 8 && (o[h] = l(n.pow(y, 1 / 2))), c[h] = l(n.pow(y, 1 / 3)), h++), y++;
        })();
        var E = [], x = u.SHA256 = f.extend({
          _doReset: function() {
            this._hash = new a.init(o.slice(0));
          },
          _doProcessBlock: function(g, l) {
            for (var y = this._hash.words, h = y[0], C = y[1], d = y[2], p = y[3], v = y[4], m = y[5], A = y[6], _ = y[7], D = 0; D < 64; D++) {
              if (D < 16)
                E[D] = g[l + D] | 0;
              else {
                var S = E[D - 15], B = (S << 25 | S >>> 7) ^ (S << 14 | S >>> 18) ^ S >>> 3, b = E[D - 2], w = (b << 15 | b >>> 17) ^ (b << 13 | b >>> 19) ^ b >>> 10;
                E[D] = B + E[D - 7] + w + E[D - 16];
              }
              var k = v & m ^ ~v & A, P = h & C ^ h & d ^ C & d, q = (h << 30 | h >>> 2) ^ (h << 19 | h >>> 13) ^ (h << 10 | h >>> 22), H = (v << 26 | v >>> 6) ^ (v << 21 | v >>> 11) ^ (v << 7 | v >>> 25), j = _ + H + k + c[D] + E[D], z = q + P;
              _ = A, A = m, m = v, v = p + j | 0, p = d, d = C, C = h, h = j + z | 0;
            }
            y[0] = y[0] + h | 0, y[1] = y[1] + C | 0, y[2] = y[2] + d | 0, y[3] = y[3] + p | 0, y[4] = y[4] + v | 0, y[5] = y[5] + m | 0, y[6] = y[6] + A | 0, y[7] = y[7] + _ | 0;
          },
          _doFinalize: function() {
            var g = this._data, l = g.words, y = this._nDataBytes * 8, h = g.sigBytes * 8;
            return l[h >>> 5] |= 128 << 24 - h % 32, l[(h + 64 >>> 9 << 4) + 14] = n.floor(y / 4294967296), l[(h + 64 >>> 9 << 4) + 15] = y, g.sigBytes = l.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var g = f.clone.call(this);
            return g._hash = this._hash.clone(), g;
          }
        });
        s.SHA256 = f._createHelper(x), s.HmacSHA256 = f._createHmacHelper(x);
      }(Math), t.SHA256;
    });
  }(pt)), pt.exports;
}
var vt = { exports: {} }, Ui = vt.exports, yr;
function Ii() {
  return yr || (yr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), L0());
    })(Ui, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.WordArray, a = n.algo, f = a.SHA256, u = a.SHA224 = f.extend({
          _doReset: function() {
            this._hash = new i.init([
              3238371032,
              914150663,
              812702999,
              4144912697,
              4290775857,
              1750603025,
              1694076839,
              3204075428
            ]);
          },
          _doFinalize: function() {
            var o = f._doFinalize.call(this);
            return o.sigBytes -= 4, o;
          }
        });
        n.SHA224 = f._createHelper(u), n.HmacSHA224 = f._createHmacHelper(u);
      }(), t.SHA224;
    });
  }(vt)), vt.exports;
}
var Et = { exports: {} }, $i = Et.exports, mr;
function bn() {
  return mr || (mr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Xt());
    })($i, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.Hasher, a = n.x64, f = a.Word, u = a.WordArray, o = n.algo;
        function c() {
          return f.create.apply(f, arguments);
        }
        var E = [
          c(1116352408, 3609767458),
          c(1899447441, 602891725),
          c(3049323471, 3964484399),
          c(3921009573, 2173295548),
          c(961987163, 4081628472),
          c(1508970993, 3053834265),
          c(2453635748, 2937671579),
          c(2870763221, 3664609560),
          c(3624381080, 2734883394),
          c(310598401, 1164996542),
          c(607225278, 1323610764),
          c(1426881987, 3590304994),
          c(1925078388, 4068182383),
          c(2162078206, 991336113),
          c(2614888103, 633803317),
          c(3248222580, 3479774868),
          c(3835390401, 2666613458),
          c(4022224774, 944711139),
          c(264347078, 2341262773),
          c(604807628, 2007800933),
          c(770255983, 1495990901),
          c(1249150122, 1856431235),
          c(1555081692, 3175218132),
          c(1996064986, 2198950837),
          c(2554220882, 3999719339),
          c(2821834349, 766784016),
          c(2952996808, 2566594879),
          c(3210313671, 3203337956),
          c(3336571891, 1034457026),
          c(3584528711, 2466948901),
          c(113926993, 3758326383),
          c(338241895, 168717936),
          c(666307205, 1188179964),
          c(773529912, 1546045734),
          c(1294757372, 1522805485),
          c(1396182291, 2643833823),
          c(1695183700, 2343527390),
          c(1986661051, 1014477480),
          c(2177026350, 1206759142),
          c(2456956037, 344077627),
          c(2730485921, 1290863460),
          c(2820302411, 3158454273),
          c(3259730800, 3505952657),
          c(3345764771, 106217008),
          c(3516065817, 3606008344),
          c(3600352804, 1432725776),
          c(4094571909, 1467031594),
          c(275423344, 851169720),
          c(430227734, 3100823752),
          c(506948616, 1363258195),
          c(659060556, 3750685593),
          c(883997877, 3785050280),
          c(958139571, 3318307427),
          c(1322822218, 3812723403),
          c(1537002063, 2003034995),
          c(1747873779, 3602036899),
          c(1955562222, 1575990012),
          c(2024104815, 1125592928),
          c(2227730452, 2716904306),
          c(2361852424, 442776044),
          c(2428436474, 593698344),
          c(2756734187, 3733110249),
          c(3204031479, 2999351573),
          c(3329325298, 3815920427),
          c(3391569614, 3928383900),
          c(3515267271, 566280711),
          c(3940187606, 3454069534),
          c(4118630271, 4000239992),
          c(116418474, 1914138554),
          c(174292421, 2731055270),
          c(289380356, 3203993006),
          c(460393269, 320620315),
          c(685471733, 587496836),
          c(852142971, 1086792851),
          c(1017036298, 365543100),
          c(1126000580, 2618297676),
          c(1288033470, 3409855158),
          c(1501505948, 4234509866),
          c(1607167915, 987167468),
          c(1816402316, 1246189591)
        ], x = [];
        (function() {
          for (var l = 0; l < 80; l++)
            x[l] = c();
        })();
        var g = o.SHA512 = i.extend({
          _doReset: function() {
            this._hash = new u.init([
              new f.init(1779033703, 4089235720),
              new f.init(3144134277, 2227873595),
              new f.init(1013904242, 4271175723),
              new f.init(2773480762, 1595750129),
              new f.init(1359893119, 2917565137),
              new f.init(2600822924, 725511199),
              new f.init(528734635, 4215389547),
              new f.init(1541459225, 327033209)
            ]);
          },
          _doProcessBlock: function(l, y) {
            for (var h = this._hash.words, C = h[0], d = h[1], p = h[2], v = h[3], m = h[4], A = h[5], _ = h[6], D = h[7], S = C.high, B = C.low, b = d.high, w = d.low, k = p.high, P = p.low, q = v.high, H = v.low, j = m.high, z = m.low, V = A.high, M = A.low, R = _.high, O = _.low, N = D.high, T = D.low, K = S, W = B, Z = b, U = w, Te = k, Ce = P, n0 = q, Oe = H, oe = j, re = z, Ke = V, Ne = M, Ye = R, Pe = O, s0 = N, qe = T, ae = 0; ae < 80; ae++) {
              var se, he, Xe = x[ae];
              if (ae < 16)
                he = Xe.high = l[y + ae * 2] | 0, se = Xe.low = l[y + ae * 2 + 1] | 0;
              else {
                var M0 = x[ae - 15], _e = M0.high, Le = M0.low, es = (_e >>> 1 | Le << 31) ^ (_e >>> 8 | Le << 24) ^ _e >>> 7, V0 = (Le >>> 1 | _e << 31) ^ (Le >>> 8 | _e << 24) ^ (Le >>> 7 | _e << 25), W0 = x[ae - 2], be = W0.high, He = W0.low, ts = (be >>> 19 | He << 13) ^ (be << 3 | He >>> 29) ^ be >>> 6, j0 = (He >>> 19 | be << 13) ^ (He << 3 | be >>> 29) ^ (He >>> 6 | be << 26), K0 = x[ae - 7], rs = K0.high, ns = K0.low, Y0 = x[ae - 16], ss = Y0.high, X0 = Y0.low;
                se = V0 + ns, he = es + rs + (se >>> 0 < V0 >>> 0 ? 1 : 0), se = se + j0, he = he + ts + (se >>> 0 < j0 >>> 0 ? 1 : 0), se = se + X0, he = he + ss + (se >>> 0 < X0 >>> 0 ? 1 : 0), Xe.high = he, Xe.low = se;
              }
              var is = oe & Ke ^ ~oe & Ye, G0 = re & Ne ^ ~re & Pe, os = K & Z ^ K & Te ^ Z & Te, as = W & U ^ W & Ce ^ U & Ce, cs = (K >>> 28 | W << 4) ^ (K << 30 | W >>> 2) ^ (K << 25 | W >>> 7), Q0 = (W >>> 28 | K << 4) ^ (W << 30 | K >>> 2) ^ (W << 25 | K >>> 7), fs = (oe >>> 14 | re << 18) ^ (oe >>> 18 | re << 14) ^ (oe << 23 | re >>> 9), xs = (re >>> 14 | oe << 18) ^ (re >>> 18 | oe << 14) ^ (re << 23 | oe >>> 9), J0 = E[ae], us = J0.high, Z0 = J0.low, ne = qe + xs, de = s0 + fs + (ne >>> 0 < qe >>> 0 ? 1 : 0), ne = ne + G0, de = de + is + (ne >>> 0 < G0 >>> 0 ? 1 : 0), ne = ne + Z0, de = de + us + (ne >>> 0 < Z0 >>> 0 ? 1 : 0), ne = ne + se, de = de + he + (ne >>> 0 < se >>> 0 ? 1 : 0), er = Q0 + as, ls = cs + os + (er >>> 0 < Q0 >>> 0 ? 1 : 0);
              s0 = Ye, qe = Pe, Ye = Ke, Pe = Ne, Ke = oe, Ne = re, re = Oe + ne | 0, oe = n0 + de + (re >>> 0 < Oe >>> 0 ? 1 : 0) | 0, n0 = Te, Oe = Ce, Te = Z, Ce = U, Z = K, U = W, W = ne + er | 0, K = de + ls + (W >>> 0 < ne >>> 0 ? 1 : 0) | 0;
            }
            B = C.low = B + W, C.high = S + K + (B >>> 0 < W >>> 0 ? 1 : 0), w = d.low = w + U, d.high = b + Z + (w >>> 0 < U >>> 0 ? 1 : 0), P = p.low = P + Ce, p.high = k + Te + (P >>> 0 < Ce >>> 0 ? 1 : 0), H = v.low = H + Oe, v.high = q + n0 + (H >>> 0 < Oe >>> 0 ? 1 : 0), z = m.low = z + re, m.high = j + oe + (z >>> 0 < re >>> 0 ? 1 : 0), M = A.low = M + Ne, A.high = V + Ke + (M >>> 0 < Ne >>> 0 ? 1 : 0), O = _.low = O + Pe, _.high = R + Ye + (O >>> 0 < Pe >>> 0 ? 1 : 0), T = D.low = T + qe, D.high = N + s0 + (T >>> 0 < qe >>> 0 ? 1 : 0);
          },
          _doFinalize: function() {
            var l = this._data, y = l.words, h = this._nDataBytes * 8, C = l.sigBytes * 8;
            y[C >>> 5] |= 128 << 24 - C % 32, y[(C + 128 >>> 10 << 5) + 30] = Math.floor(h / 4294967296), y[(C + 128 >>> 10 << 5) + 31] = h, l.sigBytes = y.length * 4, this._process();
            var d = this._hash.toX32();
            return d;
          },
          clone: function() {
            var l = i.clone.call(this);
            return l._hash = this._hash.clone(), l;
          },
          blockSize: 1024 / 32
        });
        n.SHA512 = i._createHelper(g), n.HmacSHA512 = i._createHmacHelper(g);
      }(), t.SHA512;
    });
  }(Et)), Et.exports;
}
var gt = { exports: {} }, zi = gt.exports, Br;
function Mi() {
  return Br || (Br = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Xt(), bn());
    })(zi, function(t) {
      return function() {
        var n = t, s = n.x64, i = s.Word, a = s.WordArray, f = n.algo, u = f.SHA512, o = f.SHA384 = u.extend({
          _doReset: function() {
            this._hash = new a.init([
              new i.init(3418070365, 3238371032),
              new i.init(1654270250, 914150663),
              new i.init(2438529370, 812702999),
              new i.init(355462360, 4144912697),
              new i.init(1731405415, 4290775857),
              new i.init(2394180231, 1750603025),
              new i.init(3675008525, 1694076839),
              new i.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var c = u._doFinalize.call(this);
            return c.sigBytes -= 16, c;
          }
        });
        n.SHA384 = u._createHelper(o), n.HmacSHA384 = u._createHmacHelper(o);
      }(), t.SHA384;
    });
  }(gt)), gt.exports;
}
var yt = { exports: {} }, Vi = yt.exports, Ar;
function Wi() {
  return Ar || (Ar = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Xt());
    })(Vi, function(t) {
      return function(n) {
        var s = t, i = s.lib, a = i.WordArray, f = i.Hasher, u = s.x64, o = u.Word, c = s.algo, E = [], x = [], g = [];
        (function() {
          for (var h = 1, C = 0, d = 0; d < 24; d++) {
            E[h + 5 * C] = (d + 1) * (d + 2) / 2 % 64;
            var p = C % 5, v = (2 * h + 3 * C) % 5;
            h = p, C = v;
          }
          for (var h = 0; h < 5; h++)
            for (var C = 0; C < 5; C++)
              x[h + 5 * C] = C + (2 * h + 3 * C) % 5 * 5;
          for (var m = 1, A = 0; A < 24; A++) {
            for (var _ = 0, D = 0, S = 0; S < 7; S++) {
              if (m & 1) {
                var B = (1 << S) - 1;
                B < 32 ? D ^= 1 << B : _ ^= 1 << B - 32;
              }
              m & 128 ? m = m << 1 ^ 113 : m <<= 1;
            }
            g[A] = o.create(_, D);
          }
        })();
        var l = [];
        (function() {
          for (var h = 0; h < 25; h++)
            l[h] = o.create();
        })();
        var y = c.SHA3 = f.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: f.cfg.extend({
            outputLength: 512
          }),
          _doReset: function() {
            for (var h = this._state = [], C = 0; C < 25; C++)
              h[C] = new o.init();
            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function(h, C) {
            for (var d = this._state, p = this.blockSize / 2, v = 0; v < p; v++) {
              var m = h[C + 2 * v], A = h[C + 2 * v + 1];
              m = (m << 8 | m >>> 24) & 16711935 | (m << 24 | m >>> 8) & 4278255360, A = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360;
              var _ = d[v];
              _.high ^= A, _.low ^= m;
            }
            for (var D = 0; D < 24; D++) {
              for (var S = 0; S < 5; S++) {
                for (var B = 0, b = 0, w = 0; w < 5; w++) {
                  var _ = d[S + 5 * w];
                  B ^= _.high, b ^= _.low;
                }
                var k = l[S];
                k.high = B, k.low = b;
              }
              for (var S = 0; S < 5; S++)
                for (var P = l[(S + 4) % 5], q = l[(S + 1) % 5], H = q.high, j = q.low, B = P.high ^ (H << 1 | j >>> 31), b = P.low ^ (j << 1 | H >>> 31), w = 0; w < 5; w++) {
                  var _ = d[S + 5 * w];
                  _.high ^= B, _.low ^= b;
                }
              for (var z = 1; z < 25; z++) {
                var B, b, _ = d[z], V = _.high, M = _.low, R = E[z];
                R < 32 ? (B = V << R | M >>> 32 - R, b = M << R | V >>> 32 - R) : (B = M << R - 32 | V >>> 64 - R, b = V << R - 32 | M >>> 64 - R);
                var O = l[x[z]];
                O.high = B, O.low = b;
              }
              var N = l[0], T = d[0];
              N.high = T.high, N.low = T.low;
              for (var S = 0; S < 5; S++)
                for (var w = 0; w < 5; w++) {
                  var z = S + 5 * w, _ = d[z], K = l[z], W = l[(S + 1) % 5 + 5 * w], Z = l[(S + 2) % 5 + 5 * w];
                  _.high = K.high ^ ~W.high & Z.high, _.low = K.low ^ ~W.low & Z.low;
                }
              var _ = d[0], U = g[D];
              _.high ^= U.high, _.low ^= U.low;
            }
          },
          _doFinalize: function() {
            var h = this._data, C = h.words;
            this._nDataBytes * 8;
            var d = h.sigBytes * 8, p = this.blockSize * 32;
            C[d >>> 5] |= 1 << 24 - d % 32, C[(n.ceil((d + 1) / p) * p >>> 5) - 1] |= 128, h.sigBytes = C.length * 4, this._process();
            for (var v = this._state, m = this.cfg.outputLength / 8, A = m / 8, _ = [], D = 0; D < A; D++) {
              var S = v[D], B = S.high, b = S.low;
              B = (B << 8 | B >>> 24) & 16711935 | (B << 24 | B >>> 8) & 4278255360, b = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360, _.push(b), _.push(B);
            }
            return new a.init(_, m);
          },
          clone: function() {
            for (var h = f.clone.call(this), C = h._state = this._state.slice(0), d = 0; d < 25; d++)
              C[d] = C[d].clone();
            return h;
          }
        });
        s.SHA3 = f._createHelper(y), s.HmacSHA3 = f._createHmacHelper(y);
      }(Math), t.SHA3;
    });
  }(yt)), yt.exports;
}
var mt = { exports: {} }, ji = mt.exports, Cr;
function Ki() {
  return Cr || (Cr = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(ji, function(t) {
      /** @preserve
      			(c) 2012 by Cédric Mesnil. All rights reserved.
      
      			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
      			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
      			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      			*/
      return function(n) {
        var s = t, i = s.lib, a = i.WordArray, f = i.Hasher, u = s.algo, o = a.create([
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          7,
          4,
          13,
          1,
          10,
          6,
          15,
          3,
          12,
          0,
          9,
          5,
          2,
          14,
          11,
          8,
          3,
          10,
          14,
          4,
          9,
          15,
          8,
          1,
          2,
          7,
          0,
          6,
          13,
          11,
          5,
          12,
          1,
          9,
          11,
          10,
          0,
          8,
          12,
          4,
          13,
          3,
          7,
          15,
          14,
          5,
          6,
          2,
          4,
          0,
          5,
          9,
          7,
          12,
          2,
          10,
          14,
          1,
          3,
          8,
          11,
          6,
          15,
          13
        ]), c = a.create([
          5,
          14,
          7,
          0,
          9,
          2,
          11,
          4,
          13,
          6,
          15,
          8,
          1,
          10,
          3,
          12,
          6,
          11,
          3,
          7,
          0,
          13,
          5,
          10,
          14,
          15,
          8,
          12,
          4,
          9,
          1,
          2,
          15,
          5,
          1,
          3,
          7,
          14,
          6,
          9,
          11,
          8,
          12,
          2,
          10,
          0,
          4,
          13,
          8,
          6,
          4,
          1,
          3,
          11,
          15,
          0,
          5,
          12,
          2,
          13,
          9,
          7,
          10,
          14,
          12,
          15,
          10,
          4,
          1,
          5,
          8,
          7,
          6,
          2,
          13,
          14,
          0,
          3,
          9,
          11
        ]), E = a.create([
          11,
          14,
          15,
          12,
          5,
          8,
          7,
          9,
          11,
          13,
          14,
          15,
          6,
          7,
          9,
          8,
          7,
          6,
          8,
          13,
          11,
          9,
          7,
          15,
          7,
          12,
          15,
          9,
          11,
          7,
          13,
          12,
          11,
          13,
          6,
          7,
          14,
          9,
          13,
          15,
          14,
          8,
          13,
          6,
          5,
          12,
          7,
          5,
          11,
          12,
          14,
          15,
          14,
          15,
          9,
          8,
          9,
          14,
          5,
          6,
          8,
          6,
          5,
          12,
          9,
          15,
          5,
          11,
          6,
          8,
          13,
          12,
          5,
          12,
          13,
          14,
          11,
          8,
          5,
          6
        ]), x = a.create([
          8,
          9,
          9,
          11,
          13,
          15,
          15,
          5,
          7,
          7,
          8,
          11,
          14,
          14,
          12,
          6,
          9,
          13,
          15,
          7,
          12,
          8,
          9,
          11,
          7,
          7,
          12,
          7,
          6,
          15,
          13,
          11,
          9,
          7,
          15,
          11,
          8,
          6,
          6,
          14,
          12,
          13,
          5,
          14,
          13,
          13,
          7,
          5,
          15,
          5,
          8,
          11,
          14,
          14,
          6,
          14,
          6,
          9,
          12,
          9,
          12,
          5,
          15,
          8,
          8,
          5,
          12,
          9,
          12,
          5,
          14,
          6,
          8,
          13,
          6,
          5,
          15,
          13,
          11,
          11
        ]), g = a.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), l = a.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), y = u.RIPEMD160 = f.extend({
          _doReset: function() {
            this._hash = a.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
          },
          _doProcessBlock: function(A, _) {
            for (var D = 0; D < 16; D++) {
              var S = _ + D, B = A[S];
              A[S] = (B << 8 | B >>> 24) & 16711935 | (B << 24 | B >>> 8) & 4278255360;
            }
            var b = this._hash.words, w = g.words, k = l.words, P = o.words, q = c.words, H = E.words, j = x.words, z, V, M, R, O, N, T, K, W, Z;
            N = z = b[0], T = V = b[1], K = M = b[2], W = R = b[3], Z = O = b[4];
            for (var U, D = 0; D < 80; D += 1)
              U = z + A[_ + P[D]] | 0, D < 16 ? U += h(V, M, R) + w[0] : D < 32 ? U += C(V, M, R) + w[1] : D < 48 ? U += d(V, M, R) + w[2] : D < 64 ? U += p(V, M, R) + w[3] : U += v(V, M, R) + w[4], U = U | 0, U = m(U, H[D]), U = U + O | 0, z = O, O = R, R = m(M, 10), M = V, V = U, U = N + A[_ + q[D]] | 0, D < 16 ? U += v(T, K, W) + k[0] : D < 32 ? U += p(T, K, W) + k[1] : D < 48 ? U += d(T, K, W) + k[2] : D < 64 ? U += C(T, K, W) + k[3] : U += h(T, K, W) + k[4], U = U | 0, U = m(U, j[D]), U = U + Z | 0, N = Z, Z = W, W = m(K, 10), K = T, T = U;
            U = b[1] + M + W | 0, b[1] = b[2] + R + Z | 0, b[2] = b[3] + O + N | 0, b[3] = b[4] + z + T | 0, b[4] = b[0] + V + K | 0, b[0] = U;
          },
          _doFinalize: function() {
            var A = this._data, _ = A.words, D = this._nDataBytes * 8, S = A.sigBytes * 8;
            _[S >>> 5] |= 128 << 24 - S % 32, _[(S + 64 >>> 9 << 4) + 14] = (D << 8 | D >>> 24) & 16711935 | (D << 24 | D >>> 8) & 4278255360, A.sigBytes = (_.length + 1) * 4, this._process();
            for (var B = this._hash, b = B.words, w = 0; w < 5; w++) {
              var k = b[w];
              b[w] = (k << 8 | k >>> 24) & 16711935 | (k << 24 | k >>> 8) & 4278255360;
            }
            return B;
          },
          clone: function() {
            var A = f.clone.call(this);
            return A._hash = this._hash.clone(), A;
          }
        });
        function h(A, _, D) {
          return A ^ _ ^ D;
        }
        function C(A, _, D) {
          return A & _ | ~A & D;
        }
        function d(A, _, D) {
          return (A | ~_) ^ D;
        }
        function p(A, _, D) {
          return A & D | _ & ~D;
        }
        function v(A, _, D) {
          return A ^ (_ | ~D);
        }
        function m(A, _) {
          return A << _ | A >>> 32 - _;
        }
        s.RIPEMD160 = f._createHelper(y), s.HmacRIPEMD160 = f._createHmacHelper(y);
      }(), t.RIPEMD160;
    });
  }(mt)), mt.exports;
}
var Bt = { exports: {} }, Yi = Bt.exports, _r;
function H0() {
  return _r || (_r = 1, function(r, e) {
    (function(t, n) {
      r.exports = n($());
    })(Yi, function(t) {
      (function() {
        var n = t, s = n.lib, i = s.Base, a = n.enc, f = a.Utf8, u = n.algo;
        u.HMAC = i.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function(o, c) {
            o = this._hasher = new o.init(), typeof c == "string" && (c = f.parse(c));
            var E = o.blockSize, x = E * 4;
            c.sigBytes > x && (c = o.finalize(c)), c.clamp();
            for (var g = this._oKey = c.clone(), l = this._iKey = c.clone(), y = g.words, h = l.words, C = 0; C < E; C++)
              y[C] ^= 1549556828, h[C] ^= 909522486;
            g.sigBytes = l.sigBytes = x, this.reset();
          },
          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function() {
            var o = this._hasher;
            o.reset(), o.update(this._iKey);
          },
          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function(o) {
            return this._hasher.update(o), this;
          },
          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function(o) {
            var c = this._hasher, E = c.finalize(o);
            c.reset();
            var x = c.finalize(this._oKey.clone().concat(E));
            return x;
          }
        });
      })();
    });
  }(Bt)), Bt.exports;
}
var At = { exports: {} }, Xi = At.exports, br;
function Gi() {
  return br || (br = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), L0(), H0());
    })(Xi, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.Base, a = s.WordArray, f = n.algo, u = f.SHA256, o = f.HMAC, c = f.PBKDF2 = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: i.extend({
            keySize: 128 / 32,
            hasher: u,
            iterations: 25e4
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function(E) {
            this.cfg = this.cfg.extend(E);
          },
          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(E, x) {
            for (var g = this.cfg, l = o.create(g.hasher, E), y = a.create(), h = a.create([1]), C = y.words, d = h.words, p = g.keySize, v = g.iterations; C.length < p; ) {
              var m = l.update(x).finalize(h);
              l.reset();
              for (var A = m.words, _ = A.length, D = m, S = 1; S < v; S++) {
                D = l.finalize(D), l.reset();
                for (var B = D.words, b = 0; b < _; b++)
                  A[b] ^= B[b];
              }
              y.concat(m), d[0]++;
            }
            return y.sigBytes = p * 4, y;
          }
        });
        n.PBKDF2 = function(E, x, g) {
          return c.create(g).compute(E, x);
        };
      }(), t.PBKDF2;
    });
  }(At)), At.exports;
}
var Ct = { exports: {} }, Qi = Ct.exports, Dr;
function Ee() {
  return Dr || (Dr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), _n(), H0());
    })(Qi, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.Base, a = s.WordArray, f = n.algo, u = f.MD5, o = f.EvpKDF = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: i.extend({
            keySize: 128 / 32,
            hasher: u,
            iterations: 1
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function(c) {
            this.cfg = this.cfg.extend(c);
          },
          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(c, E) {
            for (var x, g = this.cfg, l = g.hasher.create(), y = a.create(), h = y.words, C = g.keySize, d = g.iterations; h.length < C; ) {
              x && l.update(x), x = l.update(c).finalize(E), l.reset();
              for (var p = 1; p < d; p++)
                x = l.finalize(x), l.reset();
              y.concat(x);
            }
            return y.sigBytes = C * 4, y;
          }
        });
        n.EvpKDF = function(c, E, x) {
          return o.create(x).compute(c, E);
        };
      }(), t.EvpKDF;
    });
  }(Ct)), Ct.exports;
}
var _t = { exports: {} }, Ji = _t.exports, Fr;
function G() {
  return Fr || (Fr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Ee());
    })(Ji, function(t) {
      t.lib.Cipher || function(n) {
        var s = t, i = s.lib, a = i.Base, f = i.WordArray, u = i.BufferedBlockAlgorithm, o = s.enc;
        o.Utf8;
        var c = o.Base64, E = s.algo, x = E.EvpKDF, g = i.Cipher = u.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: a.extend(),
          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function(B, b) {
            return this.create(this._ENC_XFORM_MODE, B, b);
          },
          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function(B, b) {
            return this.create(this._DEC_XFORM_MODE, B, b);
          },
          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function(B, b, w) {
            this.cfg = this.cfg.extend(w), this._xformMode = B, this._key = b, this.reset();
          },
          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function() {
            u.reset.call(this), this._doReset();
          },
          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function(B) {
            return this._append(B), this._process();
          },
          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function(B) {
            B && this._append(B);
            var b = this._doFinalize();
            return b;
          },
          keySize: 128 / 32,
          ivSize: 128 / 32,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: /* @__PURE__ */ function() {
            function B(b) {
              return typeof b == "string" ? S : A;
            }
            return function(b) {
              return {
                encrypt: function(w, k, P) {
                  return B(k).encrypt(b, w, k, P);
                },
                decrypt: function(w, k, P) {
                  return B(k).decrypt(b, w, k, P);
                }
              };
            };
          }()
        });
        i.StreamCipher = g.extend({
          _doFinalize: function() {
            var B = this._process(!0);
            return B;
          },
          blockSize: 1
        });
        var l = s.mode = {}, y = i.BlockCipherMode = a.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function(B, b) {
            return this.Encryptor.create(B, b);
          },
          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function(B, b) {
            return this.Decryptor.create(B, b);
          },
          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function(B, b) {
            this._cipher = B, this._iv = b;
          }
        }), h = l.CBC = function() {
          var B = y.extend();
          B.Encryptor = B.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(w, k) {
              var P = this._cipher, q = P.blockSize;
              b.call(this, w, k, q), P.encryptBlock(w, k), this._prevBlock = w.slice(k, k + q);
            }
          }), B.Decryptor = B.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(w, k) {
              var P = this._cipher, q = P.blockSize, H = w.slice(k, k + q);
              P.decryptBlock(w, k), b.call(this, w, k, q), this._prevBlock = H;
            }
          });
          function b(w, k, P) {
            var q, H = this._iv;
            H ? (q = H, this._iv = n) : q = this._prevBlock;
            for (var j = 0; j < P; j++)
              w[k + j] ^= q[j];
          }
          return B;
        }(), C = s.pad = {}, d = C.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function(B, b) {
            for (var w = b * 4, k = w - B.sigBytes % w, P = k << 24 | k << 16 | k << 8 | k, q = [], H = 0; H < k; H += 4)
              q.push(P);
            var j = f.create(q, k);
            B.concat(j);
          },
          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function(B) {
            var b = B.words[B.sigBytes - 1 >>> 2] & 255;
            B.sigBytes -= b;
          }
        };
        i.BlockCipher = g.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: g.cfg.extend({
            mode: h,
            padding: d
          }),
          reset: function() {
            var B;
            g.reset.call(this);
            var b = this.cfg, w = b.iv, k = b.mode;
            this._xformMode == this._ENC_XFORM_MODE ? B = k.createEncryptor : (B = k.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == B ? this._mode.init(this, w && w.words) : (this._mode = B.call(k, this, w && w.words), this._mode.__creator = B);
          },
          _doProcessBlock: function(B, b) {
            this._mode.processBlock(B, b);
          },
          _doFinalize: function() {
            var B, b = this.cfg.padding;
            return this._xformMode == this._ENC_XFORM_MODE ? (b.pad(this._data, this.blockSize), B = this._process(!0)) : (B = this._process(!0), b.unpad(B)), B;
          },
          blockSize: 128 / 32
        });
        var p = i.CipherParams = a.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function(B) {
            this.mixIn(B);
          },
          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function(B) {
            return (B || this.formatter).stringify(this);
          }
        }), v = s.format = {}, m = v.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function(B) {
            var b, w = B.ciphertext, k = B.salt;
            return k ? b = f.create([1398893684, 1701076831]).concat(k).concat(w) : b = w, b.toString(c);
          },
          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function(B) {
            var b, w = c.parse(B), k = w.words;
            return k[0] == 1398893684 && k[1] == 1701076831 && (b = f.create(k.slice(2, 4)), k.splice(0, 4), w.sigBytes -= 16), p.create({ ciphertext: w, salt: b });
          }
        }, A = i.SerializableCipher = a.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: a.extend({
            format: m
          }),
          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(B, b, w, k) {
            k = this.cfg.extend(k);
            var P = B.createEncryptor(w, k), q = P.finalize(b), H = P.cfg;
            return p.create({
              ciphertext: q,
              key: w,
              iv: H.iv,
              algorithm: B,
              mode: H.mode,
              padding: H.padding,
              blockSize: B.blockSize,
              formatter: k.format
            });
          },
          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(B, b, w, k) {
            k = this.cfg.extend(k), b = this._parse(b, k.format);
            var P = B.createDecryptor(w, k).finalize(b.ciphertext);
            return P;
          },
          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function(B, b) {
            return typeof B == "string" ? b.parse(B, this) : B;
          }
        }), _ = s.kdf = {}, D = _.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function(B, b, w, k, P) {
            if (k || (k = f.random(64 / 8)), P)
              var q = x.create({ keySize: b + w, hasher: P }).compute(B, k);
            else
              var q = x.create({ keySize: b + w }).compute(B, k);
            var H = f.create(q.words.slice(b), w * 4);
            return q.sigBytes = b * 4, p.create({ key: q, iv: H, salt: k });
          }
        }, S = i.PasswordBasedCipher = A.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: A.cfg.extend({
            kdf: D
          }),
          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(B, b, w, k) {
            k = this.cfg.extend(k);
            var P = k.kdf.execute(w, B.keySize, B.ivSize, k.salt, k.hasher);
            k.iv = P.iv;
            var q = A.encrypt.call(this, B, b, P.key, k);
            return q.mixIn(P), q;
          },
          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(B, b, w, k) {
            k = this.cfg.extend(k), b = this._parse(b, k.format);
            var P = k.kdf.execute(w, B.keySize, B.ivSize, b.salt, k.hasher);
            k.iv = P.iv;
            var q = A.decrypt.call(this, B, b, P.key, k);
            return q;
          }
        });
      }();
    });
  }(_t)), _t.exports;
}
var bt = { exports: {} }, Zi = bt.exports, wr;
function eo() {
  return wr || (wr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(Zi, function(t) {
      return t.mode.CFB = function() {
        var n = t.lib.BlockCipherMode.extend();
        n.Encryptor = n.extend({
          processBlock: function(i, a) {
            var f = this._cipher, u = f.blockSize;
            s.call(this, i, a, u, f), this._prevBlock = i.slice(a, a + u);
          }
        }), n.Decryptor = n.extend({
          processBlock: function(i, a) {
            var f = this._cipher, u = f.blockSize, o = i.slice(a, a + u);
            s.call(this, i, a, u, f), this._prevBlock = o;
          }
        });
        function s(i, a, f, u) {
          var o, c = this._iv;
          c ? (o = c.slice(0), this._iv = void 0) : o = this._prevBlock, u.encryptBlock(o, 0);
          for (var E = 0; E < f; E++)
            i[a + E] ^= o[E];
        }
        return n;
      }(), t.mode.CFB;
    });
  }(bt)), bt.exports;
}
var Dt = { exports: {} }, to = Dt.exports, kr;
function ro() {
  return kr || (kr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(to, function(t) {
      return t.mode.CTR = function() {
        var n = t.lib.BlockCipherMode.extend(), s = n.Encryptor = n.extend({
          processBlock: function(i, a) {
            var f = this._cipher, u = f.blockSize, o = this._iv, c = this._counter;
            o && (c = this._counter = o.slice(0), this._iv = void 0);
            var E = c.slice(0);
            f.encryptBlock(E, 0), c[u - 1] = c[u - 1] + 1 | 0;
            for (var x = 0; x < u; x++)
              i[a + x] ^= E[x];
          }
        });
        return n.Decryptor = s, n;
      }(), t.mode.CTR;
    });
  }(Dt)), Dt.exports;
}
var Ft = { exports: {} }, no = Ft.exports, Rr;
function so() {
  return Rr || (Rr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(no, function(t) {
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      return t.mode.CTRGladman = function() {
        var n = t.lib.BlockCipherMode.extend();
        function s(f) {
          if ((f >> 24 & 255) === 255) {
            var u = f >> 16 & 255, o = f >> 8 & 255, c = f & 255;
            u === 255 ? (u = 0, o === 255 ? (o = 0, c === 255 ? c = 0 : ++c) : ++o) : ++u, f = 0, f += u << 16, f += o << 8, f += c;
          } else
            f += 1 << 24;
          return f;
        }
        function i(f) {
          return (f[0] = s(f[0])) === 0 && (f[1] = s(f[1])), f;
        }
        var a = n.Encryptor = n.extend({
          processBlock: function(f, u) {
            var o = this._cipher, c = o.blockSize, E = this._iv, x = this._counter;
            E && (x = this._counter = E.slice(0), this._iv = void 0), i(x);
            var g = x.slice(0);
            o.encryptBlock(g, 0);
            for (var l = 0; l < c; l++)
              f[u + l] ^= g[l];
          }
        });
        return n.Decryptor = a, n;
      }(), t.mode.CTRGladman;
    });
  }(Ft)), Ft.exports;
}
var wt = { exports: {} }, io = wt.exports, Sr;
function oo() {
  return Sr || (Sr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(io, function(t) {
      return t.mode.OFB = function() {
        var n = t.lib.BlockCipherMode.extend(), s = n.Encryptor = n.extend({
          processBlock: function(i, a) {
            var f = this._cipher, u = f.blockSize, o = this._iv, c = this._keystream;
            o && (c = this._keystream = o.slice(0), this._iv = void 0), f.encryptBlock(c, 0);
            for (var E = 0; E < u; E++)
              i[a + E] ^= c[E];
          }
        });
        return n.Decryptor = s, n;
      }(), t.mode.OFB;
    });
  }(wt)), wt.exports;
}
var kt = { exports: {} }, ao = kt.exports, Tr;
function co() {
  return Tr || (Tr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(ao, function(t) {
      return t.mode.ECB = function() {
        var n = t.lib.BlockCipherMode.extend();
        return n.Encryptor = n.extend({
          processBlock: function(s, i) {
            this._cipher.encryptBlock(s, i);
          }
        }), n.Decryptor = n.extend({
          processBlock: function(s, i) {
            this._cipher.decryptBlock(s, i);
          }
        }), n;
      }(), t.mode.ECB;
    });
  }(kt)), kt.exports;
}
var Rt = { exports: {} }, fo = Rt.exports, Or;
function xo() {
  return Or || (Or = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(fo, function(t) {
      return t.pad.AnsiX923 = {
        pad: function(n, s) {
          var i = n.sigBytes, a = s * 4, f = a - i % a, u = i + f - 1;
          n.clamp(), n.words[u >>> 2] |= f << 24 - u % 4 * 8, n.sigBytes += f;
        },
        unpad: function(n) {
          var s = n.words[n.sigBytes - 1 >>> 2] & 255;
          n.sigBytes -= s;
        }
      }, t.pad.Ansix923;
    });
  }(Rt)), Rt.exports;
}
var St = { exports: {} }, uo = St.exports, Nr;
function lo() {
  return Nr || (Nr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(uo, function(t) {
      return t.pad.Iso10126 = {
        pad: function(n, s) {
          var i = s * 4, a = i - n.sigBytes % i;
          n.concat(t.lib.WordArray.random(a - 1)).concat(t.lib.WordArray.create([a << 24], 1));
        },
        unpad: function(n) {
          var s = n.words[n.sigBytes - 1 >>> 2] & 255;
          n.sigBytes -= s;
        }
      }, t.pad.Iso10126;
    });
  }(St)), St.exports;
}
var Tt = { exports: {} }, ho = Tt.exports, Pr;
function po() {
  return Pr || (Pr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(ho, function(t) {
      return t.pad.Iso97971 = {
        pad: function(n, s) {
          n.concat(t.lib.WordArray.create([2147483648], 1)), t.pad.ZeroPadding.pad(n, s);
        },
        unpad: function(n) {
          t.pad.ZeroPadding.unpad(n), n.sigBytes--;
        }
      }, t.pad.Iso97971;
    });
  }(Tt)), Tt.exports;
}
var Ot = { exports: {} }, vo = Ot.exports, qr;
function Eo() {
  return qr || (qr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(vo, function(t) {
      return t.pad.ZeroPadding = {
        pad: function(n, s) {
          var i = s * 4;
          n.clamp(), n.sigBytes += i - (n.sigBytes % i || i);
        },
        unpad: function(n) {
          for (var s = n.words, i = n.sigBytes - 1, i = n.sigBytes - 1; i >= 0; i--)
            if (s[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
              n.sigBytes = i + 1;
              break;
            }
        }
      }, t.pad.ZeroPadding;
    });
  }(Ot)), Ot.exports;
}
var Nt = { exports: {} }, go = Nt.exports, Lr;
function yo() {
  return Lr || (Lr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(go, function(t) {
      return t.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      }, t.pad.NoPadding;
    });
  }(Nt)), Nt.exports;
}
var Pt = { exports: {} }, mo = Pt.exports, Hr;
function Bo() {
  return Hr || (Hr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), G());
    })(mo, function(t) {
      return function(n) {
        var s = t, i = s.lib, a = i.CipherParams, f = s.enc, u = f.Hex, o = s.format;
        o.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function(c) {
            return c.ciphertext.toString(u);
          },
          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function(c) {
            var E = u.parse(c);
            return a.create({ ciphertext: E });
          }
        };
      }(), t.format.Hex;
    });
  }(Pt)), Pt.exports;
}
var qt = { exports: {} }, Ao = qt.exports, Ur;
function Co() {
  return Ur || (Ur = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Be(), Ae(), Ee(), G());
    })(Ao, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.BlockCipher, a = n.algo, f = [], u = [], o = [], c = [], E = [], x = [], g = [], l = [], y = [], h = [];
        (function() {
          for (var p = [], v = 0; v < 256; v++)
            v < 128 ? p[v] = v << 1 : p[v] = v << 1 ^ 283;
          for (var m = 0, A = 0, v = 0; v < 256; v++) {
            var _ = A ^ A << 1 ^ A << 2 ^ A << 3 ^ A << 4;
            _ = _ >>> 8 ^ _ & 255 ^ 99, f[m] = _, u[_] = m;
            var D = p[m], S = p[D], B = p[S], b = p[_] * 257 ^ _ * 16843008;
            o[m] = b << 24 | b >>> 8, c[m] = b << 16 | b >>> 16, E[m] = b << 8 | b >>> 24, x[m] = b;
            var b = B * 16843009 ^ S * 65537 ^ D * 257 ^ m * 16843008;
            g[_] = b << 24 | b >>> 8, l[_] = b << 16 | b >>> 16, y[_] = b << 8 | b >>> 24, h[_] = b, m ? (m = D ^ p[p[p[B ^ D]]], A ^= p[p[A]]) : m = A = 1;
          }
        })();
        var C = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], d = a.AES = i.extend({
          _doReset: function() {
            var p;
            if (!(this._nRounds && this._keyPriorReset === this._key)) {
              for (var v = this._keyPriorReset = this._key, m = v.words, A = v.sigBytes / 4, _ = this._nRounds = A + 6, D = (_ + 1) * 4, S = this._keySchedule = [], B = 0; B < D; B++)
                B < A ? S[B] = m[B] : (p = S[B - 1], B % A ? A > 6 && B % A == 4 && (p = f[p >>> 24] << 24 | f[p >>> 16 & 255] << 16 | f[p >>> 8 & 255] << 8 | f[p & 255]) : (p = p << 8 | p >>> 24, p = f[p >>> 24] << 24 | f[p >>> 16 & 255] << 16 | f[p >>> 8 & 255] << 8 | f[p & 255], p ^= C[B / A | 0] << 24), S[B] = S[B - A] ^ p);
              for (var b = this._invKeySchedule = [], w = 0; w < D; w++) {
                var B = D - w;
                if (w % 4)
                  var p = S[B];
                else
                  var p = S[B - 4];
                w < 4 || B <= 4 ? b[w] = p : b[w] = g[f[p >>> 24]] ^ l[f[p >>> 16 & 255]] ^ y[f[p >>> 8 & 255]] ^ h[f[p & 255]];
              }
            }
          },
          encryptBlock: function(p, v) {
            this._doCryptBlock(p, v, this._keySchedule, o, c, E, x, f);
          },
          decryptBlock: function(p, v) {
            var m = p[v + 1];
            p[v + 1] = p[v + 3], p[v + 3] = m, this._doCryptBlock(p, v, this._invKeySchedule, g, l, y, h, u);
            var m = p[v + 1];
            p[v + 1] = p[v + 3], p[v + 3] = m;
          },
          _doCryptBlock: function(p, v, m, A, _, D, S, B) {
            for (var b = this._nRounds, w = p[v] ^ m[0], k = p[v + 1] ^ m[1], P = p[v + 2] ^ m[2], q = p[v + 3] ^ m[3], H = 4, j = 1; j < b; j++) {
              var z = A[w >>> 24] ^ _[k >>> 16 & 255] ^ D[P >>> 8 & 255] ^ S[q & 255] ^ m[H++], V = A[k >>> 24] ^ _[P >>> 16 & 255] ^ D[q >>> 8 & 255] ^ S[w & 255] ^ m[H++], M = A[P >>> 24] ^ _[q >>> 16 & 255] ^ D[w >>> 8 & 255] ^ S[k & 255] ^ m[H++], R = A[q >>> 24] ^ _[w >>> 16 & 255] ^ D[k >>> 8 & 255] ^ S[P & 255] ^ m[H++];
              w = z, k = V, P = M, q = R;
            }
            var z = (B[w >>> 24] << 24 | B[k >>> 16 & 255] << 16 | B[P >>> 8 & 255] << 8 | B[q & 255]) ^ m[H++], V = (B[k >>> 24] << 24 | B[P >>> 16 & 255] << 16 | B[q >>> 8 & 255] << 8 | B[w & 255]) ^ m[H++], M = (B[P >>> 24] << 24 | B[q >>> 16 & 255] << 16 | B[w >>> 8 & 255] << 8 | B[k & 255]) ^ m[H++], R = (B[q >>> 24] << 24 | B[w >>> 16 & 255] << 16 | B[k >>> 8 & 255] << 8 | B[P & 255]) ^ m[H++];
            p[v] = z, p[v + 1] = V, p[v + 2] = M, p[v + 3] = R;
          },
          keySize: 256 / 32
        });
        n.AES = i._createHelper(d);
      }(), t.AES;
    });
  }(qt)), qt.exports;
}
var Lt = { exports: {} }, _o = Lt.exports, Ir;
function bo() {
  return Ir || (Ir = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Be(), Ae(), Ee(), G());
    })(_o, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.WordArray, a = s.BlockCipher, f = n.algo, u = [
          57,
          49,
          41,
          33,
          25,
          17,
          9,
          1,
          58,
          50,
          42,
          34,
          26,
          18,
          10,
          2,
          59,
          51,
          43,
          35,
          27,
          19,
          11,
          3,
          60,
          52,
          44,
          36,
          63,
          55,
          47,
          39,
          31,
          23,
          15,
          7,
          62,
          54,
          46,
          38,
          30,
          22,
          14,
          6,
          61,
          53,
          45,
          37,
          29,
          21,
          13,
          5,
          28,
          20,
          12,
          4
        ], o = [
          14,
          17,
          11,
          24,
          1,
          5,
          3,
          28,
          15,
          6,
          21,
          10,
          23,
          19,
          12,
          4,
          26,
          8,
          16,
          7,
          27,
          20,
          13,
          2,
          41,
          52,
          31,
          37,
          47,
          55,
          30,
          40,
          51,
          45,
          33,
          48,
          44,
          49,
          39,
          56,
          34,
          53,
          46,
          42,
          50,
          36,
          29,
          32
        ], c = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], E = [
          {
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
          },
          {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
          },
          {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
          },
          {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
          },
          {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
          },
          {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
          },
          {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
          },
          {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
          }
        ], x = [
          4160749569,
          528482304,
          33030144,
          2064384,
          129024,
          8064,
          504,
          2147483679
        ], g = f.DES = a.extend({
          _doReset: function() {
            for (var C = this._key, d = C.words, p = [], v = 0; v < 56; v++) {
              var m = u[v] - 1;
              p[v] = d[m >>> 5] >>> 31 - m % 32 & 1;
            }
            for (var A = this._subKeys = [], _ = 0; _ < 16; _++) {
              for (var D = A[_] = [], S = c[_], v = 0; v < 24; v++)
                D[v / 6 | 0] |= p[(o[v] - 1 + S) % 28] << 31 - v % 6, D[4 + (v / 6 | 0)] |= p[28 + (o[v + 24] - 1 + S) % 28] << 31 - v % 6;
              D[0] = D[0] << 1 | D[0] >>> 31;
              for (var v = 1; v < 7; v++)
                D[v] = D[v] >>> (v - 1) * 4 + 3;
              D[7] = D[7] << 5 | D[7] >>> 27;
            }
            for (var B = this._invSubKeys = [], v = 0; v < 16; v++)
              B[v] = A[15 - v];
          },
          encryptBlock: function(C, d) {
            this._doCryptBlock(C, d, this._subKeys);
          },
          decryptBlock: function(C, d) {
            this._doCryptBlock(C, d, this._invSubKeys);
          },
          _doCryptBlock: function(C, d, p) {
            this._lBlock = C[d], this._rBlock = C[d + 1], l.call(this, 4, 252645135), l.call(this, 16, 65535), y.call(this, 2, 858993459), y.call(this, 8, 16711935), l.call(this, 1, 1431655765);
            for (var v = 0; v < 16; v++) {
              for (var m = p[v], A = this._lBlock, _ = this._rBlock, D = 0, S = 0; S < 8; S++)
                D |= E[S][((_ ^ m[S]) & x[S]) >>> 0];
              this._lBlock = _, this._rBlock = A ^ D;
            }
            var B = this._lBlock;
            this._lBlock = this._rBlock, this._rBlock = B, l.call(this, 1, 1431655765), y.call(this, 8, 16711935), y.call(this, 2, 858993459), l.call(this, 16, 65535), l.call(this, 4, 252645135), C[d] = this._lBlock, C[d + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        function l(C, d) {
          var p = (this._lBlock >>> C ^ this._rBlock) & d;
          this._rBlock ^= p, this._lBlock ^= p << C;
        }
        function y(C, d) {
          var p = (this._rBlock >>> C ^ this._lBlock) & d;
          this._lBlock ^= p, this._rBlock ^= p << C;
        }
        n.DES = a._createHelper(g);
        var h = f.TripleDES = a.extend({
          _doReset: function() {
            var C = this._key, d = C.words;
            if (d.length !== 2 && d.length !== 4 && d.length < 6)
              throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
            var p = d.slice(0, 2), v = d.length < 4 ? d.slice(0, 2) : d.slice(2, 4), m = d.length < 6 ? d.slice(0, 2) : d.slice(4, 6);
            this._des1 = g.createEncryptor(i.create(p)), this._des2 = g.createEncryptor(i.create(v)), this._des3 = g.createEncryptor(i.create(m));
          },
          encryptBlock: function(C, d) {
            this._des1.encryptBlock(C, d), this._des2.decryptBlock(C, d), this._des3.encryptBlock(C, d);
          },
          decryptBlock: function(C, d) {
            this._des3.decryptBlock(C, d), this._des2.encryptBlock(C, d), this._des1.decryptBlock(C, d);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        n.TripleDES = a._createHelper(h);
      }(), t.TripleDES;
    });
  }(Lt)), Lt.exports;
}
var Ht = { exports: {} }, Do = Ht.exports, $r;
function Fo() {
  return $r || ($r = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Be(), Ae(), Ee(), G());
    })(Do, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.StreamCipher, a = n.algo, f = a.RC4 = i.extend({
          _doReset: function() {
            for (var c = this._key, E = c.words, x = c.sigBytes, g = this._S = [], l = 0; l < 256; l++)
              g[l] = l;
            for (var l = 0, y = 0; l < 256; l++) {
              var h = l % x, C = E[h >>> 2] >>> 24 - h % 4 * 8 & 255;
              y = (y + g[l] + C) % 256;
              var d = g[l];
              g[l] = g[y], g[y] = d;
            }
            this._i = this._j = 0;
          },
          _doProcessBlock: function(c, E) {
            c[E] ^= u.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });
        function u() {
          for (var c = this._S, E = this._i, x = this._j, g = 0, l = 0; l < 4; l++) {
            E = (E + 1) % 256, x = (x + c[E]) % 256;
            var y = c[E];
            c[E] = c[x], c[x] = y, g |= c[(c[E] + c[x]) % 256] << 24 - l * 8;
          }
          return this._i = E, this._j = x, g;
        }
        n.RC4 = i._createHelper(f);
        var o = a.RC4Drop = f.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: f.cfg.extend({
            drop: 192
          }),
          _doReset: function() {
            f._doReset.call(this);
            for (var c = this.cfg.drop; c > 0; c--)
              u.call(this);
          }
        });
        n.RC4Drop = i._createHelper(o);
      }(), t.RC4;
    });
  }(Ht)), Ht.exports;
}
var Ut = { exports: {} }, wo = Ut.exports, zr;
function ko() {
  return zr || (zr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Be(), Ae(), Ee(), G());
    })(wo, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.StreamCipher, a = n.algo, f = [], u = [], o = [], c = a.Rabbit = i.extend({
          _doReset: function() {
            for (var x = this._key.words, g = this.cfg.iv, l = 0; l < 4; l++)
              x[l] = (x[l] << 8 | x[l] >>> 24) & 16711935 | (x[l] << 24 | x[l] >>> 8) & 4278255360;
            var y = this._X = [
              x[0],
              x[3] << 16 | x[2] >>> 16,
              x[1],
              x[0] << 16 | x[3] >>> 16,
              x[2],
              x[1] << 16 | x[0] >>> 16,
              x[3],
              x[2] << 16 | x[1] >>> 16
            ], h = this._C = [
              x[2] << 16 | x[2] >>> 16,
              x[0] & 4294901760 | x[1] & 65535,
              x[3] << 16 | x[3] >>> 16,
              x[1] & 4294901760 | x[2] & 65535,
              x[0] << 16 | x[0] >>> 16,
              x[2] & 4294901760 | x[3] & 65535,
              x[1] << 16 | x[1] >>> 16,
              x[3] & 4294901760 | x[0] & 65535
            ];
            this._b = 0;
            for (var l = 0; l < 4; l++)
              E.call(this);
            for (var l = 0; l < 8; l++)
              h[l] ^= y[l + 4 & 7];
            if (g) {
              var C = g.words, d = C[0], p = C[1], v = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, m = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, A = v >>> 16 | m & 4294901760, _ = m << 16 | v & 65535;
              h[0] ^= v, h[1] ^= A, h[2] ^= m, h[3] ^= _, h[4] ^= v, h[5] ^= A, h[6] ^= m, h[7] ^= _;
              for (var l = 0; l < 4; l++)
                E.call(this);
            }
          },
          _doProcessBlock: function(x, g) {
            var l = this._X;
            E.call(this), f[0] = l[0] ^ l[5] >>> 16 ^ l[3] << 16, f[1] = l[2] ^ l[7] >>> 16 ^ l[5] << 16, f[2] = l[4] ^ l[1] >>> 16 ^ l[7] << 16, f[3] = l[6] ^ l[3] >>> 16 ^ l[1] << 16;
            for (var y = 0; y < 4; y++)
              f[y] = (f[y] << 8 | f[y] >>> 24) & 16711935 | (f[y] << 24 | f[y] >>> 8) & 4278255360, x[g + y] ^= f[y];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function E() {
          for (var x = this._X, g = this._C, l = 0; l < 8; l++)
            u[l] = g[l];
          g[0] = g[0] + 1295307597 + this._b | 0, g[1] = g[1] + 3545052371 + (g[0] >>> 0 < u[0] >>> 0 ? 1 : 0) | 0, g[2] = g[2] + 886263092 + (g[1] >>> 0 < u[1] >>> 0 ? 1 : 0) | 0, g[3] = g[3] + 1295307597 + (g[2] >>> 0 < u[2] >>> 0 ? 1 : 0) | 0, g[4] = g[4] + 3545052371 + (g[3] >>> 0 < u[3] >>> 0 ? 1 : 0) | 0, g[5] = g[5] + 886263092 + (g[4] >>> 0 < u[4] >>> 0 ? 1 : 0) | 0, g[6] = g[6] + 1295307597 + (g[5] >>> 0 < u[5] >>> 0 ? 1 : 0) | 0, g[7] = g[7] + 3545052371 + (g[6] >>> 0 < u[6] >>> 0 ? 1 : 0) | 0, this._b = g[7] >>> 0 < u[7] >>> 0 ? 1 : 0;
          for (var l = 0; l < 8; l++) {
            var y = x[l] + g[l], h = y & 65535, C = y >>> 16, d = ((h * h >>> 17) + h * C >>> 15) + C * C, p = ((y & 4294901760) * y | 0) + ((y & 65535) * y | 0);
            o[l] = d ^ p;
          }
          x[0] = o[0] + (o[7] << 16 | o[7] >>> 16) + (o[6] << 16 | o[6] >>> 16) | 0, x[1] = o[1] + (o[0] << 8 | o[0] >>> 24) + o[7] | 0, x[2] = o[2] + (o[1] << 16 | o[1] >>> 16) + (o[0] << 16 | o[0] >>> 16) | 0, x[3] = o[3] + (o[2] << 8 | o[2] >>> 24) + o[1] | 0, x[4] = o[4] + (o[3] << 16 | o[3] >>> 16) + (o[2] << 16 | o[2] >>> 16) | 0, x[5] = o[5] + (o[4] << 8 | o[4] >>> 24) + o[3] | 0, x[6] = o[6] + (o[5] << 16 | o[5] >>> 16) + (o[4] << 16 | o[4] >>> 16) | 0, x[7] = o[7] + (o[6] << 8 | o[6] >>> 24) + o[5] | 0;
        }
        n.Rabbit = i._createHelper(c);
      }(), t.Rabbit;
    });
  }(Ut)), Ut.exports;
}
var It = { exports: {} }, Ro = It.exports, Mr;
function So() {
  return Mr || (Mr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Be(), Ae(), Ee(), G());
    })(Ro, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.StreamCipher, a = n.algo, f = [], u = [], o = [], c = a.RabbitLegacy = i.extend({
          _doReset: function() {
            var x = this._key.words, g = this.cfg.iv, l = this._X = [
              x[0],
              x[3] << 16 | x[2] >>> 16,
              x[1],
              x[0] << 16 | x[3] >>> 16,
              x[2],
              x[1] << 16 | x[0] >>> 16,
              x[3],
              x[2] << 16 | x[1] >>> 16
            ], y = this._C = [
              x[2] << 16 | x[2] >>> 16,
              x[0] & 4294901760 | x[1] & 65535,
              x[3] << 16 | x[3] >>> 16,
              x[1] & 4294901760 | x[2] & 65535,
              x[0] << 16 | x[0] >>> 16,
              x[2] & 4294901760 | x[3] & 65535,
              x[1] << 16 | x[1] >>> 16,
              x[3] & 4294901760 | x[0] & 65535
            ];
            this._b = 0;
            for (var h = 0; h < 4; h++)
              E.call(this);
            for (var h = 0; h < 8; h++)
              y[h] ^= l[h + 4 & 7];
            if (g) {
              var C = g.words, d = C[0], p = C[1], v = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, m = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, A = v >>> 16 | m & 4294901760, _ = m << 16 | v & 65535;
              y[0] ^= v, y[1] ^= A, y[2] ^= m, y[3] ^= _, y[4] ^= v, y[5] ^= A, y[6] ^= m, y[7] ^= _;
              for (var h = 0; h < 4; h++)
                E.call(this);
            }
          },
          _doProcessBlock: function(x, g) {
            var l = this._X;
            E.call(this), f[0] = l[0] ^ l[5] >>> 16 ^ l[3] << 16, f[1] = l[2] ^ l[7] >>> 16 ^ l[5] << 16, f[2] = l[4] ^ l[1] >>> 16 ^ l[7] << 16, f[3] = l[6] ^ l[3] >>> 16 ^ l[1] << 16;
            for (var y = 0; y < 4; y++)
              f[y] = (f[y] << 8 | f[y] >>> 24) & 16711935 | (f[y] << 24 | f[y] >>> 8) & 4278255360, x[g + y] ^= f[y];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function E() {
          for (var x = this._X, g = this._C, l = 0; l < 8; l++)
            u[l] = g[l];
          g[0] = g[0] + 1295307597 + this._b | 0, g[1] = g[1] + 3545052371 + (g[0] >>> 0 < u[0] >>> 0 ? 1 : 0) | 0, g[2] = g[2] + 886263092 + (g[1] >>> 0 < u[1] >>> 0 ? 1 : 0) | 0, g[3] = g[3] + 1295307597 + (g[2] >>> 0 < u[2] >>> 0 ? 1 : 0) | 0, g[4] = g[4] + 3545052371 + (g[3] >>> 0 < u[3] >>> 0 ? 1 : 0) | 0, g[5] = g[5] + 886263092 + (g[4] >>> 0 < u[4] >>> 0 ? 1 : 0) | 0, g[6] = g[6] + 1295307597 + (g[5] >>> 0 < u[5] >>> 0 ? 1 : 0) | 0, g[7] = g[7] + 3545052371 + (g[6] >>> 0 < u[6] >>> 0 ? 1 : 0) | 0, this._b = g[7] >>> 0 < u[7] >>> 0 ? 1 : 0;
          for (var l = 0; l < 8; l++) {
            var y = x[l] + g[l], h = y & 65535, C = y >>> 16, d = ((h * h >>> 17) + h * C >>> 15) + C * C, p = ((y & 4294901760) * y | 0) + ((y & 65535) * y | 0);
            o[l] = d ^ p;
          }
          x[0] = o[0] + (o[7] << 16 | o[7] >>> 16) + (o[6] << 16 | o[6] >>> 16) | 0, x[1] = o[1] + (o[0] << 8 | o[0] >>> 24) + o[7] | 0, x[2] = o[2] + (o[1] << 16 | o[1] >>> 16) + (o[0] << 16 | o[0] >>> 16) | 0, x[3] = o[3] + (o[2] << 8 | o[2] >>> 24) + o[1] | 0, x[4] = o[4] + (o[3] << 16 | o[3] >>> 16) + (o[2] << 16 | o[2] >>> 16) | 0, x[5] = o[5] + (o[4] << 8 | o[4] >>> 24) + o[3] | 0, x[6] = o[6] + (o[5] << 16 | o[5] >>> 16) + (o[4] << 16 | o[4] >>> 16) | 0, x[7] = o[7] + (o[6] << 8 | o[6] >>> 24) + o[5] | 0;
        }
        n.RabbitLegacy = i._createHelper(c);
      }(), t.RabbitLegacy;
    });
  }(It)), It.exports;
}
var $t = { exports: {} }, To = $t.exports, Vr;
function Oo() {
  return Vr || (Vr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Be(), Ae(), Ee(), G());
    })(To, function(t) {
      return function() {
        var n = t, s = n.lib, i = s.BlockCipher, a = n.algo;
        const f = 16, u = [
          608135816,
          2242054355,
          320440878,
          57701188,
          2752067618,
          698298832,
          137296536,
          3964562569,
          1160258022,
          953160567,
          3193202383,
          887688300,
          3232508343,
          3380367581,
          1065670069,
          3041331479,
          2450970073,
          2306472731
        ], o = [
          [
            3509652390,
            2564797868,
            805139163,
            3491422135,
            3101798381,
            1780907670,
            3128725573,
            4046225305,
            614570311,
            3012652279,
            134345442,
            2240740374,
            1667834072,
            1901547113,
            2757295779,
            4103290238,
            227898511,
            1921955416,
            1904987480,
            2182433518,
            2069144605,
            3260701109,
            2620446009,
            720527379,
            3318853667,
            677414384,
            3393288472,
            3101374703,
            2390351024,
            1614419982,
            1822297739,
            2954791486,
            3608508353,
            3174124327,
            2024746970,
            1432378464,
            3864339955,
            2857741204,
            1464375394,
            1676153920,
            1439316330,
            715854006,
            3033291828,
            289532110,
            2706671279,
            2087905683,
            3018724369,
            1668267050,
            732546397,
            1947742710,
            3462151702,
            2609353502,
            2950085171,
            1814351708,
            2050118529,
            680887927,
            999245976,
            1800124847,
            3300911131,
            1713906067,
            1641548236,
            4213287313,
            1216130144,
            1575780402,
            4018429277,
            3917837745,
            3693486850,
            3949271944,
            596196993,
            3549867205,
            258830323,
            2213823033,
            772490370,
            2760122372,
            1774776394,
            2652871518,
            566650946,
            4142492826,
            1728879713,
            2882767088,
            1783734482,
            3629395816,
            2517608232,
            2874225571,
            1861159788,
            326777828,
            3124490320,
            2130389656,
            2716951837,
            967770486,
            1724537150,
            2185432712,
            2364442137,
            1164943284,
            2105845187,
            998989502,
            3765401048,
            2244026483,
            1075463327,
            1455516326,
            1322494562,
            910128902,
            469688178,
            1117454909,
            936433444,
            3490320968,
            3675253459,
            1240580251,
            122909385,
            2157517691,
            634681816,
            4142456567,
            3825094682,
            3061402683,
            2540495037,
            79693498,
            3249098678,
            1084186820,
            1583128258,
            426386531,
            1761308591,
            1047286709,
            322548459,
            995290223,
            1845252383,
            2603652396,
            3431023940,
            2942221577,
            3202600964,
            3727903485,
            1712269319,
            422464435,
            3234572375,
            1170764815,
            3523960633,
            3117677531,
            1434042557,
            442511882,
            3600875718,
            1076654713,
            1738483198,
            4213154764,
            2393238008,
            3677496056,
            1014306527,
            4251020053,
            793779912,
            2902807211,
            842905082,
            4246964064,
            1395751752,
            1040244610,
            2656851899,
            3396308128,
            445077038,
            3742853595,
            3577915638,
            679411651,
            2892444358,
            2354009459,
            1767581616,
            3150600392,
            3791627101,
            3102740896,
            284835224,
            4246832056,
            1258075500,
            768725851,
            2589189241,
            3069724005,
            3532540348,
            1274779536,
            3789419226,
            2764799539,
            1660621633,
            3471099624,
            4011903706,
            913787905,
            3497959166,
            737222580,
            2514213453,
            2928710040,
            3937242737,
            1804850592,
            3499020752,
            2949064160,
            2386320175,
            2390070455,
            2415321851,
            4061277028,
            2290661394,
            2416832540,
            1336762016,
            1754252060,
            3520065937,
            3014181293,
            791618072,
            3188594551,
            3933548030,
            2332172193,
            3852520463,
            3043980520,
            413987798,
            3465142937,
            3030929376,
            4245938359,
            2093235073,
            3534596313,
            375366246,
            2157278981,
            2479649556,
            555357303,
            3870105701,
            2008414854,
            3344188149,
            4221384143,
            3956125452,
            2067696032,
            3594591187,
            2921233993,
            2428461,
            544322398,
            577241275,
            1471733935,
            610547355,
            4027169054,
            1432588573,
            1507829418,
            2025931657,
            3646575487,
            545086370,
            48609733,
            2200306550,
            1653985193,
            298326376,
            1316178497,
            3007786442,
            2064951626,
            458293330,
            2589141269,
            3591329599,
            3164325604,
            727753846,
            2179363840,
            146436021,
            1461446943,
            4069977195,
            705550613,
            3059967265,
            3887724982,
            4281599278,
            3313849956,
            1404054877,
            2845806497,
            146425753,
            1854211946
          ],
          [
            1266315497,
            3048417604,
            3681880366,
            3289982499,
            290971e4,
            1235738493,
            2632868024,
            2414719590,
            3970600049,
            1771706367,
            1449415276,
            3266420449,
            422970021,
            1963543593,
            2690192192,
            3826793022,
            1062508698,
            1531092325,
            1804592342,
            2583117782,
            2714934279,
            4024971509,
            1294809318,
            4028980673,
            1289560198,
            2221992742,
            1669523910,
            35572830,
            157838143,
            1052438473,
            1016535060,
            1802137761,
            1753167236,
            1386275462,
            3080475397,
            2857371447,
            1040679964,
            2145300060,
            2390574316,
            1461121720,
            2956646967,
            4031777805,
            4028374788,
            33600511,
            2920084762,
            1018524850,
            629373528,
            3691585981,
            3515945977,
            2091462646,
            2486323059,
            586499841,
            988145025,
            935516892,
            3367335476,
            2599673255,
            2839830854,
            265290510,
            3972581182,
            2759138881,
            3795373465,
            1005194799,
            847297441,
            406762289,
            1314163512,
            1332590856,
            1866599683,
            4127851711,
            750260880,
            613907577,
            1450815602,
            3165620655,
            3734664991,
            3650291728,
            3012275730,
            3704569646,
            1427272223,
            778793252,
            1343938022,
            2676280711,
            2052605720,
            1946737175,
            3164576444,
            3914038668,
            3967478842,
            3682934266,
            1661551462,
            3294938066,
            4011595847,
            840292616,
            3712170807,
            616741398,
            312560963,
            711312465,
            1351876610,
            322626781,
            1910503582,
            271666773,
            2175563734,
            1594956187,
            70604529,
            3617834859,
            1007753275,
            1495573769,
            4069517037,
            2549218298,
            2663038764,
            504708206,
            2263041392,
            3941167025,
            2249088522,
            1514023603,
            1998579484,
            1312622330,
            694541497,
            2582060303,
            2151582166,
            1382467621,
            776784248,
            2618340202,
            3323268794,
            2497899128,
            2784771155,
            503983604,
            4076293799,
            907881277,
            423175695,
            432175456,
            1378068232,
            4145222326,
            3954048622,
            3938656102,
            3820766613,
            2793130115,
            2977904593,
            26017576,
            3274890735,
            3194772133,
            1700274565,
            1756076034,
            4006520079,
            3677328699,
            720338349,
            1533947780,
            354530856,
            688349552,
            3973924725,
            1637815568,
            332179504,
            3949051286,
            53804574,
            2852348879,
            3044236432,
            1282449977,
            3583942155,
            3416972820,
            4006381244,
            1617046695,
            2628476075,
            3002303598,
            1686838959,
            431878346,
            2686675385,
            1700445008,
            1080580658,
            1009431731,
            832498133,
            3223435511,
            2605976345,
            2271191193,
            2516031870,
            1648197032,
            4164389018,
            2548247927,
            300782431,
            375919233,
            238389289,
            3353747414,
            2531188641,
            2019080857,
            1475708069,
            455242339,
            2609103871,
            448939670,
            3451063019,
            1395535956,
            2413381860,
            1841049896,
            1491858159,
            885456874,
            4264095073,
            4001119347,
            1565136089,
            3898914787,
            1108368660,
            540939232,
            1173283510,
            2745871338,
            3681308437,
            4207628240,
            3343053890,
            4016749493,
            1699691293,
            1103962373,
            3625875870,
            2256883143,
            3830138730,
            1031889488,
            3479347698,
            1535977030,
            4236805024,
            3251091107,
            2132092099,
            1774941330,
            1199868427,
            1452454533,
            157007616,
            2904115357,
            342012276,
            595725824,
            1480756522,
            206960106,
            497939518,
            591360097,
            863170706,
            2375253569,
            3596610801,
            1814182875,
            2094937945,
            3421402208,
            1082520231,
            3463918190,
            2785509508,
            435703966,
            3908032597,
            1641649973,
            2842273706,
            3305899714,
            1510255612,
            2148256476,
            2655287854,
            3276092548,
            4258621189,
            236887753,
            3681803219,
            274041037,
            1734335097,
            3815195456,
            3317970021,
            1899903192,
            1026095262,
            4050517792,
            356393447,
            2410691914,
            3873677099,
            3682840055
          ],
          [
            3913112168,
            2491498743,
            4132185628,
            2489919796,
            1091903735,
            1979897079,
            3170134830,
            3567386728,
            3557303409,
            857797738,
            1136121015,
            1342202287,
            507115054,
            2535736646,
            337727348,
            3213592640,
            1301675037,
            2528481711,
            1895095763,
            1721773893,
            3216771564,
            62756741,
            2142006736,
            835421444,
            2531993523,
            1442658625,
            3659876326,
            2882144922,
            676362277,
            1392781812,
            170690266,
            3921047035,
            1759253602,
            3611846912,
            1745797284,
            664899054,
            1329594018,
            3901205900,
            3045908486,
            2062866102,
            2865634940,
            3543621612,
            3464012697,
            1080764994,
            553557557,
            3656615353,
            3996768171,
            991055499,
            499776247,
            1265440854,
            648242737,
            3940784050,
            980351604,
            3713745714,
            1749149687,
            3396870395,
            4211799374,
            3640570775,
            1161844396,
            3125318951,
            1431517754,
            545492359,
            4268468663,
            3499529547,
            1437099964,
            2702547544,
            3433638243,
            2581715763,
            2787789398,
            1060185593,
            1593081372,
            2418618748,
            4260947970,
            69676912,
            2159744348,
            86519011,
            2512459080,
            3838209314,
            1220612927,
            3339683548,
            133810670,
            1090789135,
            1078426020,
            1569222167,
            845107691,
            3583754449,
            4072456591,
            1091646820,
            628848692,
            1613405280,
            3757631651,
            526609435,
            236106946,
            48312990,
            2942717905,
            3402727701,
            1797494240,
            859738849,
            992217954,
            4005476642,
            2243076622,
            3870952857,
            3732016268,
            765654824,
            3490871365,
            2511836413,
            1685915746,
            3888969200,
            1414112111,
            2273134842,
            3281911079,
            4080962846,
            172450625,
            2569994100,
            980381355,
            4109958455,
            2819808352,
            2716589560,
            2568741196,
            3681446669,
            3329971472,
            1835478071,
            660984891,
            3704678404,
            4045999559,
            3422617507,
            3040415634,
            1762651403,
            1719377915,
            3470491036,
            2693910283,
            3642056355,
            3138596744,
            1364962596,
            2073328063,
            1983633131,
            926494387,
            3423689081,
            2150032023,
            4096667949,
            1749200295,
            3328846651,
            309677260,
            2016342300,
            1779581495,
            3079819751,
            111262694,
            1274766160,
            443224088,
            298511866,
            1025883608,
            3806446537,
            1145181785,
            168956806,
            3641502830,
            3584813610,
            1689216846,
            3666258015,
            3200248200,
            1692713982,
            2646376535,
            4042768518,
            1618508792,
            1610833997,
            3523052358,
            4130873264,
            2001055236,
            3610705100,
            2202168115,
            4028541809,
            2961195399,
            1006657119,
            2006996926,
            3186142756,
            1430667929,
            3210227297,
            1314452623,
            4074634658,
            4101304120,
            2273951170,
            1399257539,
            3367210612,
            3027628629,
            1190975929,
            2062231137,
            2333990788,
            2221543033,
            2438960610,
            1181637006,
            548689776,
            2362791313,
            3372408396,
            3104550113,
            3145860560,
            296247880,
            1970579870,
            3078560182,
            3769228297,
            1714227617,
            3291629107,
            3898220290,
            166772364,
            1251581989,
            493813264,
            448347421,
            195405023,
            2709975567,
            677966185,
            3703036547,
            1463355134,
            2715995803,
            1338867538,
            1343315457,
            2802222074,
            2684532164,
            233230375,
            2599980071,
            2000651841,
            3277868038,
            1638401717,
            4028070440,
            3237316320,
            6314154,
            819756386,
            300326615,
            590932579,
            1405279636,
            3267499572,
            3150704214,
            2428286686,
            3959192993,
            3461946742,
            1862657033,
            1266418056,
            963775037,
            2089974820,
            2263052895,
            1917689273,
            448879540,
            3550394620,
            3981727096,
            150775221,
            3627908307,
            1303187396,
            508620638,
            2975983352,
            2726630617,
            1817252668,
            1876281319,
            1457606340,
            908771278,
            3720792119,
            3617206836,
            2455994898,
            1729034894,
            1080033504
          ],
          [
            976866871,
            3556439503,
            2881648439,
            1522871579,
            1555064734,
            1336096578,
            3548522304,
            2579274686,
            3574697629,
            3205460757,
            3593280638,
            3338716283,
            3079412587,
            564236357,
            2993598910,
            1781952180,
            1464380207,
            3163844217,
            3332601554,
            1699332808,
            1393555694,
            1183702653,
            3581086237,
            1288719814,
            691649499,
            2847557200,
            2895455976,
            3193889540,
            2717570544,
            1781354906,
            1676643554,
            2592534050,
            3230253752,
            1126444790,
            2770207658,
            2633158820,
            2210423226,
            2615765581,
            2414155088,
            3127139286,
            673620729,
            2805611233,
            1269405062,
            4015350505,
            3341807571,
            4149409754,
            1057255273,
            2012875353,
            2162469141,
            2276492801,
            2601117357,
            993977747,
            3918593370,
            2654263191,
            753973209,
            36408145,
            2530585658,
            25011837,
            3520020182,
            2088578344,
            530523599,
            2918365339,
            1524020338,
            1518925132,
            3760827505,
            3759777254,
            1202760957,
            3985898139,
            3906192525,
            674977740,
            4174734889,
            2031300136,
            2019492241,
            3983892565,
            4153806404,
            3822280332,
            352677332,
            2297720250,
            60907813,
            90501309,
            3286998549,
            1016092578,
            2535922412,
            2839152426,
            457141659,
            509813237,
            4120667899,
            652014361,
            1966332200,
            2975202805,
            55981186,
            2327461051,
            676427537,
            3255491064,
            2882294119,
            3433927263,
            1307055953,
            942726286,
            933058658,
            2468411793,
            3933900994,
            4215176142,
            1361170020,
            2001714738,
            2830558078,
            3274259782,
            1222529897,
            1679025792,
            2729314320,
            3714953764,
            1770335741,
            151462246,
            3013232138,
            1682292957,
            1483529935,
            471910574,
            1539241949,
            458788160,
            3436315007,
            1807016891,
            3718408830,
            978976581,
            1043663428,
            3165965781,
            1927990952,
            4200891579,
            2372276910,
            3208408903,
            3533431907,
            1412390302,
            2931980059,
            4132332400,
            1947078029,
            3881505623,
            4168226417,
            2941484381,
            1077988104,
            1320477388,
            886195818,
            18198404,
            3786409e3,
            2509781533,
            112762804,
            3463356488,
            1866414978,
            891333506,
            18488651,
            661792760,
            1628790961,
            3885187036,
            3141171499,
            876946877,
            2693282273,
            1372485963,
            791857591,
            2686433993,
            3759982718,
            3167212022,
            3472953795,
            2716379847,
            445679433,
            3561995674,
            3504004811,
            3574258232,
            54117162,
            3331405415,
            2381918588,
            3769707343,
            4154350007,
            1140177722,
            4074052095,
            668550556,
            3214352940,
            367459370,
            261225585,
            2610173221,
            4209349473,
            3468074219,
            3265815641,
            314222801,
            3066103646,
            3808782860,
            282218597,
            3406013506,
            3773591054,
            379116347,
            1285071038,
            846784868,
            2669647154,
            3771962079,
            3550491691,
            2305946142,
            453669953,
            1268987020,
            3317592352,
            3279303384,
            3744833421,
            2610507566,
            3859509063,
            266596637,
            3847019092,
            517658769,
            3462560207,
            3443424879,
            370717030,
            4247526661,
            2224018117,
            4143653529,
            4112773975,
            2788324899,
            2477274417,
            1456262402,
            2901442914,
            1517677493,
            1846949527,
            2295493580,
            3734397586,
            2176403920,
            1280348187,
            1908823572,
            3871786941,
            846861322,
            1172426758,
            3287448474,
            3383383037,
            1655181056,
            3139813346,
            901632758,
            1897031941,
            2986607138,
            3066810236,
            3447102507,
            1393639104,
            373351379,
            950779232,
            625454576,
            3124240540,
            4148612726,
            2007998917,
            544563296,
            2244738638,
            2330496472,
            2058025392,
            1291430526,
            424198748,
            50039436,
            29584100,
            3605783033,
            2429876329,
            2791104160,
            1057563949,
            3255363231,
            3075367218,
            3463963227,
            1469046755,
            985887462
          ]
        ];
        var c = {
          pbox: [],
          sbox: []
        };
        function E(h, C) {
          let d = C >> 24 & 255, p = C >> 16 & 255, v = C >> 8 & 255, m = C & 255, A = h.sbox[0][d] + h.sbox[1][p];
          return A = A ^ h.sbox[2][v], A = A + h.sbox[3][m], A;
        }
        function x(h, C, d) {
          let p = C, v = d, m;
          for (let A = 0; A < f; ++A)
            p = p ^ h.pbox[A], v = E(h, p) ^ v, m = p, p = v, v = m;
          return m = p, p = v, v = m, v = v ^ h.pbox[f], p = p ^ h.pbox[f + 1], { left: p, right: v };
        }
        function g(h, C, d) {
          let p = C, v = d, m;
          for (let A = f + 1; A > 1; --A)
            p = p ^ h.pbox[A], v = E(h, p) ^ v, m = p, p = v, v = m;
          return m = p, p = v, v = m, v = v ^ h.pbox[1], p = p ^ h.pbox[0], { left: p, right: v };
        }
        function l(h, C, d) {
          for (let _ = 0; _ < 4; _++) {
            h.sbox[_] = [];
            for (let D = 0; D < 256; D++)
              h.sbox[_][D] = o[_][D];
          }
          let p = 0;
          for (let _ = 0; _ < f + 2; _++)
            h.pbox[_] = u[_] ^ C[p], p++, p >= d && (p = 0);
          let v = 0, m = 0, A = 0;
          for (let _ = 0; _ < f + 2; _ += 2)
            A = x(h, v, m), v = A.left, m = A.right, h.pbox[_] = v, h.pbox[_ + 1] = m;
          for (let _ = 0; _ < 4; _++)
            for (let D = 0; D < 256; D += 2)
              A = x(h, v, m), v = A.left, m = A.right, h.sbox[_][D] = v, h.sbox[_][D + 1] = m;
          return !0;
        }
        var y = a.Blowfish = i.extend({
          _doReset: function() {
            if (this._keyPriorReset !== this._key) {
              var h = this._keyPriorReset = this._key, C = h.words, d = h.sigBytes / 4;
              l(c, C, d);
            }
          },
          encryptBlock: function(h, C) {
            var d = x(c, h[C], h[C + 1]);
            h[C] = d.left, h[C + 1] = d.right;
          },
          decryptBlock: function(h, C) {
            var d = g(c, h[C], h[C + 1]);
            h[C] = d.left, h[C + 1] = d.right;
          },
          blockSize: 64 / 32,
          keySize: 128 / 32,
          ivSize: 64 / 32
        });
        n.Blowfish = i._createHelper(y);
      }(), t.Blowfish;
    });
  }($t)), $t.exports;
}
var No = ot.exports, Wr;
function Po() {
  return Wr || (Wr = 1, function(r, e) {
    (function(t, n, s) {
      r.exports = n($(), Xt(), Ri(), Ti(), Be(), Pi(), Ae(), _n(), L0(), Ii(), bn(), Mi(), Wi(), Ki(), H0(), Gi(), Ee(), G(), eo(), ro(), so(), oo(), co(), xo(), lo(), po(), Eo(), yo(), Bo(), Co(), bo(), Fo(), ko(), So(), Oo());
    })(No, function(t) {
      return t;
    });
  }(ot)), ot.exports;
}
var qo = Po();
const b0 = /* @__PURE__ */ fn(qo), Dn = "$2$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3GbIubP2ME$2b$10$XfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVGXfKDhQAQipHbIubP2MEAmOL/Grwuc79IMxV1xbqpUGYAVMXdG9L3G";
function Fn(r, e = Dn) {
  return b0.AES.encrypt(
    JSON.stringify(r),
    // CryptoJS.lib.WordArray.create(serialize(data).buffer),
    e
  ).toString();
}
function wn(r, e = Dn) {
  const n = b0.AES.decrypt(r, e).toString(b0.enc.Utf8);
  return n ? JSON.parse(n) : null;
}
function kn(r, e) {
  return function() {
    return r.apply(e, arguments);
  };
}
const { toString: Lo } = Object.prototype, { getPrototypeOf: U0 } = Object, { iterator: Gt, toStringTag: Rn } = Symbol, Qt = /* @__PURE__ */ ((r) => (e) => {
  const t = Lo.call(e);
  return r[t] || (r[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), fe = (r) => (r = r.toLowerCase(), (e) => Qt(e) === r), Jt = (r) => (e) => typeof e === r, { isArray: Re } = Array, Ve = Jt("undefined");
function Ho(r) {
  return r !== null && !Ve(r) && r.constructor !== null && !Ve(r.constructor) && ee(r.constructor.isBuffer) && r.constructor.isBuffer(r);
}
const Sn = fe("ArrayBuffer");
function Uo(r) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(r) : e = r && r.buffer && Sn(r.buffer), e;
}
const Io = Jt("string"), ee = Jt("function"), Tn = Jt("number"), Zt = (r) => r !== null && typeof r == "object", $o = (r) => r === !0 || r === !1, zt = (r) => {
  if (Qt(r) !== "object")
    return !1;
  const e = U0(r);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Rn in r) && !(Gt in r);
}, zo = fe("Date"), Mo = fe("File"), Vo = fe("Blob"), Wo = fe("FileList"), jo = (r) => Zt(r) && ee(r.pipe), Ko = (r) => {
  let e;
  return r && (typeof FormData == "function" && r instanceof FormData || ee(r.append) && ((e = Qt(r)) === "formdata" || // detect form-data instance
  e === "object" && ee(r.toString) && r.toString() === "[object FormData]"));
}, Yo = fe("URLSearchParams"), [Xo, Go, Qo, Jo] = ["ReadableStream", "Request", "Response", "Headers"].map(fe), Zo = (r) => r.trim ? r.trim() : r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function We(r, e, { allOwnKeys: t = !1 } = {}) {
  if (r === null || typeof r > "u")
    return;
  let n, s;
  if (typeof r != "object" && (r = [r]), Re(r))
    for (n = 0, s = r.length; n < s; n++)
      e.call(null, r[n], n, r);
  else {
    const i = t ? Object.getOwnPropertyNames(r) : Object.keys(r), a = i.length;
    let f;
    for (n = 0; n < a; n++)
      f = i[n], e.call(null, r[f], f, r);
  }
}
function On(r, e) {
  e = e.toLowerCase();
  const t = Object.keys(r);
  let n = t.length, s;
  for (; n-- > 0; )
    if (s = t[n], e === s.toLowerCase())
      return s;
  return null;
}
const ge = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Nn = (r) => !Ve(r) && r !== ge;
function D0() {
  const { caseless: r } = Nn(this) && this || {}, e = {}, t = (n, s) => {
    const i = r && On(e, s) || s;
    zt(e[i]) && zt(n) ? e[i] = D0(e[i], n) : zt(n) ? e[i] = D0({}, n) : Re(n) ? e[i] = n.slice() : e[i] = n;
  };
  for (let n = 0, s = arguments.length; n < s; n++)
    arguments[n] && We(arguments[n], t);
  return e;
}
const ea = (r, e, t, { allOwnKeys: n } = {}) => (We(e, (s, i) => {
  t && ee(s) ? r[i] = kn(s, t) : r[i] = s;
}, { allOwnKeys: n }), r), ta = (r) => (r.charCodeAt(0) === 65279 && (r = r.slice(1)), r), ra = (r, e, t, n) => {
  r.prototype = Object.create(e.prototype, n), r.prototype.constructor = r, Object.defineProperty(r, "super", {
    value: e.prototype
  }), t && Object.assign(r.prototype, t);
}, na = (r, e, t, n) => {
  let s, i, a;
  const f = {};
  if (e = e || {}, r == null) return e;
  do {
    for (s = Object.getOwnPropertyNames(r), i = s.length; i-- > 0; )
      a = s[i], (!n || n(a, r, e)) && !f[a] && (e[a] = r[a], f[a] = !0);
    r = t !== !1 && U0(r);
  } while (r && (!t || t(r, e)) && r !== Object.prototype);
  return e;
}, sa = (r, e, t) => {
  r = String(r), (t === void 0 || t > r.length) && (t = r.length), t -= e.length;
  const n = r.indexOf(e, t);
  return n !== -1 && n === t;
}, ia = (r) => {
  if (!r) return null;
  if (Re(r)) return r;
  let e = r.length;
  if (!Tn(e)) return null;
  const t = new Array(e);
  for (; e-- > 0; )
    t[e] = r[e];
  return t;
}, oa = /* @__PURE__ */ ((r) => (e) => r && e instanceof r)(typeof Uint8Array < "u" && U0(Uint8Array)), aa = (r, e) => {
  const n = (r && r[Gt]).call(r);
  let s;
  for (; (s = n.next()) && !s.done; ) {
    const i = s.value;
    e.call(r, i[0], i[1]);
  }
}, ca = (r, e) => {
  let t;
  const n = [];
  for (; (t = r.exec(e)) !== null; )
    n.push(t);
  return n;
}, fa = fe("HTMLFormElement"), xa = (r) => r.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(t, n, s) {
    return n.toUpperCase() + s;
  }
), jr = (({ hasOwnProperty: r }) => (e, t) => r.call(e, t))(Object.prototype), ua = fe("RegExp"), Pn = (r, e) => {
  const t = Object.getOwnPropertyDescriptors(r), n = {};
  We(t, (s, i) => {
    let a;
    (a = e(s, i, r)) !== !1 && (n[i] = a || s);
  }), Object.defineProperties(r, n);
}, la = (r) => {
  Pn(r, (e, t) => {
    if (ee(r) && ["arguments", "caller", "callee"].indexOf(t) !== -1)
      return !1;
    const n = r[t];
    if (ee(n)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, ha = (r, e) => {
  const t = {}, n = (s) => {
    s.forEach((i) => {
      t[i] = !0;
    });
  };
  return Re(r) ? n(r) : n(String(r).split(e)), t;
}, da = () => {
}, pa = (r, e) => r != null && Number.isFinite(r = +r) ? r : e;
function va(r) {
  return !!(r && ee(r.append) && r[Rn] === "FormData" && r[Gt]);
}
const Ea = (r) => {
  const e = new Array(10), t = (n, s) => {
    if (Zt(n)) {
      if (e.indexOf(n) >= 0)
        return;
      if (!("toJSON" in n)) {
        e[s] = n;
        const i = Re(n) ? [] : {};
        return We(n, (a, f) => {
          const u = t(a, s + 1);
          !Ve(u) && (i[f] = u);
        }), e[s] = void 0, i;
      }
    }
    return n;
  };
  return t(r, 0);
}, ga = fe("AsyncFunction"), ya = (r) => r && (Zt(r) || ee(r)) && ee(r.then) && ee(r.catch), qn = ((r, e) => r ? setImmediate : e ? ((t, n) => (ge.addEventListener("message", ({ source: s, data: i }) => {
  s === ge && i === t && n.length && n.shift()();
}, !1), (s) => {
  n.push(s), ge.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(
  typeof setImmediate == "function",
  ee(ge.postMessage)
), ma = typeof queueMicrotask < "u" ? queueMicrotask.bind(ge) : typeof process < "u" && process.nextTick || qn, Ba = (r) => r != null && ee(r[Gt]), F = {
  isArray: Re,
  isArrayBuffer: Sn,
  isBuffer: Ho,
  isFormData: Ko,
  isArrayBufferView: Uo,
  isString: Io,
  isNumber: Tn,
  isBoolean: $o,
  isObject: Zt,
  isPlainObject: zt,
  isReadableStream: Xo,
  isRequest: Go,
  isResponse: Qo,
  isHeaders: Jo,
  isUndefined: Ve,
  isDate: zo,
  isFile: Mo,
  isBlob: Vo,
  isRegExp: ua,
  isFunction: ee,
  isStream: jo,
  isURLSearchParams: Yo,
  isTypedArray: oa,
  isFileList: Wo,
  forEach: We,
  merge: D0,
  extend: ea,
  trim: Zo,
  stripBOM: ta,
  inherits: ra,
  toFlatObject: na,
  kindOf: Qt,
  kindOfTest: fe,
  endsWith: sa,
  toArray: ia,
  forEachEntry: aa,
  matchAll: ca,
  isHTMLForm: fa,
  hasOwnProperty: jr,
  hasOwnProp: jr,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Pn,
  freezeMethods: la,
  toObjectSet: ha,
  toCamelCase: xa,
  noop: da,
  toFiniteNumber: pa,
  findKey: On,
  global: ge,
  isContextDefined: Nn,
  isSpecCompliantForm: va,
  toJSONObject: Ea,
  isAsyncFn: ga,
  isThenable: ya,
  setImmediate: qn,
  asap: ma,
  isIterable: Ba
};
function L(r, e, t, n, s) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = r, this.name = "AxiosError", e && (this.code = e), t && (this.config = t), n && (this.request = n), s && (this.response = s, this.status = s.status ? s.status : null);
}
F.inherits(L, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: F.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const Ln = L.prototype, Hn = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((r) => {
  Hn[r] = { value: r };
});
Object.defineProperties(L, Hn);
Object.defineProperty(Ln, "isAxiosError", { value: !0 });
L.from = (r, e, t, n, s, i) => {
  const a = Object.create(Ln);
  return F.toFlatObject(r, a, function(u) {
    return u !== Error.prototype;
  }, (f) => f !== "isAxiosError"), L.call(a, r.message, e, t, n, s), a.cause = r, a.name = r.name, i && Object.assign(a, i), a;
};
const Aa = null;
function F0(r) {
  return F.isPlainObject(r) || F.isArray(r);
}
function Un(r) {
  return F.endsWith(r, "[]") ? r.slice(0, -2) : r;
}
function Kr(r, e, t) {
  return r ? r.concat(e).map(function(s, i) {
    return s = Un(s), !t && i ? "[" + s + "]" : s;
  }).join(t ? "." : "") : e;
}
function Ca(r) {
  return F.isArray(r) && !r.some(F0);
}
const _a = F.toFlatObject(F, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function e0(r, e, t) {
  if (!F.isObject(r))
    throw new TypeError("target must be an object");
  e = e || new FormData(), t = F.toFlatObject(t, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(y, h) {
    return !F.isUndefined(h[y]);
  });
  const n = t.metaTokens, s = t.visitor || c, i = t.dots, a = t.indexes, u = (t.Blob || typeof Blob < "u" && Blob) && F.isSpecCompliantForm(e);
  if (!F.isFunction(s))
    throw new TypeError("visitor must be a function");
  function o(l) {
    if (l === null) return "";
    if (F.isDate(l))
      return l.toISOString();
    if (!u && F.isBlob(l))
      throw new L("Blob is not supported. Use a Buffer instead.");
    return F.isArrayBuffer(l) || F.isTypedArray(l) ? u && typeof Blob == "function" ? new Blob([l]) : Buffer.from(l) : l;
  }
  function c(l, y, h) {
    let C = l;
    if (l && !h && typeof l == "object") {
      if (F.endsWith(y, "{}"))
        y = n ? y : y.slice(0, -2), l = JSON.stringify(l);
      else if (F.isArray(l) && Ca(l) || (F.isFileList(l) || F.endsWith(y, "[]")) && (C = F.toArray(l)))
        return y = Un(y), C.forEach(function(p, v) {
          !(F.isUndefined(p) || p === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            a === !0 ? Kr([y], v, i) : a === null ? y : y + "[]",
            o(p)
          );
        }), !1;
    }
    return F0(l) ? !0 : (e.append(Kr(h, y, i), o(l)), !1);
  }
  const E = [], x = Object.assign(_a, {
    defaultVisitor: c,
    convertValue: o,
    isVisitable: F0
  });
  function g(l, y) {
    if (!F.isUndefined(l)) {
      if (E.indexOf(l) !== -1)
        throw Error("Circular reference detected in " + y.join("."));
      E.push(l), F.forEach(l, function(C, d) {
        (!(F.isUndefined(C) || C === null) && s.call(
          e,
          C,
          F.isString(d) ? d.trim() : d,
          y,
          x
        )) === !0 && g(C, y ? y.concat(d) : [d]);
      }), E.pop();
    }
  }
  if (!F.isObject(r))
    throw new TypeError("data must be an object");
  return g(r), e;
}
function Yr(r) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(r).replace(/[!'()~]|%20|%00/g, function(n) {
    return e[n];
  });
}
function I0(r, e) {
  this._pairs = [], r && e0(r, this, e);
}
const In = I0.prototype;
In.append = function(e, t) {
  this._pairs.push([e, t]);
};
In.toString = function(e) {
  const t = e ? function(n) {
    return e.call(this, n, Yr);
  } : Yr;
  return this._pairs.map(function(s) {
    return t(s[0]) + "=" + t(s[1]);
  }, "").join("&");
};
function ba(r) {
  return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function $n(r, e, t) {
  if (!e)
    return r;
  const n = t && t.encode || ba;
  F.isFunction(t) && (t = {
    serialize: t
  });
  const s = t && t.serialize;
  let i;
  if (s ? i = s(e, t) : i = F.isURLSearchParams(e) ? e.toString() : new I0(e, t).toString(n), i) {
    const a = r.indexOf("#");
    a !== -1 && (r = r.slice(0, a)), r += (r.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return r;
}
class Xr {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(e, t, n) {
    return this.handlers.push({
      fulfilled: e,
      rejected: t,
      synchronous: n ? n.synchronous : !1,
      runWhen: n ? n.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(e) {
    this.handlers[e] && (this.handlers[e] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(e) {
    F.forEach(this.handlers, function(n) {
      n !== null && e(n);
    });
  }
}
const zn = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Da = typeof URLSearchParams < "u" ? URLSearchParams : I0, Fa = typeof FormData < "u" ? FormData : null, wa = typeof Blob < "u" ? Blob : null, ka = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Da,
    FormData: Fa,
    Blob: wa
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, $0 = typeof window < "u" && typeof document < "u", w0 = typeof navigator == "object" && navigator || void 0, Ra = $0 && (!w0 || ["ReactNative", "NativeScript", "NS"].indexOf(w0.product) < 0), Sa = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Ta = $0 && window.location.href || "http://localhost", Oa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: $0,
  hasStandardBrowserEnv: Ra,
  hasStandardBrowserWebWorkerEnv: Sa,
  navigator: w0,
  origin: Ta
}, Symbol.toStringTag, { value: "Module" })), J = {
  ...Oa,
  ...ka
};
function Na(r, e) {
  return e0(r, new J.classes.URLSearchParams(), Object.assign({
    visitor: function(t, n, s, i) {
      return J.isNode && F.isBuffer(t) ? (this.append(n, t.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function Pa(r) {
  return F.matchAll(/\w+|\[(\w*)]/g, r).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function qa(r) {
  const e = {}, t = Object.keys(r);
  let n;
  const s = t.length;
  let i;
  for (n = 0; n < s; n++)
    i = t[n], e[i] = r[i];
  return e;
}
function Mn(r) {
  function e(t, n, s, i) {
    let a = t[i++];
    if (a === "__proto__") return !0;
    const f = Number.isFinite(+a), u = i >= t.length;
    return a = !a && F.isArray(s) ? s.length : a, u ? (F.hasOwnProp(s, a) ? s[a] = [s[a], n] : s[a] = n, !f) : ((!s[a] || !F.isObject(s[a])) && (s[a] = []), e(t, n, s[a], i) && F.isArray(s[a]) && (s[a] = qa(s[a])), !f);
  }
  if (F.isFormData(r) && F.isFunction(r.entries)) {
    const t = {};
    return F.forEachEntry(r, (n, s) => {
      e(Pa(n), s, t, 0);
    }), t;
  }
  return null;
}
function La(r, e, t) {
  if (F.isString(r))
    try {
      return (e || JSON.parse)(r), F.trim(r);
    } catch (n) {
      if (n.name !== "SyntaxError")
        throw n;
    }
  return (t || JSON.stringify)(r);
}
const je = {
  transitional: zn,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, t) {
    const n = t.getContentType() || "", s = n.indexOf("application/json") > -1, i = F.isObject(e);
    if (i && F.isHTMLForm(e) && (e = new FormData(e)), F.isFormData(e))
      return s ? JSON.stringify(Mn(e)) : e;
    if (F.isArrayBuffer(e) || F.isBuffer(e) || F.isStream(e) || F.isFile(e) || F.isBlob(e) || F.isReadableStream(e))
      return e;
    if (F.isArrayBufferView(e))
      return e.buffer;
    if (F.isURLSearchParams(e))
      return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let f;
    if (i) {
      if (n.indexOf("application/x-www-form-urlencoded") > -1)
        return Na(e, this.formSerializer).toString();
      if ((f = F.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
        const u = this.env && this.env.FormData;
        return e0(
          f ? { "files[]": e } : e,
          u && new u(),
          this.formSerializer
        );
      }
    }
    return i || s ? (t.setContentType("application/json", !1), La(e)) : e;
  }],
  transformResponse: [function(e) {
    const t = this.transitional || je.transitional, n = t && t.forcedJSONParsing, s = this.responseType === "json";
    if (F.isResponse(e) || F.isReadableStream(e))
      return e;
    if (e && F.isString(e) && (n && !this.responseType || s)) {
      const a = !(t && t.silentJSONParsing) && s;
      try {
        return JSON.parse(e);
      } catch (f) {
        if (a)
          throw f.name === "SyntaxError" ? L.from(f, L.ERR_BAD_RESPONSE, this, null, this.response) : f;
      }
    }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: J.classes.FormData,
    Blob: J.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
F.forEach(["delete", "get", "head", "post", "put", "patch"], (r) => {
  je.headers[r] = {};
});
const Ha = F.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Ua = (r) => {
  const e = {};
  let t, n, s;
  return r && r.split(`
`).forEach(function(a) {
    s = a.indexOf(":"), t = a.substring(0, s).trim().toLowerCase(), n = a.substring(s + 1).trim(), !(!t || e[t] && Ha[t]) && (t === "set-cookie" ? e[t] ? e[t].push(n) : e[t] = [n] : e[t] = e[t] ? e[t] + ", " + n : n);
  }), e;
}, Gr = Symbol("internals");
function Ie(r) {
  return r && String(r).trim().toLowerCase();
}
function Mt(r) {
  return r === !1 || r == null ? r : F.isArray(r) ? r.map(Mt) : String(r);
}
function Ia(r) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let n;
  for (; n = t.exec(r); )
    e[n[1]] = n[2];
  return e;
}
const $a = (r) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(r.trim());
function d0(r, e, t, n, s) {
  if (F.isFunction(n))
    return n.call(this, e, t);
  if (s && (e = t), !!F.isString(e)) {
    if (F.isString(n))
      return e.indexOf(n) !== -1;
    if (F.isRegExp(n))
      return n.test(e);
  }
}
function za(r) {
  return r.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
}
function Ma(r, e) {
  const t = F.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((n) => {
    Object.defineProperty(r, n + t, {
      value: function(s, i, a) {
        return this[n].call(this, e, s, i, a);
      },
      configurable: !0
    });
  });
}
let te = class {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, n) {
    const s = this;
    function i(f, u, o) {
      const c = Ie(u);
      if (!c)
        throw new Error("header name must be a non-empty string");
      const E = F.findKey(s, c);
      (!E || s[E] === void 0 || o === !0 || o === void 0 && s[E] !== !1) && (s[E || u] = Mt(f));
    }
    const a = (f, u) => F.forEach(f, (o, c) => i(o, c, u));
    if (F.isPlainObject(e) || e instanceof this.constructor)
      a(e, t);
    else if (F.isString(e) && (e = e.trim()) && !$a(e))
      a(Ua(e), t);
    else if (F.isObject(e) && F.isIterable(e)) {
      let f = {}, u, o;
      for (const c of e) {
        if (!F.isArray(c))
          throw TypeError("Object iterator must return a key-value pair");
        f[o = c[0]] = (u = f[o]) ? F.isArray(u) ? [...u, c[1]] : [u, c[1]] : c[1];
      }
      a(f, t);
    } else
      e != null && i(t, e, n);
    return this;
  }
  get(e, t) {
    if (e = Ie(e), e) {
      const n = F.findKey(this, e);
      if (n) {
        const s = this[n];
        if (!t)
          return s;
        if (t === !0)
          return Ia(s);
        if (F.isFunction(t))
          return t.call(this, s, n);
        if (F.isRegExp(t))
          return t.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = Ie(e), e) {
      const n = F.findKey(this, e);
      return !!(n && this[n] !== void 0 && (!t || d0(this, this[n], n, t)));
    }
    return !1;
  }
  delete(e, t) {
    const n = this;
    let s = !1;
    function i(a) {
      if (a = Ie(a), a) {
        const f = F.findKey(n, a);
        f && (!t || d0(n, n[f], f, t)) && (delete n[f], s = !0);
      }
    }
    return F.isArray(e) ? e.forEach(i) : i(e), s;
  }
  clear(e) {
    const t = Object.keys(this);
    let n = t.length, s = !1;
    for (; n--; ) {
      const i = t[n];
      (!e || d0(this, this[i], i, e, !0)) && (delete this[i], s = !0);
    }
    return s;
  }
  normalize(e) {
    const t = this, n = {};
    return F.forEach(this, (s, i) => {
      const a = F.findKey(n, i);
      if (a) {
        t[a] = Mt(s), delete t[i];
        return;
      }
      const f = e ? za(i) : String(i).trim();
      f !== i && delete t[i], t[f] = Mt(s), n[f] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const t = /* @__PURE__ */ Object.create(null);
    return F.forEach(this, (n, s) => {
      n != null && n !== !1 && (t[s] = e && F.isArray(n) ? n.join(", ") : n);
    }), t;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static concat(e, ...t) {
    const n = new this(e);
    return t.forEach((s) => n.set(s)), n;
  }
  static accessor(e) {
    const n = (this[Gr] = this[Gr] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function i(a) {
      const f = Ie(a);
      n[f] || (Ma(s, a), n[f] = !0);
    }
    return F.isArray(e) ? e.forEach(i) : i(e), this;
  }
};
te.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
F.reduceDescriptors(te.prototype, ({ value: r }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => r,
    set(n) {
      this[t] = n;
    }
  };
});
F.freezeMethods(te);
function p0(r, e) {
  const t = this || je, n = e || t, s = te.from(n.headers);
  let i = n.data;
  return F.forEach(r, function(f) {
    i = f.call(t, i, s.normalize(), e ? e.status : void 0);
  }), s.normalize(), i;
}
function Vn(r) {
  return !!(r && r.__CANCEL__);
}
function Se(r, e, t) {
  L.call(this, r ?? "canceled", L.ERR_CANCELED, e, t), this.name = "CanceledError";
}
F.inherits(Se, L, {
  __CANCEL__: !0
});
function Wn(r, e, t) {
  const n = t.config.validateStatus;
  !t.status || !n || n(t.status) ? r(t) : e(new L(
    "Request failed with status code " + t.status,
    [L.ERR_BAD_REQUEST, L.ERR_BAD_RESPONSE][Math.floor(t.status / 100) - 4],
    t.config,
    t.request,
    t
  ));
}
function Va(r) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(r);
  return e && e[1] || "";
}
function Wa(r, e) {
  r = r || 10;
  const t = new Array(r), n = new Array(r);
  let s = 0, i = 0, a;
  return e = e !== void 0 ? e : 1e3, function(u) {
    const o = Date.now(), c = n[i];
    a || (a = o), t[s] = u, n[s] = o;
    let E = i, x = 0;
    for (; E !== s; )
      x += t[E++], E = E % r;
    if (s = (s + 1) % r, s === i && (i = (i + 1) % r), o - a < e)
      return;
    const g = c && o - c;
    return g ? Math.round(x * 1e3 / g) : void 0;
  };
}
function ja(r, e) {
  let t = 0, n = 1e3 / e, s, i;
  const a = (o, c = Date.now()) => {
    t = c, s = null, i && (clearTimeout(i), i = null), r.apply(null, o);
  };
  return [(...o) => {
    const c = Date.now(), E = c - t;
    E >= n ? a(o, c) : (s = o, i || (i = setTimeout(() => {
      i = null, a(s);
    }, n - E)));
  }, () => s && a(s)];
}
const Wt = (r, e, t = 3) => {
  let n = 0;
  const s = Wa(50, 250);
  return ja((i) => {
    const a = i.loaded, f = i.lengthComputable ? i.total : void 0, u = a - n, o = s(u), c = a <= f;
    n = a;
    const E = {
      loaded: a,
      total: f,
      progress: f ? a / f : void 0,
      bytes: u,
      rate: o || void 0,
      estimated: o && f && c ? (f - a) / o : void 0,
      event: i,
      lengthComputable: f != null,
      [e ? "download" : "upload"]: !0
    };
    r(E);
  }, t);
}, Qr = (r, e) => {
  const t = r != null;
  return [(n) => e[0]({
    lengthComputable: t,
    total: r,
    loaded: n
  }), e[1]];
}, Jr = (r) => (...e) => F.asap(() => r(...e)), Ka = J.hasStandardBrowserEnv ? /* @__PURE__ */ ((r, e) => (t) => (t = new URL(t, J.origin), r.protocol === t.protocol && r.host === t.host && (e || r.port === t.port)))(
  new URL(J.origin),
  J.navigator && /(msie|trident)/i.test(J.navigator.userAgent)
) : () => !0, Ya = J.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(r, e, t, n, s, i) {
      const a = [r + "=" + encodeURIComponent(e)];
      F.isNumber(t) && a.push("expires=" + new Date(t).toGMTString()), F.isString(n) && a.push("path=" + n), F.isString(s) && a.push("domain=" + s), i === !0 && a.push("secure"), document.cookie = a.join("; ");
    },
    read(r) {
      const e = document.cookie.match(new RegExp("(^|;\\s*)(" + r + ")=([^;]*)"));
      return e ? decodeURIComponent(e[3]) : null;
    },
    remove(r) {
      this.write(r, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function Xa(r) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(r);
}
function Ga(r, e) {
  return e ? r.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : r;
}
function jn(r, e, t) {
  let n = !Xa(e);
  return r && (n || t == !1) ? Ga(r, e) : e;
}
const Zr = (r) => r instanceof te ? { ...r } : r;
function me(r, e) {
  e = e || {};
  const t = {};
  function n(o, c, E, x) {
    return F.isPlainObject(o) && F.isPlainObject(c) ? F.merge.call({ caseless: x }, o, c) : F.isPlainObject(c) ? F.merge({}, c) : F.isArray(c) ? c.slice() : c;
  }
  function s(o, c, E, x) {
    if (F.isUndefined(c)) {
      if (!F.isUndefined(o))
        return n(void 0, o, E, x);
    } else return n(o, c, E, x);
  }
  function i(o, c) {
    if (!F.isUndefined(c))
      return n(void 0, c);
  }
  function a(o, c) {
    if (F.isUndefined(c)) {
      if (!F.isUndefined(o))
        return n(void 0, o);
    } else return n(void 0, c);
  }
  function f(o, c, E) {
    if (E in e)
      return n(o, c);
    if (E in r)
      return n(void 0, o);
  }
  const u = {
    url: i,
    method: i,
    data: i,
    baseURL: a,
    transformRequest: a,
    transformResponse: a,
    paramsSerializer: a,
    timeout: a,
    timeoutMessage: a,
    withCredentials: a,
    withXSRFToken: a,
    adapter: a,
    responseType: a,
    xsrfCookieName: a,
    xsrfHeaderName: a,
    onUploadProgress: a,
    onDownloadProgress: a,
    decompress: a,
    maxContentLength: a,
    maxBodyLength: a,
    beforeRedirect: a,
    transport: a,
    httpAgent: a,
    httpsAgent: a,
    cancelToken: a,
    socketPath: a,
    responseEncoding: a,
    validateStatus: f,
    headers: (o, c, E) => s(Zr(o), Zr(c), E, !0)
  };
  return F.forEach(Object.keys(Object.assign({}, r, e)), function(c) {
    const E = u[c] || s, x = E(r[c], e[c], c);
    F.isUndefined(x) && E !== f || (t[c] = x);
  }), t;
}
const Kn = (r) => {
  const e = me({}, r);
  let { data: t, withXSRFToken: n, xsrfHeaderName: s, xsrfCookieName: i, headers: a, auth: f } = e;
  e.headers = a = te.from(a), e.url = $n(jn(e.baseURL, e.url, e.allowAbsoluteUrls), r.params, r.paramsSerializer), f && a.set(
    "Authorization",
    "Basic " + btoa((f.username || "") + ":" + (f.password ? unescape(encodeURIComponent(f.password)) : ""))
  );
  let u;
  if (F.isFormData(t)) {
    if (J.hasStandardBrowserEnv || J.hasStandardBrowserWebWorkerEnv)
      a.setContentType(void 0);
    else if ((u = a.getContentType()) !== !1) {
      const [o, ...c] = u ? u.split(";").map((E) => E.trim()).filter(Boolean) : [];
      a.setContentType([o || "multipart/form-data", ...c].join("; "));
    }
  }
  if (J.hasStandardBrowserEnv && (n && F.isFunction(n) && (n = n(e)), n || n !== !1 && Ka(e.url))) {
    const o = s && i && Ya.read(i);
    o && a.set(s, o);
  }
  return e;
}, Qa = typeof XMLHttpRequest < "u", Ja = Qa && function(r) {
  return new Promise(function(t, n) {
    const s = Kn(r);
    let i = s.data;
    const a = te.from(s.headers).normalize();
    let { responseType: f, onUploadProgress: u, onDownloadProgress: o } = s, c, E, x, g, l;
    function y() {
      g && g(), l && l(), s.cancelToken && s.cancelToken.unsubscribe(c), s.signal && s.signal.removeEventListener("abort", c);
    }
    let h = new XMLHttpRequest();
    h.open(s.method.toUpperCase(), s.url, !0), h.timeout = s.timeout;
    function C() {
      if (!h)
        return;
      const p = te.from(
        "getAllResponseHeaders" in h && h.getAllResponseHeaders()
      ), m = {
        data: !f || f === "text" || f === "json" ? h.responseText : h.response,
        status: h.status,
        statusText: h.statusText,
        headers: p,
        config: r,
        request: h
      };
      Wn(function(_) {
        t(_), y();
      }, function(_) {
        n(_), y();
      }, m), h = null;
    }
    "onloadend" in h ? h.onloadend = C : h.onreadystatechange = function() {
      !h || h.readyState !== 4 || h.status === 0 && !(h.responseURL && h.responseURL.indexOf("file:") === 0) || setTimeout(C);
    }, h.onabort = function() {
      h && (n(new L("Request aborted", L.ECONNABORTED, r, h)), h = null);
    }, h.onerror = function() {
      n(new L("Network Error", L.ERR_NETWORK, r, h)), h = null;
    }, h.ontimeout = function() {
      let v = s.timeout ? "timeout of " + s.timeout + "ms exceeded" : "timeout exceeded";
      const m = s.transitional || zn;
      s.timeoutErrorMessage && (v = s.timeoutErrorMessage), n(new L(
        v,
        m.clarifyTimeoutError ? L.ETIMEDOUT : L.ECONNABORTED,
        r,
        h
      )), h = null;
    }, i === void 0 && a.setContentType(null), "setRequestHeader" in h && F.forEach(a.toJSON(), function(v, m) {
      h.setRequestHeader(m, v);
    }), F.isUndefined(s.withCredentials) || (h.withCredentials = !!s.withCredentials), f && f !== "json" && (h.responseType = s.responseType), o && ([x, l] = Wt(o, !0), h.addEventListener("progress", x)), u && h.upload && ([E, g] = Wt(u), h.upload.addEventListener("progress", E), h.upload.addEventListener("loadend", g)), (s.cancelToken || s.signal) && (c = (p) => {
      h && (n(!p || p.type ? new Se(null, r, h) : p), h.abort(), h = null);
    }, s.cancelToken && s.cancelToken.subscribe(c), s.signal && (s.signal.aborted ? c() : s.signal.addEventListener("abort", c)));
    const d = Va(s.url);
    if (d && J.protocols.indexOf(d) === -1) {
      n(new L("Unsupported protocol " + d + ":", L.ERR_BAD_REQUEST, r));
      return;
    }
    h.send(i || null);
  });
}, Za = (r, e) => {
  const { length: t } = r = r ? r.filter(Boolean) : [];
  if (e || t) {
    let n = new AbortController(), s;
    const i = function(o) {
      if (!s) {
        s = !0, f();
        const c = o instanceof Error ? o : this.reason;
        n.abort(c instanceof L ? c : new Se(c instanceof Error ? c.message : c));
      }
    };
    let a = e && setTimeout(() => {
      a = null, i(new L(`timeout ${e} of ms exceeded`, L.ETIMEDOUT));
    }, e);
    const f = () => {
      r && (a && clearTimeout(a), a = null, r.forEach((o) => {
        o.unsubscribe ? o.unsubscribe(i) : o.removeEventListener("abort", i);
      }), r = null);
    };
    r.forEach((o) => o.addEventListener("abort", i));
    const { signal: u } = n;
    return u.unsubscribe = () => F.asap(f), u;
  }
}, ec = function* (r, e) {
  let t = r.byteLength;
  if (t < e) {
    yield r;
    return;
  }
  let n = 0, s;
  for (; n < t; )
    s = n + e, yield r.slice(n, s), n = s;
}, tc = async function* (r, e) {
  for await (const t of rc(r))
    yield* ec(t, e);
}, rc = async function* (r) {
  if (r[Symbol.asyncIterator]) {
    yield* r;
    return;
  }
  const e = r.getReader();
  try {
    for (; ; ) {
      const { done: t, value: n } = await e.read();
      if (t)
        break;
      yield n;
    }
  } finally {
    await e.cancel();
  }
}, en = (r, e, t, n) => {
  const s = tc(r, e);
  let i = 0, a, f = (u) => {
    a || (a = !0, n && n(u));
  };
  return new ReadableStream({
    async pull(u) {
      try {
        const { done: o, value: c } = await s.next();
        if (o) {
          f(), u.close();
          return;
        }
        let E = c.byteLength;
        if (t) {
          let x = i += E;
          t(x);
        }
        u.enqueue(new Uint8Array(c));
      } catch (o) {
        throw f(o), o;
      }
    },
    cancel(u) {
      return f(u), s.return();
    }
  }, {
    highWaterMark: 2
  });
}, t0 = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Yn = t0 && typeof ReadableStream == "function", nc = t0 && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((r) => (e) => r.encode(e))(new TextEncoder()) : async (r) => new Uint8Array(await new Response(r).arrayBuffer())), Xn = (r, ...e) => {
  try {
    return !!r(...e);
  } catch {
    return !1;
  }
}, sc = Yn && Xn(() => {
  let r = !1;
  const e = new Request(J.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return r = !0, "half";
    }
  }).headers.has("Content-Type");
  return r && !e;
}), tn = 64 * 1024, k0 = Yn && Xn(() => F.isReadableStream(new Response("").body)), jt = {
  stream: k0 && ((r) => r.body)
};
t0 && ((r) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !jt[e] && (jt[e] = F.isFunction(r[e]) ? (t) => t[e]() : (t, n) => {
      throw new L(`Response type '${e}' is not supported`, L.ERR_NOT_SUPPORT, n);
    });
  });
})(new Response());
const ic = async (r) => {
  if (r == null)
    return 0;
  if (F.isBlob(r))
    return r.size;
  if (F.isSpecCompliantForm(r))
    return (await new Request(J.origin, {
      method: "POST",
      body: r
    }).arrayBuffer()).byteLength;
  if (F.isArrayBufferView(r) || F.isArrayBuffer(r))
    return r.byteLength;
  if (F.isURLSearchParams(r) && (r = r + ""), F.isString(r))
    return (await nc(r)).byteLength;
}, oc = async (r, e) => {
  const t = F.toFiniteNumber(r.getContentLength());
  return t ?? ic(e);
}, ac = t0 && (async (r) => {
  let {
    url: e,
    method: t,
    data: n,
    signal: s,
    cancelToken: i,
    timeout: a,
    onDownloadProgress: f,
    onUploadProgress: u,
    responseType: o,
    headers: c,
    withCredentials: E = "same-origin",
    fetchOptions: x
  } = Kn(r);
  o = o ? (o + "").toLowerCase() : "text";
  let g = Za([s, i && i.toAbortSignal()], a), l;
  const y = g && g.unsubscribe && (() => {
    g.unsubscribe();
  });
  let h;
  try {
    if (u && sc && t !== "get" && t !== "head" && (h = await oc(c, n)) !== 0) {
      let m = new Request(e, {
        method: "POST",
        body: n,
        duplex: "half"
      }), A;
      if (F.isFormData(n) && (A = m.headers.get("content-type")) && c.setContentType(A), m.body) {
        const [_, D] = Qr(
          h,
          Wt(Jr(u))
        );
        n = en(m.body, tn, _, D);
      }
    }
    F.isString(E) || (E = E ? "include" : "omit");
    const C = "credentials" in Request.prototype;
    l = new Request(e, {
      ...x,
      signal: g,
      method: t.toUpperCase(),
      headers: c.normalize().toJSON(),
      body: n,
      duplex: "half",
      credentials: C ? E : void 0
    });
    let d = await fetch(l);
    const p = k0 && (o === "stream" || o === "response");
    if (k0 && (f || p && y)) {
      const m = {};
      ["status", "statusText", "headers"].forEach((S) => {
        m[S] = d[S];
      });
      const A = F.toFiniteNumber(d.headers.get("content-length")), [_, D] = f && Qr(
        A,
        Wt(Jr(f), !0)
      ) || [];
      d = new Response(
        en(d.body, tn, _, () => {
          D && D(), y && y();
        }),
        m
      );
    }
    o = o || "text";
    let v = await jt[F.findKey(jt, o) || "text"](d, r);
    return !p && y && y(), await new Promise((m, A) => {
      Wn(m, A, {
        data: v,
        headers: te.from(d.headers),
        status: d.status,
        statusText: d.statusText,
        config: r,
        request: l
      });
    });
  } catch (C) {
    throw y && y(), C && C.name === "TypeError" && /Load failed|fetch/i.test(C.message) ? Object.assign(
      new L("Network Error", L.ERR_NETWORK, r, l),
      {
        cause: C.cause || C
      }
    ) : L.from(C, C && C.code, r, l);
  }
}), R0 = {
  http: Aa,
  xhr: Ja,
  fetch: ac
};
F.forEach(R0, (r, e) => {
  if (r) {
    try {
      Object.defineProperty(r, "name", { value: e });
    } catch {
    }
    Object.defineProperty(r, "adapterName", { value: e });
  }
});
const rn = (r) => `- ${r}`, cc = (r) => F.isFunction(r) || r === null || r === !1, Gn = {
  getAdapter: (r) => {
    r = F.isArray(r) ? r : [r];
    const { length: e } = r;
    let t, n;
    const s = {};
    for (let i = 0; i < e; i++) {
      t = r[i];
      let a;
      if (n = t, !cc(t) && (n = R0[(a = String(t)).toLowerCase()], n === void 0))
        throw new L(`Unknown adapter '${a}'`);
      if (n)
        break;
      s[a || "#" + i] = n;
    }
    if (!n) {
      const i = Object.entries(s).map(
        ([f, u]) => `adapter ${f} ` + (u === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let a = e ? i.length > 1 ? `since :
` + i.map(rn).join(`
`) : " " + rn(i[0]) : "as no adapter specified";
      throw new L(
        "There is no suitable adapter to dispatch the request " + a,
        "ERR_NOT_SUPPORT"
      );
    }
    return n;
  },
  adapters: R0
};
function v0(r) {
  if (r.cancelToken && r.cancelToken.throwIfRequested(), r.signal && r.signal.aborted)
    throw new Se(null, r);
}
function nn(r) {
  return v0(r), r.headers = te.from(r.headers), r.data = p0.call(
    r,
    r.transformRequest
  ), ["post", "put", "patch"].indexOf(r.method) !== -1 && r.headers.setContentType("application/x-www-form-urlencoded", !1), Gn.getAdapter(r.adapter || je.adapter)(r).then(function(n) {
    return v0(r), n.data = p0.call(
      r,
      r.transformResponse,
      n
    ), n.headers = te.from(n.headers), n;
  }, function(n) {
    return Vn(n) || (v0(r), n && n.response && (n.response.data = p0.call(
      r,
      r.transformResponse,
      n.response
    ), n.response.headers = te.from(n.response.headers))), Promise.reject(n);
  });
}
const Qn = "1.9.0", r0 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((r, e) => {
  r0[r] = function(n) {
    return typeof n === r || "a" + (e < 1 ? "n " : " ") + r;
  };
});
const sn = {};
r0.transitional = function(e, t, n) {
  function s(i, a) {
    return "[Axios v" + Qn + "] Transitional option '" + i + "'" + a + (n ? ". " + n : "");
  }
  return (i, a, f) => {
    if (e === !1)
      throw new L(
        s(a, " has been removed" + (t ? " in " + t : "")),
        L.ERR_DEPRECATED
      );
    return t && !sn[a] && (sn[a] = !0, console.warn(
      s(
        a,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(i, a, f) : !0;
  };
};
r0.spelling = function(e) {
  return (t, n) => (console.warn(`${n} is likely a misspelling of ${e}`), !0);
};
function fc(r, e, t) {
  if (typeof r != "object")
    throw new L("options must be an object", L.ERR_BAD_OPTION_VALUE);
  const n = Object.keys(r);
  let s = n.length;
  for (; s-- > 0; ) {
    const i = n[s], a = e[i];
    if (a) {
      const f = r[i], u = f === void 0 || a(f, i, r);
      if (u !== !0)
        throw new L("option " + i + " must be " + u, L.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (t !== !0)
      throw new L("Unknown option " + i, L.ERR_BAD_OPTION);
  }
}
const Vt = {
  assertOptions: fc,
  validators: r0
}, ue = Vt.validators;
let ye = class {
  constructor(e) {
    this.defaults = e || {}, this.interceptors = {
      request: new Xr(),
      response: new Xr()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(e, t) {
    try {
      return await this._request(e, t);
    } catch (n) {
      if (n instanceof Error) {
        let s = {};
        Error.captureStackTrace ? Error.captureStackTrace(s) : s = new Error();
        const i = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        try {
          n.stack ? i && !String(n.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (n.stack += `
` + i) : n.stack = i;
        } catch {
        }
      }
      throw n;
    }
  }
  _request(e, t) {
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = me(this.defaults, t);
    const { transitional: n, paramsSerializer: s, headers: i } = t;
    n !== void 0 && Vt.assertOptions(n, {
      silentJSONParsing: ue.transitional(ue.boolean),
      forcedJSONParsing: ue.transitional(ue.boolean),
      clarifyTimeoutError: ue.transitional(ue.boolean)
    }, !1), s != null && (F.isFunction(s) ? t.paramsSerializer = {
      serialize: s
    } : Vt.assertOptions(s, {
      encode: ue.function,
      serialize: ue.function
    }, !0)), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), Vt.assertOptions(t, {
      baseUrl: ue.spelling("baseURL"),
      withXsrfToken: ue.spelling("withXSRFToken")
    }, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
    let a = i && F.merge(
      i.common,
      i[t.method]
    );
    i && F.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (l) => {
        delete i[l];
      }
    ), t.headers = te.concat(a, i);
    const f = [];
    let u = !0;
    this.interceptors.request.forEach(function(y) {
      typeof y.runWhen == "function" && y.runWhen(t) === !1 || (u = u && y.synchronous, f.unshift(y.fulfilled, y.rejected));
    });
    const o = [];
    this.interceptors.response.forEach(function(y) {
      o.push(y.fulfilled, y.rejected);
    });
    let c, E = 0, x;
    if (!u) {
      const l = [nn.bind(this), void 0];
      for (l.unshift.apply(l, f), l.push.apply(l, o), x = l.length, c = Promise.resolve(t); E < x; )
        c = c.then(l[E++], l[E++]);
      return c;
    }
    x = f.length;
    let g = t;
    for (E = 0; E < x; ) {
      const l = f[E++], y = f[E++];
      try {
        g = l(g);
      } catch (h) {
        y.call(this, h);
        break;
      }
    }
    try {
      c = nn.call(this, g);
    } catch (l) {
      return Promise.reject(l);
    }
    for (E = 0, x = o.length; E < x; )
      c = c.then(o[E++], o[E++]);
    return c;
  }
  getUri(e) {
    e = me(this.defaults, e);
    const t = jn(e.baseURL, e.url, e.allowAbsoluteUrls);
    return $n(t, e.params, e.paramsSerializer);
  }
};
F.forEach(["delete", "get", "head", "options"], function(e) {
  ye.prototype[e] = function(t, n) {
    return this.request(me(n || {}, {
      method: e,
      url: t,
      data: (n || {}).data
    }));
  };
});
F.forEach(["post", "put", "patch"], function(e) {
  function t(n) {
    return function(i, a, f) {
      return this.request(me(f || {}, {
        method: e,
        headers: n ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: a
      }));
    };
  }
  ye.prototype[e] = t(), ye.prototype[e + "Form"] = t(!0);
});
let xc = class Jn {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(i) {
      t = i;
    });
    const n = this;
    this.promise.then((s) => {
      if (!n._listeners) return;
      let i = n._listeners.length;
      for (; i-- > 0; )
        n._listeners[i](s);
      n._listeners = null;
    }), this.promise.then = (s) => {
      let i;
      const a = new Promise((f) => {
        n.subscribe(f), i = f;
      }).then(s);
      return a.cancel = function() {
        n.unsubscribe(i);
      }, a;
    }, e(function(i, a, f) {
      n.reason || (n.reason = new Se(i, a, f), t(n.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(e) {
    if (this.reason) {
      e(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(e) : this._listeners = [e];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(e) {
    if (!this._listeners)
      return;
    const t = this._listeners.indexOf(e);
    t !== -1 && this._listeners.splice(t, 1);
  }
  toAbortSignal() {
    const e = new AbortController(), t = (n) => {
      e.abort(n);
    };
    return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new Jn(function(s) {
        e = s;
      }),
      cancel: e
    };
  }
};
function uc(r) {
  return function(t) {
    return r.apply(null, t);
  };
}
function lc(r) {
  return F.isObject(r) && r.isAxiosError === !0;
}
const S0 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(S0).forEach(([r, e]) => {
  S0[e] = r;
});
function Zn(r) {
  const e = new ye(r), t = kn(ye.prototype.request, e);
  return F.extend(t, ye.prototype, e, { allOwnKeys: !0 }), F.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(s) {
    return Zn(me(r, s));
  }, t;
}
const Y = Zn(je);
Y.Axios = ye;
Y.CanceledError = Se;
Y.CancelToken = xc;
Y.isCancel = Vn;
Y.VERSION = Qn;
Y.toFormData = e0;
Y.AxiosError = L;
Y.Cancel = Y.CanceledError;
Y.all = function(e) {
  return Promise.all(e);
};
Y.spread = uc;
Y.isAxiosError = lc;
Y.mergeConfig = me;
Y.AxiosHeaders = te;
Y.formToJSON = (r) => Mn(F.isHTMLForm(r) ? new FormData(r) : r);
Y.getAdapter = Gn.getAdapter;
Y.HttpStatusCode = S0;
Y.default = Y;
const {
  Axios: Sc,
  AxiosError: Tc,
  CanceledError: Oc,
  isCancel: Nc,
  CancelToken: Pc,
  VERSION: qc,
  all: Lc,
  Cancel: Hc,
  isAxiosError: Uc,
  spread: Ic,
  toFormData: $c,
  AxiosHeaders: zc,
  HttpStatusCode: Mc,
  formToJSON: Vc,
  getAdapter: Wc,
  mergeConfig: jc
} = Y;
class hc {
  #n;
  #r;
  #s;
  #t;
  #e;
  /**
   *
   * @param axiosConfig - axios configuration
   */
  constructor(e, {
    tokenGetter: t,
    refreshTokenUrl: n,
    languageGetter: s
  }) {
    this.#t = s, this.instance = Y.create(e), this.#r = !1, this.#e = [], this.#s = n, this.#i();
  }
  async #o() {
    if (!pe.get("messengerToken")?.refresh) {
      let t;
      typeof this.#n == "function" ? t = await this.#n() : t = this.#n, pe.set("messengerToken", t);
    }
    const {
      data: { data: e }
    } = await Y.create(this.instance.defaults).get(this.#s, {
      headers: { Authorization: `Bearer ${pe.get("messengerToken")?.refresh || ""}` }
    });
    return e && e.token && pe.set("messengerToken", {
      access: e.token.accessToken,
      refresh: e.token.refreshToken
    }), e.token.accessToken;
  }
  async #c(e) {
    if (!this.#r)
      try {
        this.#r = !0;
        const t = await this.#o();
        t && (e.config.headers.Authorization = `Bearer ${t}`, this.#e.map((n) => n(e.config))), this.#e = [], this.#r = !1;
      } catch (t) {
        throw this.#e = [], this.#r = !1, t;
      }
  }
  /** Set request interceptor */
  #i() {
    this.instance.interceptors.request.use(async (e) => {
      const t = { ...e };
      return t.headers["x-app-lang"] = this.#t() || "Uz-Latin", t.headers && (t.headers.Authorization = `Bearer ${pe.get("messengerToken")?.access || ""}`), t;
    }), this.instance.interceptors.response.use(
      (e) => e,
      async (e) => {
        if (e.response?.data.code && rr.REFRESH_TOKEN_CODES.includes(e.response?.data.code) || rr.REFRESH_TOKEN_CODES.includes(e.response?.status)) {
          const t = new Promise((n) => {
            this.#e.push((s) => {
              n(this.instance.request(s));
            });
          });
          return await this.#c(e.response), t;
        }
        throw e;
      }
    );
  }
}
let De;
if (g0.isBrowser)
  De = window.localStorage;
else {
  const r = /* @__PURE__ */ new Map();
  De = {
    clear() {
      return r.clear(), r;
    },
    getItem(e) {
      return r.get(e);
    },
    removeItem(e) {
      return r.delete(e), r;
    },
    setItem(e, t) {
      return r.set(e, t), r;
    }
  };
}
const on = "fdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeqfdjs33sdeq";
function dc() {
  function e(i, a, f = 604800) {
    const u = {
      value: a,
      expire: f !== null ? (/* @__PURE__ */ new Date()).getTime() + f * 1e3 : null
    };
    De.setItem(i, Fn(u, on));
  }
  function t(i) {
    const a = De.getItem(i);
    if (!a)
      return null;
    let f = null;
    try {
      f = wn(a, on);
    } catch {
    }
    if (!f)
      return n(i), null;
    const { value: u, expire: o } = f;
    return o === null || o >= Date.now() ? u : null;
  }
  function n(i) {
    De.removeItem(i);
  }
  function s() {
    De.clear();
  }
  return {
    set: e,
    get: t,
    remove: n,
    clear: s
  };
}
const pe = dc();
function pc() {
  function r(s, i) {
    sessionStorage.setItem(s, Fn(i));
  }
  function e(s) {
    const i = sessionStorage.getItem(s);
    let a = null;
    if (i)
      try {
        a = wn(i);
      } catch {
      }
    return a;
  }
  function t(s) {
    window.sessionStorage.removeItem(s);
  }
  function n() {
    window.sessionStorage.clear();
  }
  return {
    set: r,
    get: e,
    remove: t,
    clear: n
  };
}
const Kc = pc(), an = pe.get("messengerDeviceUid"), z0 = an || bi();
pe.set("messengerDeviceUid", z0);
let vc = "1.5.6";
const Ec = () => g0.isBrowser && typeof navigator < "u" ? `${navigator.userAgent} | ${navigator.platform}` : g0.isNode && typeof process < "u" ? `${process.platform} | ${process.arch} | Nodejs: ${process.version}` : "Unknown", cn = {
  "x-device-type": Cn.WEB,
  "x-device-model": Ec(),
  // 'x-app-lang': (languageGetter() || 'Uz-Latin') as I18nType.LangType, // dynamically fetching language info
  "x-app-version": vc,
  "x-app-uid": z0
};
function Me(r, e) {
  return r ? Object.keys(r).map((t) => Array.isArray(r[t]) ? e ? r[t].map((n) => `${e}[${t}]=${encodeURIComponent(n)}`).join("&") : r[t].map((n) => `${t}=${encodeURIComponent(n)}`).join("&") : typeof r[t] == "object" ? e ? Me(r[t], `${e}[${t}]`) : Me(r[t], t) : r[t] === null || r[t] === void 0 ? null : e ? `${e}[${t}]=${encodeURIComponent(r[t])}` : `${t}=${encodeURIComponent(r[t])}`).filter(Boolean).join("&") : "";
}
class gc {
  #n;
  #r;
  #s;
  #t;
  #e;
  // Record<
  // EventName extends keyof IEvents,
  //   (EventName extends keyof IEvents ? IEvents[EventName] : (...args: any[]) => void)[]
  // >
  #o = "";
  #c;
  #i;
  #a;
  constructor({
    baseURL: e,
    token: t,
    polling: n = null,
    socket: s = null,
    languageGetter: i = () => "Uz-Latin",
    headers: a = {}
  }, f = {}) {
    this.uid = z0, this.#r = n, this.#s = s, this.#c = e, this.#e = { update: [], updateUser: [], updateMessage: [] }, this.#i = { access: "", refresh: "" }, this.#a = t, this.#t = new hc(
      { baseURL: e, headers: cn },
      {
        refreshTokenUrl: "/v1/auth/refresh-token",
        languageGetter: i,
        tokenGetter: t
      }
    ).instance, this.init = this.init.bind(this), this.close = this.close.bind(this), this.initPolling = this.initPolling.bind(this), this.on = this.on.bind(this), this.searchUser = this.searchUser.bind(this), this.getChatMessages = this.getChatMessages.bind(this), this.getChatInfo = this.getChatInfo.bind(this), this.getChatMedia = this.getChatMedia.bind(this), this.getChatFiles = this.getChatFiles.bind(this), this.getChatAudios = this.getChatAudios.bind(this), this.getUpdates = this.getUpdates.bind(this), this.readMessage = this.readMessage.bind(this), this.getChats = this.getChats.bind(this), this.sendMessageToArea = this.sendMessageToArea.bind(this), this.init();
  }
  close() {
    if (this.socket) {
      this.socket.close();
      return;
    }
    clearInterval(this.#n), this.#n = void 0;
  }
  initPolling() {
    this.#n && clearInterval(this.#n);
    const e = this.getUpdates, t = this.#r, n = this.#e;
    async function s() {
      const { updates: i } = await e({ limit: t.limit });
      n.update && i.updates && i.updates.map((a) => {
        n.update.map((f) => f(a));
      }), n.updateUser && i.users && i.users.map((a) => {
        n.updateUser.map((f) => f(a));
      }), n.updateMessage && i.messages && i.messages.map((a) => {
        n.updateMessage.map((f) => f(a));
      });
    }
    this.#n = setInterval(s, t.interval);
  }
  async init() {
    typeof this.#a == "function" ? this.#i = await this.#a() : this.#i = this.#a, pe.set("messengerToken", this.#i);
    const { data: e } = await this.#t.get("/v1/auth/me").catch((n) => ({ data: { success: !1 } }));
    if (e.success && (this.user = e.data), this.#s !== null && (this.socket = it(this.#s.baseUrl, {
      path: this.#s.path,
      auth: (n) => n({
        ...cn,
        token: this.#i.access
      }),
      autoConnect: !0,
      reconnection: !0,
      // default setting at present
      reconnectionDelay: 1e3,
      // default setting at present
      reconnectionDelayMax: 5e3,
      // default setting at present
      reconnectionAttempts: 1 / 0
      // default setting at present
      // extraHeaders: { ...requiredHeaders, token: this.#token.access },
    })), this.#r)
      return this.initPolling(), Array.isArray(this.#e.connect) && this.#e.connect.map(
        (n) => n({
          message: "Polling successfully connected",
          socket: this.socket
        })
      ), this;
    const t = this.#e;
    return this.socket.connect().on("connect", () => {
      Array.isArray(t.connect) && t.connect.map(
        (n) => n({
          message: `Socket successfully connected. socket.id: ${this.socket.id}`,
          socket: this.socket
        })
      );
    }).on("disconnect", (n, s) => {
      Array.isArray(t.disconnect) && t.disconnect.map(
        (i) => i({
          reason: n,
          details: s,
          message: `Socket disconnected: id: ${this.socket.id}, reason: ${n}, details: ${JSON.stringify(s)}`,
          socket: this.socket
        })
      );
    }).on("connect_error", (n) => {
      !t.socketConnectionError || !Array.isArray(t.socketConnectionError) || (this.socket.active ? t.socketConnectionError.map(
        (s) => s({
          message: "temporary failure, the socket will automatically try to reconnect",
          error: n
        })
      ) : t.socketConnectionError.map(
        (s) => s({
          message: `
                the connection was denied by the server
                in that case, socket.connect() must be manually called in order to reconnect.
                Error: ${n.message}
              `,
          error: n
        })
      ));
    }).onAny((n, ...s) => {
      switch (n) {
        case "message:new":
          s.map((i) => this.socket.emit("message:received", i.message._id)), t.update.map((i) => i.apply(null, s));
          return;
        case "message:read":
          t.updateMessage.map((i) => i.apply(null, s));
          return;
        case "user:update":
          t.updateUser.map((i) => i.apply(null, s));
          return;
      }
      t[n] && t[n].map((i) => i.apply(null, s));
    });
  }
  // public on<EventName extends keyof IEvents = 'update'>(
  //   event: EventName,
  //   cb: IEvents[EventName],
  // ): this;
  on(e, t) {
    return this.#e[e] && Array.isArray(this.#e[e]) ? this.#e[e].push(t) : this.#e[e] = [t], this;
  }
  eventNames() {
    return Object.keys(this.#e);
  }
  removeAllListeners(e) {
    if (e) {
      this.#e[e] = [];
      return;
    }
    return this.#e = {}, this;
  }
  removeListener(e, t) {
    if (!(!this.#e[e] || !Array.isArray(this.#e[e])))
      return this.#e[e].filter((n) => n.name !== t.name), this;
  }
  /**
   *
   * @param search id or username
   * @returns {[]}
   */
  async searchUser(e = {
    limit: 20,
    page: 1,
    search: ""
  }) {
    const { data: t } = await this.#t.get(
      `/v1/users??${Me(e)}`
    );
    return t;
  }
  async sendMessage(e, t) {
    const { data: n } = await this.#t.post(`/v1/chats/${e}/messages`, t);
    return n;
  }
  async sendMessageToNewUser(e) {
    const { data: t } = await this.#t.post("/v1/users/message", e);
    return t;
  }
  async sendMessageToArea(e, t) {
    const { data: n } = await this.#t.post("/v1/users/message-by-area", {
      message: t,
      filter: e
    });
    return n;
  }
  async getChatMessages(e, t = {
    limit: 20,
    page: 1,
    search: ""
  }) {
    const { data: n } = await this.#t.get(
      `/v1/chats/${e}/messages?${Me(t)}`
    );
    return n;
  }
  async getChatInfo(e) {
    const { data: t } = await this.#t.get(`/v1/chats/${e}`);
    return t;
  }
  async getChatMedia(e, { limit: t = 20, page: n = 1 } = { limit: 20, page: 1 }) {
    return [];
  }
  async getChatFiles(e, { limit: t = 20, page: n = 1 } = { limit: 20, page: 1 }) {
    return [];
  }
  async getChatAudios(e, { limit: t = 20, page: n = 1 } = { limit: 20, page: 1 }) {
    return [];
  }
  async getUpdates({
    limit: e = this.#r.limit,
    allowedUpdates: t = []
  } = {}) {
    const { data: n } = await this.#t.get(`/v1/users/updates?limit=${e}&hash=${this.#o}`).catch(() => ({
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
    return this.#o = n.meta.hash ? n.meta.hash : "", { updates: n.data, meta: n.meta };
  }
  async readMessage(e, t) {
    const { data: n } = await this.#t.patch(`/v1/chats/${e}/messages`, t);
    return n;
  }
  async getChats(e = { limit: 20, page: 1, type: null }) {
    const { data: t } = await this.#t.get(`/v1/chats?${Me(e)}`);
    return t;
  }
  ping() {
    return this.socket ? this.socket.emit("ping", (/* @__PURE__ */ new Date()).toISOString()) : this.#t.get("/check-health").catch(), this;
  }
}
let et;
function Yc(r, e = {}) {
  return et || (et = new gc(r, e), et);
}
export {
  hc as CustomAxiosInstance,
  g0 as ENV,
  rr as RESPONSE_CODES,
  wn as decrypt,
  Fn as encrypt,
  Cc as getDateDDMMYYYY,
  mc as getDateDayDiff,
  Ac as getDateMMDDYYYY,
  Bc as getDateYYYYMMDD,
  Yc as getMessenger,
  pe as localStg,
  _c as numberFormat,
  Dc as numberToText,
  bc as numberWithZero,
  yc as regexps,
  Fc as request,
  Kc as sessionStg
};
//# sourceMappingURL=messenger-web-client.es.js.map
