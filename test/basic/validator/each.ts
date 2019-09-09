import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('each ring', () => {
    describe('basic functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .each((item, index, data) => item + (data[index + 1] || 0))
                  .earn('A').value)
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with promise output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .each((item, index, data) => Promise.resolve(item + (data[index + 1] || 0)))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with validation chain output', () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .each((item, index, data) => validator.with(item + (data[index + 1] || 0)))
                  .earn('A').value)
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .each((item, index, data) => validator.with(Promise.resolve(item + (data[index + 1] || 0))))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should get bypassed correctly', () => {
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with([5])
                .if(false)
                .each(() => validator.earn('A'))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('asynchronous functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => item + (data[index + 1] || 0))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toEqual(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with promise output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => Promise.resolve(item + (data[index + 1] || 0)))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => validator.with(item + (data[index + 1] || 0)))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => validator.with(Promise.resolve(item + (data[index + 1] || 0))))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should get bypassed correctly', async () => {
        class EachValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with(Promise.resolve([5]))
                .if(false)
                .each(() => validator.earn('A'))
            );
          }
        }

        const validation = new EachValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });
  });
});
