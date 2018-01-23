import PageCard from './PageCard'
import PageCardToolbar from './PageCardToolbar'

PageCard.install = function (Vue) {
  Vue.component(PageCard.name, PageCard)
  Vue.component(PageCardToolbar.name, PageCardToolbar)
}

export default PageCard
