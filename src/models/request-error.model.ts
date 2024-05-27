export class RequestError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}
