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
import TractionTag from '@/components/shared/TractionTag'
import TractionSubSection from '@/components/shared/TractionSubSection'
import TractionMutedText from '@/components/shared/TractionMutedText'
import TractionToggle from '@/components/shared/TractionToggle'
import TractionSpinner from '@/components/shared/TractionSpinner'
import TractionInput from '@/components/shared/TractionInput'
import TractionFieldError from '@/components/shared/TractionFieldError'
import TractionSelect from '@/components/shared/TractionSelect'
import TractionResultIcon from '@/components/shared/icons/TractionResultIcon'
import TractionPaginationIcon from '@/components/shared/icons/TractionPaginationIcon'
import TractionPagination from '@/components/shared/TractionPagination'
import TractionForm from '@/components/shared/TractionForm'
import TractionTable from '@/components/shared/table/TractionTable'
import TractionTableRow from '@/components/shared/table/TractionTableRow'
import TractionTableColumn from '@/components/shared/table/TractionTableColumn'
import TractionModal from '@/components/shared/TractionModal'
import TractionArrowIcon from '@/components/shared/icons/TractionArrowIcon'
import TractionSortIcon from '@/components/shared/icons/TractionSortIcon'
import TractionCloseIcon from '@/components/shared/icons/TractionCloseIcon'



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
  vue.component('TractionTag', TractionTag)
  vue.component('TractionSubSection', TractionSubSection)
  vue.component('TractionMutedText', TractionMutedText)
  vue.component('TractionToggle', TractionToggle)
  vue.component('TractionSpinner', TractionSpinner)
  vue.component('TractionInput', TractionInput)
  vue.component('TractionFieldError', TractionFieldError)
  vue.component('TractionResultIcon', TractionResultIcon)
  vue.component('TractionSelect', TractionSelect)
  vue.component('TractionPagination', TractionPagination)
  vue.component('TractionPaginationIcon', TractionPaginationIcon)
  vue.component('TractionForm', TractionForm)
  vue.component('TractionArrowIcon', TractionArrowIcon)
  vue.component('TractionSortIcon', TractionSortIcon)
  vue.component('TractionTable', TractionTable)
  vue.component('TractionTableRow', TractionTableRow)
  vue.component('TractionTableColumn', TractionTableColumn)
  vue.component('TractionModal', TractionModal)
  vue.component('TractionCloseIcon', TractionCloseIcon)
}

export { registerGlobal}
