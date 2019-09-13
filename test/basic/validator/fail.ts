import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('fail ring', () => {
    describe('basic', () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator => validator.fail('A'));
        }
      }

      it('should be able to be initialized', () => {
        const validation = new TestValidation();
        expect(validation).toBeInstanceOf(TestValidation);
      });

      it('should invalidate.', () => {
        const validation = new TestValidation();
        expect(validation.ok).toBe(false);
      });

      it('should has no earned badges.', () => {
        const validation = new TestValidation();
        expect(validation.badges).toEqual([]);
        expect(validation.has('A')).toBe(false);
      });

      it('should has the failed badges.', () => {
        const validation = new TestValidation();
        expect(validation.failedBadges).toEqual(['A']);
        expect(validation.errors).toEqual({ A: '' });
      });

      it('should have no error messages.', () => {
        const validation = new TestValidation();
        expect(validation.messages().length).toBe(0);
        expect(validation.message()).toBe(undefined);
        expect(validation.messages('A').length).toBe(0);
        expect(validation.message('A')).toBe(undefined);
      });

      it('should throw properly.', () => {
        const validation = new TestValidation();
        try {
          validation.throw();
          throw 'Test failed.';
        } catch (error) {
          expect(error).toBe('');
        }
        try {
          validation.throw('Something!');
          throw 'Test failed.';
        } catch (error) {
          expect(error).toBe('Something!');
        }
      });

      it('should get resolved without errors and change in results.', async () => {
        const validation = new TestValidation();
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
        expect(validation.failedBadges).toEqual(['A']);
      });

      it('should get disposed successfully and still get resolved.', async () => {
        const validation = new TestValidation();
        validation.dispose();
        await validation.async;
      });
    });

    describe('multiple', () => {
      class TestValidation extends Validation<'A' | 'B' | 'C' | 'D'> {
        constructor() {
          super(validator => {
            validator.fail('A');
            validator.fail('B').fail('C');
            validator
              .fail('A')
              .fail('B')
              .fail('C')
              .fail('D');
          });
        }
      }

      it('should be able to be initialized', () => {
        const validation = new TestValidation();
        expect(validation).toBeInstanceOf(TestValidation);
      });

      it('should invalidate.', () => {
        const validation = new TestValidation();
        expect(validation.ok).toBe(false);
      });

      it('should not block the chain.', () => {
        const validation = new TestValidation();
        expect(validation.failedBadges.includes('D')).toBe(true);
      });

      it('should has no earned badges.', () => {
        const validation = new TestValidation();
        expect(validation.badges).toEqual([]);
        expect(validation.has('A')).toBe(false);
        expect(validation.has('A', 'B')).toBe(false);
        expect(validation.has('B', 'C', 'D')).toBe(false);
      });

      it('should has no failed badges.', () => {
        const validation = new TestValidation();
        expect(validation.failedBadges).toEqual(['A', 'B', 'C', 'D']);
        expect(validation.errors).toEqual({ A: '', B: '', C: '', D: '' });
      });

      it('should have no error messages.', () => {
        const validation = new TestValidation();
        expect(validation.messages().length).toBe(0);
        expect(validation.message()).toBe(undefined);
        expect(validation.messages('A').length).toBe(0);
        expect(validation.message('A')).toBe(undefined);
        expect(validation.messages('*A').length).toBe(0);
        expect(validation.message('A*')).toBe(undefined);
        expect(validation.messages('*').length).toBe(0);
        expect(validation.message('*')).toBe(undefined);
      });

      it('should throw properly.', () => {
        const validation = new TestValidation();
        try {
          validation.throw();
          throw 'Test failed.';
        } catch (error) {
          expect(error).toBe('');
        }
        try {
          validation.throw('Something!');
          throw 'Test failed.';
        } catch (error) {
          expect(error).toBe('Something!');
        }
      });

      it('should get resolved without errors and change in results.', async () => {
        const validation = new TestValidation();
        await validation.async;
        expect(validation.ok).toBe(false);
      });

      it('should get disposed successfully and still get resolved.', async () => {
        const validation = new TestValidation();
        validation.dispose();
        await validation.async;
        expect(validation.ok).toBe(false);
      });
    });

    it('should get bypassed correctly', () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator => validator.must(false).fail('A'));
        }
      }

      const validation = new TestValidation();
      expect(validation.failedBadges).toEqual([]);
    });

    it('should work async correctly', async () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator => validator.with(Promise.resolve()).fail('A'));
        }
      }

      const validation = new TestValidation();
      expect(validation.failedBadges).toEqual([]);
      await validation.async;
      expect(validation.failedBadges).toEqual(['A']);
    });
  });
});
