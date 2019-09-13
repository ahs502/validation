import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('do ring', () => {
    describe('basic functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .do((x, y, z) => [z, y, x])
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with promise output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .do((x, y, z) => Promise.resolve([z, y, x]))
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
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with validation chain output', () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .do((x, y, z) => validator.with([z, y, x]))
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .do((x, y, z) => validator.with(Promise.resolve([z, y, x])))
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
        expect(result).toEqual(source.slice().reverse());
      });

      it('should not work with unsafe validation chain output', () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .do((x, y, z) => validator.if().with([z, y, x]))
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

      it('should not work with unsafe asynchronous validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .do((x, y, z) => validator.if().with(Promise.resolve([z, y, x])))
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
            super(validator =>
              validator.then(() =>
                validator
                  .with([10] as [number])
                  .if()
                  .do(() => 10)
              )
            );
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
            super(validator =>
              validator
                .with(<const>[5])
                .if(false)
                .do(x => validator.earn('A'))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('asynchronous functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => [z, y, x])
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
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with promise output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => Promise.resolve([z, y, x]))
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
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => validator.with([z, y, x]))
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
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => validator.with(Promise.resolve([z, y, x])))
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
        expect(result).toEqual(source.slice().reverse());
      });

      it('should work with validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => validator.if().with([z, y, x]))
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

      it('should work with asynchronous validation chain output', async () => {
        const source = <const>[5, 'something', true];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .do((x, y, z) => validator.if().with(Promise.resolve([z, y, x])))
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
                .with(Promise.resolve(<const>[5]))
                .if(false)
                .do(x => validator.earn('A'))
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
