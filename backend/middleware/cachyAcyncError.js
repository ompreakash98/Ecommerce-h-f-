module.exports = (thrFunc) => (req, res, next) => {
      Promise.resolve(thrFunc(req, res, next)).catch(next)


}