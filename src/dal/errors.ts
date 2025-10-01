export class UnauthenticatedError extends Error {
  constructor(message = "Unauthenticated") {
    super(message)
    this.name = "UnauthenticatedError"
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message)
    this.name = "UnauthorizedError"
  }
}
