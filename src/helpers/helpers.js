/**
 * Send message to the console - only when not in production
 * @param {*} message the message to log
 */
log(message) {
  if (process.env.VUE_APP_LOG === 'true') { // https://stackoverflow.com/a/264037
    console.log(message)
  }
},
