import Validation from '../dist/Validation';

test('Validation to work', () => {
  class PointValidation extends Validation<'X_IS_VALID' | 'X_IS_NOT_NEGATIVE' | 'Y_IS_VALID' | 'Y_IS_NOT_NEGATIVE' | 'NOT_ON_XY_LINE'> {
    constructor(point: any) {
      super(validator =>
        validator.object(point).do(({ x, y }) => {
          validator.check('X_IS_VALID', typeof x === 'number').check('X_IS_NOT_NEGATIVE', () => x >= 0);
          validator.check('Y_IS_VALID', typeof y === 'number').check('Y_IS_NOT_NEGATIVE', () => y >= 0);
          validator.when('X_IS_NOT_NEGATIVE', 'Y_IS_NOT_NEGATIVE').check('NOT_ON_XY_LINE', () => x !== y);
        })
      );
    }
  }
  const point = { x: 324, y: 812 };
  const validation = new PointValidation(point);
  expect(validation.ok).toBe(true);
});
