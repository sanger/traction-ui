DPL-592

# To do

- creating a run:

  - after dragging and dropping the pool to well, the well is not populated with the pool information

- when editing a run:
  - the well knows the pool barcode but not other features such as movie_time etc
  - runInfoEdit is fine, runWellDefaultEdit and runPlateItem are not

## tests

### end to end tests

- pacbio_run_create

  - cannot cy.get() components I've added such as
    - .pacbioPoolList
    - .pacbioPoolSelectedList
    - (doesn't actually need them but out of curiosity)
  - current drag and drop of tube to well functionality does not work, resulting in no update button being displayed that is failing the first two tests (while the third one passes the drag and drop still does not work)

- pacbio_run_edit
  - not making the changes on #movie_time (says to select 15, does not)
  - when updating, errors saying pool is not valid

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

- can save pools into wells when creating and editing a run

## refactoring and restructuring

- leave setPools as it was and make a findPools action in RunCreate store
- copied setpools over to runcreate/actions
- returned pools/actions to what it was, the pacbiopools page now works

## tests

- revert changes on pools.actions.spec
- move tests from poolcreate to runcreate (will be copied from pools one)

- getters.spec.js
- a valid barcode
- mutations.spec.js
  - add test for set... mutations used from pools store
  - add test for removepool mutation

## styling

- change layout to fit all the other components on the page
- change the button layout
