// node_modules/svelte/src/constants.js
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_START_FAILED = "[?";
var HYDRATION_END = "]";
var ELEMENT_IS_NAMESPACED = 1;
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;

// node_modules/svelte/src/escaping.js
var ATTR_REGEX = /[&"<]/g;
var CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped2 = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped2 += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped2 + str.substring(last);
}

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/svelte/src/internal/shared/utils.js
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var has_own_property = Object.prototype.hasOwnProperty;
var noop = () => {
};
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// node_modules/svelte/src/internal/shared/attributes.js
var replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (name === "hidden" && value !== "until-found") {
    is_boolean = true;
  }
  if (value == null || !value && is_boolean) return "";
  const normalized = has_own_property.call(replacements, name) && replacements[name].get(value) || value;
  const assignment = is_boolean ? `=""` : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function clsx2(value) {
  if (typeof value === "object") {
    return clsx(value);
  } else {
    return value ?? "";
  }
}
var whitespace = [..." 	\n\r\f\xA0\v\uFEFF"];
function to_class(value, hash2, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash2) {
    classname = classname ? classname + " " + hash2 : hash2;
  }
  if (directives) {
    for (var key of Object.keys(directives)) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css2 = "";
  for (var key of Object.keys(styles)) {
    var value = styles[key];
    if (value != null && value !== "") {
      css2 += " " + key + ": " + value + separator;
    }
  }
  return css2;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\/\*.*?\*\//g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}

// node_modules/esm-env/browser-fallback.js
var browser_fallback_default = typeof window !== "undefined";

// node_modules/esm-env/dev-fallback.js
var node_env = globalThis.process?.env?.NODE_ENV;
var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var DESTROYING = 1 << 25;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
var IS_XHTML = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;

// node_modules/svelte/src/internal/server/hydration.js
var BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
var BLOCK_OPEN_ELSE = `<!--${HYDRATION_START_ELSE}-->`;
var BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;

// node_modules/svelte/src/utils.js
var regex_return_characters = /\r/g;
function hash(str) {
  str = str.replace(regex_return_characters, "");
  let hash2 = 5381;
  let i = str.length;
  while (i--) hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return (hash2 >>> 0).toString(36);
}
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
function is_boolean_attribute(name) {
  return DOM_BOOLEAN_ATTRIBUTES.includes(name);
}
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback"
];
var STATE_CREATION_RUNES = (
  /** @type {const} */
  [
    "$state",
    "$state.raw",
    "$derived",
    "$derived.by"
  ]
);
var RUNES = (
  /** @type {const} */
  [
    ...STATE_CREATION_RUNES,
    "$state.eager",
    "$state.snapshot",
    "$props",
    "$props.id",
    "$bindable",
    "$effect",
    "$effect.pre",
    "$effect.tracking",
    "$effect.root",
    "$effect.pending",
    "$inspect",
    "$inspect().with",
    "$inspect.trace",
    "$host"
  ]
);

// node_modules/svelte/src/internal/server/abort-signal.js
var controller = null;
function abort() {
  controller?.abort(STALE_REACTION);
  controller = null;
}

// node_modules/svelte/src/internal/server/context.js
var ssr_context = null;
function set_ssr_context(v) {
  ssr_context = v;
}
function push(fn) {
  ssr_context = { p: ssr_context, c: null, r: null };
  if (dev_fallback_default) {
    ssr_context.function = fn;
    ssr_context.element = ssr_context.p?.element;
  }
}
function pop() {
  ssr_context = /** @type {SSRContext} */
  ssr_context.p;
}

// node_modules/svelte/src/internal/server/errors.js
function async_local_storage_unavailable() {
  const error = new Error(`async_local_storage_unavailable
The node API \`AsyncLocalStorage\` is not available, but is required to use async server rendering.
https://svelte.dev/e/async_local_storage_unavailable`);
  error.name = "Svelte error";
  throw error;
}
function await_invalid() {
  const error = new Error(`await_invalid
Encountered asynchronous work while rendering synchronously.
https://svelte.dev/e/await_invalid`);
  error.name = "Svelte error";
  throw error;
}
function html_deprecated() {
  const error = new Error(`html_deprecated
The \`html\` property of server render results has been deprecated. Use \`body\` instead.
https://svelte.dev/e/html_deprecated`);
  error.name = "Svelte error";
  throw error;
}
function invalid_csp() {
  const error = new Error(`invalid_csp
\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.
https://svelte.dev/e/invalid_csp`);
  error.name = "Svelte error";
  throw error;
}
function invalid_id_prefix() {
  const error = new Error(`invalid_id_prefix
The \`idPrefix\` option cannot include \`--\`.
https://svelte.dev/e/invalid_id_prefix`);
  error.name = "Svelte error";
  throw error;
}
function server_context_required() {
  const error = new Error(`server_context_required
Could not resolve \`render\` context.
https://svelte.dev/e/server_context_required`);
  error.name = "Svelte error";
  throw error;
}

// node_modules/svelte/src/internal/server/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function unresolved_hydratable(key, stack) {
  if (dev_fallback_default) {
    console.warn(
      `%c[svelte] unresolved_hydratable
%cA \`hydratable\` value with key \`${key}\` was created, but at least part of it was not used during the render.

The \`hydratable\` was initialized in:
${stack}
https://svelte.dev/e/unresolved_hydratable`,
      bold,
      normal
    );
  } else {
    console.warn(`https://svelte.dev/e/unresolved_hydratable`);
  }
}

// node_modules/svelte/src/internal/server/render-context.js
var current_render = null;
var context = null;
function get_render_context() {
  const store = context ?? als?.getStore();
  if (!store) {
    server_context_required();
  }
  return store;
}
async function with_render_context(fn) {
  context = {
    hydratable: {
      lookup: /* @__PURE__ */ new Map(),
      comparisons: [],
      unresolved_promises: /* @__PURE__ */ new Map()
    }
  };
  if (in_webcontainer()) {
    const { promise, resolve } = deferred();
    const previous_render = current_render;
    current_render = promise;
    await previous_render;
    return fn().finally(resolve);
  }
  try {
    if (als === null) {
      async_local_storage_unavailable();
    }
    return als.run(context, fn);
  } finally {
    context = null;
  }
}
var als = null;
var als_import = null;
function init_render_context() {
  als_import ??= import("node:async_hooks").then((hooks) => {
    als = new hooks.AsyncLocalStorage();
  }).then(noop, noop);
  return als_import;
}
function in_webcontainer() {
  return !!globalThis.process?.versions?.webcontainer;
}

// node_modules/svelte/src/internal/server/crypto.js
var text_encoder;
var crypto;
var obfuscated_import = (module_name) => import(
  /* @vite-ignore */
  module_name
);
async function sha256(data) {
  text_encoder ??= new TextEncoder();
  crypto ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (
    // @ts-ignore - we don't install node types in the prod build
    // don't use import('node:crypto') directly because static analysers will think we rely on node when we don't
    (await obfuscated_import("node:crypto")).webcrypto
  );
  const hash_buffer = await crypto.subtle.digest("SHA-256", text_encoder.encode(data));
  return base64_encode(hash_buffer);
}
function base64_encode(bytes) {
  if (!browser_fallback_default && globalThis.Buffer) {
    return globalThis.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// node_modules/devalue/src/constants.js
var MAX_ARRAY_LEN = 2 ** 32 - 1;
var MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;

// node_modules/devalue/src/utils.js
var escaped = {
  "<": "\\u003C",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var DevalueError = class extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   * @param {any} [value] - The value that failed to be serialized
   * @param {any} [root] - The root value being serialized
   */
  constructor(message, keys, value, root) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
    this.value = value;
    this.root = root;
  }
};
function is_primitive(thing) {
  return thing === null || typeof thing !== "object" && typeof thing !== "function";
}
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result2 = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result2 += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result2 + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
var is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(n) {
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  if (n > MAX_ARRAY_INDEX) return false;
  return true;
}
function is_valid_array_index_string(s) {
  if (s.length === 0) return false;
  if (s.length > 1 && s.charCodeAt(0) === 48) return false;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return is_valid_array_index(+s);
}
function array_index_cut(keys) {
  for (var i = keys.length - 1; i >= 0; i--) {
    if (is_valid_array_index_string(keys[i])) {
      break;
    }
  }
  return i + 1;
}
function valid_array_indices(array) {
  const keys = Object.keys(array);
  keys.length = array_index_cut(keys);
  return keys;
}

// node_modules/devalue/src/uneval.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function uneval(value, replacer) {
  const counts = /* @__PURE__ */ new Map();
  const keys = [];
  const custom = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (!is_primitive(thing)) {
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (replacer) {
        const str2 = replacer(thing, (value2) => uneval(value2, replacer));
        if (typeof str2 === "string") {
          custom.set(thing, str2);
          return;
        }
      }
      if (typeof thing === "function") {
        throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
        case "URL":
        case "URLSearchParams":
          return;
        case "Array":
          thing.forEach((value2, i) => {
            keys.push(`[${i}]`);
            walk(value2);
            keys.pop();
          });
          break;
        case "Set":
          Array.from(thing).forEach(walk);
          break;
        case "Map":
          for (const [key, value2] of thing) {
            keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
            walk(key);
            walk(value2);
            keys.pop();
          }
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
        case "DataView":
          walk(thing.buffer);
          return;
        case "ArrayBuffer":
          return;
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          return;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
          }
          for (const key of Object.keys(thing)) {
            if (key === "__proto__") {
              throw new DevalueError(
                `Cannot stringify objects with __proto__ keys`,
                keys,
                thing,
                value
              );
            }
            keys.push(stringify_key(key));
            walk(thing[key]);
            keys.pop();
          }
      }
    } else if (typeof thing === "symbol") {
      throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], get_name(i));
  });
  function stringify2(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (is_primitive(thing)) {
      return stringify_primitive(thing);
    }
    if (custom.has(thing)) {
      return custom.get(thing);
    }
    const type = get_type(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
      case "BigInt":
        return `Object(${stringify2(thing.valueOf())})`;
      case "RegExp":
        const { source: source2, flags: flags2 } = thing;
        return flags2 ? `new RegExp(${stringify_string(source2)},"${flags2}")` : `new RegExp(${stringify_string(source2)})`;
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "URL":
        return `new URL(${stringify_string(thing.toString())})`;
      case "URLSearchParams":
        return `new URLSearchParams(${stringify_string(thing.toString())})`;
      case "Array": {
        let has_holes = false;
        let result2 = "[";
        for (let i = 0; i < thing.length; i += 1) {
          if (i > 0) result2 += ",";
          if (Object.hasOwn(thing, i)) {
            result2 += stringify2(thing[i]);
          } else if (!has_holes) {
            const populated_keys = valid_array_indices(
              /** @type {any[]} */
              thing
            );
            const population = populated_keys.length;
            const d = String(thing.length).length;
            const hole_cost = thing.length + 2;
            const sparse_cost = 25 + d + population * (d + 2);
            if (hole_cost > sparse_cost) {
              const entries = populated_keys.map((k) => `${k}:${stringify2(thing[k])}`).join(",");
              return `Object.assign(Array(${thing.length}),{${entries}})`;
            }
            has_holes = true;
          }
        }
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return result2 + tail + "]";
      }
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify2).join(",")}])`;
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Float16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array": {
        let str2 = `new ${type}`;
        if (!names.has(thing.buffer)) {
          str2 += `([${stringify_typed_array_elements(type, thing.buffer)}])`;
        } else {
          str2 += `(${stringify2(thing.buffer)})`;
        }
        if (thing.byteLength !== thing.buffer.byteLength) {
          const start = thing.byteOffset / thing.BYTES_PER_ELEMENT;
          const end = start + thing.length;
          str2 += `.subarray(${start},${end})`;
        }
        return str2;
      }
      case "DataView": {
        let str2 = `new DataView`;
        if (!names.has(thing.buffer)) {
          str2 += `(new Uint8Array([${new Uint8Array(thing.buffer)}]).buffer`;
        } else {
          str2 += `(${stringify2(thing.buffer)}`;
        }
        if (thing.byteLength !== thing.buffer.byteLength) {
          str2 += `,${thing.byteOffset},${thing.byteLength}`;
        }
        return str2 + ")";
      }
      case "ArrayBuffer": {
        const ui8 = new Uint8Array(thing);
        return `new Uint8Array([${ui8.toString()}]).buffer`;
      }
      case "Temporal.Duration":
      case "Temporal.Instant":
      case "Temporal.PlainDate":
      case "Temporal.PlainTime":
      case "Temporal.PlainDateTime":
      case "Temporal.PlainMonthDay":
      case "Temporal.PlainYearMonth":
      case "Temporal.ZonedDateTime":
        return `${type}.from(${stringify_string(thing.toString())})`;
      default:
        const keys2 = Object.keys(thing);
        const obj = keys2.map((key) => `${safe_key(key)}:${stringify2(thing[key])}`).join(",");
        const proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return keys2.length > 0 ? `{${obj},__proto__:null}` : `{__proto__:null}`;
        }
        return `{${obj}}`;
    }
  }
  const str = stringify2(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    const reconstructions = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (custom.has(thing)) {
        values.push(
          /** @type {string} */
          custom.get(thing)
        );
        return;
      }
      if (is_primitive(thing)) {
        values.push(stringify_primitive(thing));
        return;
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          values.push(`Object(${stringify2(thing.valueOf())})`);
          break;
        case "RegExp":
          const { source: source2, flags: flags2 } = thing;
          const regexp = flags2 ? `new RegExp(${stringify_string(source2)},"${flags2}")` : `new RegExp(${stringify_string(source2)})`;
          values.push(regexp);
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "URL":
          values.push(`new URL(${stringify_string(thing.toString())})`);
          break;
        case "URLSearchParams":
          values.push(`new URLSearchParams(${stringify_string(thing.toString())})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify2(v)}`);
          });
          break;
        case "Set": {
          values.push(`new Set`);
          const adds = Array.from(thing).map((v) => `.add(${stringify2(v)})`);
          if (adds.length > 0) statements.push(name + adds.join(""));
          break;
        }
        case "Map": {
          values.push(`new Map`);
          const sets = Array.from(thing).map(
            ([k, v]) => `.set(${stringify2(k)}, ${stringify2(v)})`
          );
          if (sets.length > 0) statements.push(name + sets.join(""));
          break;
        }
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          let str2 = `new ${type}`;
          if (!names.has(thing.buffer)) {
            str2 += `([${stringify_typed_array_elements(type, thing.buffer)}])`;
          } else {
            str2 += `(${stringify2(thing.buffer)})`;
          }
          if (thing.byteLength !== thing.buffer.byteLength) {
            const start = thing.byteOffset / thing.BYTES_PER_ELEMENT;
            const end = start + thing.length;
            str2 += `.subarray(${start},${end})`;
          }
          values.push(`{}`);
          reconstructions.push(`${name}=${str2}`);
          break;
        }
        case "DataView": {
          let str2 = `new DataView`;
          if (!names.has(thing.buffer)) {
            str2 += `(new Uint8Array([${new Uint8Array(thing.buffer)}]).buffer`;
          } else {
            str2 += `(${stringify2(thing.buffer)}`;
          }
          if (thing.byteLength !== thing.buffer.byteLength) {
            str2 += `,${thing.byteOffset},${thing.byteLength}`;
          }
          str2 += ")";
          values.push(`{}`);
          reconstructions.push(`${name}=${str2}`);
          break;
        }
        case "ArrayBuffer":
          values.push(`new Uint8Array([${new Uint8Array(thing)}]).buffer`);
          break;
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          values.push(`${type}.from(${stringify_string(thing.toString())})`);
          break;
        default:
          values.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach((key) => {
            statements.push(`${name}${safe_prop(key)}=${stringify2(thing[key])}`);
          });
      }
    });
    statements.push(`return ${str}`);
    const body = [...reconstructions, ...statements].join(";");
    if (params.length > 65534) {
      return `(function(){var[${params.join(",")}]=arguments[0];${body}}([${values.join(",")}]))`;
    }
    return `(function(${params.join(",")}){${body}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function stringify_typed_array_elements(type, buffer) {
  const array = new /** @type {any} */
  globalThis[type](buffer);
  if (type === "BigInt64Array" || type === "BigUint64Array") {
    return Array.from(array, (element) => `${element}n`).join(",");
  }
  if (array instanceof Float32Array || array instanceof Float64Array || typeof Float16Array !== "undefined" && array instanceof Float16Array) {
    return Array.from(array, (element) => Object.is(element, -0) ? "-0" : `${element}`).join(",");
  }
  return array.toString();
}
function get_name(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function escape_unsafe_char(c) {
  return escaped[c] || c;
}
function escape_unsafe_chars(str) {
  return str.replace(unsafe_chars, escape_unsafe_char);
}
function safe_key(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escape_unsafe_chars(JSON.stringify(key));
}
function safe_prop(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escape_unsafe_chars(JSON.stringify(key))}]`;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return "void 0";
  if (thing === 0 && 1 / thing < 0) return "-0";
  const str = String(thing);
  if (type === "number") return str.replace(/^(-)?0\./, "$1.");
  if (type === "bigint") return thing + "n";
  return str;
}

// node_modules/svelte/src/internal/server/renderer.js
var Renderer = class _Renderer {
  /**
   * The contents of the renderer.
   * @type {RendererItem[]}
   */
  #out = [];
  /**
   * Any `onDestroy` callbacks registered during execution of this renderer.
   * @type {(() => void)[] | undefined}
   */
  #on_destroy = void 0;
  /**
   * Whether this renderer is a component body.
   * @type {boolean}
   */
  #is_component_body = false;
  /**
   * If set, this renderer is an error boundary. When async collection
   * of the children fails, the failed snippet is rendered instead.
   * @type {{
   * 	failed: (renderer: Renderer, error: unknown, reset: () => void) => void;
   * 	transformError: (error: unknown) => unknown;
   * 	context: SSRContext | null;
   * } | null}
   */
  #boundary = null;
  /**
   * The type of string content that this renderer is accumulating.
   * @type {RendererType}
   */
  type;
  /** @type {Renderer | undefined} */
  #parent;
  /**
   * Asynchronous work associated with this renderer
   * @type {Promise<void> | undefined}
   */
  promise = void 0;
  /**
   * State which is associated with the content tree as a whole.
   * It will be re-exposed, uncopied, on all children.
   * @type {SSRState}
   * @readonly
   */
  global;
  /**
   * State that is local to the branch it is declared in.
   * It will be shallow-copied to all children.
   *
   * @type {{ select_value: string | undefined }}
   */
  local;
  /**
   * @param {SSRState} global
   * @param {Renderer | undefined} [parent]
   */
  constructor(global, parent) {
    this.#parent = parent;
    this.global = global;
    this.local = parent ? { ...parent.local } : { select_value: void 0 };
    this.type = parent ? parent.type : "body";
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  head(fn) {
    const head = new _Renderer(this.global, this);
    head.type = "head";
    this.#out.push(head);
    head.child(fn);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async_block(blockers, fn) {
    this.#out.push(BLOCK_OPEN);
    this.async(blockers, fn);
    this.#out.push(BLOCK_CLOSE);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async(blockers, fn) {
    let callback = fn;
    if (blockers.length > 0) {
      const context2 = ssr_context;
      callback = (renderer) => {
        return Promise.all(blockers).then(() => {
          const previous_context = ssr_context;
          try {
            set_ssr_context(context2);
            return fn(renderer);
          } finally {
            set_ssr_context(previous_context);
          }
        });
      };
    }
    this.child(callback);
  }
  /**
   * @param {Array<() => void>} thunks
   */
  run(thunks) {
    const context2 = ssr_context;
    let promise = Promise.resolve(thunks[0]());
    const promises = [promise];
    for (const fn of thunks.slice(1)) {
      promise = promise.then(() => {
        const previous_context = ssr_context;
        set_ssr_context(context2);
        try {
          return fn();
        } finally {
          set_ssr_context(previous_context);
        }
      });
      promises.push(promise);
    }
    promise.catch(noop);
    this.promise = promise;
    return promises;
  }
  /**
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   */
  child_block(fn) {
    this.#out.push(BLOCK_OPEN);
    this.child(fn);
    this.#out.push(BLOCK_CLOSE);
  }
  /**
   * Create a child renderer. The child renderer inherits the state from the parent,
   * but has its own content.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   */
  child(fn) {
    const child = new _Renderer(this.global, this);
    this.#out.push(child);
    const parent = ssr_context;
    set_ssr_context({
      ...ssr_context,
      p: parent,
      c: null,
      r: child
    });
    const result2 = fn(child);
    set_ssr_context(parent);
    if (result2 instanceof Promise) {
      result2.catch(noop);
      result2.finally(() => set_ssr_context(null)).catch(noop);
      if (child.global.mode === "sync") {
        await_invalid();
      }
      child.promise = result2;
    }
    return child;
  }
  /**
   * Render children inside an error boundary. If the children throw and the API-level
   * `transformError` transform handles the error (doesn't re-throw), the `failed` snippet is
   * rendered instead. Otherwise the error propagates.
   *
   * @param {{ failed?: (renderer: Renderer, error: unknown, reset: () => void) => void }} props
   * @param {(renderer: Renderer) => MaybePromise<void>} children_fn
   */
  boundary(props, children_fn) {
    const child = new _Renderer(this.global, this);
    this.#out.push(child);
    const parent_context = ssr_context;
    if (props.failed) {
      child.#boundary = {
        failed: props.failed,
        transformError: this.global.transformError,
        context: parent_context
      };
    }
    set_ssr_context({
      ...ssr_context,
      p: parent_context,
      c: null,
      r: child
    });
    try {
      const result2 = children_fn(child);
      set_ssr_context(parent_context);
      if (result2 instanceof Promise) {
        if (child.global.mode === "sync") {
          await_invalid();
        }
        result2.catch(noop);
        child.promise = result2;
      }
    } catch (error) {
      set_ssr_context(parent_context);
      const failed_snippet = props.failed;
      if (!failed_snippet) throw error;
      const result2 = this.global.transformError(error);
      child.#out.length = 0;
      child.#boundary = null;
      if (result2 instanceof Promise) {
        if (this.global.mode === "sync") {
          await_invalid();
        }
        child.promise = /** @type {Promise<unknown>} */
        result2.then((transformed) => {
          set_ssr_context(parent_context);
          child.#out.push(_Renderer.#serialize_failed_boundary(transformed));
          failed_snippet(child, transformed, noop);
          child.#out.push(BLOCK_CLOSE);
        });
        child.promise.catch(noop);
      } else {
        child.#out.push(_Renderer.#serialize_failed_boundary(result2));
        failed_snippet(child, result2, noop);
        child.#out.push(BLOCK_CLOSE);
      }
    }
  }
  /**
   * Create a component renderer. The component renderer inherits the state from the parent,
   * but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   * @param {Function} [component_fn]
   * @returns {void}
   */
  component(fn, component_fn) {
    push(component_fn);
    const child = this.child(fn);
    child.#is_component_body = true;
    pop();
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {(renderer: Renderer) => void} fn
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   * @param {boolean | undefined} [is_rich]
   * @returns {void}
   */
  select(attrs, fn, css_hash, classes, styles, flags2, is_rich) {
    const { value, ...select_attrs } = attrs;
    this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags2)}>`);
    this.child((renderer) => {
      renderer.local.select_value = value;
      fn(renderer);
    });
    this.push(`${is_rich ? "<!>" : ""}</select>`);
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {string | number | boolean | ((renderer: Renderer) => void)} body
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   * @param {boolean | undefined} [is_rich]
   */
  option(attrs, body, css_hash, classes, styles, flags2, is_rich) {
    this.#out.push(`<option${attributes(attrs, css_hash, classes, styles, flags2)}`);
    const close = (renderer, value, { head, body: body2 }) => {
      if (has_own_property.call(attrs, "value")) {
        value = attrs.value;
      }
      if (value === this.local.select_value) {
        renderer.#out.push(' selected=""');
      }
      renderer.#out.push(`>${body2}${is_rich ? "<!>" : ""}</option>`);
      if (head) {
        renderer.head((child) => child.push(head));
      }
    };
    if (typeof body === "function") {
      this.child((renderer) => {
        const r2 = new _Renderer(this.global, this);
        body(r2);
        if (this.global.mode === "async") {
          return r2.#collect_content_async().then((content) => {
            close(renderer, content.body.replaceAll("<!---->", ""), content);
          });
        } else {
          const content = r2.#collect_content();
          close(renderer, content.body.replaceAll("<!---->", ""), content);
        }
      });
    } else {
      close(this, body, { body: escape_html(body) });
    }
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  title(fn) {
    const path2 = this.get_path();
    const close = (head) => {
      this.global.set_title(head, path2);
    };
    this.child((renderer) => {
      const r2 = new _Renderer(renderer.global, renderer);
      fn(r2);
      if (renderer.global.mode === "async") {
        return r2.#collect_content_async().then((content) => {
          close(content.head);
        });
      } else {
        const content = r2.#collect_content();
        close(content.head);
      }
    });
  }
  /**
   * @param {string | (() => Promise<string>)} content
   */
  push(content) {
    if (typeof content === "function") {
      this.child(async (renderer) => renderer.push(await content()));
    } else {
      this.#out.push(content);
    }
  }
  /**
   * @param {() => void} fn
   */
  on_destroy(fn) {
    (this.#on_destroy ??= []).push(fn);
  }
  /**
   * @returns {number[]}
   */
  get_path() {
    return this.#parent ? [...this.#parent.get_path(), this.#parent.#out.indexOf(this)] : [];
  }
  /**
   * @deprecated this is needed for legacy component bindings
   */
  copy() {
    const copy = new _Renderer(this.global, this.#parent);
    copy.type = this.type;
    copy.#out = this.#out.map((item) => item instanceof _Renderer ? item.copy() : item);
    copy.promise = this.promise;
    return copy;
  }
  /**
   * @param {Renderer} other
   * @deprecated this is needed for legacy component bindings
   */
  subsume(other) {
    if (this.global.mode !== other.global.mode) {
      throw new Error(
        "invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!"
      );
    }
    this.local = other.local;
    this.#out = other.#out.map((item, i) => {
      const current = this.#out[i];
      if (current instanceof _Renderer && item instanceof _Renderer) {
        current.subsume(item);
        return current;
      }
      return item;
    });
    this.promise = other.promise;
    this.type = other.type;
  }
  get length() {
    return this.#out.length;
  }
  /**
   * Creates the hydration comment that marks the start of a failed boundary.
   * The error is JSON-serialized and embedded inside an HTML comment for the client
   * to parse during hydration. The JSON is escaped to prevent `-->` or `<!--` sequences
   * from breaking out of the comment (XSS). Uses unicode escapes which `JSON.parse()`
   * handles transparently.
   * @param {unknown} error
   * @returns {string}
   */
  static #serialize_failed_boundary(error) {
    var json = JSON.stringify(error);
    var escaped2 = json.replace(/>/g, "\\u003e").replace(/</g, "\\u003c");
    return `<!--${HYDRATION_START_FAILED}${escaped2}-->`;
  }
  /**
   * Only available on the server and when compiling with the `server` option.
   * Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
   * @returns {RenderOutput}
   */
  static render(component, options = {}) {
    let sync;
    let async;
    const result2 = (
      /** @type {RenderOutput} */
      {}
    );
    Object.defineProperties(result2, {
      html: {
        get: () => {
          return (sync ??= _Renderer.#render(component, options)).body;
        }
      },
      head: {
        get: () => {
          return (sync ??= _Renderer.#render(component, options)).head;
        }
      },
      body: {
        get: () => {
          return (sync ??= _Renderer.#render(component, options)).body;
        }
      },
      hashes: {
        value: {
          script: ""
        }
      },
      then: {
        value: (
          /**
           * this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
           *
           * @template TResult1
           * @template [TResult2=never]
           * @param { (value: SyncRenderOutput) => TResult1 } onfulfilled
           * @param { (reason: unknown) => TResult2 } onrejected
           */
          (onfulfilled, onrejected) => {
            if (!async_mode_flag) {
              const result3 = sync ??= _Renderer.#render(component, options);
              const user_result = onfulfilled({
                head: result3.head,
                body: result3.body,
                html: result3.body,
                hashes: { script: [] }
              });
              return Promise.resolve(user_result);
            }
            async ??= init_render_context().then(
              () => with_render_context(() => _Renderer.#render_async(component, options))
            );
            return async.then((result3) => {
              Object.defineProperty(result3, "html", {
                // eslint-disable-next-line getter-return
                get: () => {
                  html_deprecated();
                }
              });
              return onfulfilled(
                /** @type {SyncRenderOutput} */
                result3
              );
            }, onrejected);
          }
        )
      }
    });
    return result2;
  }
  /**
   * Collect all of the `onDestroy` callbacks registered during rendering. In an async context, this is only safe to call
   * after awaiting `collect_async`.
   *
   * Child renderers are "porous" and don't affect execution order, but component body renderers
   * create ordering boundaries. Within a renderer, callbacks run in order until hitting a component boundary.
   * @returns {Iterable<() => void>}
   */
  *#collect_on_destroy() {
    for (const component of this.#traverse_components()) {
      yield* component.#collect_ondestroy();
    }
  }
  /**
   * Performs a depth-first search of renderers, yielding the deepest components first, then additional components as we backtrack up the tree.
   * @returns {Iterable<Renderer>}
   */
  *#traverse_components() {
    for (const child of this.#out) {
      if (typeof child !== "string") {
        yield* child.#traverse_components();
      }
    }
    if (this.#is_component_body) {
      yield this;
    }
  }
  /**
   * @returns {Iterable<() => void>}
   */
  *#collect_ondestroy() {
    if (this.#on_destroy) {
      for (const fn of this.#on_destroy) {
        yield fn;
      }
    }
    for (const child of this.#out) {
      if (child instanceof _Renderer && !child.#is_component_body) {
        yield* child.#collect_ondestroy();
      }
    }
  }
  /**
   * Render a component. Throws if any of the children are performing asynchronous work.
   *
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} options
   * @returns {AccumulatedContent}
   */
  static #render(component, options) {
    var previous_context = ssr_context;
    try {
      const renderer = _Renderer.#open_render("sync", component, options);
      const content = renderer.#collect_content();
      return _Renderer.#close_render(content, renderer);
    } finally {
      abort();
      set_ssr_context(previous_context);
    }
  }
  /**
   * Render a component.
   *
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
   * @returns {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }>}
   */
  static async #render_async(component, options) {
    const previous_context = ssr_context;
    try {
      const renderer = _Renderer.#open_render("async", component, options);
      const content = await renderer.#collect_content_async();
      const hydratables = await renderer.#collect_hydratables();
      if (hydratables !== null) {
        content.head = hydratables + content.head;
      }
      return _Renderer.#close_render(content, renderer);
    } finally {
      set_ssr_context(previous_context);
      abort();
    }
  }
  /**
   * Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
   * @param {AccumulatedContent} content
   * @returns {AccumulatedContent}
   */
  #collect_content(content = { head: "", body: "" }) {
    for (const item of this.#out) {
      if (typeof item === "string") {
        content[this.type] += item;
      } else if (item instanceof _Renderer) {
        item.#collect_content(content);
      }
    }
    return content;
  }
  /**
   * Collect all of the code from the `out` array and return it as a string.
   * @param {AccumulatedContent} content
   * @returns {Promise<AccumulatedContent>}
   */
  async #collect_content_async(content = { head: "", body: "" }) {
    await this.promise;
    for (const item of this.#out) {
      if (typeof item === "string") {
        content[this.type] += item;
      } else if (item instanceof _Renderer) {
        if (item.#boundary) {
          const boundary_content = { head: "", body: "" };
          try {
            await item.#collect_content_async(boundary_content);
            content.head += boundary_content.head;
            content.body += boundary_content.body;
          } catch (error) {
            const { context: context2, failed, transformError } = item.#boundary;
            set_ssr_context(context2);
            let promise = transformError(error);
            set_ssr_context(null);
            let transformed = await promise;
            set_ssr_context(context2);
            const failed_renderer = new _Renderer(item.global, item);
            failed_renderer.type = item.type;
            failed_renderer.#out.push(_Renderer.#serialize_failed_boundary(transformed));
            failed(failed_renderer, transformed, noop);
            failed_renderer.#out.push(BLOCK_CLOSE);
            await failed_renderer.#collect_content_async(content);
          }
        } else {
          await item.#collect_content_async(content);
        }
      }
    }
    return content;
  }
  async #collect_hydratables() {
    const ctx = get_render_context().hydratable;
    for (const [_, key] of ctx.unresolved_promises) {
      unresolved_hydratable(key, ctx.lookup.get(key)?.stack ?? "<missing stack trace>");
    }
    for (const comparison of ctx.comparisons) {
      await comparison;
    }
    return await this.#hydratable_block(ctx);
  }
  /**
   * @template {Record<string, any>} Props
   * @param {'sync' | 'async'} mode
   * @param {import('svelte').Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} options
   * @returns {Renderer}
   */
  static #open_render(mode, component, options) {
    if (options.idPrefix?.includes("--")) {
      invalid_id_prefix();
    }
    var previous_context = ssr_context;
    try {
      const renderer = new _Renderer(
        new SSRState(
          mode,
          options.idPrefix ? options.idPrefix + "-" : "",
          options.csp,
          options.transformError
        )
      );
      const context2 = { p: null, c: options.context ?? null, r: renderer };
      set_ssr_context(context2);
      renderer.push(BLOCK_OPEN);
      component(renderer, options.props ?? {});
      renderer.push(BLOCK_CLOSE);
      return renderer;
    } finally {
      set_ssr_context(previous_context);
    }
  }
  /**
   * @param {AccumulatedContent} content
   * @param {Renderer} renderer
   * @returns {AccumulatedContent & { hashes: { script: Sha256Source[] } }}
   */
  static #close_render(content, renderer) {
    for (const cleanup of renderer.#collect_on_destroy()) {
      cleanup();
    }
    let head = content.head + renderer.global.get_title();
    let body = content.body;
    for (const { hash: hash2, code } of renderer.global.css) {
      head += `<style id="${hash2}">${code}</style>`;
    }
    return {
      head,
      body,
      hashes: {
        script: renderer.global.csp.script_hashes
      }
    };
  }
  /**
   * @param {HydratableContext} ctx
   */
  async #hydratable_block(ctx) {
    if (ctx.lookup.size === 0) {
      return null;
    }
    let entries = [];
    let has_promises = false;
    for (const [k, v] of ctx.lookup) {
      if (v.promises) {
        has_promises = true;
        for (const p of v.promises) await p;
      }
      entries.push(`[${uneval(k)},${v.serialized}]`);
    }
    let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
    if (has_promises) {
      prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
    }
    const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
    let csp_attr = "";
    if (this.global.csp.nonce) {
      csp_attr = ` nonce="${this.global.csp.nonce}"`;
    } else if (this.global.csp.hash) {
      const hash2 = await sha256(body);
      this.global.csp.script_hashes.push(`sha256-${hash2}`);
    }
    return `
		<script${csp_attr}>${body}</script>`;
  }
};
var SSRState = class {
  /** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
  csp;
  /** @readonly @type {'sync' | 'async'} */
  mode;
  /** @readonly @type {() => string} */
  uid;
  /** @readonly @type {Set<{ hash: string; code: string }>} */
  css = /* @__PURE__ */ new Set();
  /**
   * `transformError` passed to `render`. Called when an error boundary catches an error.
   * Throws by default if unset in `render`.
   * @type {(error: unknown) => unknown}
   */
  transformError;
  /** @type {{ path: number[], value: string }} */
  #title = { path: [], value: "" };
  /**
   * @param {'sync' | 'async'} mode
   * @param {string} id_prefix
   * @param {Csp} csp
   * @param {((error: unknown) => unknown) | undefined} [transformError]
   */
  constructor(mode, id_prefix = "", csp = { hash: false }, transformError) {
    this.mode = mode;
    this.csp = { ...csp, script_hashes: [] };
    this.transformError = transformError ?? ((error) => {
      throw error;
    });
    let uid = 1;
    this.uid = () => `${id_prefix}s${uid++}`;
  }
  get_title() {
    return this.#title.value;
  }
  /**
   * Performs a depth-first (lexicographic) comparison using the path. Rejects sets
   * from earlier than or equal to the current value.
   * @param {string} value
   * @param {number[]} path
   */
  set_title(value, path2) {
    const current = this.#title.path;
    let i = 0;
    let l = Math.min(path2.length, current.length);
    while (i < l && path2[i] === current[i]) i += 1;
    if (path2[i] === void 0) return;
    if (current[i] === void 0 || path2[i] > current[i]) {
      this.#title.path = path2;
      this.#title.value = value;
    }
  }
};

// node_modules/svelte/src/internal/server/blocks/html.js
function html(value) {
  var html3 = String(value ?? "");
  var open = dev_fallback_default ? `<!--${hash(html3)}-->` : "<!---->";
  return open + html3 + "<!---->";
}

// node_modules/svelte/src/html-tree-validation.js
var autoclosing_children = {
  // based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
  li: { direct: ["li"] },
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt#technical_summary
  dt: { descendant: ["dt", "dd"], reset_by: ["dl"] },
  dd: { descendant: ["dt", "dd"], reset_by: ["dl"] },
  p: {
    descendant: [
      "address",
      "article",
      "aside",
      "blockquote",
      "div",
      "dl",
      "fieldset",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "hr",
      "main",
      "menu",
      "nav",
      "ol",
      "p",
      "pre",
      "section",
      "table",
      "ul"
    ]
  },
  rt: { descendant: ["rt", "rp"] },
  rp: { descendant: ["rt", "rp"] },
  optgroup: { descendant: ["optgroup"] },
  option: { descendant: ["option", "optgroup"] },
  thead: { direct: ["tbody", "tfoot"] },
  tbody: { direct: ["tbody", "tfoot"] },
  tfoot: { direct: ["tbody"] },
  tr: { direct: ["tr", "tbody"] },
  td: { direct: ["td", "th", "tr"] },
  th: { direct: ["td", "th", "tr"] }
};
var disallowed_children = {
  ...autoclosing_children,
  // Strictly speaking, seeing an <option> doesn't mean we're in a <select>, but we assume it here
  // option or optgroup does not have an `only` restriction because newer browsers support rich HTML content
  // inside option elements. For older browsers, hydration will handle the mismatch.
  form: { descendant: ["form"] },
  a: { descendant: ["a"] },
  button: { descendant: ["button"] },
  h1: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  h2: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  h3: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  h4: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  h5: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  h6: { descendant: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
  // No special behavior since these rules fall back to "in body" mode for
  // all except special table nodes which cause bad parsing behavior anyway.
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
  tr: { only: ["th", "td", "style", "script", "template"] },
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
  tbody: { only: ["tr", "style", "script", "template"] },
  thead: { only: ["tr", "style", "script", "template"] },
  tfoot: { only: ["tr", "style", "script", "template"] },
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
  colgroup: { only: ["col", "template"] },
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
  table: {
    only: ["caption", "colgroup", "tbody", "thead", "tfoot", "style", "script", "template"]
  },
  // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
  head: {
    only: [
      "base",
      "basefont",
      "bgsound",
      "link",
      "meta",
      "title",
      "noscript",
      "noframes",
      "style",
      "script",
      "template"
    ]
  },
  // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
  html: { only: ["head", "body", "frameset"] },
  frameset: { only: ["frame"] },
  "#document": { only: ["html"] }
};

// node_modules/svelte/src/internal/server/index.js
var INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function render(component, options = {}) {
  if (options.csp?.hash && options.csp.nonce) {
    invalid_csp();
  }
  return Renderer.render(
    /** @type {Component<Props>} */
    component,
    options
  );
}
function attributes(attrs, css_hash, classes, styles, flags2 = 0) {
  if (styles) {
    attrs.style = to_style(attrs.style, styles);
  }
  if (attrs.class) {
    attrs.class = clsx2(attrs.class);
  }
  if (css_hash || classes) {
    attrs.class = to_class(attrs.class, css_hash, classes);
  }
  let attr_str = "";
  let name;
  const is_html = (flags2 & ELEMENT_IS_NAMESPACED) === 0;
  const lowercase = (flags2 & ELEMENT_PRESERVE_ATTRIBUTE_CASE) === 0;
  const is_input = (flags2 & ELEMENT_IS_INPUT) !== 0;
  for (name of Object.keys(attrs)) {
    if (typeof attrs[name] === "function") continue;
    if (name[0] === "$" && name[1] === "$") continue;
    if (name === "" || INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
    var value = attrs[name];
    var lower = name.toLowerCase();
    if (lowercase) name = lower;
    if (lower.length > 2 && lower.startsWith("on")) continue;
    if (is_input) {
      if (name === "defaultvalue" || name === "defaultchecked") {
        name = name === "defaultvalue" ? "value" : "checked";
        if (attrs[name]) continue;
      }
    }
    attr_str += attr(name, value, is_html && is_boolean_attribute(name));
  }
  return attr_str;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function ensure_array_like(array_like_or_iterator) {
  if (array_like_or_iterator) {
    return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  return [];
}

// src/svelte/CharacterSheet.svelte
function CharacterSheet($$renderer) {
  const stats = [
    { name: "Strength", attr: "strength" },
    { name: "Speed", attr: "speed" },
    { name: "Intellect", attr: "intellect" },
    { name: "Combat", attr: "combat" }
  ];
  $$renderer.push(`<div class="section"><h2>Character Stats</h2> <!--[-->`);
  const each_array = ensure_array_like(stats);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let stat = each_array[$$index];
    $$renderer.push(`<div class="stat-row"><label>${escape_html(stat.name)}</label> <input type="number"${attr("name", `attr_${stringify(stat.attr)}`)} value="25"/></div>`);
  }
  $$renderer.push(`<!--]--></div>`);
}

// src/svelte/NPCSheet.svelte
function NPCSheet($$renderer) {
  const stats = [
    {
      name: "Combat",
      short: "C",
      attr: "combat",
      desc: "This works exactly like the Combat Stat, showing how good they are in a fight.",
      placeholder: "20"
    },
    {
      name: "Instinct",
      short: "I",
      attr: "instinct",
      desc: "This is a catchall Stat for Fear, Sanity, Body, Speed, Intellect, and everything else.",
      placeholder: "25"
    }
  ];
  $$renderer.push(`<div class="npc-sheet svelte-dyo6wd"><header class="npc-sheet__header svelte-dyo6wd"><div class="npc-sheet__title-group svelte-dyo6wd"><span class="npc-sheet__badge svelte-dyo6wd" data-i18n="npc">NPC / CONTRACTOR</span> <input class="npc-sheet__name-input svelte-dyo6wd" name="attr_character_name" type="text" placeholder="NPC Name" data-i18n-placeholder="NPC Name" aria-label="NPC Name"/></div></header> <section class="npc-sheet__stats-section svelte-dyo6wd"><div class="npc-sheet__stats-grid svelte-dyo6wd"><!--[-->`);
  const each_array = ensure_array_like(stats);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let stat = each_array[$$index];
    $$renderer.push(`<div class="npc-sheet__stat-card svelte-dyo6wd"><div class="npc-sheet__stat-header svelte-dyo6wd"><button class="npc-sheet__stat-roll-btn svelte-dyo6wd" type="roll"${attr("name", `roll_${stringify(stat.attr)}`)}${attr("title", `Roll ${stringify(stat.name)}`)}${attr("aria-label", `Roll ${stringify(stat.name)}`)}${attr("value", `{{template:ms}} {{name=${stringify(stat.name)}}} {{character_name=@{character_name}}} {{roll=[[1d100-1cs1cf99]]}} {{roll2=[[?{Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99}]]}} {{target=@{${stringify(stat.attr)}}}}`)}><span class="npc-sheet__stat-title"${attr("data-i18n", stat.name)}>${escape_html(stat.name)} (${escape_html(stat.short)})</span></button> <span class="npc-sheet__tooltip svelte-dyo6wd">${escape_html(stat.desc)}</span></div> <input class="npc-sheet__stat-input svelte-dyo6wd"${attr("name", `attr_${stringify(stat.attr)}`)} type="number"${attr("placeholder", stat.placeholder)}${attr("aria-label", `${stringify(stat.name)} value`)}/></div>`);
  }
  $$renderer.push(`<!--]--> <div class="npc-sheet__stat-card npc-sheet__stat-card--initiative svelte-dyo6wd"><div class="npc-sheet__stat-header svelte-dyo6wd"><button class="npc-sheet__stat-roll-btn npc-sheet__stat-roll-btn--initiative svelte-dyo6wd" type="roll" name="roll_initiative" title="Roll Initiative into Turn Tracker" aria-label="Roll Initiative into Turn Tracker" value="{{template:ms}} {{name=Initiative}} {{character_name=@{character_name}}} {{roll=[[1d100-1cs1cf99 &amp;{tracker}]]}} {{roll2=[[?{Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99 &amp;{tracker}}]]}} {{target=@{instinct}}}"><span class="npc-sheet__stat-title" data-i18n="initiative">Initiative</span></button> <span class="npc-sheet__tooltip svelte-dyo6wd" data-i18n="Rolls Instinct and adds to the Turn Tracker">Rolls Instinct and adds to Turn Tracker (&amp;{tracker})</span></div> <div class="npc-sheet__initiative-subtext svelte-dyo6wd">Instinct + Tracker</div></div> <div class="npc-sheet__vital-card npc-sheet__vital-card--wounds svelte-dyo6wd"><div class="npc-sheet__vital-label svelte-dyo6wd" data-i18n="wounds">Wounds (W)</div> <div class="npc-sheet__minmax-wrapper svelte-dyo6wd"><input class="npc-sheet__vital-input svelte-dyo6wd" name="attr_wounds" type="number" placeholder="1" title="Current Wounds" aria-label="Current Wounds"/> <span class="npc-sheet__separator svelte-dyo6wd">/</span> <input class="npc-sheet__vital-input svelte-dyo6wd" name="attr_wounds_max" type="number" placeholder="1" title="Max Wounds" aria-label="Max Wounds"/></div> <div class="npc-sheet__vital-sublabels svelte-dyo6wd"><span data-i18n="current">Current</span> <span data-i18n="max">Max</span></div></div> <div class="npc-sheet__vital-card npc-sheet__vital-card--health svelte-dyo6wd"><div class="npc-sheet__vital-label svelte-dyo6wd" data-i18n="health">Health (HP)</div> <div class="npc-sheet__minmax-wrapper svelte-dyo6wd"><input class="npc-sheet__vital-input svelte-dyo6wd" name="attr_health" type="number" placeholder="20" title="Current Health" aria-label="Current Health"/> <span class="npc-sheet__separator svelte-dyo6wd">/</span> <input class="npc-sheet__vital-input svelte-dyo6wd" name="attr_health_max" type="number" placeholder="20" title="Health per Wound" aria-label="Health per Wound"/></div> <div class="npc-sheet__vital-sublabels svelte-dyo6wd"><span data-i18n="current">Current</span> <span data-i18n="per wound">Per Wound</span></div></div> <div class="npc-sheet__vital-card npc-sheet__vital-card--ap svelte-dyo6wd"><div class="npc-sheet__vital-label svelte-dyo6wd" data-i18n="armor points">Armor Points (AP)</div> <input class="npc-sheet__stat-input npc-sheet__stat-input--ap svelte-dyo6wd" name="attr_armor_points" type="number" placeholder="0" aria-label="Armor Points"/></div></div></section> <section class="npc-sheet__main-content svelte-dyo6wd"><div class="npc-sheet__section npc-sheet__attacks svelte-dyo6wd"><div class="npc-sheet__section-header svelte-dyo6wd"><h3 class="npc-sheet__section-title svelte-dyo6wd" data-i18n="attacks">Attacks</h3></div> <div class="npc-sheet__table-header svelte-dyo6wd"><span class="npc-sheet__table-head-cell" data-i18n="attack">Attack</span> <span class="npc-sheet__table-head-cell" data-i18n="type">Type</span> <span class="npc-sheet__table-head-cell" data-i18n="damage">Damage</span> <span class="npc-sheet__table-head-cell npc-sheet__table-head-cell--cog"></span></div> <fieldset class="repeating_attacks"><div class="npc-sheet__attack-row svelte-dyo6wd"><button class="npc-sheet__row-roll-btn svelte-dyo6wd" type="roll" name="roll_attack" title="Roll Attack" aria-label="Roll Attack" value="{{template:ms}} {{name=@{attack_name}}} {{character_name=@{character_name}}} {{roll=[[1d100-1cs1cf99]]}} {{roll2=[[?{Advantage/Disadvantage|Normal,0|Advantage/Disadvantage,1d100-1cs1cf99}]]}} {{target=[[@{combat}]]}} {{ranges=@{attack_range_s}}} {{rangem=@{attack_range_m}}} {{rangel=@{attack_range_l}}} {{damage=[[@{attack_damage}]]}} {{notes=@{attack_notes}}}"><span class="npc-sheet__attack-name-display" name="attr_attack_name"></span></button> <select class="npc-sheet__attack-type-select svelte-dyo6wd" name="attr_attack_type" aria-label="Attack Type">`);
  $$renderer.option({ value: "Ranged", "data-i18n": "Ranged" }, ($$renderer2) => {
    $$renderer2.push(`Ranged`);
  });
  $$renderer.option({ value: "Melee", "data-i18n": "Melee" }, ($$renderer2) => {
    $$renderer2.push(`Melee`);
  });
  $$renderer.push(`</select> <input class="npc-sheet__attack-damage-input svelte-dyo6wd" name="attr_attack_damage" type="text" placeholder="Damage" data-i18n-placeholder="damage" aria-label="Attack Damage"/> <label class="npc-sheet__cog-label svelte-dyo6wd"><input class="npc-sheet__settings-toggle svelte-dyo6wd" name="attr_attack_settings" type="checkbox" checked=""/> <span class="npc-sheet__cog-icon svelte-dyo6wd">y</span></label> <div class="npc-sheet__settings-drawer npc-sheet__attack-settings svelte-dyo6wd"><div class="npc-sheet__settings-row svelte-dyo6wd"><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="name">Name</span> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_name" type="text" placeholder="Attack name" data-i18n-placeholder="attack name" aria-label="Attack Name"/></div> <div class="npc-sheet__settings-row npc-sheet__settings-row--ranges svelte-dyo6wd"><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="range">Range (S/M/L)</span> <div class="npc-sheet__range-inputs svelte-dyo6wd"><input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_range_s" type="text" placeholder="Short" data-i18n-placeholder="short" aria-label="Short Range"/> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_range_m" type="text" placeholder="Med" data-i18n-placeholder="medium" aria-label="Medium Range"/> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_range_l" type="text" placeholder="Long" data-i18n-placeholder="long" aria-label="Long Range"/></div></div> <div class="npc-sheet__settings-row npc-sheet__settings-row--grid svelte-dyo6wd"><div><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="critical damage">Critical Damage</span> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_crit_damage" type="text" placeholder="Crit Damage" data-i18n-placeholder="damage" aria-label="Critical Damage"/></div> <div><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="critical effect">Critical Effect</span> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_crit_effect" type="text" placeholder="Crit Effect" data-i18n-placeholder="effect" aria-label="Critical Effect"/></div></div> <div class="npc-sheet__settings-row npc-sheet__settings-row--grid svelte-dyo6wd"><div><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="shots">Shots</span> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_shots" type="text" placeholder="Shots" data-i18n-placeholder="shots" aria-label="Shots"/></div> <div><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="ammunition">Ammunition</span> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_attack_ammunition" type="text" placeholder="Ammo" data-i18n-placeholder="ammunition" aria-label="Ammunition"/></div></div> <div class="npc-sheet__settings-row npc-sheet__settings-row--full svelte-dyo6wd"><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="notes">Notes</span> <textarea class="npc-sheet__settings-textarea svelte-dyo6wd" name="attr_attack_notes" placeholder="Special rules, wound types, or ammunition effects..." data-i18n-placeholder="notes" aria-label="Attack Notes"></textarea></div></div></div></fieldset></div> <div class="npc-sheet__section npc-sheet__traits svelte-dyo6wd"><div class="npc-sheet__section-header svelte-dyo6wd"><h3 class="npc-sheet__section-title svelte-dyo6wd" data-i18n="traits">Traits</h3></div> <fieldset class="repeating_traits"><div class="npc-sheet__trait-row svelte-dyo6wd"><button class="npc-sheet__row-roll-btn svelte-dyo6wd" type="roll" name="roll_trait" title="Roll Trait" aria-label="Roll Trait" value="{{template:ms}} {{name=@{trait_name}}} {{character_name=@{character_name}}} {{notes=@{trait_description}}}"><span class="npc-sheet__trait-name-display" name="attr_trait_name"></span></button> <label class="npc-sheet__cog-label svelte-dyo6wd"><input class="npc-sheet__settings-toggle svelte-dyo6wd" name="attr_trait_settings" type="checkbox" checked=""/> <span class="npc-sheet__cog-icon svelte-dyo6wd">y</span></label> <div class="npc-sheet__trait-preview svelte-dyo6wd" name="attr_trait_description"></div> <div class="npc-sheet__settings-drawer npc-sheet__trait-settings svelte-dyo6wd"><div class="npc-sheet__settings-row svelte-dyo6wd"><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="name">Trait Name</span> <input class="npc-sheet__settings-input svelte-dyo6wd" name="attr_trait_name" type="text" placeholder="Trait name" data-i18n-placeholder="trait name" aria-label="Trait Name"/></div> <div class="npc-sheet__settings-row npc-sheet__settings-row--full svelte-dyo6wd"><span class="npc-sheet__settings-label svelte-dyo6wd" data-i18n="description">Description</span> <textarea class="npc-sheet__settings-textarea svelte-dyo6wd" name="attr_trait_description" placeholder="Describe the trait or special rule..." data-i18n-placeholder="trait description" aria-label="Trait Description"></textarea></div></div></div></fieldset></div></section> <section class="npc-sheet__narrative-grid svelte-dyo6wd"><div class="npc-sheet__narrative-card svelte-dyo6wd"><h3 class="npc-sheet__section-title svelte-dyo6wd" data-i18n="description">Description</h3> <textarea class="npc-sheet__textarea svelte-dyo6wd" name="attr_description" placeholder="Enter the NPC's description, motivation, or behavior here." data-i18n-placeholder="Enter the NPC's description here." aria-label="NPC Description"></textarea></div> <div class="npc-sheet__narrative-card svelte-dyo6wd"><h3 class="npc-sheet__section-title svelte-dyo6wd" data-i18n="equipment">Equipment &amp; Notes</h3> <textarea class="npc-sheet__textarea svelte-dyo6wd" name="attr_equipment" placeholder="Enter the NPC's equipment, gear, salary, or notes here." data-i18n-placeholder="Enter the NPC's equipment here." aria-label="NPC Equipment and Notes"></textarea></div></section></div>`);
}

// src/svelte/ShipSheet.svelte
function ShipSheet($$renderer) {
  $$renderer.push(`<div class="section"><h2>Ship Sheet</h2> <label>Hull <input type="number" name="attr_hull"/></label></div>`);
}

// src/svelte/Sheet.svelte
function Sheet($$renderer) {
  const title = "Mothership 1e Character Sheet";
  const workerScriptOpen = '<script type="text/worker">';
  const workerScriptClose = "</script>";
  $$renderer.push(`<div class="sheet-wrapper svelte-deygyw"><h1 class="svelte-deygyw">Mothership 1e Character Sheet</h1> <input type="hidden" name="attr_sheet_type" class="sheet-type-toggle" value="character"/> <div class="character-sheet">`);
  CharacterSheet($$renderer, {});
  $$renderer.push(`<!----></div> <div class="ship-sheet">`);
  ShipSheet($$renderer, {});
  $$renderer.push(`<!----></div> <div class="npc-sheet-wrapper">`);
  NPCSheet($$renderer, {});
  $$renderer.push(`<!----></div></div> ${html(workerScriptOpen)} console.log("Roll20 Sheetworker code here"); ${html(workerScriptClose)}`);
}

// scripts/compile-svelte-root.js
import fs from "fs";
import path from "path";
var result = render(Sheet, { props: {} });
var html2 = result.html || result.body || result;
fs.writeFileSync(path.resolve(process.cwd(), "mothership.html"), html2);
console.log("\u2705 Successfully built mothership.html using Svelte!");
var css = result.css && result.css.code ? result.css.code : result.css?.code || result.css || "";
fs.writeFileSync(path.resolve(process.cwd(), "mothership.css"), css);
console.log("\u2705 Successfully built mothership.css using Svelte!");
