import FlaggedFeature from '@/components/shared/FlaggedFeature'
import LoadingFullScreenModal from '@/components/shared/LoadingFullScreenModal'
import TractionSection from '@/components/shared/TractionSection'
import TractionHeading from '@/components/TractionHeading'
import TractionMenu from '@/components/shared/TractionMenu'
import TractionMenuItem from '@/components/shared/TractionMenuItem'

import {
  BButton,
  BModal,
  BFormSelect,
  BAlert,
  BContainer,
  BRow,
  BCol,
  BForm,
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
  vue.component('traction-button', BButton)
}

const registerGlobal = (vue) => {
  vue.component('FlaggedFeature', FlaggedFeature)
  vue.component('LoadingFullScreenModal', LoadingFullScreenModal)
  vue.component('TractionSection', TractionSection)
  vue.component('TractionHeading', TractionHeading)
  vue.component('TractionMenu', TractionMenu)
  vue.component('TractionMenuItem', TractionMenuItem)

  registerBootstrapComponents(vue)
}

export { registerGlobal }
