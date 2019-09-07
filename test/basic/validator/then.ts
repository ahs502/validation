import Validation from '../../../src/Validation';
import ValidatorBase from '../../../src/ValidatorBase';

describe('Validator', () => {
  describe('then ring', () => {
    describe('basic functionality', () => {
      it('should pass data to its task and set data with the result without breaking the chain', () => {
        let result: any = undefined;
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('6');
      });

      it('should work fine with a promise result', async () => {
        let result: any = undefined;
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
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
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('6');
      });

      it('should work fine with an async validator result', async () => {
        let result: any = undefined;
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('6');
      });

      it('should get bypassed correctly', () => {
        class ThenValidation extends Validation<'A'> {
          constructor() {
            super(validator => validator.if(false).then(() => validator.earn('A')));
          }
        }

        const validation = new ThenValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });

    describe('work asynchronous correctly', () => {
      it('should pass data to its task and set data with the result without breaking the chain', async () => {
        let result: any = undefined;
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
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
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
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
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
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
        class ThenValidation extends Validation<'A'> {
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

        const validation = new ThenValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(result).toBe(undefined);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(result).toBe('6');
      });

      it('should get bypassed correctly', async () => {
        class ThenValidation extends Validation<'A'> {
          constructor() {
            super(validator =>
              validator
                .with(Promise.resolve())
                .if(false)
                .then(() => validator.earn('A'))
            );
          }
        }

        const validation = new ThenValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
      });
    });
  });
});
