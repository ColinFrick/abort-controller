# @colinfrick/abort-controller

[![npm version](https://img.shields.io/npm/v/@colinfrick/abort-controller.svg)](https://www.npmjs.com/package/@colinfrick/abort-controller)
[![Downloads/month](https://img.shields.io/npm/dm/@colinfrick/abort-controller.svg)](http://www.npmtrends.com/@colinfrick/abort-controller)
![Build Status](https://github.com/colinfrick/abort-controller/actions/workflows/test.yml/badge.svg)
[![Coverage Status](https://codecov.io/gh/colinfrick/abort-controller/branch/master/graph/badge.svg)](https://codecov.io/gh/colinfrick/abort-controller)
[![Dependency Status](https://david-dm.org/colinfrick/abort-controller.svg)](https://david-dm.org/colinfrick/abort-controller)

An implementation of [WHATWG AbortController interface](https://dom.spec.whatwg.org/#interface-abortcontroller).

```js
import AbortController from "@colinfrick/abort-controller"

const controller = new AbortController()
const signal = controller.signal

signal.addEventListener("abort", () => {
    console.log("aborted!")
})

controller.abort()
```

> https://jsfiddle.net/1r2994qp/1/

## 💿 Installation

Use [npm](https://www.npmjs.com/) to install then use a bundler.

```
npm install @colinfrick/abort-controller
```

Or download from [`dist` directory](./dist).

- [dist/abort-controller.mjs](dist/abort-controller.mjs) ... ES modules version.
- [dist/abort-controller.js](dist/abort-controller.js) ... Common JS version.
- [dist/abort-controller.umd.js](dist/abort-controller.umd.js) ... UMD (Universal Module Definition) version. This is transpiled by [Babel](https://babeljs.io/) for IE 11.

## 📖 Usage

### Basic

```js
import AbortController from "@colinfrick/abort-controller"
// or
const AbortController = require("@colinfrick/abort-controller")

// or UMD version defines a global variable:
const AbortController = window.AbortControllerShim
```

If your bundler recognizes `browser` field of `package.json`, the imported `AbortController` is the native one and it doesn't contain shim (even if the native implementation was nothing).
If you wanted to polyfill `AbortController` for IE, use `abort-controller/polyfill`.

### Polyfilling

Importing `@colinfrick/abort-controller/polyfill` assigns the `AbortController` shim to the `AbortController` global variable if the native implementation was nothing.

```js
import "@colinfrick/abort-controller/polyfill"
// or
require("@colinfrick/abort-controller/polyfill")
```

### API

#### AbortController

> https://dom.spec.whatwg.org/#interface-abortcontroller

##### controller.signal

The [AbortSignal](https://dom.spec.whatwg.org/#interface-AbortSignal) object which is associated to this controller.

##### controller.abort()

Notify `abort` event to listeners that the `signal` has.

## 📰 Changelog

- See [GitHub releases](https://github.com/colinfrick/abort-controller/releases).

## 🍻 Contributing

Contributing is welcome ❤️

Please use GitHub issues/PRs.

### Development tools

- `npm install` installs dependencies for development.
- `npm test` runs tests and measures code coverage.
- `npm run clean` removes temporary files of tests.
- `npm run coverage` opens code coverage of the previous test with your default browser.
- `npm run lint` runs ESLint.
- `npm run build` generates `dist` codes.
- `npm run watch` runs tests on each file change.
