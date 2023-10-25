/*
 * A library to build select options for dropdowns
 */

/*
 * @param {string} key - the key to use for the value of the option
 * @param {string} name - the key to use for the text of the option
 * @param {array} list - the list of items to filter and create options from
 * @returns {object} - an object with fields, filter, and options
 */
const SelectOptionsType = ({ key, name, list }) => {
  // fields is an object with the key and name to use for the value and text of the option
  const fields = {
    value: key,
    text: name,
  }

  /*
   * filter returns a list of items that are active or have the same key as the current item
   * @param {object} currentItem - the current item to compare to
   * @returns {array} - a list of items that are active or have the same key as the current item
   */
  const filterByActiveOrKey = (currentItem) => {
    return list.filter((item) => item.active || item[key] === currentItem[key])
  }

  /*
   * options returns a list of options for the dropdown
   * @param {object} currentItem - the current item to compare to
   * @returns {array} - a list of options for the dropdown
   */
  const options = (currentItem) => {
    return filterByActiveOrKey(currentItem).map((item) => {
      return {
        value: item[key],
        text: item[name],
      }
    })
  }

  return { fields, list, filterByActiveOrKey, options }
}

// InstrumentTypeSelectOptionsType is a SelectOptionsType with key 'key' and name 'name'
const InstrumentTypeSelectOptionsType = (list) =>
  SelectOptionsType({ key: 'key', name: 'name', list })

// SmrtLinkVersionSelectOptionsType is a SelectOptionsType with key 'id' and name 'name'
const SmrtLinkVersionSelectOptionsType = (list) =>
  SelectOptionsType({ key: 'id', name: 'name', list })

export { SelectOptionsType, InstrumentTypeSelectOptionsType, SmrtLinkVersionSelectOptionsType }
