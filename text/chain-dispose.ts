import Validation from '../src/Validation';

describe('Validation', () => {
  describe('Validation dispose', () => {
    interface User {
      id: number;
      username: string;
      age: number;
      access: boolean;
    }

    const userDatabase: readonly User[] = [
      { id: 1001, username: 'Hessam', age: 33, access: true },
      { id: 1002, username: 'Mahdiyar', age: 20, access: false },
      { id: 1003, username: 'Mehrnoosh', age: 26, access: true },
      { id: 1004, username: 'Alireza', age: 18, access: true },
      { id: 1005, username: 'Golnoosh', age: 20, access: false },
      { id: 1006, username: 'Negar', age: 21, access: true }
    ];
    let getUserByIdResponseCount = 0;
    function getUserById(id: number): Promise<User | null> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          getUserByIdResponseCount++;
          const user = userDatabase.find(u => u.id === id);
          resolve(user);
        }, 10);
      });
    }

    const Requests = <const>['pen', 'book', 'paper', 'pencil'];
    type Request = typeof Requests[number];
    interface Form {
      userId: number;
      request: Request;
    }

    class FormValidation extends Validation<
      'ID_EXISTS' | 'USER_EXISTS' | 'REQUEST_EXISTS' | 'REQUEST_IS_VALID' | 'USER_IS_OLD_ENOUGH' | 'USER_HAS_ACCESS' | 'USER_HAS_ACCESS_TO_REQUEST'
    > {
      constructor(form: Form) {
        super(validator =>
          validator.object(form).then(({ userId, request }) => {
            validator
              .in('user', userId)
              .check('ID_EXISTS', () => !!userId && typeof userId === 'number' && !isNaN(userId))
              .await(() => getUserById(userId))
              .check('USER_EXISTS', user => !!user)
              .then(user => user!)
              .then(({ age, access }) => {
                validator.check('USER_IS_OLD_ENOUGH', age >= 20);
                validator.check('USER_HAS_ACCESS', access);
              })
              .end();
            validator
              .in('request', request)
              .check('REQUEST_EXISTS', () => !!request && typeof request === 'string')
              .check('REQUEST_IS_VALID', () => Requests.includes(request))
              .with(request)
              .end();
            validator
              .after<[User, Request]>('user', 'request')
              .check('USER_HAS_ACCESS_TO_REQUEST', ([{ age }, request]) => age >= (request === 'pencil' ? 22 : 20));
          })
        );
      }
    }

    test.each`
      form
      ${{ userId: 1001, request: 'pen' }}
      ${{ userId: 1003, request: 'pencil' }}
    `('should validate valid form $form correctly', async ({ form }) => {
      getUserByIdResponseCount = 0;
      const validation = new FormValidation(form);
      expect(validation.ok).toBe(true);
      expect(getUserByIdResponseCount).toBe(0);
      await validation.async;
      expect(validation.ok).toBe(true);
      expect(getUserByIdResponseCount).toBe(1);
    });

    test.each`
      form                                     | okInitially | async
      ${123}                                   | ${false}    | ${false}
      ${{ userId: 1001, request: 'rubber' }}   | ${false}    | ${true}
      ${{ userId: '1001', request: 'pencil' }} | ${false}    | ${false}
      ${{ userId: 9999, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1002, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1002, request: 'book' }}     | ${true}     | ${true}
      ${{ userId: 1002, request: 'pencil' }}   | ${true}     | ${true}
      ${{ userId: 1004, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1004, request: 'paper' }}    | ${true}     | ${true}
      ${{ userId: 1004, request: 'pencil' }}   | ${true}     | ${true}
      ${{ userId: 1005, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1005, request: 'paper' }}    | ${true}     | ${true}
      ${{ userId: 1005, request: 'pencil' }}   | ${true}     | ${true}
      ${{ userId: 1006, request: 'pencil' }}   | ${true}     | ${true}
    `('should validate invalid form $form correctly', async ({ form, okInitially, async }) => {
      getUserByIdResponseCount = 0;
      const validation = new FormValidation(form);
      expect(validation.ok).toBe(okInitially);
      expect(getUserByIdResponseCount).toBe(0);
      await validation.async;
      expect(validation.ok).toBe(false);
      expect(getUserByIdResponseCount).toBe(async ? 1 : 0);
    });

    test.each`
      form                                     | okInitially | async
      ${123}                                   | ${false}    | ${false}
      ${{ userId: 1001, request: 'rubber' }}   | ${false}    | ${true}
      ${{ userId: '1001', request: 'pencil' }} | ${false}    | ${false}
      ${{ userId: 9999, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1002, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1002, request: 'book' }}     | ${true}     | ${true}
      ${{ userId: 1002, request: 'pencil' }}   | ${true}     | ${true}
      ${{ userId: 1004, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1004, request: 'paper' }}    | ${true}     | ${true}
      ${{ userId: 1004, request: 'pencil' }}   | ${true}     | ${true}
      ${{ userId: 1005, request: 'pen' }}      | ${true}     | ${true}
      ${{ userId: 1005, request: 'paper' }}    | ${true}     | ${true}
      ${{ userId: 1005, request: 'pencil' }}   | ${true}     | ${true}
      ${{ userId: 1006, request: 'pencil' }}   | ${true}     | ${true}
    `('should dispose validation of form $form correctly', async ({ form, okInitially, async }) => {
      getUserByIdResponseCount = 0;
      const validation = new FormValidation(form);
      validation.dispose();
      expect(validation.ok).toBe(okInitially);
      expect(getUserByIdResponseCount).toBe(0);
      try {
        await validation.async;
        async && expect(true).toBe(false);
      } catch (reason) {
        expect(reason).toBe('disposed');
        expect(validation.ok).toBe(okInitially);
        expect(getUserByIdResponseCount).toBe(0);
      }
    });
  });
});
