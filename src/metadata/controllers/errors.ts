export class BadValues extends Error {
    public constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, BadValues.prototype);
    }
  }
  
  export class IdNotExists extends Error {
    public constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, IdNotExists.prototype);
    }
  }