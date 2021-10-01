module.exports = function (config) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
    process.exit(1)
  }
  
  const firefoxOptions = {
    prefs: {
      'devtools.chrome.enabled': true,
      'devtools.debugger.prompt-connection': false,
      'devtools.debugger.remote-enabled': true,
      'dom.webnotifications.enabled': false,
      'media.webrtc.hw.h264.enabled': true,
      'media.getusermedia.screensharing.enabled': true,
      'media.navigator.permission.disabled': true,
      'media.navigator.streams.fake': true,
      'media.peerconnection.video.h264_enabled': true,
    },
  };
  
  const chromeOptions = {
    args: [
      'start-maximized',
      'disable-infobars',
      'ignore-gpu-blacklist',
      'test-type',
      'disable-gpu',
      '--disable-features=WebRtcHideLocalIpsWithMdns',
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      '--enable-experimental-web-platform-features',
      '--allow-insecure-localhost',
      '--unsafely-treat-insecure-origin-as-secure',
    ],
  };

  // Browsers to run on Sauce Labs
  // Check out https://saucelabs.com/platforms for all browser/OS combos
  const customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      tags: ['jsonwp-chrome']
    },
    sl_chromeW3C: {
      base: 'SauceLabs',
      browserName: 'chrome',
      browserVersion: 'latest',
      'goog:chromeOptions': chromeOptions,
      'sauce:options':{
        tags: ['w3c-chrome']
      }
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      'moz:firefoxOptions': firefoxOptions,
      tags: ['jsonwp-firefox']
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: 'latest',
      tags: ['jsonwp-ie11']
    }
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/*.js',
      'test/*.js'
    ],
    reporters: ['progress', 'saucelabs'],
    port: 9876,
    colors: true,
    sauceLabs: {
      testName: 'Karma and Sauce Labs demo',
      recordScreenshots: false,
      connectOptions: {
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },
    // Increase timeout in case connection in CI is slow
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true
  })
};
