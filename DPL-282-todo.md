- Add all ONT Run components to within /ont/run folder, and update import statement [DONE as28]

# Store

- Create ont folder in store, with the relevant vuex riles `src/store/traction/ont/runs/ <actions>/<getters> etc` [DONE as28]
- Create an store Run index file, pulling in run module [DONE as28]
- Add currentRun object to the state.js file [DONE as28]

# Run (create) View

- Add Create Run button to ONTRun view and test
- Create run object in the state

# Runs View

- Test: Runs button on ONT Dashboard
- Test Runs view: Test table present
- Test Runs view: New run button
- Test Run view: has nested components

# ONTRunInfomation

- Add Instrument name drop down to ONTRunInfomation (details in service story - Possibly call Traction Service, to fetch list of Instrument, filtering instruments by ONT pipeline, with data: name, rows, columns [WIP as28]
- Add State drop down to ONTRunInfomation (Pending/Started/Completed/Cancelled) [WIP as28]
- Store Instrument name in Vuex State, so it is accessible from other components
- Test: ONTRunInformation contains Instrument name drop down
- Test: ONTRunInformation contains State drop down

# ONTAddPools

- Add text input box to ONTAddPools, add to data in component [DONE as28]
- Add 'search' button to ONTAddPools, to input a pool barcode. [DONE as28]
- Mock request, to return a pool [pool is an object? with what properties? where will it come from?]
- Add List to display pools, showing pool barcode and number of samples, with a remove button [how is the connection between an instrument 'run' with its 24/48 flowcells and their linked pools maintained?]
- Add test for the above ONTAddPools

# ONTRunInstrumentFlowcells

- Create simple mocked version [DONE as28]
- Contains ONTFlowCells in tabular format - how best to pass in the matrix of flowcells and their linked pools?
- Investigate how this could be dynamically created, based on Instrument Name
- Possibly adding config for each instrument layout (e.g 1x5 6x8) - p.s. Limber has something similar

# ONTFlowCell

- Create a simple mocked version of a flowcell with pool information [DONE as28]
- What props are needed?
- Should it have a remove button on it? How is that affected by run state?
- Add v-if to draw empty version if no pool linked
- Add tests
