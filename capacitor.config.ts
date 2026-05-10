import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.mycanvas.app',
  appName: 'MyCanvas',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#000000',
  },
  plugins: {
    SplashScreen: { launchShowDuration: 0 },
    StatusBar: { style: 'Dark', backgroundColor: '#000000' },
  },
}

export default config
