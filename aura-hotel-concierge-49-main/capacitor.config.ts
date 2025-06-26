
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bfe6eadf793c43dc99dd7b48463302f1',
  appName: 'Parkside Plaza Hotel',
  webDir: 'dist',
  server: {
    url: 'https://bfe6eadf-793c-43dc-99dd-7b48463302f1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#6B0F1A",
      splashFullScreen: true,
      splashImmersive: true
    },
  }
};

export default config;
