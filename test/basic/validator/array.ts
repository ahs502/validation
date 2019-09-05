import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('array chain', () => {
    describe('basic functionality', () => {
      let result: any;
      class ArrayValidation extends Validation<'A'> {
        constructor(data: any) {
          super(validator => (result = validator.array(data).earn('A').value));
        }
      }

      it.each`
        data                   | ok
        ${undefined}           | ${false}
        ${null}                | ${false}
        ${34}                  | ${false}
        ${NaN}                 | ${false}
        ${Infinity}            | ${false}
        ${'something'}         | ${false}
        ${/regex/}             | ${false}
        ${Symbol('something')} | ${false}
        ${true}                | ${false}
        ${false}               | ${false}
        ${Function}            | ${false}
        ${Array}               | ${false}
        ${Object}              | ${false}
        ${{}}                  | ${false}
        ${{ a: 1, b: 2 }}      | ${false}
        ${[]}                  | ${true}
        ${[1, 2, 3]}           | ${true}
      `('should provide $data anyway, continue the chain for JSON-like arrays and block it and invalidate otherwise', ({ data, ok }) => {
        result = undefined;
        const validation = new ArrayValidation(data);
        expect(validation.ok).toBe(ok);
        expect(result).toBe(data);
        expect(validation.badges).toEqual(ok ? ['A'] : []);
      });
    });

    describe('basic functionality with promises', () => {
      let result: any;
      class ArrayValidation extends Validation<'A'> {
        constructor(data: any) {
          super(validator =>
            validator
              .array(Promise.resolve(data))
              .earn('A')
              .value.then(feed => (result = feed))
          );
        }
      }

      it.each`
        data                   | ok
        ${undefined}           | ${false}
        ${null}                | ${false}
        ${34}                  | ${false}
        ${NaN}                 | ${false}
        ${Infinity}            | ${false}
        ${'something'}         | ${false}
        ${/regex/}             | ${false}
        ${Symbol('something')} | ${false}
        ${true}                | ${false}
        ${false}               | ${false}
        ${Function}            | ${false}
        ${Array}               | ${false}
        ${Object}              | ${false}
        ${{}}                  | ${false}
        ${{ a: 1, b: 2 }}      | ${false}
        ${[]}                  | ${true}
        ${[1, 2, 3]}           | ${true}
      `('should provide $data anyway, continue the chain for JSON-like arrays and block it and invalidate otherwise', async ({ data, ok }) => {
        result = undefined;
        const validation = new ArrayValidation(data);
        expect(validation.ok).toBe(true);
        expect(result).toBe(undefined);
        expect(validation.badges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(ok);
        expect(result).toBe(data);
        expect(validation.badges).toEqual(ok ? ['A'] : []);
      });
    });

    it('should get bypassed correctly', () => {
      class ArrayValidation extends Validation {
        constructor() {
          super(validator => validator.if(false).array({}));
        }
      }

      const validation = new ArrayValidation();
      expect(validation.ok).toBe(true);
    });

    it('should work async correctly', async () => {
      class ArrayValidation extends Validation {
        data: any = undefined;
        constructor() {
          super(validator =>
            validator
              .with(Promise.resolve())
              .array({})
              .value.then(feed => (this.data = feed))
          );
        }
      }

      const validation = new ArrayValidation();
      expect(validation.ok).toBe(true);
      expect(validation.data).toBe(undefined);
      await validation.async;
      expect(validation.ok).toBe(false);
      expect(validation.data).toEqual({});
    });
  });
});
