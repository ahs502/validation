import Validation from '../../src/Validation';

describe('Validation', () => {
  describe('failure in synchronous validation', () => {
    class MyValidation extends Validation {
      constructor() {
        super(() => {
          throw 'Hi!';
        });
      }
    }

    it('should throw proper error when initializing.', () => {
      try {
        new MyValidation();
        throw 'Test failed.';
      } catch (error) {
        expect(error).toBe('Hi!');
      }
    });
  });

  describe('failure in asynchronous validation', () => {
    class MyValidation extends Validation {
      constructor() {
        super(validator => validator.after(Promise.reject('Hi!')));
      }
    }

    it('should reject with proper error after initializing.', async () => {
      const validation = new MyValidation();
      expect(validation.ok).toBe(true);
      try {
        await validation.async;
        throw 'Test failed.';
      } catch (error) {
        expect(error).toBe('Hi!');
        expect(validation.ok).toBe(undefined);
      }
    });
  });
});
