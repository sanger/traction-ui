module.exports = {
  test_settings: {

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        webStorageEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
           args: ["--headless"]
        }
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}