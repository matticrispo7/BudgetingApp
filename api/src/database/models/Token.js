// RefreshToken model
export class Token {
  constructor(userId, token) {
    this._userId = userId;
    this._token = token;
    this._timestamp = new Date().getTime();
  }

  toDTO() {
    return {
      userId: this._userId,
      refreshToken: this._token,
      timestamp: this._timestamp,
    };
  }
}
