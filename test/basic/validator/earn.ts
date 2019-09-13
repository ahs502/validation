import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('earn ring', () => {
    describe('basic', () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator => validator.earn('A'));
        }
      }

      it('should be able to be initialized', () => {
        const validation = new TestValidation();
        expect(validation).toBeInstanceOf(TestValidation);
      });

      it('should not invalidate.', () => {
        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
      });

      it('should has the earned badges.', () => {
        const validation = new TestValidation();
        expect(validation.badges).toEqual(['A']);
        expect(validation.has('A')).toBe(true);
      });

      it('should has no failed badges.', () => {
        const validation = new TestValidation();
        expect(validation.failedBadges.length).toBe(0);
        expect(validation.errors).toEqual({});
      });

      it('should have no error messages.', () => {
        const validation = new TestValidation();
        expect(validation.messages().length).toBe(0);
        expect(validation.message()).toBe(undefined);
        expect(validation.messages('A').length).toBe(0);
        expect(validation.message('A')).toBe(undefined);
      });

      it('should throw nothing.', () => {
        const validation = new TestValidation();
        validation.throw();
      });

      it('should get resolved without errors and change in results.', async () => {
        const validation = new TestValidation();
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(validation.failedBadges).toEqual([]);
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
            validator.earn('A');
            validator.earn('B').earn('C');
            validator
              .earn('A')
              .earn('B')
              .earn('C')
              .earn('D');
          });
        }
      }

      it('should be able to be initialized', () => {
        const validation = new TestValidation();
        expect(validation).toBeInstanceOf(TestValidation);
      });

      it('should not invalidate.', () => {
        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
      });

      it('should not block the chain.', () => {
        const validation = new TestValidation();
        expect(validation.has('D')).toBe(true);
      });

      it('should has the earned badges.', () => {
        const validation = new TestValidation();
        expect(validation.badges).toEqual(['A', 'B', 'C', 'D']);
        expect(validation.has('A')).toBe(true);
        expect(validation.has('A', 'B')).toBe(true);
        expect(validation.has('B', 'C', 'D')).toBe(true);
      });

      it('should has no failed badges.', () => {
        const validation = new TestValidation();
        expect(validation.failedBadges.length).toBe(0);
        expect(validation.errors).toEqual({});
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

      it('should throw nothing.', () => {
        const validation = new TestValidation();
        validation.throw();
      });

      it('should get resolved without errors and change in results.', async () => {
        const validation = new TestValidation();
        await validation.async;
        expect(validation.ok).toBe(true);
      });

      it('should get disposed successfully and still get resolved.', async () => {
        const validation = new TestValidation();
        validation.dispose();
        await validation.async;
        expect(validation.ok).toBe(true);
      });
    });

    it('should get bypassed correctly', () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator => validator.must(false).earn('A'));
        }
      }

      const validation = new TestValidation();
      expect(validation.badges).toEqual([]);
    });

    it('should work async correctly', async () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator => validator.with(Promise.resolve()).earn('A'));
        }
      }

      const validation = new TestValidation();
      expect(validation.badges).toEqual([]);
      await validation.async;
      expect(validation.badges).toEqual(['A']);
    });
  });
});
