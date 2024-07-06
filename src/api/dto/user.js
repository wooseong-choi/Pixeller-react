export class UserDTO {
  constructor(username, password) {
    this.id = username;
    this.name = username;
    this.pw = password;
    this.UserType = "U";
  }
}

export class GoogleUserDTO {
  constructor(username) {
    this.id = username;
    this.name = username;
    this.UserType = "G";
  }
}
