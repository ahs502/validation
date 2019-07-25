

# @ahs502/validation

#### A universal client and server side data model validation for complex data structures.

Have you ever struggled validating forms with *complex* and *dynamic* data structures?

Have you ever tried to validate each part of your data from *different aspects* and generate *accurate error messages* on it telling exactly what is wrong with that field?

Did you have a hard time to implement *cross field validation* or *sequential/conditional checks* on your data?

Have you ever thought about implementing validation on your data model *once* and use it *both* within the *client side* and the *server side* code?

Are you tired from those stupid rule definitions and wish to be able to apply all sorts of custom checks on your data directly by JavaScript expressions?

If the answer is ***yes***, then `@ahs502/validation` system is here to save the day!

+ Both **TypeScript** and **JavaScript** support
+ No rules, no conventions, just **plain JavaScript expressions to check things**
+ Support for **asynchronous** validations as well as **synchronous** validations

```typescript
import Validation from '@ahs502/validation'

/* Simple data structure definition */
interface Point {
  x: number;
  y: number;
}

/* Validation for data of type Point */
class PointValidation extends Validation<
  'X_IS_VALID' | 'X_IS_IN_RANGE' | 'Y_IS_VALID' | 'Y_IS_IN_RANGE'
> {
  constructor(point: Point, range: number) {
    super(validator =>
      validator.object(point).do(({ x, y }) => {
        validator
          .check('X_IS_VALID', typeof x === 'number' && !isNaN(x))
          .check('X_IS_IN_RANGE', () => -range <= x && x <= +range);
        validator
          .check('Y_IS_VALID', typeof y === 'number' && !isNaN(y))
          .check('Y_IS_IN_RANGE', () => -range <= y && y <= +range);
      })
    );
  }
}

/* Nested data structure definition */
interface Path {
  points: Point[];
  closed: boolean;
}

/* Validation for data of type Path */
class PathValidation extends Validation<
  | 'CLOSED_IS_VALID'
  | 'MIN_3_POINTS_WHEN_CLOSED'
  | 'MIN_1_POINT_WHEN_NOT_CLOSED',
  { points: PointValidation[] }
> {
  constructor(path: Path, range: number) {
    super((validator, validation) =>
      validator.object(path).do(({ points, closed }) => {
        validator
          .array(points)
          .each((point, index) =>
            validator
              .into('points', index)
              .set(new PointValidation(point, range))
          );
        validator
          .check('CLOSED_IS_VALID', typeof closed === 'boolean')
          .must(validation.$.points.every(pointValidation => pointValidation.ok))
          .then(() => {
            validator
              .if(closed)
              .check('MIN_3_POINTS_WHEN_CLOSED', () => points.length >= 3);
            validator
              .if(!closed)
              .check('MIN_1_POINT_WHEN_NOT_CLOSED', () => points.length >= 1);
          });
      })
    );
  }
}

/* Initialize sample data */
const path: Path = providePath();

/* Validate sample data */
const pathValidation = new PathValidation(path, 100);

/* Check the validation result */
if (pathValidation.ok) {
  /* Variable path is a valid Path object! */
} else {
  /* Read all error messages from path validation */
  console.error(pathValidation.messages());

  /* Read all error messages related to x of all point validations */
  pathValidation.$.points.forEach(pointValidation => {
    console.error(pointValidation.messages('X_*'));
  });
}
```

## Installation

```sh
$ npm install @ahs502/validation
```

## Usage

First, create a *validation class* for your data type:

```typescript
import Validation from '@ahs502/validation';

interface MyData {
  ...
}

class MyDataValidation extends Validation {
  constructor(d) {
    super(validator => {
      // Validate d...
    };
  }
}
```

Then, instantiate it to validate your data instances:

```typescript
const myData: MyData = ... ;

const validation = new MyDataValidation(myData);
if (validation.ok) {
  // myData is valid!
}
```

## How to validate?

### Learn `@ahs502/validation` by examples!

Let's suppose we have a `Point` data type <small>(It can even be the format of an input form)</small>: 

```typescript
interface Point {
  x: number;
  y: number;
}
```

And, we want to validate its `x` and `y` to be *valid* and *positive* numbers.

We may use the provided `validator` to create *validation chain*s:

```typescript
class PointValidation extends Validation<"X_IS_VALID" | "X_IS_POSITIVE" | "Y_IS_VALID" | "Y_IS_POSITIVE"> {
  constructor(point: Point) {
    super(validator => {
      const { x, y } = point;
      validator.check("X_IS_VALID", typeof x === "number").check("X_IS_POSITIVE", () => x > 0);
      validator.check("Y_IS_VALID", typeof y === "number").check("Y_IS_POSITIVE", () => y > 0);
    });
  }
}
```

The validation above contains two *validation chain*s for both `x` and `y`. In each chain, first it tries to check their validity as a number, then **if succeeds the previous step** tries to check their positiveness; so, in the second step of the check **we can count on** the value to be a valid number.

At each `.check()` step, the `validator` tries to *earn some badge*, otherwise it will *fail that badge*.

> Please note that the condition on the first `check` is an *expression*, but the second one is an *arrow function*, that's a good practice because first conditions are always checked but the next ones only need to be evaluated if the previous ones pass.

Finally, we can validate each instance of `Point` as easily as this:

```typescript
var myPoint = { x: 4, y: 5 };

const validation = new PointValidation(myPoint);
if (validation.ok) {
  // myPoint is valid!
}
```

Want to know more details on what is exactly wrong with your data?

```typescript
var myPoint = { x: 'something', y: -10 };

const validation = new PointValidation(myPoint);
if (!validation.ok) {
  validation.badges;                          // ['Y_IS_VALID']
  validation.failedBadges;                    // ['X_IS_VALID', 'Y_IS_POSITIVE']
  validation.has('Y_IS_VALID');               // true
  validation.has('X_IS_VALID', 'Y_IS_VALID'); // false
}
```

If you don't trust the *structure* of your data <small>(e.g. it comes from unknown sources)</small>, enhance the validation like this:

```typescript
class PointValidation extends Validation<"X_IS_VALID" | "X_IS_POSITIVE" | "Y_IS_VALID" | "Y_IS_POSITIVE"> {
  constructor(point: Point) {
    super(validator =>
      validator.object(point).do(({ x, y }) => {
        validator.check("X_IS_VALID", typeof x === "number").check("X_IS_POSITIVE", () => x > 0);
        validator.check("Y_IS_VALID", typeof y === "number").check("Y_IS_POSITIVE", () => y > 0);
      })
    );
  }
}
```

The `.point(target)` makes sure that the `target` is an **existing object** (something like a `{ ... }` in a *json* file, not an array), so you can **safely** decompose it during the next `.do()` step. Otherwise, the validation fails and the rest of the *chain* blocks.

Now, let's add one more check to see if the `point` is within a certain `range` from the origin (*cross field* validation):

```typescript
class PointValidation extends Validation<
  "X_IS_VALID" | "X_IS_POSITIVE" | "Y_IS_VALID" | "Y_IS_POSITIVE" | "POINT_IS_IN_RANGE"
> {
  constructor(point: Point, range: number) {
    super(validator =>
      validator.object(point).do(({ x, y }) => {
        validator.check("X_IS_VALID", typeof x === "number").check("X_IS_POSITIVE", () => x > 0);
        validator.check("Y_IS_VALID", typeof y === "number").check("Y_IS_POSITIVE", () => y > 0);
        validator
          .when("X_IS_POSITIVE", "Y_IS_POSITIVE")
          .check("POINT_IS_IN_RANGE", () => x ** 2 + y ** 2 <= range ** 2);
      })
    );
  }
}
```

The `.when(...requiredBadges)` only allows the chain to continue if *all* the `requiredBadges` are available. So, you can **safely** check for range coverage in order to gain badge `'POINT_IS_IN_RANGE'`, because at this point, both `x` and `y` are definitely valid and positive numbers.

What if you had an input form and wanted to show appropriate error messages on each input field? If so, you need to assign proper failure messages to each badge like this:

```typescript
class PointValidation extends Validation<
  "X_IS_VALID" | "X_IS_POSITIVE" | "Y_IS_VALID" | "Y_IS_POSITIVE" | "POINT_IS_IN_RANGE"
> {
  constructor(point: Point, range: number) {
    super(validator =>
      validator.object(point).do(({ x, y }) => {
        validator
          .check("X_IS_VALID", typeof x === "number", "Invalid number.")
          .check("X_IS_POSITIVE", () => x > 0, "Horizontal value is not positive.");
        validator
          .check("Y_IS_VALID", typeof y === "number", "Invalid number.")
          .check("Y_IS_POSITIVE", () => y > 0, "Vertical value is not positive.");
        validator
          .when("X_IS_POSITIVE", "Y_IS_POSITIVE")
          .check(
            "POINT_IS_IN_RANGE",
            () => x ** 2 + y ** 2 <= range ** 2,
            `The point (${x}, ${y}) is not in the range ${range}.`
          );
      })
    );
  }
}
```

Then, you can access the provided errors on the data like this:

```typescript
var myPoint = { x: 'something', y: -10 };

const validation = new PointValidation(myPoint);
if (!validation.ok) {
  validation.failedBadges;           // ['X_IS_VALID', 'Y_IS_POSITIVE']
  validation.errors;                 // {'X_IS_VALID': 'Invalid number.', 'Y_IS_POSITIVE': 'Vertical value is not positive.'}
  validation.messages();             // ['Invalid number.', 'Vertical value is not positive.']
  validation.messages('X_IS_VALID'); // ['Invalid number.']
  validation.messages('Y_*');        // ['Vertical value is not positive.']
  validation.message();              // 'Invalid number.'
  validation.throw();                // throws 'Invalid number.'
}
```

For simplicity, you can also aggregate all *fixed* error messages for this validation into a single failure message dictionary:

```typescript
class PointValidation extends Validation<
  "X_IS_VALID" | "X_IS_POSITIVE" | "Y_IS_VALID" | "Y_IS_POSITIVE" | "POINT_IS_IN_RANGE"
> {
  constructor(point: Point, range: number) {
    super(
      validator =>
        validator.object(point).do(({ x, y }) => {
          validator.check("X_IS_VALID", typeof x === "number").check("X_IS_POSITIVE", () => x > 0);
          validator.check("Y_IS_VALID", typeof y === "number").check("Y_IS_POSITIVE", () => y > 0);
          validator
            .when("X_IS_POSITIVE", "Y_IS_POSITIVE")
            .check(
              "POINT_IS_IN_RANGE",
              () => x ** 2 + y ** 2 <= range ** 2,
              `The point (${x}, ${y}) is not in the range ${range}.`
            );
        }),
      {
        "*_IS_VALID": "Invalid number.",
        X_IS_POSITIVE: "Horizontal value is not positive.",
        Y_IS_POSITIVE: "Vertical value is not positive."
      }
    );
  }
}
```

Or even on a more global scope, to be applied on all defined validations:

```typescript
Validation.defaultBadgeFailureMessages = {
  "*_IS_VALID":  "Invalid number.",
  ...
};
```

Now, let's go for a more complicated example; a *nested* data structure validation. Suppose we have a definition for `Path` like this:

```typescript
interface Path {
  label: string;
  points: Point[];
  closed: boolean;
}
```

We want to check:
* The `label` to exist and to be valid,
* The `points` to include at least 2 valid `Point` objects,
* The path doesn't cross itself, unless it's a `closed` path, then it should end at another point on it.

Here is a validation defined for a `Path`, it may sound confusing at the first glance, but trust me; it's absolutely not!

```typescript
class PathValidation extends Validation<
  | "LABEL_EXISTS"
  | "LABEL_IS_VALID"
  | "POINTS_INCLUDE_AT_LEAST_TWO_ITEMS"
  | "CLOSED_PATH_RETURNS_THE_PATH"
  | "OPEN_PATH_DOES_NOT_CROSS_ITSELF",
  {
    points: {
      validation: PointValidation;
      crossing: boolean;
    }[];
  }
> {
  constructor(path: Path, range: number) {
    super((validator, validation) =>
      validator.object(path).do(({ label, points, closed }) => {
        validator
          .check("LABEL_EXISTS", !!label && typeof label === "string")
          .check("LABEL_IS_VALID", () => /^[a-z]*$/.test(label));
        validator
          .array(points)
          .each((point, index) => {
            validator.into("points", index, "validation").set(new PointValidation(point, range));
            validator.into("points", index, "crossing").put(points.some(p => p.x === point.x && p.y === point.y));
          })
          .check("POINTS_INCLUDE_AT_LEAST_TWO_ITEMS", () => points.length >= 2)
          .if(() =>  validation.$.points.every(p  =>  p.validation.ok))
          .must(() => validation.$.points.slice(0, -1).every(p => !p.crossing))
          .then(() => {
            validator
              .if(closed)
              .check("CLOSED_PATH_RETURNS_THE_PATH", () => validation.$.points[points.length - 1].crossing);
            validator
              .if(!closed)
              .check("OPEN_PATH_DOES_NOT_CROSS_ITSELF", () => !validation.$.points[points.length - 1].crossing);
          });
      })
    );
  }
}
```

There are many different ways how someone could define a validation, the above is one possible way for our `Path`. Let's explain it:

First note the second type argument:

```typescript
{
  points: {
    validation: PointValidation;
    crossing: boolean;
  }[];
}
```

given to the base generic class `Validation`; It will be the type of the object `validation.$`, a helper internal data structure that helps the `validator` to validate *complex*, *dynamic* and/or *nested* data structures.

Also, note the parameter `validation` as the second provided argument after `validator` in the `super` constructor call; It's the same as `this` for our `PathValidation`'s constructor. However, you can't access `this` itself directly inside the `super((validator, validation) => { ... });` call, because the `this` keyword is only available after `super()` call is finished for inherited classes!

What else is new? Hmm... Aha! The `.array(target)` makes sure that the `target` is an **existing array** (something like a `[ ... ]` in a *json* file, not an array-like object), so you can **safely** iterate it during the next `.each()` step. Otherwise, the validation fails and the rest of the *chain* blocks.

You can fill `validation.$` using the two *chain*s below:
* `validator.into(...path_in_$).set(partial_validation)`: Which puts the `partial_validation` into the `...path_in_$` address in `validation.$` and invalidates the validation for invalid `partial_validation`s, also, blocks the rest of the *chain* in that case,
* `validator.into(...path_in_$).put(any_value)`: Just like the previous one, but does not affect the validity status.

There are more new *chaining rings* in this example:
* `if()`: Checks one <small>(or more)</small> condition(s) <small>(or condition provider(s))</small> and blocks the rest of the *chain* if there is some unsatisfied condition,
* `must()`: Just like `if()`, but invalidates the validation too,
* `then()`: Does nothing but to run the given task when it comes to this point.

Validating a `Path` will become a simple task to do:

```typescript
var myPath: Path = {
  label: 'Route66',
  points: [
    { x: 10, y, 10 },
    { x: 10, y, 25 },
    { x: 15, y, 5 }
  ],
  closed: false
};

const validation = new PathValidation(myPath);
if (validation.ok) {
  // myPath and all its points are valid!
} else {
  validation.messages();                               // The list of all direct error messages with myPath
  validation.has('LABEL_IS_VALID');                    // Did myPath gain the badge LABEL_IS_VALID?
  validation.$.points[0].validation.ok;                // The PointValidation for the first point in myPath
  validation.$.points[1].crossing;                     // false, the second point doesn't cross the path behind
  validation.$.points[2].validation.has('X_IS_VALID'); // Did the thrid point in myPath gain the badge X_IS_VALID?
  ...
}
```

There are even more *chaining rings*:
* `else()`: Toggles the *activeness* status of the *chain*,
* `earn()`: Simply gives a badge to this validation,
* `fail()`: Simply makes the validation to fail at a badge and block.

For example, the following *chain*s are **near exactly** the same:

```typescript
validator.check("BADGE", condition, "Error message.");

validator
  .if(condition)
  .earn("BADGE")
  .else()
  .fail("BADGE", "Error message.");

validator
  .if(condition)
  .earn("BADGE")
  .else(() => validator.fail("BADGE", "Error message."));
```

The only difference is the two conditional *chain*s continue after `.else()` only if the `condition` is `false` but the first `check()` *chain* continues only when the `condition` becomes `true`. In order to fix it and make all three above *chains* quiet similar, we can just add another extra `.else()` *ring* to those *chain*s:

```typescript
validator
  .if(condition)
  .earn("BADGE")
  .else()
  .fail("BADGE", "Error message.")
  .else()
  . ...

validator
  .if(condition)
  .earn("BADGE")
  .else(() => validator.fail("BADGE", "Error message."))
  .else()
  . ...
```

## How to integrate?

*~~Not documented yet!~~*

## API

*~~Not documented yet!~~*

## Notes

*~~Not documented yet!~~*

## Examples

*~~Not documented yet!~~*

## Development

Run tests (Powered by *jest*):

```sh
$ npm test
```

Build the project into the `dist` folder:

```sh
$ npm run build
```

> It is preferred to develop this project by VS Code with Prettier extension installed. 

## Contribute

It would be appreciated if you had any suggestion or contribution on this package or detected any bug.
+ See the code on [GitHub.com](https://github.com/ahs502/validation)
+ See the package on [npmjs.com](https://www.npmjs.com/package/@ahs502/validation)
+ Contact me by [my gmail](ahs502@gmail.com)  *(Hessamoddin A Shokravi)*
