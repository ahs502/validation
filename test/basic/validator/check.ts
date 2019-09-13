import Validation from '../../../src/Validation';

describe('Validator', () => {
  describe('check ring', () => {
    describe('simple check', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.check('A', data === 'valid'));
        }
      }

      it('should validate a valid data', () => {
        const validation = new TestValidation('valid');
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(validation.failedBadges).toEqual([]);
      });

      it('should invalidate an invalid data', () => {
        const validation = new TestValidation('invalid');
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
        expect(validation.failedBadges).toEqual(['A']);
      });
    });

    describe('simple check with function validator', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.check('A', () => data === 'valid'));
        }
      }

      it('should validate a valid data', () => {
        const validation = new TestValidation('valid');
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(validation.failedBadges).toEqual([]);
      });

      it('should invalidate an invalid data', () => {
        const validation = new TestValidation('invalid');
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
        expect(validation.failedBadges).toEqual(['A']);
      });
    });

    describe('simple check with feeded function validator', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.with('valid').check('A', feed => data === feed));
        }
      }

      it('should validate a valid data', () => {
        const validation = new TestValidation('valid');
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(validation.failedBadges).toEqual([]);
      });

      it('should invalidate an invalid data', () => {
        const validation = new TestValidation('invalid');
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
        expect(validation.failedBadges).toEqual(['A']);
      });
    });

    describe('simple check without message', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.check('A', data === 'valid'));
        }
      }

      it('should invalidate an invalid data without error messages', () => {
        const validation = new TestValidation('invalid');
        expect(validation.errors).toEqual({ A: '' });
        expect(validation.message()).toBe(undefined);
        expect(validation.message('B*')).toBe(undefined);
        expect(validation.messages('*')).toEqual([]);
      });
    });

    describe('simple check with message', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.check('A', data === 'valid', 'something'));
        }
      }

      it('should validate a valid data without error messages', () => {
        const validation = new TestValidation('valid');
        expect(validation.ok).toBe(true);
        expect(validation.errors).toEqual({});
        expect(validation.message()).toBe(undefined);
        expect(validation.message('B*')).toBe(undefined);
        expect(validation.messages('*')).toEqual([]);
      });

      it('should invalidate an invalid data with proper error message', () => {
        const validation = new TestValidation('invalid');
        expect(validation.errors).toEqual({ A: 'something' });
        expect(validation.message()).toBe('something');
        expect(validation.message('B*')).toBe(undefined);
        expect(validation.messages('*')).toEqual(['something']);
      });
    });

    describe('simple check with message function', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.check('A', data === 'valid', () => 'something'));
        }
      }

      it('should invalidate an invalid data with proper error message', () => {
        const validation = new TestValidation('invalid');
        expect(validation.errors).toEqual({ A: 'something' });
        expect(validation.message()).toBe('something');
        expect(validation.message('B*')).toBe(undefined);
        expect(validation.messages('*')).toEqual(['something']);
      });
    });

    describe('simple check with feeded message function', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.with('something').check('A', data === 'valid', feed => feed));
        }
      }

      it('should invalidate an invalid data with proper error message', () => {
        const validation = new TestValidation('invalid');
        expect(validation.errors).toEqual({ A: 'something' });
        expect(validation.message()).toBe('something');
        expect(validation.message('B*')).toBe(undefined);
        expect(validation.messages('*')).toEqual(['something']);
      });
    });

    describe('block chain behaviour', () => {
      class TestValidation extends Validation<'A' | 'B' | 'C' | 'D' | 'E' | 'F'> {
        constructor(data: string) {
          super(
            validator => {
              validator
                .check('A', data.includes('A'), '!A')
                .check('B', () => data.includes('B'))
                .check('C', () => data.includes('C'))
                .check('D', () => data.includes('D'));
              validator.check('E', data.includes('E')).check('F', () => data.includes('F'));
            },
            {
              B: '!B',
              'C*': '!C',
              '*D': '!D',
              '*': '!!',
              E: 'never',
              F: 'never'
            }
          );
        }
      }

      test.each`
        data        | ok       | badges                            | failedBadges  | errors
        ${'ABCDEF'} | ${true}  | ${['A', 'B', 'C', 'D', 'E', 'F']} | ${[]}         | ${{}}
        ${'BCDEF'}  | ${false} | ${['E', 'F']}                     | ${['A']}      | ${{ A: '!A' }}
        ${'EF'}     | ${false} | ${['E', 'F']}                     | ${['A']}      | ${{ A: '!A' }}
        ${'ACDEF'}  | ${false} | ${['A', 'E', 'F']}                | ${['B']}      | ${{ B: '!B' }}
        ${'AEF'}    | ${false} | ${['A', 'E', 'F']}                | ${['B']}      | ${{ B: '!B' }}
        ${'ACDE'}   | ${false} | ${['A', 'E']}                     | ${['B', 'F']} | ${{ B: '!B', F: '!!' }}
        ${'ABCDF'}  | ${false} | ${['A', 'B', 'C', 'D']}           | ${['E']}      | ${{ E: '!!' }}
        ${'BCDF'}   | ${false} | ${[]}                             | ${['A', 'E']} | ${{ A: '!A', E: '!!' }}
        ${''}       | ${false} | ${[]}                             | ${['A', 'E']} | ${{ A: '!A', E: '!!' }}
        ${'ABCEF'}  | ${false} | ${['A', 'B', 'C', 'E', 'F']}      | ${['D']}      | ${{ D: '!D' }}
        ${'ABDEF'}  | ${false} | ${['A', 'B', 'E', 'F']}           | ${['C']}      | ${{ C: '!C' }}
      `('should block the chain for $data iff it invalidates', ({ data, ok, badges, failedBadges, errors }) => {
        const validation = new TestValidation(data);
        expect(validation.ok).toBe(ok);
        expect(validation.badges).toEqual(badges);
        expect(validation.failedBadges).toEqual(failedBadges);
        expect(validation.errors).toEqual(errors);
      });
    });

    describe('basic async check', () => {
      class TestValidation extends Validation<'A'> {
        constructor(data: 'valid' | 'invalid') {
          super(validator => validator.with(Promise.resolve()).check('A', data === 'valid', 'something'));
        }
      }

      it('should validate a valid data without error messages', async () => {
        const validation = new TestValidation('valid');
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(validation.errors).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual(['A']);
        expect(validation.errors).toEqual({});
      });

      it('should invalidate an invalid data with proper error message', async () => {
        const validation = new TestValidation('invalid');
        expect(validation.ok).toBe(true);
        expect(validation.badges).toEqual([]);
        expect(validation.errors).toEqual({});
        await validation.async;
        expect(validation.ok).toBe(false);
        expect(validation.badges).toEqual([]);
        expect(validation.errors).toEqual({ A: 'something' });
      });
    });

    it('should make the chain to become unsafe if a provider ring come after', () => {
      class TestValidation extends Validation {
        constructor() {
          super(validator => validator.then(() => validator.check('', true).with(10)));
        }
      }

      try {
        new TestValidation();
      } catch {
        return;
      }
      throw 'Invalid point';
    });
  });
});
