class Response {
  constructor(response) {
    this.status = response.status
    this.statusText = response.statusText
    this._body = response.data
    this._errors = response.data.errors
  }

  get body() {
    if (this._body.data === undefined) return {}

    if (this._body.included === undefined) return this._body.data.map(attrs =>
      Object.assign({ id: attrs.id }, attrs.attributes)
    )

    let list = []
    
    // data is request resource from SS, so we need to compute included information about sample
    if (this._body.included && this._body.included.filter(e => e.type=="sample_metadata") !== 0) {
      this._body.data.map(request => {
        let sample_id = request.relationships.samples.data[0].id
        let sample = this._body.included.filter(e => e.id == sample_id).filter(e => e.type =="samples")[0]
        let sample_attributes = sample.attributes

        let sample_metadata_id = sample.relationships.sample_metadata.data.id
        let sample_metadata = this._body.included.filter(e => e.id == sample_metadata_id).filter(e => e.type =="sample_metadata")[0]
        let sample_metadata_attributes = sample_metadata.attributes

        let attrs = Object.assign({ id: request.id }, request.attributes, sample_attributes, sample_metadata_attributes)
        list.push(attrs)
      })
    }
    return list
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
