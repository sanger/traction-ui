/*
  TODO: separate out into reusable functional methods - currying and recursion.
*/
import deserialize from '@/api/JsonApi'

class Response {
  constructor(response) {
    this.status = response.status
    this.statusText = response.statusText
    this._body = response.data
    this._errors = response.data.errors
  }

  get successful () {
    return (this.status >= 200 && this.status <= 400)
  }

  get data () {
    if (this._body.data === undefined) return {}
    return deserialize(this._body)
  }

  get errors() {
    if (this._errors === undefined) return {}

    let self = this

    return Object.assign({
      message:  Object.keys(self._errors).map(key => {
                  return self._errors[key].map(error => key.concat(' ', error))
                })
                .reduce(function(a, b) { return(a.concat(b))}, [])
                .join(', ')
    })
  }

}

export default Response
