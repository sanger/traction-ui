class Response {
  constructor(response) {
    this.status = response.status
    this.statusText = response.statusText
    this._body = response.data.data
    this._errors = response.data.errors
  }

  get body() {
    if (this._body === undefined) return
    return this._body.map(attrs =>
      Object.assign({ id: attrs.id }, attrs.attributes)
    )
  }

  get errors() {
    if (this._errors === undefined) return
    let message = this._errors.map(error => Object.values(error) ).join(', ')
    return Object.assign({ message: message })
  }
}

export default Response
