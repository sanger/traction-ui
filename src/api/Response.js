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
    let msg
    if (Object.keys(this._errors).length === 1) {
      let key = Object.keys(this._errors)[0]
      let error = Object.values(this._errors)[0].join(', ')
      msg = key.concat(" ", error)
    } else {
      msg = this._errors.map(error => Object.values(error) ).join(', ')
    }
    return Object.assign({ message: msg })
  }
}

export default Response
