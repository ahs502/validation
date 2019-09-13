import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('each ring', () => {
    describe('basic functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
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

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with promise output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .each((item, index, data) => Promise.resolve(item + (data[index + 1] || 0)))
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
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with validation chain output', () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
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

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .each((item, index, data) => validator.with(Promise.resolve(item + (data[index + 1] || 0))))
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
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should not work with unsafe validation chain output', () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(source)
                  .each((item, index, data) => validator.if().with(item + (data[index + 1] || 0)))
                  .earn('A').value)
            );
          }
        }

        try {
          new TestValidation();
        } catch (reason) {
          expect(result).toBe(undefined);
          return;
        }
        expect(true).toBe(false);
      });

      it('should not work with unsafe asynchronous validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(source)
                .each((item, index, data) => validator.if().with(Promise.resolve(item + (data[index + 1] || 0))))
                .earn('A').value as Promise<any>).then(feed => (result = feed))
            );
          }
        }

        try {
          new TestValidation();
        } catch (reason) {
          expect(result).toBe(undefined);
          return;
        }
        expect(true).toBe(false);
      });

      it('should mark the chain unsafe if it comes after check rings', () => {
        class TestValidation extends Validation {
          constructor() {
            super(validator =>
              validator.then(() =>
                validator
                  .with([10])
                  .if()
                  .each(() => 10)
              )
            );
          }
        }

        try {
          new TestValidation();
        } catch {
          return;
        }
        expect(true).toBe(false);
      });

      it('should get bypassed correctly', () => {
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with([5])
                .if(false)
                .each(() => validator.earn('A'))
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });

      it.each`
        data
        ${undefined}
        ${null}
        ${10}
        ${'something'}
        ${true}
        ${NaN}
        ${{}}
        ${/a/}
        ${Infinity}
        ${() => {}}
      `('should throw for non-array data $data', ({ data }) => {
        class TestValidation extends Validation {
          constructor() {
            super(validator => (validator.with(data) as any).each(() => 10));
          }
        }

        try {
          new TestValidation();
        } catch {
          return;
        }
        expect(true).toBe(false);
      });
    });

    describe('asynchronous functionality', () => {
      it("should use the chain's data destructured and pass the result to the rest of the chain without blocking it", async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => item + (data[index + 1] || 0))
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
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with promise output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => Promise.resolve(item + (data[index + 1] || 0)))
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
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => validator.with(item + (data[index + 1] || 0)))
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
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should work with asynchronous validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => validator.with(Promise.resolve(item + (data[index + 1] || 0))))
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
        expect(result).toEqual([3, 5, 7, 4]);
      });

      it('should not work with unsafe validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => validator.if().with(item + (data[index + 1] || 0)))
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
        } catch (reason) {
          expect(validation.ok).toBe(undefined);
          expect(validation.badges).toEqual([]);
          expect(result).toEqual(undefined);
          return;
        }
        expect(true).toBe(false);
      });

      it('should not work with unsafe asynchronous validation chain output', async () => {
        const source = [1, 2, 3, 4];
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              (validator
                .with(Promise.resolve(source))
                .each((item, index, data) => validator.if().with(Promise.resolve(item + (data[index + 1] || 0))))
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
        } catch (reason) {
          expect(validation.ok).toBe(undefined);
          expect(validation.badges).toEqual([]);
          expect(result).toEqual(undefined);
          return;
        }
        expect(true).toBe(false);
      });

      it('should mark the chain unsafe if it comes after check rings', async () => {
        class TestValidation extends Validation {
          constructor() {
            super(validator =>
              validator.with(Promise.resolve()).then(() =>
                validator
                  .with(Promise.resolve([10]))
                  .if()
                  .each(() => 10)
              )
            );
          }
        }

        try {
          await new TestValidation().async;
        } catch {
          return;
        }
        expect(true).toBe(false);
      });

      it('should get bypassed correctly', async () => {
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with(Promise.resolve([5]))
                .if(false)
                .each(() => validator.earn('A'))
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

      it.each`
        data
        ${undefined}
        ${null}
        ${10}
        ${'something'}
        ${true}
        ${NaN}
        ${{}}
        ${/a/}
        ${Infinity}
        ${() => {}}
      `('should throw for non-array data $data', async ({ data }) => {
        class TestValidation extends Validation {
          constructor() {
            super(validator => (validator.with(Promise.resolve(data)) as any).each(() => 10));
          }
        }

        try {
          await new TestValidation().async;
        } catch {
          return;
        }
        expect(true).toBe(false);
      });
    });
  });
});
