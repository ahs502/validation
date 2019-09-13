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
  describe('set ring', () => {
    it('should set validation.$ values without blocking the chain', () => {
      let result: any = undefined;
      class TestValidation extends Validation<'A', $Type> {
        constructor() {
          super(
            validator =>
              (result = validator
                .with(10)
                .set(validator.$.b[1].d.f[2])
                .earn('A').value)
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(result).toBe(10);
      expect(validation.$).toEqual({ b: [undefined, { d: { f: [undefined, undefined, 10] } }] });
    });

    it('should work async correctly', async () => {
      let result: any = undefined;
      class TestValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator =>
            (validator
              .with(Promise.resolve(10))
              .set(validator.$.b[1].d.f[2])
              .earn('A').value as Promise<any>).then(feed => (result = feed))
          );
        }
      }

      const validation = new TestValidation();
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
      class TestValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator =>
            validator
              .with(10)
              .if(false)
              .set(validator.$.b[1].d.f[2])
              .earn('A')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(validation.$).toEqual({});
    });

    it('should get bypassed asynchronously correctly', async () => {
      class TestValidation extends Validation<'A', $Type> {
        constructor() {
          super(validator =>
            validator
              .with(Promise.resolve(10))
              .if(false)
              .set(validator.$.b[1].d.f[2])
              .earn('A')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(validation.$).toEqual({});
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(validation.$).toEqual({});
    });
  });
});
