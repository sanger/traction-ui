/**
 * Checks if a feature flag is enabled.
 * @param {string} featureFlag - The name of the feature flag to check.
 * @returns {boolean} - A true or false status on whether the feature flag is enabled.
 */

const checkFeatureFlag = async (featureFlag) => {
  const response = await fetch(`${import.meta.env.VITE_TRACTION_BASE_URL}/flipper/api/actors/User`)
  const flags = await response.json()
  return flags?.features?.[featureFlag]?.enabled == true
}

export { checkFeatureFlag }
