// we need to use absolute paths for Cypress. @ not available. Can we add it
import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from './../../src/api/JsonApi'

/*
 * Factory for creating a list of printers
 * @returns a base factory object with the printers data
 * @returns a storePrinters object with the printers data stored by id
 */

const PacbioSmrtLinkVersionFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'printers',
        links: {
          self: 'http://localhost:3100/v1/printers/1',
        },
        attributes: {
          name: 'g216bc',
          labware_type: 'tube',
          active: true,
          created_at: '2024-05-03T09:24:31.972Z',
          updated_at: '2024-05-03T09:24:58.615Z',
          deactivated_at: null,
        },
      },
      {
        id: '2',
        type: 'printers',
        links: {
          self: 'http://localhost:3100/v1/printers/2',
        },
        attributes: {
          name: 'h105bc',
          labware_type: 'tube',
          active: true,
          created_at: '2024-05-03T09:25:54.237Z',
          updated_at: '2024-05-03T09:25:54.237Z',
          deactivated_at: null,
        },
      },
      {
        id: '3',
        type: 'printers',
        links: {
          self: 'http://localhost:3100/v1/printers/3',
        },
        attributes: {
          name: 'aPrinterName',
          labware_type: 'plate96',
          active: true,
          created_at: '2024-05-03T09:26:20.279Z',
          updated_at: '2024-05-03T09:26:20.279Z',
          deactivated_at: null,
        },
      },
      {
        id: '4',
        type: 'printers',
        links: {
          self: 'http://localhost:3100/v1/printers/4',
        },
        attributes: {
          name: 'ssrtubebc-sq1',
          labware_type: 'tube',
          active: true,
          created_at: '2024-05-03T09:26:57.239Z',
          updated_at: '2024-05-03T09:26:57.239Z',
          deactivated_at: null,
        },
      },
      {
        id: '5',
        type: 'printers',
        links: {
          self: 'http://localhost:3100/v1/printers/5',
        },
        attributes: {
          name: 'aa309bc1',
          labware_type: 'tube',
          active: true,
          created_at: '2024-05-03T09:27:18.206Z',
          updated_at: '2024-05-03T09:27:18.206Z',
          deactivated_at: null,
        },
      },
      {
        id: '6',
        type: 'printers',
        links: {
          self: 'http://localhost:3100/v1/printers/6',
        },
        attributes: {
          name: 'aa309bc2',
          labware_type: 'plate96',
          active: true,
          created_at: '2024-05-03T09:27:31.950Z',
          updated_at: '2024-05-03T09:27:31.950Z',
          deactivated_at: null,
        },
      },
    ],
    meta: {
      page_count: 1,
    },
    links: {
      first: 'http://localhost:3100/v1/printers?page%5Bnumber%5D=1&page%5Bsize%5D=1000',
      last: 'http://localhost:3100/v1/printers?page%5Bnumber%5D=1&page%5Bsize%5D=1000',
    },
  }

  const storePrinters = dataToObjectById({ ...data })

  return { ...BaseFactory(data), storePrinters }
}

export default PacbioSmrtLinkVersionFactory
