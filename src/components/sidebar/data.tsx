import { CompareArrowsRounded, DonutSmallRounded } from '@mui/icons-material'
import Compare from '../compare/compare'
import OptimalSuggestion from '../optimal-suggestion/OptimalSuggestion'

export type MainListItem = {
  title: string
  icon: React.ReactNode
  id: string
  component: React.ReactNode
}

export const drawerWidth = 290

export const mainListItems: MainListItem[] = [
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
