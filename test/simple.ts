import Validation from '../src/Validation';

describe('Validation', () => {
  describe('Simple usage', () => {
    interface Point {
      x: number;
      y: number;
    }

    test.each`
      point                   | ok
      ${{ x: 3420, y: 982 }}  | ${true}
      ${{ x: 0, y: 1 }}       | ${true}
      ${{ x: 1, y: 0 }}       | ${true}
      ${{ x: 0, y: 0 }}       | ${false}
      ${{ x: 136, y: -3490 }} | ${false}
      ${{ x: 325 }}           | ${false}
      ${{ x: '18', y: 775 }}  | ${false}
      ${{ x: 4, y: true }}    | ${false}
      ${null}                 | ${false}
      ${123}                  | ${false}
    `('should validate to $ok for point $point', ({ point, ok }) => {
      class PointValidation extends Validation<'X_IS_VALID' | 'X_IS_NOT_NEGATIVE' | 'Y_IS_VALID' | 'Y_IS_NOT_NEGATIVE' | 'NOT_ON_XY_LINE'> {
        constructor(point: Point) {
          super(validator =>
            validator.object(point).do(({ x, y }) => {
              validator.check('X_IS_VALID', typeof x === 'number').check('X_IS_NOT_NEGATIVE', () => x >= 0);
              validator.check('Y_IS_VALID', typeof y === 'number').check('Y_IS_NOT_NEGATIVE', () => y >= 0);
              validator.when('X_IS_NOT_NEGATIVE', 'Y_IS_NOT_NEGATIVE').check('NOT_ON_XY_LINE', () => x !== y);
            })
          );
        }
      }
      const validation = new PointValidation(point);
      expect(validation.ok).toBe(ok);
    });
  });
});
