# Available volume calculation

The available volume displayed in run creation uses the following calculation

$$
 V_{availble\_volume} = V_{actual\_available\_volume} + V_{used\_volume\_in\_given\_run}
$$

where

- _\(V_{available\_volume}\) represents the total volume of the library or pool that is available to be allocated or used in the run. This is the value being displayed to the user._
- _\(V_{actual\_available\_volume}\) is the current actual available volume of the library or pool, meaning the remaining amount of volume that has not been allocated or used anywhere yet._
- _\(V_{used\_volume\_in\_given\_context}\) represents the volume of the library/pool that has already been used or assigned in the specific context being edited._


## JavaScript Implementation

The method `getAvailableVolumeForAliquot` is implemented in [this file on GitHub](https://github.com/sanger/traction-ui/blob/develop/src/stores/pacbioRunCreate.js).

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
Here is a text description for the `getAvailableVolumeForAliquot` method:

```markdown
## Method Description: getAvailableVolumeForAliquot

The `getAvailableVolumeForAliquot` method calculates the available volume for a given library or pool. It takes three parameters: `sourceId` (the ID of the library or pool), `sourceType` (the type of the source, either `Pacbio::Library` or `Pacbio::Pool`), and `volume` (the volume of the current aliquot being calculated, which defaults to `null`).

1. **Validation**: The method first checks if `sourceId` and `sourceType` are provided. If either is missing, it returns `null`.

2. **Source Store Determination**: Based on the `sourceType`, it determines the correct store location (`libraries` or `pools`) and retrieves the available volume for the source. If the source is not found, it defaults to `0`.

3. **Original Aliquot Volume Calculation**: It calculates the sum of the initial volumes of all existing aliquots used in wells that originate from the source. This step accounts for any additional available volume if an existing aliquot has been reduced in volume.

4. **Used Aliquots Volume Calculation**: It calculates the sum of the volumes of all current aliquots used in wells that originate from the source.

5. **Total Available Volume Calculation**: The total available volume is calculated as the sum of the available volume, the original aliquot volume, the current aliquot volume, and the given volume (parsed as a float). The result is rounded to two decimal places.

6. **Return Value**: The method returns the total available volume rounded to two decimal places.

### Code Implementation

```javascript
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

The `getAvailableVolumeForAliquot` method calculates the available volume for a given library or pool. It first validates the presence of `sourceId` and `sourceType`, returning `null` if either is missing. Depending on the `sourceType`, it determines the correct store location (`libraries` or `pools`) and retrieves the available volume for the source, defaulting to `0` if the source is not found. The method then calculates the sum of the initial volumes of all existing aliquots used in wells that originate from the source, accounting for any additional available volume if an existing aliquot has been reduced in volume. It also calculates the sum of the volumes of all current aliquots used in wells that originate from the source. The total available volume is then calculated as the sum of the available volume, the original aliquot volume, the current aliquot volume, and the given volume. 
