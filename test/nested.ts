import Validation from '../src/Validation';

describe('Validation', () => {
  describe('Validation for nested data structures', () => {
    interface Point {
      x: number;
      y: number;
    }
    interface Path {
      length: number;
      points: readonly Point[];
    }

    test.each`
      length | points                                              | ok
      ${3}   | ${[{ x: 1, y: 0 }, { x: 1, y: 4 }, { x: 3, y: 5 }]} | ${true}
    `('should be able to nesting validate', ({ length, points, ok }) => {
      class PointValidation extends Validation<'X_IS_VALID' | 'X_IS_NOT_NEGATIVE' | 'Y_IS_VALID' | 'Y_IS_NOT_NEGATIVE'> {
        constructor(point: Point) {
          super(validator =>
            validator.object(point).do(({ x, y }) => {
              validator.check('X_IS_VALID', typeof x === 'number').check('X_IS_NOT_NEGATIVE', () => x >= 0);
              validator.check('Y_IS_VALID', typeof y === 'number').check('Y_IS_NOT_NEGATIVE', () => y >= 0);
            })
          );
        }
      }
      class PathValidation extends Validation<
        'LENGTH_EXISTS' | 'LENGTH_IS_VALID' | 'LENGTH_IS_MORE_THAN_2' | 'LENGTH_EQUALS_NUMBER_OF_POINTS',
        { readonly points: readonly PointValidation[] }
      > {
        constructor(path: Path) {
          super(validator =>
            validator.object(path).do(({ length, points }) => {
              validator
                .check('LENGTH_EXISTS', !!length || length === 0 || isNaN(length))
                .check('LENGTH_IS_VALID', () => typeof length === 'number' && !isNaN(length) && length >= 0)
                .check('LENGTH_IS_MORE_THAN_2', () => length >= 2);
              validator.array(points).each((point, index) => validator.into('points', index).set(new PointValidation(point)));
              validator
                .when('LENGTH_IS_VALID')
                .must(validator.$.points.every(v => v.ok))
                .check('LENGTH_EQUALS_NUMBER_OF_POINTS', () => length === points.length);
            })
          );
        }
      }
      const path: Path = { points, length };
      const validation = new PathValidation(path);
      expect(validation.ok).toBe(ok);
    });
  });
});
