export class SessionExpiredError extends Error {
  constructor() {
    super('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    this.name = 'SessionExpiredError';
  }
}

export function isSessionExpiredError(error: unknown): boolean {
  return error instanceof Error && error.name === 'SessionExpiredError';
}
