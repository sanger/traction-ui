
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'

/**
 * Checks if a feature flag is enabled.
 * @param {string} flagName - The name of the feature flag to check.
 * @returns {boolean} - A true or false status on whether the feature flag is enabled.
 */
const checkFeatureFlag = async (flagName) => {
  const rootStore = useRootStore()
  const request = rootStore.api.traction.feature_flags
  const promise = request.get()
  const { body = {} } = await handleResponse(promise)
    
  return body.features?.[flagName]?.enabled ? true : false
}

export { checkFeatureFlag }