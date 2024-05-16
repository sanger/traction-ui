import fs from 'fs'
import { join } from 'path'

//This is the path to the data folder where all the test json files are stored
const dataPath = '/../data/'

/**
 * This function will load a file and return a factory object
 * @param {*} name file name
 * @param {*} axios boolean flag to indicate if axios response should be returned
 * @returns
 * example usage:
 * const data = RequestFactory('Printers')
 * This returns a factory object with the data from the Printers.json file
 */
const RequestFactory = (name, axios = true) => {
  const data = loadFile(name)
  if (axios) {
    return {
      response: {
        status: 200,
        statusText: 'OK',
        ...data,
      },
    }
  } else {
    return {
      response: {
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(data),
        ok: true,
      },
      //This is the data within the file that was loaded which is parsed to json
      content: data,
    }
  }
}

/**
 * This function will load a file and return the content
 * @param {*} fileName  The name of the file to load
 * @returns The content of the file
 */
const loadFile = (fileName) => {
  const filePath = join(__dirname, dataPath, `${fileName}.json`)
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (err) {
    console.error(err)
    return {}
  }
}

export default RequestFactory
