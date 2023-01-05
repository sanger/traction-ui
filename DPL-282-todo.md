# Done

- Add all ONT Run components to within /ont/run folder, and update import statement [DONE as28]
- Create ont folder in store, with the relevant vuex riles `src/store/traction/ont/runs/ <actions>/<getters> etc` [DONE as28]
- Create an store Run index file, pulling in run module [DONE as28]
- Add currentRun object to the state.js file [DONE as28]
- Add text input box to ONTAddPools, add to data in component [DONE as28]
- Add 'search' button to ONTAddPools, to input a pool barcode. [DONE as28]
- Test Runs view: Test table present
- Test Runs view: New run button
- Test Run view: has nested components
- Test: Runs button on ONT Dashboard
- Add Instrument name drop down to ONTRunInfomation (details in service story - Possibly call Traction Service, to fetch list of Instrument, filtering instruments by ONT pipeline, with data: name, rows, columns [WIP as28]. Currently fetching instrument name list from the state.
- Create run object in the state
- Add State drop down to ONTRunInfomation (Pending/Started/Completed/Cancelled)
- Store Instrument name in Vuex State, so it is accessible from other components
- Test: ONTRunInformation contains Instrument name drop down
- Test: ONTRunInformation contains State drop down
- Add Create Run button to ONTRun view and test
- Add method to call createRun action, redirect to runs page if successful, or show error
- Create createRun VueX actions
- Add create function to OntRun.js api
- Test: create run button, runAction, actions, OntRun.js
- Check existing ONT pool vuex request/state etc (WIP hc6)
- Enter pool barcode, populate list of pools, and display
- Mock request, to return a pool
- Add List to display pools

# Todo

- Make naming of ONT vs Ont consistent

## Run (create) View

- Pull service changes, and check create run works and errors as expected

## ONTRunInfomation

- Fetch instrument name list from backend, and persist in VueX the instrument id

## ONTAddPools

- showing pool barcode and number of samples
- add a remove button [how is the connection between an instrument 'run' with its 24/48 flowcells and their linked pools maintained?]
- Add test for the above ONTAddPools

## ONTRunInstrumentFlowcells

- Investigate how this could be dynamically created, based on Instrument Name
- Create simple mocked version of ONTRunInstrumentFlowcells [DONE as28]
- Contains ONTFlowCells in tabular format - how best to pass in the matrix of flowcells and their linked pools?
- Possibly adding config for each instrument layout (e.g 1x5 6x8) - p.s. Limber has something similar

## ONTFlowCell

- Create a simple mocked version of a flowcell with pool information [DONE as28]
- What props are needed?
- Should it have a remove button on it? How is that affected by run state?
- Add v-if to draw empty version if no pool linked
- Add tests
