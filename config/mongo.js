const Env = use('Env')

module.exports = {
  uri: Env.get('MONGODB_URI', '')
}