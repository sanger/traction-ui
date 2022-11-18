import { handleResponse } from '@/api/ResponseHelper'

const printJob = async ({ request, printerName, labelTemplate, labels, copies }) => {
  const payload = {
    printer_name: printerName,
    label_template: labelTemplate,
    labels,
    copies,
  }

  const promise = request.create({ data: payload })

  const { success, data, errors } = await handleResponse(promise)

  return { success, data, errors }
}

export { printJob }

export default printJob
