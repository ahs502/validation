import Validator from './interfaces/Validator';

export default class ValidatorMock /* implements Validator<'', {}, {}> */ {
  constructor(private readonly data: any, private readonly async: boolean) {}

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
  set(): any {
    return this;
  }
  put(): any {
    return this;
  }
  get(): any {
    return this;
  }
  use(): any {
    return this;
  }

  get value(): any {
    return this;
  }

  end(): any | Promise<any> {
    return this.async ? Promise.resolve(this.data) : this.data;
  }
}
