# Todo

- UI: Display information about the invalid position on the creation or update of a run. Possibly show error in the specific flowcell (dependent on: Service)

- Make naming of ONT vs Ont consistent
- Add comments throughout
- Refactor Vuex

## Tests

- e2e Test

# Done

- Test: `src/store/traction/ont/runs/actions.js` (`updateRun`, `editRun`)
- UI: Runs sort by most recent
- UI: Reset button for whole page
- UI: Runs table header, rename ‘Name’ to ‘Experiment ID’
- UI: Don’t let create a run with no flowcell data (Create button disabled)
- UI: Rename ‘Pool Barcode’ to ‘Library Barcode’
- UI: Trim library barcode/ flowcell
- UI: Make Pool Barcode and Flowcell always uppercase
- UI: Add Flowcell ID validation (dependent on: Alex)
- UI: Update PromethION column/ row naming system (dependent on: Alex)
- UI: Support Runs Pagination (dependent on: Service) (service done) https://github.com/sanger/traction-service/pull/890/commits/b160f9e3c223e2932afddc6a58e6e8ec6ed8d3d9

- Test: `ONTRun.spec.js`
- Test: `ONTRunInstrumentFlowcells.spec.js`
- Test: `ONTRuns.spec.js` (`editRun`, `mapGetters`, `generateId`, `redirectToRun`, `mapActions`)
- Test: ONTFlowcell
  - Test: `ONTRunInformation`
- Update with what will be used when scanning in Pool to Flowcell (**tube barcode**)
- `updateRun` action
- Use ont_pool_id in flowcell data when creating a run (call setPools on OntRun creation)
- Add v-if to draw empty version if no pool linked
- on edit, disable changing the instrument
- update list of states
- make naming of pool_id to ont_pool_id throughout
- naming of Flowcell or FlowCell
- ONTAddPools: Make pool items draggable
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
- Investigate how this could be dynamically created, based on Instrument Name
- Create simple mocked version of ONTRunInstrumentFlowcells [DONE as28]
- Should this be done as an SVG? Does it need to be, is it easier to just use components
- Contains ONTFlowcells in tabular format - how best to pass in the matrix of flowcells and their linked pools?
- Possibly adding config for each instrument layout (e.g 1x5 6x8) - p.s. Limber has something similar
- Add to the store's currentRun a matrix of the flowcells with pool barcodes and the flowcell ids they contain
- Create a simple mocked version of a flowcell with pool information [DONE as28]
- ONTFlowcell: will need an input box to scan in the flowcell ID
- Fetch instrument name list from backend, and persist in VueX the instrument name and type
- Pull service changes, and check create run works and errors as expected
- will need an input box to scan in the pool ID [DONE]
- add colour change to show flowcell id present. e.g. grey when empty, yellow when pool, green when flowcell id added) [DONE]
- Test: LabwareFinder, button is disabled is there searchValue is empty [hc6 done]
- Test: ONTRunInformation remove '@/api/OntRun', and add setInstruments? [hc6 done]
- Test: `src/store/traction/ont/runs/actions.js` [hc6 done]
- Test: `src/store/traction/ont/runs/getters.js` [hc6 done]
- Test: `src/store/traction/ont/runs/mutations.js` [hc6 done]
- on creation of a new run, clear the instrument and other values from the currentRun so the screen doesn't show the previously selected instrument
- Test: - ONTFlowell.spec.js
- Make pool items dropable into flowcells
