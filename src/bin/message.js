class Message {
  constructor(message, user, dest) {
    this.message = message;
    this.user = user;
    this.dest = dest;
    this.date = new Date().getTime();
  }
}

module.exports = {
  Message,
};
