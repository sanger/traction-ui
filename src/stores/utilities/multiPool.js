/**
 * Produce a json api compliant payload
 *
 * @param {Object}
 *
 */
const payload = ({ multiPool }) => {
  const { pipeline, pool_method } = multiPool
  return {
    data: {
      type: 'multi_pools',
      id: multiPool.id,
      attributes: {
        pipeline,
        pool_method,
      },
    },
  }
}

export { payload }
