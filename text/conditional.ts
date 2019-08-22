import Validation from '../src/Validation';

describe('Validation', () => {
  describe('Validation conditional checks', () => {
    type PersonType = 'CHILD' | 'STUDENT' | 'PARENT';
    interface ChildInfo {
      fatherName?: string;
      motherName?: string;
    }
    interface StudentInfo extends ChildInfo {
      schoolName: string;
      grade: number;
    }
    interface ParentInfo {
      childrenNames: string[];
    }
    interface Person {
      name: string;
      age: number;
      type: PersonType;
      info: ChildInfo | StudentInfo | ParentInfo;
    }

    class ChildInfoValidation extends Validation<
      | 'PARENTS_ARE_AVAILABLE'
      | 'FATHER_NAME_EXISTS'
      | 'FATHER_NAME_IS_VALID'
      | 'FATHER_IS_AVAILABLE'
      | 'FATHER_IS_A_PARENT'
      | 'FATHER_IS_MY_PARENT'
      | 'MOTHER_NAME_EXISTS'
      | 'MOTHER_NAME_IS_VALID'
      | 'MOTHER_IS_AVAILABLE'
      | 'MOTHER_IS_A_PARENT'
      | 'MOTHER_IS_MY_PARENT'
    > {
      constructor(childInfo: ChildInfo, name: string, persons: readonly Person[]) {
        super((validator, validation) =>
          validator.object(childInfo).then(({ fatherName, motherName }) => {
            validator
              .if(!fatherName, !motherName)
              .fail('PARENTS_ARE_AVAILABLE')
              .else(() => {
                validator
                  .if(!!fatherName)
                  .earn('FATHER_NAME_EXISTS')
                  .check('FATHER_NAME_IS_VALID', () => checkNameValidity(fatherName!))
                  .then(() => {
                    const parent = persons.find(p => p.name === fatherName);
                    validator
                      .check('FATHER_IS_AVAILABLE', !!parent)
                      .check('FATHER_IS_A_PARENT', () => parent!.type === 'PARENT')
                      .check('FATHER_IS_MY_PARENT', () => (parent!.info as ParentInfo).childrenNames.includes(name));
                  });
                validator
                  .if(!!motherName)
                  .earn('MOTHER_NAME_EXISTS')
                  .check('MOTHER_NAME_IS_VALID', () => checkNameValidity(motherName!))
                  .then(() => {
                    const parent = persons.find(p => p.name === motherName);
                    validator
                      .check('MOTHER_IS_AVAILABLE', !!parent)
                      .check('MOTHER_IS_A_PARENT', () => parent!.type === 'PARENT')
                      .check('MOTHER_IS_MY_PARENT', () => (parent!.info as ParentInfo).childrenNames.includes(name));
                  });
              })
              .if(validation.has('FATHER_IS_MY_PARENT') || validation.has('MOTHER_IS_MY_PARENT'))
              .earn('PARENTS_ARE_AVAILABLE')
              .else()
              .fail('PARENTS_ARE_AVAILABLE');
          })
        );
      }
    }
    class StudentInfoValidator extends Validation<
      'SCHOOL_NAME_EXISTS' | 'SCHOOL_NAME_IS_VALID' | 'SCHOOL_EXISTS' | 'GRADE_EXISTS' | 'GRADE_IS_NUMBER' | 'GRADE_IS_IN_RANGE',
      { asChild: ChildInfoValidation }
    > {
      constructor(studentInfo: StudentInfo, name: string, persons: readonly Person[], schools: readonly string[]) {
        super(validator => {
          validator.$('asChild').set(new ChildInfoValidation(studentInfo, name, persons));
          validator.object(studentInfo).then(({ schoolName, grade }) => {
            validator
              .check('SCHOOL_NAME_EXISTS', !!schoolName)
              .check('SCHOOL_NAME_IS_VALID', () => checkNameValidity(schoolName))
              .check('SCHOOL_EXISTS', () => schools.includes(schoolName));
            validator
              .check('GRADE_EXISTS', !!grade || grade === 0)
              .check('GRADE_IS_NUMBER', () => typeof grade === 'number' && !isNaN(grade))
              .check('GRADE_IS_IN_RANGE', () => 0 <= grade && grade <= 20);
          });
        });
      }
    }
    class ParentInfoValidation extends Validation<
      '',
      {
        childrenNames: {
          exists: boolean;
          isValid: boolean;
        }[];
      }
    > {
      constructor(parentInfo: ParentInfo) {
        super(validator =>
          validator.object(parentInfo).then(({ childrenNames }) =>
            validator.array(childrenNames).each((childName, index) => {
              validator
                .$('childrenNames', index, 'exists')
                .put(!!childName)
                .$('childrenNames', index, 'isValid')
                .put(() => typeof childName === 'string' && checkNameValidity(childName));
            })
          )
        );
      }
    }
    class PersonValidation extends Validation<
      | 'NAME_EXISTS'
      | 'NAME_IS_VALID'
      | 'NAME_IS_NOT_DUPLICATED'
      | 'AGE_EXISTS'
      | 'AGE_IS_VALID'
      | 'TYPE_EXISTS'
      | 'TYPE_IS_VALID'
      | 'IF_CHILD_AGE_IS_UNDER_7'
      | 'IF_STUDENT_AGE_IS_ABOVE_7'
      | 'IF_STUDENT_AGE_IS_UNDER_18'
      | 'IF_PARENT_AGE_IS_ABOVE_14',
      {
        childInfo: ChildInfoValidation;
        studentInfo: StudentInfoValidator;
        parentInfo: ParentInfoValidation;
      }
    > {
      constructor(person: Person, persons: readonly Person[], schools: readonly string[]) {
        super(validator =>
          validator.object(person).then(({ name, age, type, info }) => {
            validator
              .check('NAME_EXISTS', !!name)
              .check('NAME_IS_VALID', () => typeof name === 'string' && checkNameValidity(name))
              .check('NAME_IS_NOT_DUPLICATED', () => persons.every(p => p.name !== name));
            validator.check('AGE_EXISTS', !!age || age === 0).check('AGE_IS_VALID', () => typeof age === 'number' && !isNaN(age) && age >= 0);
            validator.check('TYPE_EXISTS', !!type).check('TYPE_IS_VALID', () => ['CHILD', 'STUDENT', 'PARENT'].includes(type));
            validator.when('AGE_IS_VALID', 'TYPE_IS_VALID').then(() => {
              validator.if(type === 'CHILD').then(() => {
                validator.$('childInfo').set(new ChildInfoValidation(info as ChildInfo, name, persons));
                validator.check('IF_CHILD_AGE_IS_UNDER_7', age < 7);
              });
              validator.if(type === 'STUDENT').then(() => {
                validator.$('studentInfo').set(new StudentInfoValidator(info as StudentInfo, name, persons, schools));
                validator.check('IF_STUDENT_AGE_IS_ABOVE_7', age >= 7);
                validator.check('IF_STUDENT_AGE_IS_UNDER_18', age <= 18);
              });
              validator.if(type === 'PARENT').then(() => {
                validator.$('parentInfo').set(new ParentInfoValidation(info as ParentInfo));
                validator.check('IF_PARENT_AGE_IS_ABOVE_14', age >= 14);
              });
            });
          })
        );
      }
    }

    function checkNameValidity(name: string): boolean {
      return /^[A-Z][a-z]+$/.test(name);
    }

    const schools = ['Golha', 'Nemooneh', 'Danesh', 'Azar'];
    const persons: Person[] = [];

    test.each`
      person                                                                                                                | ok
      ${{ name: 'Hessam', age: 33, type: 'PARENT', info: { childrenNames: ['Mahdiar'] } }}                                  | ${true}
      ${{ name: 'Hessam', age: 33, type: 'PARENT', info: { childrenNames: [] } }}                                           | ${false}
      ${{ name: 'mehrnoosh', age: 26, type: 'PARENT', info: { childrenNames: ['Mahdiar'] } }}                               | ${false}
      ${{ name: 'Mehrnoosh', age: 10, type: 'PARENT', info: { childrenNames: ['Mahdiar'] } }}                               | ${false}
      ${{ name: 'Mehrnoosh', age: 26, type: 'PARENT' }}                                                                     | ${false}
      ${{ name: 'Mehrnoosh', age: 26, type: 'PARENT', info: {} }}                                                           | ${false}
      ${{ name: 'Mehrnoosh', age: 26, type: 'PARENT', info: { childrenNames: ['Mahdiar'] } }}                               | ${true}
      ${{ name: 'Shahrzad', age: 33, type: 'PARENT', info: { childrenNames: ['Roze', 'Siavash'] } }}                        | ${true}
      ${{ name: 'Mahdiar', age: 3, type: 'CHILD', info: { fatherName: 'Hessam', motherName: 'Shahrzad' } }}                 | ${false}
      ${{ name: 'Mahdiar', age: 3, type: 'CHILD', info: { fatherName: 'Hessam', motherName: 'mehrnoosh' } }}                | ${false}
      ${{ name: 'Mahdiar', age: 3, type: 'STUDENT', info: { fatherName: 'Hessam', motherName: 'Mehrnoosh' } }}              | ${false}
      ${{ name: 'Mahdiar', age: 13, type: 'STUDENT', info: { fatherName: 'Hessam', motherName: 'Mehrnoosh' } }}             | ${false}
      ${{ name: 'Mahdiar', age: 13, type: 'CHILD', info: { fatherName: 'Hessam', motherName: 'Mehrnoosh' } }}               | ${false}
      ${{ name: 'Mahdiar', age: 3, type: 'CHILD', info: { fatherName: 'Hessam', motherName: 'Mehrnoosh' } }}                | ${true}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { schoolName: 'Simorgh', grade: 19 } }}                              | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { schoolName: 'Golha', grade: 19 } }}                                | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Mehrnoosh', schoolName: 'Golha', grade: 19 } }}       | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: true } }}      | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: null } }}      | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: NaN } }}       | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: undefined } }} | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: '19' } }}      | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: -19 } }}       | ${false}
      ${{ name: 'Roze', age: -7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: 19 } }}       | ${false}
      ${{ name: 'Roze', age: 6, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: 19 } }}        | ${false}
      ${{ name: 'Roze', age: 7, type: 'STUDENT', info: { motherName: 'Shahrzad', schoolName: 'Golha', grade: 19 } }}        | ${true}
    `('should add person $person if its validation result is $ok', ({ person, ok }) => {
      const validation = new PersonValidation(person, persons, schools);
      expect(validation.ok).toBe(ok);
      if (validation.ok) {
        persons.push(person);
      }
    });
  });
});
