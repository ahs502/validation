import Validation from '../../../src/Validation';
import ValidatorBase from '../../../src/ValidatorBase';

describe('Validator', () => {
  describe('then ring', () => {
    describe('basic functionality', () => {
      it('should pass data to its task and set data with the result without breaking the chain', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(5)
                  .then(n => (n + 1).toString())
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('6');
      });

      it('should work fine with a promise result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(5)
                  .then(n => Promise.resolve((n + 1).toString()))
                  .earn('A').value
              ).then(feed => (result = feed))
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
        expect(result).toBe('6');
      });

      it('should work fine with a validator result', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(5)
                  .then(n => validator.with((n + 1).toString()))
                  .earn('A').value)
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('6');
      });

      it('should work fine with an async validator result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(5)
                  .then(n => validator.with(Promise.resolve((n + 1).toString())))
                  .earn('A').value
              ).then(feed => (result = feed))
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
        expect(result).toBe('6');
      });

      it('should not work fine with an unsafe validator result', () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(
              validator =>
                (result = validator
                  .with(5)
                  .then(n => validator.if().with((n + 1).toString()))
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

      it('should not work fine with an unsafe async validator result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(5)
                  .then(n => validator.if().with(Promise.resolve((n + 1).toString())))
                  .earn('A').value
              ).then(feed => (result = feed))
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

      it('should mark the chain unsafe if it comes after check rings', () => {
        class TestValidation extends Validation {
          constructor() {
            super(validator => validator.then(() => validator.if().then(() => 10)));
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
            super(validator => validator.if(false).then(() => validator.earn('A')));
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('work asynchronous correctly', () => {
      it('should pass data to its task and set data with the result without breaking the chain', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(Promise.resolve(5))
                  .then(n => (n + 1).toString())
                  .earn('A').value
              ).then(feed => (result = feed))
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
        expect(result).toBe('6');
      });

      it('should work fine with a promise result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(Promise.resolve(5))
                  .then(n => Promise.resolve((n + 1).toString()))
                  .earn('A').value
              ).then(feed => (result = feed))
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
        expect(result).toBe('6');
      });

      it('should work fine with a validator result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(Promise.resolve(5))
                  .then(n => validator.with((n + 1).toString()))
                  .earn('A').value
              ).then(feed => (result = feed))
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
        expect(result).toBe('6');
      });

      it('should work fine with an async validator result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(Promise.resolve(5))
                  .then(n => validator.with(Promise.resolve((n + 1).toString())))
                  .earn('A').value
              ).then(feed => (result = feed))
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
        expect(result).toBe('6');
      });

      it('should not work fine with an unsafe validator result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(Promise.resolve(5))
                  .then(n => validator.if().with((n + 1).toString()))
                  .earn('A').value
              ).then(feed => (result = feed))
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

      it('should not work fine with an unsafe async validator result', async () => {
        let result: any = undefined;
        class TestValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              Promise.resolve(
                validator
                  .with(Promise.resolve(5))
                  .then(n => validator.if().with(Promise.resolve((n + 1).toString())))
                  .earn('A').value
              ).then(feed => (result = feed))
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

      it('should mark the chain unsafe if it comes after check rings', async () => {
        class TestValidation extends Validation {
          constructor() {
            super(validator =>
              validator.with(Promise.resolve()).then(() =>
                validator
                  .with(Promise.resolve())
                  .if()
                  .then(() => 10)
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
                .then(() => validator.earn('A'))
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
