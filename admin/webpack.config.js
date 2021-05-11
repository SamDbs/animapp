const path = require('path')
const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  config.resolve.alias['@components'] = path.resolve(__dirname, 'components')
  config.resolve.alias['@hooks'] = path.resolve(__dirname, 'hooks')
  config.resolve.alias['@utils'] = path.resolve(__dirname, 'utils')
  return config
}
