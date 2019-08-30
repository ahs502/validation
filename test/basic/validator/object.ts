import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('object chain', () => {
    describe('basic functionality', () => {
      class ObjectValidation extends Validation<'A'> {
        data: any;
        constructor(data: any) {
          super((validator, validation) => ((validation as ObjectValidation).data = validator.object(data).earn('A').value));
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
        ${[]}                  | ${false}
        ${[1, 2, 3]}           | ${false}
        ${true}                | ${false}
        ${false}               | ${false}
        ${Function}            | ${false}
        ${Array}               | ${false}
        ${Object}              | ${false}
        ${{}}                  | ${true}
        ${{ a: 1, b: 2 }}      | ${true}
      `('should provide $data anyway, continue the chain for JSON-like objects and block it and invalidate otherwise', ({ data, ok }) => {
        const validation = new ObjectValidation(data);
        expect(validation.ok).toBe(ok);
        expect(validation.data).toBe(data);
        expect(validation.badges).toEqual(ok ? ['A'] : []);
      });
    });

    describe('basic functionality with promises', () => {
      class ObjectValidation extends Validation<'A'> {
        data: any = undefined;
        constructor(data: any) {
          super((validator, validation) =>
            validator
              .object(Promise.resolve(data))
              .earn('A')
              .value.then(feed => ((validation as ObjectValidation).data = feed))
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
        ${[]}                  | ${false}
        ${[1, 2, 3]}           | ${false}
        ${true}                | ${false}
        ${false}               | ${false}
        ${Function}            | ${false}
        ${Array}               | ${false}
        ${Object}              | ${false}
        ${{}}                  | ${true}
        ${{ a: 1, b: 2 }}      | ${true}
      `('should provide $data anyway, continue the chain for JSON-like objects and block it and invalidate otherwise', async ({ data, ok }) => {
        const validation = new ObjectValidation(data);
        expect(validation.ok).toBe(true);
        expect(validation.data).toBe(undefined);
        expect(validation.badges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(ok);
        expect(validation.data).toBe(data);
        expect(validation.badges).toEqual(ok ? ['A'] : []);
      });
    });

    it('should get bypassed correctly', () => {
      class ObjectValidation extends Validation {
        data: any = undefined;
        constructor() {
          super((validator, validation) => ((validation as ObjectValidation).data = validator.if(false).object([]).value));
        }
      }

      const validation = new ObjectValidation();
      expect(validation.ok).toBe(true);
      expect(validation.data).toBe(undefined);
    });

    it('should work async correctly', async () => {
      class ObjectValidation extends Validation {
        data: any = undefined;
        constructor() {
          super(validator => (validator.with(Promise.resolve()).object([]).value as any).then(feed => (this.data = feed)));
        }
      }

      const validation = new ObjectValidation();
      expect(validation.ok).toBe(true);
      expect(validation.data).toBe(undefined);
      await validation.async;
      expect(validation.ok).toBe(false);
      expect(validation.data).toEqual([]);
    });
  });
});
