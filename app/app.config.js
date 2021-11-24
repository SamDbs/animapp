import 'dotenv/config'

export default {
  expo: {
    name: 'app',
    slug: 'app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'animapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#cccccc',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      userInterfaceStyle: 'automatic',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#CCCCCC',
      },
      userInterfaceStyle: 'automatic',
      softwareKeyboardLayoutMode: 'pan',
    },
    web: {
      favicon: './assets/images/favicon.png',
    },
    extra: { API_URL: process.env.API_URL },
  },
}
