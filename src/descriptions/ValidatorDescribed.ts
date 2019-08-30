export default interface ValidatorDescribed {
  /**
   * Some notes for with.
   */
  with(...params: any[]): any;

  /**
   * Some notes for do.
   */
  do(...params: any[]): any;

  /**
   * Some notes for after.
   */
  after(...params: any[]): any;
}
