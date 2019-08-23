import Validation from '../../../src/Validation';

describe('Validation', () => {
  describe('earn basic', () => {
    class EarnValidation extends Validation<'A'> {
      constructor() {
        super(validator => validator.earn('A'));
      }
    }

    it('should be able to be initialized', () => {
      const validation = new EarnValidation();
      expect(validation).toBeInstanceOf(EarnValidation);
    });

    it('should not invalidate.', () => {
      const validation = new EarnValidation();
      expect(validation.ok).toBe(true);
    });

    it('should has the earned badges.', () => {
      const validation = new EarnValidation();
      expect(validation.badges).toEqual(['A']);
      expect(validation.has('A')).toBe(true);
    });

    it('should has no failed badges.', () => {
      const validation = new EarnValidation();
      expect(validation.failedBadges.length).toBe(0);
      expect(validation.errors).toEqual({});
    });

    it('should have no error messages.', () => {
      const validation = new EarnValidation();
      expect(validation.messages().length).toBe(0);
      expect(validation.message()).toBe(undefined);
      expect(validation.messages('A').length).toBe(0);
      expect(validation.message('A')).toBe(undefined);
    });

    it('should throw nothing.', () => {
      const validation = new EarnValidation();
      validation.throw();
    });

    it('should get resolved without errors and change in results.', async () => {
      const validation = new EarnValidation();
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
      expect(validation.failedBadges).toEqual([]);
    });

    it('should get disposed successfully and still get resolved.', async () => {
      const validation = new EarnValidation();
      validation.dispose();
      await validation.async;
    });
  });

  describe('earn multiple', () => {
    class EarnValidation extends Validation<'A' | 'B' | 'C' | 'D'> {
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
      const validation = new EarnValidation();
      expect(validation).toBeInstanceOf(EarnValidation);
    });

    it('should not invalidate.', () => {
      const validation = new EarnValidation();
      expect(validation.ok).toBe(true);
    });

    it('should has the earned badges.', () => {
      const validation = new EarnValidation();
      expect(validation.badges).toEqual(['A', 'B', 'C', 'D']);
      expect(validation.has('A')).toBe(true);
      expect(validation.has('A', 'B')).toBe(true);
      expect(validation.has('B', 'C', 'D')).toBe(true);
    });

    it('should has no failed badges.', () => {
      const validation = new EarnValidation();
      expect(validation.failedBadges.length).toBe(0);
      expect(validation.errors).toEqual({});
    });

    it('should have no error messages.', () => {
      const validation = new EarnValidation();
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
      const validation = new EarnValidation();
      validation.throw();
    });

    it('should get resolved without errors and change in results.', async () => {
      const validation = new EarnValidation();
      await validation.async;
      expect(validation.ok).toBe(true);
    });

    it('should get disposed successfully and still get resolved.', async () => {
      const validation = new EarnValidation();
      validation.dispose();
      await validation.async;
      expect(validation.ok).toBe(true);
    });
  });
});
