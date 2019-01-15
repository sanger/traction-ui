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

    let self = this

    return Object.assign({
      message:  Object.keys(self._errors).map(key => {
                  return self._errors[key].map(error => key.concat(" ", error))
                })
                .reduce(function(a, b) { return(a.concat(b))}, [])
                .join(", ")
    })
  }
}

export default Response
