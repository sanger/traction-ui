# Notes

## Questions

- Where should the page be? A: Top navigation bar

## Tasks

### Done

- Create new ExtractionQC page
- Add ExtractionQC page to navigation + test
- Create new ExtractionQC form

### Todo

- A file upload input box to form for CSV
- Add `used_by` options to config somewhere/ API call to
- A `used_by` drop down for (extraction: 0, some_future_group: 1) to form
- Store CSV and used_by data in form
- An upload button to form
- When the button is pressed, call API to persist
- Button handle: Once the button is pressed it should be disabled
- Button handle: While the csv is being processed there should be visual feedback
- Button handle: Once processing is finished the button should be enable
- If the upload is successful there should be some feedback indicating that it is a success (along with an indication of how many qc results have been created)
- If the upload fails then there should be some feedback (giving reasons as to why it has failed with an indication of where it has failed)

- There should be wiggle room if the use tries to upload previously recorded records. Rather than failing it will just create a new record. The qc results table is idempotent so should not overwrite amend or delete. ()
