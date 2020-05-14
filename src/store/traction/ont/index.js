const ont = {
  namespaced: true,
  state: {
    labelTemplateId: process.env.VUE_APP_ONT_LABEL_TEMPLATE_ID,
  },
  getters: {
    labelTemplateId: state => state.labelTemplateId,
  }
}

export default ont
