const io = require('./socket');

module.exports = () => {
  io.getIO().emit('message', {
    action: 'test',
    message: "Cao bro!!!"
  })
}