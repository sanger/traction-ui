# Available volume calculation

In the context of managing libraries and pools for sequencing runs, it is crucial to accurately track and calculate the available volume of each library or pool. 
This ensures that there is sufficient volume for the sequencing process and helps in managing resources efficiently.

## JavaScript Implementation
The following JavaScript function `getAvailableVolumeForAliquot` calculates the available volume for a library or pool:

You can view the full implementation of the `getAvailableVolumeForAliquot` method in the [pacbioRunCreate.js file on GitHub](https://github.com/sanger/traction-ui/blob/develop/src/stores/pacbioRunCreate.js).

```javascript
/**
 * Returns the available volume for a library or pool
 * @param {Object} sourceId The id of the library or pool
 * @param {Object} source_type The type of the source (Pacbio::Library or Pacbio::Pool)
 * @param {Object} volume The volume of the current aliquot being calculated for
 *
 * @returns {Number} The available volume for that library
 */
getAvailableVolumeForAliquot({ sourceId, sourceType, volume = null }) {
  if (!sourceId || !sourceType) {
    return null
  }

  // Get the correct store location based off the sourceType
  const sourceStore = sourceType === 'Pacbio::Library' ? this.libraries : this.pools
  // Get the available volume for the source
  const available_volume = sourceStore[sourceId]?.available_volume || 0

  // Calculate the sum of the initial volume of all existing aliquots used in wells that are from the source
  // This is required because there may be additionally available volume if an existing aliquot has been reduced in volume
  let original_aliquot_volume = 0
  Object.values(this.aliquots).forEach((aliquot) => {
    if (
      aliquot &&
      aliquot.source_id == sourceId &&
      aliquot.source_type === sourceType &&
      // We check it is a well because we have may have used_aliquots from a pool
      aliquot.used_by_type === 'Pacbio::Well'
    ) {
      original_aliquot_volume = parseFloat(original_aliquot_volume) + parseFloat(aliquot.volume)
    }
  })

  // Calculate the sum of the volume of all the current aliquots used in wells that are from the source
  let used_aliquots_volume = 0
  Object.values(this.wells).forEach((plate) => {
    Object.values(plate).forEach((well) => {
      well.used_aliquots?.forEach((aliquot) => {
        // For each aliquot used in wells, check if the source is the required source and if so add the volume used
        if (aliquot && aliquot.source_id == sourceId && aliquot.source_type === sourceType) {
          used_aliquots_volume = parseFloat(used_aliquots_volume) + parseFloat(aliquot.volume)
        }
      })
    })
  })

  // Calculate the total available volume for the source
  // This is the sum of the available volume, the original aliquot volume, the current aliquot volume and the given volume
  // We parse volume as it may be a string if entered by the user
  let total_available_volume = (
    available_volume +
    original_aliquot_volume -
    used_aliquots_volume +
    parseFloat(volume)
  ).toFixed(2)

  // Return the total available volume rounded to 2 decimal places
  return parseFloat(total_available_volume)
}

```

## Method Description: getAvailableVolumeForAliquot

The `getAvailableVolumeForAliquot` method calculates the available volume for a given library or pool using following steps.

- given_volume : given used_volume of the aliquot for a library or pool

- available_volume: It first validates the presence of `sourceId` and `sourceType`, returning `null` if either is missing. Depending on the `sourceType`, it determines the correct store location (`libraries` or `pools`) and retrieves the available volume for the source, defaulting to `0` if the source is not found.

- original_aliquot_volume: Calculates the sum of the initial volumes of all existing aliquots used in wells that originate from the source, accounting for any additional available volume if an existing aliquot has been reduced in volume.

- used_aliquots_volume: Calculates the sum of the volumes of all current aliquots used in wells in current run that originate from the source.This value is subtracted because it represents the volume that has already been used

- The total available volume is then calculated as: `total_available_volume = available_volume + original_aliquot_volume - used_aliquots_volume + given_volume` 

This expression combines several components to provide an accurate total available volume for a library or pool.
