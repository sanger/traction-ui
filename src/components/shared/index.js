import FlaggedFeature from '@/components/shared/FlaggedFeature'
import LoadingFullScreenModal from '@/components/shared/LoadingFullScreenModal'
import TractionHeading from '@/components/TractionHeading'

const registerGlobal = (vue) => {
  vue.component('FlaggedFeature', FlaggedFeature)
  vue.component('LoadingFullScreenModal', LoadingFullScreenModal)
  vue.component('TractionHeading', TractionHeading)
}

export { registerGlobal }
