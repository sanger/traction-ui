DPL-592

# Todo

- allow users to select pools they search for and for them to persist when adding multiple pool barcodes

- selected pools should be able to get removed with a click

  - add a remove button within the list of pools
  - create a method to deselectPools on click

- add and modify tests
  - actions.spec.js
  - the display should be empty when nothing is being searched

# Done

- Add LabwareFinder to PacbioPoolList.vue
- Modify setPools action for LabwareFinder
- Add error message indicating user to input a barcode when the search button is clicked without a filter
- Add prompt for users to enter barcode when they search for nothing

- allow users to select pools they search for and for them to persist when adding multiple pool barcodes

  - add PacbioSelectedPoolsList component (after OntPlateSelectedList.vue component)
  - remove the provider and created methods

- get rid of the 'Failed to get pools: xxx' error that comes up due the provider method getting called in created trying to set pools with SetPools

  - the barcode is unidentified during that step

- leave setPools as it was and make a findPools action in RunCreate store
- copied setpools over to runcreate/actions
- returned pools/actions to what it was, the pacbiopools page now works
