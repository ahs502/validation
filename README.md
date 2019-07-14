
# @ahs502/validation

#### A universal client and server side data model validation for complex data structures.

Have you ever struggled validating forms with *complex* and *dynamic* data structures?

Have you ever tried to validate each part of your data from *different aspects* and generate *accurate error messages* on it telling exactly what is wrong with that field?

Did you have a hard time to implement *cross field validation* or *sequential/conditional checks* on your data?

Have you ever think about implementing validation on your data model *once* and use it *both* within the *client side* and the *server side* code?

If the answer is ***yes***, then `@ahs502/validation` system is here to save the day!

+ Both **TypeScript** and **JavaScript** support
+ No rules, no conventions, just **plain JavaScript expressions to check things**

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
    super(validator =>
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
          .must(validator.$.points.every(pointValidation => pointValidation.ok))
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
  consumePath(path);
} else {
  /* Read all error messages from path validation */
  console.error(pathValidation.errors());

  /* Read all error messages related to x of all point validations */
  pathValidation.$.points.forEach(pointValidation => {
    console.error(pointValidation.errors('X_*'));
  });
}
```

## Installation

```sh
$ npm install @ahs502/validation
```

## Initialization

*~~Not documented yet!~~*

## Usage

*~~Not documented yet!~~*

## API

*~~Not documented yet!~~*

## Notes

*~~Not documented yet!~~*

## Example

*~~Not documented yet!~~*

## Development

Run tests (Powered by *jest*):

```sh
$ npm test
```

Build the project to `dist` folder:

```sh
$ npm run build
```

> It is preferred to develop this project by VS Code with Prettier extension installed. 

## Contribute

The code is simple! It would be appreciated if you had any suggestions or contribution on it or detected any bug or issue.

+ See the code on [GitHub @ahs502/validation](https://github.com/ahs502/validation)
+ Contact me by [my gmail address](ahs502@gmail.com)  *(Hessamoddin A Shokravi)*
