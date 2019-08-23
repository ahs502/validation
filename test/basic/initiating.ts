import Validation from '../../src/Validation';

describe('Validation', () => {
  describe('initiating', () => {
    class MyValidation extends Validation {
      constructor() {
        super(() => {
          // Nothing yet!
        });
      }
    }

    it('should be able to be initialized', () => {
      const validation = new MyValidation();
      expect(validation).toBeInstanceOf(MyValidation);
    });

    it('should provide true for property ok by default.', () => {
      const validation = new MyValidation();
      expect(validation.ok).toBe(true);
    });

    it('should has no initial earned or failed badges.', () => {
      const validation = new MyValidation();
      expect(validation.badges.length).toBe(0);
      expect(validation.failedBadges.length).toBe(0);
      expect(validation.errors).toEqual({});
      expect(validation.has()).toBe(true);
    });

    it('should have no initial error messages.', () => {
      const validation = new MyValidation();
      expect(validation.messages().length).toBe(0);
      expect(validation.message()).toBe(undefined);
    });

    it('should throw nothing when its ok.', () => {
      const validation = new MyValidation();
      validation.throw();
    });

    it('should get resolved without errors and change in results.', async () => {
      const validation = new MyValidation();
      await validation.async;
      expect(validation.ok).toBe(true);
    });

    it('should get disposed successfully without any change in result due to it is synchronous.', async () => {
      const validation = new MyValidation();
      validation.dispose();
      await validation.async;
      expect(validation.ok).toBe(true);
    });
  });
});
