import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('must chain', () => {
    describe('basic functionality', () => {
      class TestValidation extends Validation<'A'> {
        constructor(a: boolean, b: boolean, c: boolean) {
          super(validator => validator.must(a, b, c).earn('A'));
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new TestValidation(true, true, true);
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
        const validation = new TestValidation(a, b, c);
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('basic functionality with function conditions', () => {
      class TestValidation extends Validation<'A'> {
        constructor(a: boolean, b: boolean, c: boolean) {
          super(validator => validator.must(() => a, () => b, () => c).earn('A'));
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new TestValidation(true, true, true);
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
        const validation = new TestValidation(a, b, c);
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('basic functionality with feeded function conditions', () => {
      class TestValidation extends Validation<'A'> {
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
        const validation = new TestValidation(true);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
      });

      it('should break the chain and invalidate iff does not pass', () => {
        const validation = new TestValidation(false);
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
      });
    });

    it('should get bypassed correctly', () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator =>
            validator
              .if(false)
              .must(false)
              .earn('A')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
    });

    it('should work async correctly', async () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator =>
            validator
              .with(Promise.resolve('invalid'))
              .must(feed => feed !== 'invalid')
              .earn('A')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      await validation.async;
      expect(validation.ok).toBe(false);
      expect(validation.badges).toEqual([]);
    });
  });
});
