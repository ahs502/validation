import Validator from './Validator';

export default class ValidatorMock implements Validator<'', {}, {}> {
  constructor(private readonly data: any) {}

  with(): any {
    return this;
  }
  object(): any {
    return this;
  }
  array(): any {
    return this;
  }
  then(): any {
    return this;
  }
  do(): any {
    return this;
  }
  each(): any {
    return this;
  }
  after(): any {
    return this;
  }
  check(): any {
    return this;
  }
  earn(): any {
    return this;
  }
  fail(): any {
    return this;
  }
  when(): any {
    return this;
  }
  must(): any {
    return this;
  }
  if(): any {
    return this;
  }
  put(): any {
    return this;
  }
  get(): any {
    return this;
  }

  end(): Promise<any> {
    return Promise.resolve(this.data);
  }
}
