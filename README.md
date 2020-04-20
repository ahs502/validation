# @ahs502/validation

#### A universal client/server side data validation for complex data structures.

Have you ever struggled validating forms with _complex_ and _dynamic_ data structures?

Have you ever tried to validate each field from _different aspects_ and generate _accurate error messages_ on each one telling exactly what is wrong with that field?

Are you tired from those stupid rule definitions and wish to be able to freely apply all sorts of custom checks on your data directly by _JavaScript native expressions_?

Did you have a hard time to implement _cross field validations_ or _sequential/conditional checks_ on your data?

Have you ever thought about implementing validation on your data model _once_ and use it _both_ within the _client_ and the _server_ side code?

If the answer is **_yes_**, then `@ahs502/validation` system is here to save the day!

- Very **simple**, yet very **powerful**
- No rules, no conventions, just **plain JavaScript expressions to check things**
- Full **TypeScript** support, as well as **JavaScript**
- Support for **asynchronous**, **synchronous** and **mixed** checks
- A lot of freedom to check things in **all sorts of ways**
- Capability to apply **complex logics** and **arbitrary orders** to check everything
- **Easy** to learn, **enjoyful** to implement

```typescript
import Validation from '@ahs502/validation'

// JavaScript:

class PointValidation extends Validation {
  constructor({ x, y }, range) {
    super(validator => {
      validator.check('X_IS_VALID', !isNaN(x), 'x is invalid.')
      validator.check('Y_IS_VALID', !isNaN(y), 'y is invalid.')
      validator
        .when('X_IS_VALID', 'Y_IS_VALID')
        .check(
          'IS_WITHIN_RANGE',
          () => Math.sqrt(x ** 2 + y ** 2) <= range,
          'The point is out of range.'
        )
    })
  }
}

// TypeScript:

interface Point {
  x: number
  y: number
}

class PointValidation extends Validation<
  'X_IS_VALID' | 'Y_IS_VALID' | 'IS_WITHIN_RANGE'
> {
  constructor({ x, y }: Point, range: number) {
    super(validator => {
      validator.check('X_IS_VALID', !isNaN(x), 'x is invalid.')
      validator.check('Y_IS_VALID', !isNaN(y), 'y is invalid.')
      validator
        .when('X_IS_VALID', 'Y_IS_VALID')
        .check(
          'IS_WITHIN_RANGE',
          () => Math.sqrt(x ** 2 + y ** 2) <= range,
          'The point is out of range.'
        )
    })
  }
}

// Usage:

const p1 = { x: 1, y: 2 }
const v1 = new PointValidation(p1, 10)
v1.ok           // true
v1.badges       // ['X_IS_VALID', 'Y_IS_VALID', 'IS_WITHIN_RANGE']
v1.failedBadges // []
v1.messages()   // []

const p2 = { x: -3, y: NaN }
const v2 = new PointValidation(p2, 10)
v2.ok           // false
v2.badges       // ['X_IS_VALID']
v2.failedBadges // ['Y_IS_VALID']
v2.messages()   // ['y is invalid.']

const p3 = { x: 100, y: 100 }
const v3 = new PointValidation(p3, 10)
v3.ok           // false
v3.badges       // ['X_IS_VALID', 'Y_IS_VALID']
v3.failedBadges // ['IS_WITHIN_RANGE']
v3.messages()   // ['The point is out of range.']

```

## Installation

```shell
$ npm install @ahs502/validation
```

## Documentation

A detailed API documentation plus tutorials and examples is
being developed at the time. The link will be shared here as
soon as possible. Thanks for being patient.

## Development

Run tests (Powered by _jest_):

```shell
$ npm test
```

Build the project into the `dist` folder:

```shell
$ npm run build
```

> It is preferred to develop this project by _VS Code_ with _Prettier_ extension installed.

## Contribution

It would be appreciated if you had any suggestion or contribution on this package or detected any bug.

- See the code on [GitHub.com](https://github.com/ahs502/validation)
- See the package on [npmjs.com](https://www.npmjs.com/package/@ahs502/validation)
- Contact me by [my gmail](ahs502@gmail.com) _(Hessamoddin A Shokravi)_

