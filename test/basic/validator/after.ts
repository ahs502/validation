import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('after ring', () => {
    describe('basic functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(6)
                  .after(x => x - 1, 'something', true, x => x, 'another thing', false)
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should work with promise output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(6)
                .after(x => x - 1, Promise.resolve('something'), true, x => Promise.resolve(x), 'another thing', false)
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should work with validation chain output', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(6)
                  .after(x => x - 1, 'something', validator.with(true), x => validator.with(x), validator.with('another thing'), false)
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should work with asynchronous validation chain output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(6)
                .after(
                  x => validator.with(Promise.resolve(x - 1)),
                  'something',
                  Promise.resolve(true),
                  x => x,
                  'another thing',
                  validator.with(Promise.resolve(false))
                )
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should not work with unsafe validation chain output', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(6)
                  .after(x => x - 1, 'something', validator.if().with(true), x => validator.with(x), validator.with('another thing'), false)
                  .earn('A').value)
            );
          }
        }

        try {
          new TestValidation();
          expect(true).toBe(false);
        } catch (reason) {
          expect(result).toBe(undefined);
        }
      });

      it('should not work with asynchronous unsafe validation chain output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(6)
                .after(
                  x => validator.if().with(Promise.resolve(x - 1)),
                  'something',
                  Promise.resolve(true),
                  x => x,
                  'another thing',
                  validator.with(Promise.resolve(false))
                )
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        try {
          new TestValidation();
          expect(false).toBe(true);
        } catch (error) {
          expect(result).toBe(undefined);
        }
      });

      it('should mark the chain unsafe if it comes after check rings', () => {
        class TestValidation extends Validation {
          constructor() {
            super(validator => validator.then(() => validator.if().after(10)));
          }
        }

        try {
          new TestValidation();
          expect(true).toBe(false);
        } catch {}
      });

      it('should get bypassed correctly', () => {
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator => validator.if(false).after(() => validator.earn('A')));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('asynchronous functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(6))
                .after(x => x - 1, 'something', true, x => x, 'another thing', false)
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toEqual(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should work with promise output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(6))
                .after(x => Promise.resolve(x - 1), Promise.resolve('something'), true, x => x, 'another thing', Promise.resolve(false))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should work with validation chain output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(6))
                .after(x => x - 1, 'something', validator.with(true), x => validator.with(x), 'another thing', false)
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should work with asynchronous validation chain output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(6))
                .after(
                  x => validator.with(Promise.resolve(x - 1)),
                  'something',
                  Promise.resolve(true),
                  x => validator.with(x),
                  validator.with(Promise.resolve('another thing')),
                  false
                )
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([5, 'something', true, 6, 'another thing', false]);
      });

      it('should not work with unsafe validation chain output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(6))
                .after(x => x - 1, 'something', validator.if().with(true), x => validator.with(x), validator.with('another thing'), false)
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        let validation!: TestValidation;
        try {
          validation = new TestValidation();
          expect(validation.ok).toBe(true);
          expect(validation.badges).toEqual([]);
          expect(result).toBe(undefined);
          await validation.async;
          expect(true).toBe(false);
        } catch (reason) {
          expect(validation.ok).toBe(undefined);
          expect(validation.badges).toEqual([]);
          expect(result).toEqual(undefined);
        }
      });

      it('should not work with asynchronous unsafe validation chain output', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(6))
                .after(
                  x => validator.if().with(Promise.resolve(x - 1)),
                  'something',
                  Promise.resolve(true),
                  x => x,
                  'another thing',
                  validator.with(Promise.resolve(false))
                )
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        let validation!: TestValidation;
        try {
          validation = new TestValidation();
          expect(validation.ok).toBe(true);
          expect(validation.badges).toEqual([]);
          expect(result).toBe(undefined);
          await validation.async;
          expect(true).toBe(false);
        } catch (error) {
          expect(validation.ok).toBe(undefined);
          expect(validation.badges).toEqual([]);
          expect(result).toEqual(undefined);
        }
      });

      it('should mark the chain unsafe if it comes after check rings', async () => {
        class TestValidation extends Validation {
          constructor() {
            super(validator =>
              validator.with(Promise.resolve()).then(() =>
                validator
                  .with(Promise.resolve())
                  .if()
                  .after(10)
              )
            );
          }
        }

        try {
          await new TestValidation().async;
          expect(true).toBe(false);
        } catch {}
      });

      it('should get bypassed correctly', async () => {
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with(Promise.resolve())
                .if(false)
                .after(() => validator.earn('A'))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });
  });
});
