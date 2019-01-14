class Response {
  constructor(response) {
    this.status = response.status
    this.statusText = response.statusText
    this._body = response.data.data
    this._errors = response.data.errors
  }

  get body() {
    if (this._body === undefined) return {}
    return this._body.map(attrs =>
      Object.assign({ id: attrs.id }, attrs.attributes)
    )
  }

  get errors() {
    if (this._errors === undefined) return {}
    let msg = []

    for (let i = 0; i < Object.keys(this._errors).length; i++) {
      let key = Object.keys(this._errors)[i]
      let errors = Object.values(this._errors)[i]

      for (let n = 0; n < errors.length; n++) {
        let message = key.concat(" ", errors[n])
        msg.push(message)
      }
    }
    return Object.assign({ message: msg.join(", ") })
  }
}

export default Response
