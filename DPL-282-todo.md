- Add all ONT Run components to within /ont/run folder, and update import statement [DONE as28]

# Store

- Create ont folder in store, with the relevant vuex riles `src/store/traction/ont/runs/ <actions>/<getters> etc` [DONE as28]
- Create an store Run index file, pulling in run module
- Add currentRun object to the state.js file

# Run (create) View

- Add Create Run button to ONTRun view and test
- Create run object in the state

# Runs View

- Test: Runs button on ONT Dashboard
- Test Runs view: Test table present
- Test Runs view: New run button
- Test Run view: has nested components

# ONTRunInfomation

- Add Instrument name drop down to ONTRunInfomation (details in service story - Possibly call Traction Service, to fetch list of Instrument, filtering instruments by ONT pipeline, with data: name, rows, columns
- Add State drop down to ONTRunInfomation (Pending/Started/Completed/Cancelled)
- Store Instrument name in Vuex State, so it is accessible from other components
- Test: ONTRunInformation contains Instrument name drop down
- Test: ONTRunInformation contains State drop down

# ONTAddPools

- Add text input box to ONTAddPools, add to data in component
- Add 'search' button to ONTAddPools, to input a pool barcode. Mock request, to return list of pools
- Add List to display pools, showing pool barcode and number of samples
- Add test for the above ONTAddPools

# ONTRunFlowcell

- Investigate how this could be dynamically created, based on Instrument Name
- Possibly adding config for each instrument layout (e.g 1x5 6x8) - p.s. Limber has something similar
