import Validation from '../src/Validation';

describe('Validation', () => {
  describe('Validation error messages for badges', () => {
    interface Student {
      name: string;
      age: number;
    }

    test.each`
      student                               | ok       | failedBadges                                  | errorMessages
      ${{ name: 'Hessam', age: 33 }}        | ${true}  | ${[]}                                         | ${[]}
      ${{ name: 'H', age: 33 }}             | ${false} | ${[]}                                         | ${['Name needs at least 2 more characters.']}
      ${{ name: 'H', age: 33 }}             | ${false} | ${['NAME_STARTS_WITH_CAPITAL', 'AGE_EXISTS']} | ${[]}
      ${{ name: 'he', age: 33 }}            | ${false} | ${[]}                                         | ${['Name needs at least 1 more characters.', 'Name should start with a capital letter.']}
      ${{ name: true, age: 33 }}            | ${false} | ${['NAME_IS_STRING']}                         | ${['Student data is invalid.']}
      ${{ name: 'Hessam', age: undefined }} | ${false} | ${['AGE_EXISTS']}                             | ${['This field is required.']}
      ${{ name: 'Hessam', age: NaN }}       | ${false} | ${['AGE_IS_VALID']}                           | ${['Age has some problem.']}
      ${null}                               | ${false} | ${[]}                                         | ${[]}
      ${123}                                | ${false} | ${[]}                                         | ${[]}
      ${[123]}                              | ${false} | ${[]}                                         | ${[]}
    `('validating student $student to $ok', ({ student, ok, failedBadges, errorMessages }) => {
      class StudentValidation extends Validation<
        | 'NAME_EXISTS'
        | 'NAME_IS_STRING'
        | 'NAME_IS_NOT_TOO_SHORT'
        | 'NAME_IS_NOT_TOO_LONG'
        | 'NAME_ONLY_CONTAINS_LETTERS'
        | 'NAME_STARTS_WITH_CAPITAL'
        | 'AGE_EXISTS'
        | 'AGE_IS_NUMBER'
        | 'AGE_IS_VALID'
        | 'AGE_IS_POSITIVE'
        | 'AGE_IS_HIGH_ENOUGH'
        | 'AGE_IS_NOT_TOO_HIGH'
      > {
        constructor(student: Student) {
          super(
            validator =>
              validator.object(student).do(({ name, age }) => {
                validator
                  .check('NAME_EXISTS', !!name)
                  .check('NAME_IS_STRING', () => typeof name === 'string')
                  .then(() => {
                    validator
                      .check({ badge: 'NAME_IS_NOT_TOO_SHORT', message: `Name needs at least ${3 - name.length} more characters.` }, name.length >= 3)
                      .check({ badge: 'NAME_IS_NOT_TOO_LONG', message: `Name has at least ${name.length - 10} extra characters.` }, () => name.length <= 10);
                    validator
                      .check('NAME_ONLY_CONTAINS_LETTERS', /^[a-zA-Z][a-zA-Z\s]*$/.test(name))
                      .check('NAME_STARTS_WITH_CAPITAL', () => /^[A-Z]$/.test(name[0]));
                  });
                validator
                  .check('AGE_EXISTS', !!age || typeof age === 'number')
                  .check('AGE_IS_NUMBER', () => typeof age === 'number')
                  .check('AGE_IS_VALID', () => !isNaN(age))
                  .check('AGE_IS_POSITIVE', () => age > 0)
                  .then(() => {
                    validator.if(age < 7).fail({ badge: 'AGE_IS_HIGH_ENOUGH', message: `The ${age} years student is too young.` });
                    validator.if(age > 40).fail({ badge: 'AGE_IS_NOT_TOO_HIGH', message: `The ${age} years student is too old.` });
                  });
              }),
            {
              '*_EXISTS': 'This field is required.',
              NAME_ONLY_CONTAINS_LETTERS: 'Name can only have letters or spaces.',
              NAME_STARTS_WITH_CAPITAL: 'Name should start with a capital letter.',
              AGE_IS_POSITIVE: 'Age should be positive.',
              'AGE_*': 'Age has some problem.',
              '*': 'Student data is invalid.'
            }
          );
        }
      }
      const validation = new StudentValidation(student);
      expect(validation.ok).toBe(ok);
      const foundErrorMessages = validation.errors(...failedBadges);
      expect(foundErrorMessages.every(e => errorMessages.includes(e)) && errorMessages.every(e => foundErrorMessages.includes(e))).toBe(true);
    });
  });
});
