import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('with ring', () => {
    it('should work synchronously and provide data', () => {
      let result: any = undefined;
      class TestValidation extends Validation<'A'> {
        constructor(data: any) {
          super(validator => (result = validator.with(data).earn('A').value));
        }
      }

      const data: any = { a: 1 };
      const validation = new TestValidation(data);
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(result).toBe(data);
    });

    it('should work synchronously and provide data with promises', async () => {
      let result: any = undefined;
      class TestValidation extends Validation<'A'> {
        constructor(data: any) {
          super(validator =>
            validator
              .with(Promise.resolve(data))
              .earn('A')
              .value.then(feed => (result = feed))
          );
        }
      }

      const data: any = { a: 1 };
      const validation = new TestValidation(data);
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(result).toBe(undefined);
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(result).toBe(data);
    });

    it('should work asynchronously and provide data', async () => {
      let result: any = undefined;
      class TestValidation extends Validation<'A'> {
        constructor(data: any) {
          super(validator =>
            validator
              .then(() => Promise.resolve())
              .with(data)
              .earn('A')
              .value.then(feed => (result = feed))
          );
        }
      }

      const data: any = { a: 1 };
      const validation = new TestValidation(data);
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(result).toBe(undefined);
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(result).toBe(data);
    });

    it('should work asynchronously and provide data with promises', async () => {
      let result: any = undefined;
      class TestValidation extends Validation<'A'> {
        constructor(data: any) {
          super(validator =>
            validator
              .then(() => Promise.resolve())
              .with(Promise.resolve(data))
              .earn('A')
              .value.then(feed => (result = feed))
          );
        }
      }

      const data: any = { a: 1 };
      const validation = new TestValidation(data);
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual([]);
      expect(result).toBe(undefined);
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(result).toBe(data);
    });
  });
});
