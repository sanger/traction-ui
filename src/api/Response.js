/*
  TODO: separate out into reusable functional methods - currying and recursion.
*/

class Response {
  constructor(response, resource, included = '') {
    this.status = response.status
    this.statusText = response.statusText
    this._body = response.data
    this.resource = resource
    this._errors = response.data.errors
    this.included = included
  }

  get successful () {
    return (this.status >= 200 && this.status <= 400)
  }

  get data () {
    if (this._body.data === undefined) return {}
    return { [this.resource]:
      this._body.data.map(attrs => ({ id: attrs.id, ...attrs.attributes }) )
    }
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

  get body() {
    if (this.data === {}) return this.data

    let data = this.data

    if (this._body.included === undefined) return  this.data

    let relationships = this.included.split('.')

    data[this.resource].map(item => {

      let relationship = this._body.data.find(i => i.id === item.id)['relationships'][relationships[0]]
      let relationshipId = relationship['data'][0]['id']
      let included = this._body.included.find(item => item.id === relationshipId)
      item[relationships[0]] = [{ id: relationshipId, ...included['attributes']}]

      if (relationships[1] !== undefined) {

        relationship = included['relationships'][relationships[1]]
        relationshipId = relationship['data']['id']
        included = this._body.included.find(item => item.id === relationshipId)
        item[relationships[0]][0][relationships[1]] = { id: relationshipId, ...included['attributes'] }

      }
    })

    return data
   
  }

}

export default Response
