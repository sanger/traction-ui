import fs from 'fs'
import { join } from 'path'

const dataPath = '../data'

const RequestFactory = (name, axios = true) => {
  const data = loadFile(name)
  if (axios) {
    return {
      status: 200,
      statusText: 'OK',
      data: { ...data },
    }
  } else {
    return {
      response: {
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(data),
        ok: true,
      },
      content: data,
    }
  }
}

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
