const ont = {
  namespaced: true,
  state: {
    labelTemplateId: import.meta.env.VITE_ONT_LABEL_TEMPLATE_ID,
  },
  getters: {
    labelTemplateId: (state) => state.labelTemplateId,
  },
}

export default ont
