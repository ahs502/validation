import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('when ring', () => {
    it('should do nothing without input', () => {
      class TestValidation extends Validation<'A'> {
        constructor() {
          super(validator => validator.when().earn('A'));
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A']);
    });

    it('should pass with earned badges', () => {
      class TestValidation extends Validation<'A' | 'B' | 'C' | 'D'> {
        constructor() {
          super(validator =>
            validator
              .earn('A')
              .earn('B')
              .earn('C')
              .when('A', 'B', 'C')
              .earn('D')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A', 'B', 'C', 'D']);
    });

    it('should not pass if even one badge fails', () => {
      class TestValidation extends Validation<'A' | 'B' | 'C' | 'D'> {
        constructor() {
          super(validator =>
            validator
              .earn('A')
              .earn('C')
              .when('A', 'B', 'C')
              .earn('D')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(false);
      expect(validation.badges).toEqual(['A', 'C']);
      expect(validation.failedBadges).toEqual([]);
    });

    it('should chain correctly', () => {
      class TestValidation extends Validation<'A' | 'B' | 'C' | 'D'> {
        constructor() {
          super(validator =>
            validator
              .earn('A')
              .earn('B')
              .earn('C')
              .when('A')
              .when('B')
              .when('C')
              .earn('D')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.ok).toBe(true);
      expect(validation.badges).toEqual(['A', 'B', 'C', 'D']);
      expect(validation.failedBadges).toEqual([]);
    });

    it('should make the chain to become unsafe if a provider ring come after', () => {
      class TestValidation extends Validation {
        constructor() {
          super(validator => validator.then(() => validator.when().with(10)));
        }
      }

      try {
        new TestValidation();
      } catch {
        return;
      }
      throw 'Invalid point';
    });

    it('should get bypassed correctly', () => {
      class TestValidation extends Validation<'A' | 'B'> {
        constructor() {
          super(validator =>
            validator
              .earn('A')
              .must(false)
              .when('A')
              .earn('B')
          );
        }
      }

      const validation = new TestValidation();
      expect(validation.badges).toEqual(['A']);
      expect(validation.failedBadges).toEqual([]);
    });

    describe('async checks', () => {
      it('should pass async correctly', async () => {
        class TestValidation extends Validation<'A' | 'B'> {
          constructor() {
            super(validator =>
              validator
                .earn('A')
                .with(Promise.resolve())
                .when('A')
                .earn('B')
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(validation.failedBadges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A', 'B']);
        expect(validation.failedBadges).toEqual([]);
      });

      it('should block async correctly', async () => {
        class TestValidation extends Validation<'A' | 'B'> {
          constructor() {
            super(validator =>
              validator
                .with(Promise.resolve())
                .when('A')
                .earn('B')
            );
          }
        }

        const validation = new TestValidation();
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(validation.failedBadges).toEqual([]);
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
        expect(validation.failedBadges).toEqual([]);
      });
    });
  });
});
