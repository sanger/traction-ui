import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
import LoadingFullScreenModal from '@/components/shared/LoadingFullScreenModal.vue'
import TractionButton from '@/components/shared/TractionButton.vue'
import TractionFieldset from '@/components/shared/TractionFieldset.vue'
import TractionFieldGroup from '@/components/shared/TractionFieldGroup.vue'
import TractionSection from '@/components/shared/TractionSection.vue'
import TractionHeading from '@/components/TractionHeading.vue'
import TractionLabel from '@/components/shared/TractionLabel.vue'
import TractionMenu from '@/components/shared/TractionMenu.vue'
import TractionMenuItem from '@/components/shared/TractionMenuItem.vue'

import {
  BModal,
  VBModal,
  BFormSelect,
  BAlert,
  BContainer,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BCard,
  BCardText,
  BListGroup,
  BListGroupItem,
  BTabs,
  BTab,
  BTable,
  BBadge,
  BFormCheckbox,
  BFormFile,
  BTableSimple,
  BTr,
  BTd,
  BSpinner,
  BFormInvalidFeedback,
  BThead,
  BTh,
  BTbody,
  BFormTextarea,
  BCardHeader,
  BNav,
  BNavItem,
  BCardBody,
  BInputGroup,
  BInputGroupAppend,
  BPagination,
} from 'bootstrap-vue'

const registerBootstrapComponents = (vue) => {
  /* eslint-disable vue/component-definition-name-casing */
  vue.component('traction-modal', BModal)
  vue.component('traction-select', BFormSelect)
  vue.component('traction-alert', BAlert)
  vue.component('traction-container', BContainer)
  vue.component('traction-row', BRow)
  vue.component('traction-col', BCol)
  vue.component('traction-form', BForm)
  vue.component('traction-form-group', BFormGroup)
  vue.component('traction-input', BFormInput)
  vue.component('traction-card', BCard)
  vue.component('traction-card-body', BCardBody)
  vue.component('traction-card-text', BCardText)
  vue.component('traction-list-group', BListGroup)
  vue.component('traction-list-group-item', BListGroupItem)
  vue.component('traction-tabs', BTabs)
  vue.component('traction-tab', BTab)
  vue.component('traction-table', BTable)
  vue.component('traction-table-simple', BTableSimple)
  vue.component('traction-badge', BBadge)
  vue.component('traction-checkbox', BFormCheckbox)
  vue.component('traction-file', BFormFile)
  vue.component('traction-tr', BTr)
  vue.component('traction-td', BTd)
  vue.component('traction-spinner', BSpinner)
  vue.component('traction-invalid-feedback', BFormInvalidFeedback)
  vue.component('traction-thead', BThead)
  vue.component('traction-th', BTh)
  vue.component('traction-tbody', BTbody)
  vue.component('traction-textarea', BFormTextarea)
  vue.component('traction-card-header', BCardHeader)
  vue.component('traction-nav-item', BNavItem)
  vue.component('traction-nav', BNav)
  vue.component('traction-input-group', BInputGroup)
  vue.component('traction-input-group-append', BInputGroupAppend)
  vue.component('traction-pagination', BPagination)

  /*
    directive is marked wth a v in front
    so it will be used as 'v-traction-modal'
  */
  vue.directive('traction-modal', VBModal)

  /* eslint-enable vue/component-definition-name-casing */
}

const registerGlobal = (vue) => {
  vue.component('FlaggedFeature', FlaggedFeature)
  vue.component('LoadingFullScreenModal', LoadingFullScreenModal)
  vue.component('TractionButton', TractionButton)
  vue.component('TractionFieldGroup', TractionFieldGroup)
  vue.component('TractionFieldset', TractionFieldset)
  vue.component('TractionLabel', TractionLabel)
  vue.component('TractionSection', TractionSection)
  vue.component('TractionHeading', TractionHeading)
  vue.component('TractionMenu', TractionMenu)
  vue.component('TractionMenuItem', TractionMenuItem)

  registerBootstrapComponents(vue)
}

export { registerGlobal }
