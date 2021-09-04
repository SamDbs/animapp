module.exports = function (api) {
  api.cache(false)
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', 'react-native-paper/babel', 'inline-dotenv'],
  }
}
