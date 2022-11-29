import { CompareArrowsRounded, DonutSmallRounded } from '@mui/icons-material'
import Compare from '../compare/compare'
import OptimalSuggestion from '../optimal-suggestion/OptimalSuggestion'

export const drawerWidth = 290

export const mainListItems = [
  {
    title: 'Optimal suggestion',
    icon: <DonutSmallRounded />,
    id: 'optimal-suggestion',
    component: <OptimalSuggestion />,
  },
  {
    title: 'Compare custom payment',
    icon: <CompareArrowsRounded />,
    id: 'compare-custom-payment',
    component: <Compare />,
  },
]
