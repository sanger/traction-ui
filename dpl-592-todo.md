DPL-592

# Todo

- allow multiple barcode input to be supported separated with carriage return
- when searching for one known and one unknown, add an error message for the unknown tube while displaying the known one

- allow users to select pools they search for and for them to persist when adding multiple pool barcodes
- selected pools should be able to get removed with a click
- get rid of the 'Failed to get pools: xxx' error that 
  - comes up due the provider method getting called in created trying to set pools with SetPools
  - this is because the barcode is unidentified during that step
- add PacbioSelectedPoolsList component (after OntPlateSelectedList.vue component)
- add and modify tests
  - actions.spec.js
  - the display should be empty when nothing is being searched


# Done

- Add LabwareFinder to PacbioPoolList.vue
- Modify setPools action for LabwareFinder
- Add error message indicating user to input a barcode when the search button is clicked without a filter
- Add prompt for users to enter barcode when they search for nothing