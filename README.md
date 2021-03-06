<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/active
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/active">
    <img src="https://img.shields.io/npm/v/@rill/active.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/active">
    <img src="https://img.shields.io/npm/dm/@rill/active.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Continuation local storage for Rill.
Keeps track of the current request context and makes it available in all of your functions (even async ones!).

Uses [Zone.js](https://github.com/angular/zone.js/) internally.

# Installation

```console
npm install @rill/active
```

# Example

#### app.js

```js
const app = rill()
const active = require("@rill/active")
const loadUser = require('./load-user.js')

// Setup the middleware.
app.use(active())

// Example route.
app.get("/my-profile", async ({ req, res, locals }, next)=> {
	// Call your regular functions (this one async loads a user object).
	await loadUser()

	res.body = renderPage({
		user: locals.user
	})
})
```

#### load-user.js

```js
const active = require("@rill/active")
const Users = require('./db/user')

/**
 * This is just an example that requires some details from the current request.
 * @rill/active saves you having to manually pass the request context everywhere.
 */
module.exports = async function () {
	// As an example lets pretend we need the request hostname.
	const hostname = active.get('req.hostname')

	// Async load a user.
	const user = await Users.find({
		hostname: hostname,
		email: email
	})

	// And then we want to set locals on the request after we load the user.
	active.set('locals.user', user)
}

```

# API

+ **active()** : Creates a middleware that keeps track of the active request.

```javascript
app.use(active())
```

+ **active.get(key: String, default: Any)** : Pulls out a `dot-notation` key from the active request context.

```javascript
active.get('req.href')
```

+ **active.set(key: String, val: Any)** : Sets a `dot-notation` key on the active request context.

```javascript
active.set('locals.title', 'some title')
```

+ **active.has(key: String)** : Checks if a key exists on the active request context.

```javascript
active.has('locals.title') // true
```

---

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
