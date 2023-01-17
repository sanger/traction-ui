# Service Code review

- On update, if the pool barcode doesn't exist, it throws a 500. If the pool barcode doesn't exist on create, it gives a 422. For both create and update, when it fails, please could it provide a flowcell position or the pool barcode which failed?

# Todo

## Generic

- Make naming of ONT vs Ont consistent
- Add comments throughout

## Refactor

- Refactor Vuex

## Components

## Tests

- Test: ONTRunInstrumentFlowcells.spec.js has no tests yet
- Test: `src/store/traction/ont/actions.js`
- Test: `tests/unit/views/ont/ONTRun.spec.js` update with response
- Test: ONTFlowcell

## Questions For UAT

- Usage: How/ When will the run be created in relation to the physical creation (upfront/ pending/ plan/ on reflection)
- Instrument: Is there a default instrument to be selected? Currently we are restricting the abilty to change the instrument type after a run has been created, is this ok?
- State: Is there a default state to be selected on `create`? Can the state be changed from and to anything? Should updates be allowed for all states?
- Flowcell ID: Does the flowcell ID need to be validated in any way? Can it be reused? (between a run, or any previous runs?) Does it always have the same prefix or format that can be validated?
- Pool Barcode: Do you want to see any pool metadata on the flowcell? (Could add a link to Pools view?) Or is the Pools side bar list helpful.
- Flowcell: Do they want a clear/reset button from Flowcell ID or Pool Barcode inputs?
- Run: Do they want a Reset button for the whole run (could just navigate away from page)
- Run: Might you ever need to create a Draft run
- Run: Validation, should you be allowed to create a run with no flowcell data

## Not MVP?

- Runs View: pagination and order (sort by default desc) (FilterCard) resources, paginator jsonapi resources (service - paginator / filter / default sort) (waiting on back end)
- ONTFlowcell: Possibly also want to change the input box into a text label once 'return' triggered (e.g. by scanner) to 'fix' that value once validated. So you don't accidently overscan a value you already entered. Would need a clear button then though.
- ONTFlowcell: UI for Flowcells is currently quite large. So for Promethion version you have to scroll a lot to reach lower positions.
- ONTFlowcell: if we add validation can add a red colour to indicate an issue with that flowcell (plus small error msg)

# Done
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
