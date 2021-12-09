const mutations = {
  setTags(state, tags) {
    state.tractionTags = tags
  },
  updateRun(state, run) {
    let runIndex = state.pacbio.runs.runs.map((e) => e.id).indexOf(run.id)

    state.pacbio.runs.runs.splice(runIndex, 1, run)
    state.pacbio.runs.runs = [...state.pacbio.runs.runs]
  },
  addMessage(state, message) {
    state.messages.push(message)
  },
}

export default mutations
