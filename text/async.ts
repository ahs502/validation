import Validation from '../src/Validation';

describe('Validation', () => {
  describe('Validation basic async checks', () => {
    interface User {
      id: number;
      username: string;
    }

    const userDatabase: readonly User[] = [
      { id: 1001, username: 'xdsofncx' },
      { id: 1002, username: 'oqqtalth' },
      { id: 1003, username: 'xgfhjhhd' },
      { id: 1004, username: 'aazaaxmh' },
      { id: 1005, username: 'psghdjks' }
    ];
    function checkUsernameAsync(id: number, username: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = userDatabase.find(u => u.id === id);
          if (!user) return reject('User not found.');
          resolve(user.username === username);
        }, 10);
      });
    }

    const userAccessDatabase: readonly { id: number; access: boolean }[] = [
      { id: 1001, access: true },
      { id: 1002, access: true },
      { id: 1003, access: false },
      { id: 1004, access: false }
    ];
    function checkUserAccessAsync(id: number): Promise<boolean> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const permission = userAccessDatabase.find(u => u.id === id);
          if (!permission) return reject('User access not found.');
          resolve(permission.access);
        }, 10);
      });
    }

    class UserValidation extends Validation<'ID_EXISTS' | 'USERNAME_EXISTS' | 'USERNAME_IS_VALID' | 'USER_HAS_ACCESS'> {
      constructor(user: User) {
        super(validator =>
          validator.object(user).then(({ id, username }) => {
            validator.check('ID_EXISTS', !!id && typeof id === 'number' && !isNaN(id));
            validator.check('USERNAME_EXISTS', !!username && typeof username === 'string' && /^[a-z]{8}$/.test(username));
            validator
              .when('ID_EXISTS', 'USERNAME_EXISTS')
              .await(async () => {
                const exists = await checkUsernameAsync(id, username);
                validator.check('USERNAME_IS_VALID', exists);
              })
              .when('USERNAME_IS_VALID')
              .await(() => checkUserAccessAsync(id).then(access => validator.check('USER_HAS_ACCESS', access).end()));
          })
        );
      }
    }

    test.each`
      user                                  | okInitially | okFinally | asyncError
      ${{ id: 1001, username: 'xdsofncx' }} | ${true}     | ${true}   | ${undefined}
      ${{ id: 1001, username: '########' }} | ${false}    | ${false}  | ${undefined}
      ${{ id: 1003, username: 'xgfhjhhd' }} | ${true}     | ${false}  | ${undefined}
      ${{ id: 1005, username: 'psghdjks' }} | ${true}     | ${false}  | ${'User access not found.'}
      ${{ id: 1006, username: 'abcdefgh' }} | ${true}     | ${false}  | ${'User not found.'}
      ${{ id: 1006, username: '********' }} | ${false}    | ${false}  | ${undefined}
    `('should validate user $user initially to $okInitially and finally to $okFinally asynchronous', async ({ user, okInitially, okFinally, asyncError }) => {
      const validation = new UserValidation(user);
      expect(validation.ok).toBe(okInitially);
      try {
        await validation.async;
        expect(asyncError).toBe(undefined);
        expect(validation.ok).toBe(okFinally);
      } catch (error) {
        expect(error).not.toBe(undefined);
        expect(error).toBe(asyncError);
        expect(validation.ok).toBe(false);
      }
    });
  });
});
