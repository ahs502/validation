import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('must chain', () => {
    describe('basic functionality', () => {
      class MustValidation extends Validation<'A'> {
        constructor(a: boolean, b: boolean, c: boolean) {
          super(validator => validator.must(a, b, c).earn('A'));
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new MustValidation(true, true, true);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
      });

      it.each`
        a        | b        | c
        ${false} | ${true}  | ${true}
        ${true}  | ${false} | ${true}
        ${true}  | ${true}  | ${false}
        ${false} | ${true}  | ${false}
        ${false} | ${false} | ${false}
      `('should break the chain and invalidate iff does not pass', ({ a, b, c }) => {
        const validation = new MustValidation(a, b, c);
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('basic functionality with function conditions', () => {
      class MustValidation extends Validation<'A'> {
        constructor(a: boolean, b: boolean, c: boolean) {
          super(validator => validator.must(() => a, () => b, () => c).earn('A'));
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new MustValidation(true, true, true);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
      });

      it.each`
        a        | b        | c
        ${false} | ${true}  | ${true}
        ${true}  | ${false} | ${true}
        ${true}  | ${true}  | ${false}
        ${false} | ${true}  | ${false}
        ${false} | ${false} | ${false}
      `('should break the chain and invalidate iff does not pass', ({ a, b, c }) => {
        const validation = new MustValidation(a, b, c);
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('basic functionality with feeded function conditions', () => {
      class MustValidation extends Validation<'A'> {
        constructor(a: boolean) {
          super(validator =>
            validator
              .with(a)
              .must(feed => feed)
              .earn('A')
          );
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new MustValidation(true);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
      });

      it('should break the chain and invalidate iff does not pass', () => {
        const validation = new MustValidation(false);
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
      });
    });

    it('should get bypassed correctly', () => {
      class MustValidation extends Validation<'A'> {
        constructor() {
          super(validator =>
            validator
              .if(false)
              .must(false)
              .earn('A')
          );
        }
      }

      const validation = new MustValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
    });

    it('should work async correctly', async () => {
      class MustValidation extends Validation<'A'> {
        constructor() {
          super(validator =>
            validator
              .with(Promise.resolve('invalid'))
              .must(feed => feed !== 'invalid')
              .earn('A')
          );
        }
      }

      const validation = new MustValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      await validation.async;
      expect(validation.ok).toBe(false);
      expect(validation.badges).toEqual([]);
    });
  });
});
