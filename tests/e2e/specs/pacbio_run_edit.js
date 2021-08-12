describe('Pacbio Run Edit view', () => {
  it('Updates a run successfully', () => {
    // visit the runs page
    // click edit existing run
    // click on well
    // update movie time
    // click update (well)
    // click update (run)
    // I should see a message run successfully updated
  })

  it('will not create a run if there is an error', () => {
   // visit the runs page
    // click edit existing run
    // click on well
    // remove on plate loading concentration
    // click update (well)
    // well should go red
    // click update (run)
    // I should see a message - e.g. on plate loading concentration should be present
  })
})
