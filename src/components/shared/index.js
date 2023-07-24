import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
import LoadingFullScreenModal from '@/components/shared/LoadingFullScreenModal.vue'
import TractionButton from '@/components/shared/TractionButton.vue'
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

const components = {
  FlaggedFeature,
  LoadingFullScreenModal,
  TractionButton,
  TractionFieldGroup,
  TractionLabel,
  TractionSection,
  TractionHeading,
  TractionMenu,
  TractionMenuItem,
  TractionTag,
  TractionSubSection,
  TractionMutedText,
  TractionToggle,
  TractionSpinner,
  TractionInput,
  TractionFieldError,
  TractionResultIcon,
  TractionSelect,
  TractionPagination,
  TractionPaginationIcon,
  TractionForm,
  TractionArrowIcon,
  TractionSortIcon,
  TractionTable,
  TractionTableRow,
  TractionTableColumn,
  TractionModal,
  TractionCloseIcon,
}

const registerGlobal = (vue) => {
  Object.entries(components).forEach(([name, component]) => vue.component(name, component))
}

export { components, registerGlobal }
