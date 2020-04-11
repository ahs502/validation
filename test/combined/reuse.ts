import Validation from '../../src/Validation';

describe('Validation', () => {
  describe('Validation named chain reuse', () => {
    interface User {
      name: string;
      age: number;
      isStudent: boolean;
    }

    let status: Partial<Record<'nameChain' | 'ageChain' | 'roleChain' | 'asynccheckIfUserHasNotSignedUpBefore' | 'checkRole', true>> = {};
    function resetStatus() {
      status = {};
    }

    async function checkIfUserHasNotSignedUpBefore(name: string): Promise<boolean> {
      status.asynccheckIfUserHasNotSignedUpBefore = true;
      return new Promise(resolve => setTimeout(() => resolve(!name.startsWith('signed up user'))));
    }
    function checkIfUserAgeMatchesRole(age: number, isStudent: boolean): boolean {
      status.checkRole = true;
      return !isStudent || age < 18;
    }

    class UserValidation extends Validation<'NAME_IS_VALID' | 'NOT_SIGNED_UP_BEFORE' | 'AGE_IS_VALID' | 'AGE_MATCHES_ROLE'> {
      constructor(user: User, previousValidation?: UserValidation) {
        super(
          validator =>
            validator.object(user).then(({ name, age, isStudent }) => {
              validator
                .start('name', name)
                .then(() => (status.nameChain = true))
                .check('NAME_IS_VALID', () => typeof name === 'string' && name.length >= 2, 'bad name')
                .then(() => checkIfUserHasNotSignedUpBefore(name))
                // .check('NOT_SIGNED_UP_BEFORE', userHasSignedUp => userHasSignedUp, 'signed up')
                .then(userHasSignedUp => validator.check('NOT_SIGNED_UP_BEFORE', userHasSignedUp, 'signed up'))
                .end();
              validator
                .start('age', age)
                .then(() => (status.ageChain = true))
                .check('AGE_IS_VALID', typeof age === 'number' && age > 0, 'bad age')
                .end();
              validator
                .start('role', age, isStudent)
                .then(() => (status.roleChain = true))
                .when('AGE_IS_VALID')
                .check('AGE_MATCHES_ROLE', () => checkIfUserAgeMatchesRole(age, isStudent), 'bad role')
                .end();
            }),
          previousValidation
        );
      }
    }

    beforeEach(() => {
      resetStatus();
    });

    let validation: UserValidation | undefined = undefined;
    test.each`
      user                                                            | sync     | ok       | badges                                                                           | messages                   | statusKeys
      ${{ name: 'Hessam', age: 34, isStudent: false }}                | ${false} | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${['nameChain', 'ageChain', 'roleChain', 'asynccheckIfUserHasNotSignedUpBefore', 'checkRole']}
      ${{ name: 'Hessam', age: 34, isStudent: false }}                | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${[]}
      ${{ name: 'Hessam', age: 34, isStudent: false }}                | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${[]}
      ${{ name: 'Hessamoddin', age: 34, isStudent: false }}           | ${false} | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${['nameChain', 'asynccheckIfUserHasNotSignedUpBefore']}
      ${{ name: 'Hessamoddin', age: 34, isStudent: false }}           | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${[]}
      ${{ name: 'H', age: 34, isStudent: false }}                     | ${true}  | ${false} | ${['AGE_IS_VALID', 'AGE_MATCHES_ROLE']}                                          | ${['bad name']}            | ${['nameChain']}
      ${{ name: 'Hessam', age: 35, isStudent: false }}                | ${false} | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${['nameChain', 'ageChain', 'roleChain', 'asynccheckIfUserHasNotSignedUpBefore', 'checkRole']}
      ${{ name: 'Hessam', age: 35, isStudent: true }}                 | ${true}  | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID']}                     | ${['bad role']}            | ${['roleChain', 'checkRole']}
      ${{ name: 'Hessam', age: 35, isStudent: true }}                 | ${true}  | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID']}                     | ${['bad role']}            | ${[]}
      ${{ name: 'signed up user Hessam', age: 36, isStudent: false }} | ${false} | ${false} | ${['NAME_IS_VALID', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']}                         | ${['signed up']}           | ${['nameChain', 'ageChain', 'roleChain', 'asynccheckIfUserHasNotSignedUpBefore', 'checkRole']}
      ${{ name: 'signed up user Hessam', age: 36, isStudent: false }} | ${true}  | ${false} | ${['NAME_IS_VALID', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']}                         | ${['signed up']}           | ${[]}
      ${{ name: 'signed up user Hessam', age: 36, isStudent: false }} | ${true}  | ${false} | ${['NAME_IS_VALID', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']}                         | ${['signed up']}           | ${[]}
      ${{ name: '', age: null, isStudent: false }}                    | ${true}  | ${false} | ${[]}                                                                            | ${['bad name', 'bad age']} | ${['nameChain', 'ageChain', 'roleChain']}
      ${{ name: 'H', age: null, isStudent: false }}                   | ${true}  | ${false} | ${[]}                                                                            | ${['bad name', 'bad age']} | ${['nameChain']}
      ${{ name: 'He', age: null, isStudent: false }}                  | ${false} | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE']}                                     | ${['bad age']}             | ${['nameChain', 'asynccheckIfUserHasNotSignedUpBefore']}
      ${{ name: 'Hes', age: null, isStudent: false }}                 | ${false} | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE']}                                     | ${['bad age']}             | ${['nameChain', 'asynccheckIfUserHasNotSignedUpBefore']}
      ${{ name: 'Hess', age: null, isStudent: false }}                | ${false} | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE']}                                     | ${['bad age']}             | ${['nameChain', 'asynccheckIfUserHasNotSignedUpBefore']}
      ${{ name: 'Hessa', age: null, isStudent: false }}               | ${false} | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE']}                                     | ${['bad age']}             | ${['nameChain', 'asynccheckIfUserHasNotSignedUpBefore']}
      ${{ name: 'Hessam', age: null, isStudent: false }}              | ${false} | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE']}                                     | ${['bad age']}             | ${['nameChain', 'asynccheckIfUserHasNotSignedUpBefore']}
      ${{ name: 'Hessam', age: 2, isStudent: false }}                 | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${['ageChain', 'roleChain', 'checkRole']}
      ${{ name: 'Hessam', age: 26, isStudent: false }}                | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${['ageChain', 'roleChain', 'checkRole']}
      ${{ name: 'Hessam', age: 26, isStudent: true }}                 | ${true}  | ${false} | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID']}                     | ${['bad role']}            | ${['roleChain', 'checkRole']}
      ${{ name: 'Hessam', age: 6, isStudent: true }}                  | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${['ageChain', 'roleChain', 'checkRole']}
      ${{ name: 'Hessam', age: 16, isStudent: true }}                 | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${['ageChain', 'roleChain', 'checkRole']}
      ${{ name: 'Hessam', age: 16, isStudent: true }}                 | ${true}  | ${true}  | ${['NAME_IS_VALID', 'NOT_SIGNED_UP_BEFORE', 'AGE_IS_VALID', 'AGE_MATCHES_ROLE']} | ${[]}                      | ${[]}
    `('should validate $user to $ok without unnecessary checks on the named chains', async ({ user, sync, ok, badges, messages, statusKeys }) => {
      validation = new UserValidation(user, validation);
      if (sync) {
        expect(validation.ok).toBe(ok);
        expect(validation.badges.slice().sort()).toEqual(badges.sort());
        expect(validation.messages().sort()).toEqual(messages.sort());
        expect(Object.keys(status).sort()).toEqual(statusKeys.sort());
      }
      await validation.async;
      expect(validation.ok).toBe(ok);
      expect(validation.badges.slice().sort()).toEqual(badges.sort());
      expect(validation.messages().sort()).toEqual(messages.sort());
      expect(Object.keys(status).sort()).toEqual(statusKeys.sort());
    });
  });

  test('should keep the named chain data and reuse it later', async () => {
    let providingCount = 0;
    class MyValidation extends Validation {
      constructor(previousValidation?: MyValidation) {
        super(
          validator =>
            validator
              .after(
                () =>
                  validator
                    .start('synchronous provider chain')
                    .then(() => providingCount++)
                    .with(1234)
                    .end(),
                validator
                  .start('asynchronous provider chain')
                  .then(() => providingCount++)
                  .then(() => Promise.resolve(5678))
                  .end()
              )
              .do((x, y) => x === 1234 && y === 5678),
          previousValidation
        );
      }
    }

    let validation: MyValidation | undefined = undefined;
    for (let i = 0; i < 10; i++) {
      validation = new MyValidation(validation);
      await validation.async;
      expect(validation.ok).toBe(true);
    }
    expect(providingCount).toBe(2);
  });
});
