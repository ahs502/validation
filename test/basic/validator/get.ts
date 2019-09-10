import Validation from '../../../src/Validation';

type $Type = {
  a: number;
  readonly b: readonly {
    c: string;
    d: {
      readonly e: boolean;
      readonly f: number[];
    };
  }[];
};

describe('Validator', () => {
  describe('get ring', () => {
    it('should get values from validation.$ without blocking the chain', () => {
      let result: any = undefined;
      class SetValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator => {
            validator.with(10).set(validator.$.b[1].d.f[2]);
            result = validator.get(validator.$.b[1].d.f[2]).earn('A').value;
          });
        }
      }

      const validation = new SetValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(result).toBe(10);
      expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
    });

    it('should work async correctly', async () => {
      let result: any = undefined;
      class SetValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator => {
            validator
              .with(Promise.resolve(10))
              .set(validator.$.b[1].d.f[2])
              .then(() =>
                (validator
                  .with(Promise.resolve())
                  .get(validator.$.b[1].d.f[2])
                  .earn('A').value as Promise<any>).then(feed => (result = feed))
              );
          });
        }
      }

      const validation = new SetValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(result).toBe(undefined);
      expect(validation.$).toEqual({});
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(result).toBe(10);
      expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
    });

    it('should get bypassed correctly', () => {
      let result: any = undefined;
      class SetValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator => {
            validator.with(10).set(validator.$.b[1].d.f[2]);
            result = validator
              .if(false)
              .get(validator.$.b[1].d.f[2])
              .earn('A').value;
          });
        }
      }

      const validation = new SetValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(result).toBe(undefined);
      expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
    });

    it('should get bypassed asynchronously correctly', async () => {
      let result: any = undefined;
      class SetValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator =>
            validator
              .with(Promise.resolve(10))
              .set(validator.$.b[1].d.f[2])
              .then(() =>
                (validator
                  .with(Promise.resolve())
                  .if(false)
                  .get(validator.$.b[1].d.f[2])
                  .earn('A').value as Promise<any>).then(feed => (result = feed))
              )
          );
        }
      }

      const validation = new SetValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(validation.$).toEqual({});
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
    });
  });
});
