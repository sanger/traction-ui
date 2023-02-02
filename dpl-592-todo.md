DPL-592

# To do

## tests

- actions.spec.js
  - add test for when multiple barcodes are searched for
- mutations.spec.js
  - add test for removepool mutation


# Done

## building

- Add LabwareFinder to PacbioPoolList.vue
- Modify setPools action for LabwareFinder
- add PacbioSelectedPoolsList component (after OntPlateSelectedList.vue component)
- remove the provider and created methods

## functionality

- allow users to select pools they search for and for them to persist when adding multiple pool barcodes

  - Add error message indicating user to input a barcode when the search button is clicked without a filter
  - Add prompt for users to enter barcode when they search for nothing

- get rid of the 'Failed to get pools: xxx' error that comes up due the provider method getting called in created trying to set pools with SetPools

  - the barcode is unidentified during that step
  - Make pools persist when searching for multiple pool barcodes (selectedPools getter?)
  - There was a way to make the pools persist without creating a selected attribute in the store
  - As all the pools in the store are the pools that are there as the filter results

- selected pools should be able to get removed with a click
  - add a remove button within the list of pools
  - create a method to removePool(take pool.id) on click in the component
  - pacbiopooltubeitem - import and export mutations, map mutation for deselect
  - create function in mutations for deselect
    - make debugger to see if it hits it
    - second argument is pool.id which should be the pool being deleted
    - remove the pool from state pools (remove item from list)
    - set state.pools the previous way = new list

- put something indicative of what the search button is for (pools) in run create

## refactoring and restructuring

- leave setPools as it was and make a findPools action in RunCreate store
- copied setpools over to runcreate/actions
- returned pools/actions to what it was, the pacbiopools page now works

## tests

- revert changes on pools.actions.spec
- move tests from poolcreate to runcreate (will be copied from pools one)

- getters.spec.js
- mutations.spec.js
  - add test for set... mutations used from pools store