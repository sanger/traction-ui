const pacbio = {
  namespaced: true,
  modules: {},
  state: {
    labelTemplateId: process.env.VUE_APP_PACBIO_LABEL_TEMPLATE_ID,
  },
  getters: {
    labelTemplateId: state => state.labelTemplateId,
  }
}

export default pacbio
