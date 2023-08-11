import hasPermi from './permission/hasPermi'
import copyText from './common/copyText'

export default function directive(app){
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
}
