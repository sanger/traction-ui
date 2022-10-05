export default {
  /**
   * Returns the PrintMyBarcodeV1 label template id associated with the ONT
   * pipeline.
   * @deprecated This should be considered deprecated as any new code should use
   *             the V2 api which can simply use template name.
   * @param {Object} state The VueX store
   * @return {String} The id of the labelTemplate to use
   */
  requests: (state) => Object.values(state.resources.requests),
}
