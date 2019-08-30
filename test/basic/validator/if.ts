import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('if chain', () => {
    describe('basic functionality', () => {
      class IfValidation extends Validation<'A'> {
        constructor(a: boolean, b: boolean, c: boolean) {
          super(validator => validator.if(a, b, c).earn('A'));
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new IfValidation(true, true, true);
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
      `('should break the chain without invalidating iff does not pass', ({ a, b, c }) => {
        const validation = new IfValidation(a, b, c);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('basic functionality with function conditions', () => {
      class IfValidation extends Validation<'A'> {
        constructor(a: boolean, b: boolean, c: boolean) {
          super(validator => validator.if(() => a, () => b, () => c).earn('A'));
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new IfValidation(true, true, true);
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
      `('should break the chain without invalidating iff does not pass', ({ a, b, c }) => {
        const validation = new IfValidation(a, b, c);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('basic functionality with feeded function conditions', () => {
      class IfValidation extends Validation<'A'> {
        constructor(a: boolean) {
          super(validator =>
            validator
              .with(a)
              .if(feed => feed)
              .earn('A')
          );
        }
      }

      it('should has no effect iff passes', () => {
        const validation = new IfValidation(true);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
      });

      it('should break the chain without invalidating iff does not pass', () => {
        const validation = new IfValidation(false);
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    it('should work async correctly', async () => {
      class IfValidation extends Validation<'A'> {
        constructor() {
          super(validator =>
            validator
              .with(Promise.resolve('invalid'))
              .if(feed => feed !== 'invalid')
              .earn('A')
          );
        }
      }

      const validation = new IfValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
    });
  });
});
