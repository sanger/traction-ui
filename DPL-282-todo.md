# Service Code review

- lets you create a run with no state (could default to pending), but doesn't let you create a run with none pending state. Maybe, front end doesn't need to have this state dropdown, and backend could default to 'pending'. NOTE: completed worked, but started and cancelled didn't

# Todo

## Generic

- Make naming of ONT vs Ont consistent
- make naming of pool_id to ont_pool_id throughout
- naming of Flowcell or FlowCell
- comments throughout

## Refactor

- refactor actions/ vuex
- pool id is being used in flowcells
- refactor actions
- have to recall instruments on editRun
- run includeResource fails (reuse resources)/ pools resource with filter

## Components

- show pools used on edit
- remove button for pool id?
- update list of states?
- error if cant find pool
- alert before changing instrument, if there are pools
- on create, can changes instrument but not state, only state pending
- on edit, can change state but not instrument
- change from using kit_barcode to using tube barcode for the display (which barcode?)
- showing number of samples in pools list
- add a remove button from pools list?
- show used pools in edit run
- Runs View: pagination and order (sort by default desc)
- Add v-if to draw empty version if no pool linked
- ONTFlowCell: if we add validation can add a red colour to indicate an issue with that flowcell (plus small error msg)
- ONTFlowCell: UI for Flowcells is currently quite large. So for Promethion version you have to scroll a lot to reach lower positions. Maybe that will make it hard to drag / drop into them?
- ONTFlowCell: Possibly also want to change the input box into a text label once 'return' triggered (e.g. by scanner) to 'fix' that value once validated. So you don't accidently overscan a value you already entered. Would need a clear button then though.
- ONTFlowCell: Add clear / remove button for flowcell data (clears pool id and flowcell id from store [and backend?])
- ONTFlowCell: Add tests

## Tests

- Test: ONTRunInstrumentFlowcells.spec.js has no tests yet
- Test: `src/store/traction/ont/actions.js`
- Test: `tests/unit/views/ont/ONTRun.spec.js` update with response
- Test: ONTAddPools

# Done

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
- Contains ONTFlowCells in tabular format - how best to pass in the matrix of flowcells and their linked pools?
- Possibly adding config for each instrument layout (e.g 1x5 6x8) - p.s. Limber has something similar
- Add to the store's currentRun a matrix of the flowcells with pool barcodes and the flowcell ids they contain
- Create a simple mocked version of a flowcell with pool information [DONE as28]
- OntFlowcell: will need an input box to scan in the flowcell ID
- Fetch instrument name list from backend, and persist in VueX the instrument name and type
- Pull service changes, and check create run works and errors as expected
- will need an input box to scan in the pool ID [DONE]
- add colour change to show flowcell id present. e.g. grey when empty, yellow when pool, green when flowcell id added) [DONE]
-  Test: LabwareFinder, button is disabled is there searchValue is empty [hc6 done]
-  Test: ONTRunInformation remove '@/api/OntRun', and add setInstruments? [hc6 done]
-  Test: `src/store/traction/ont/runs/actions.js` [hc6 done]
-  Test: `src/store/traction/ont/runs/getters.js` [hc6 done]
-  Test: `src/store/traction/ont/runs/mutations.js` [hc6 done]
- on creation of a new run, clear the instrument and other values from the currentRun so the screen doesn't show the previously selected instrument
- Test: - ONTFlowell.spec.js
- Make pool items dropable into flowcells
