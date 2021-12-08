import React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import MenuItemContent from './MenuItemContent'
import ExpandableSection from '../ExpandableSection'
import MenuLeaf from './MenuLeaf'

const PREFIX = 'RSFMenuBranch'

const classes = {
  expander: `${PREFIX}-expander`,
  expanderMargins: `${PREFIX}-expanderMargins`,
  expanderSummary: `${PREFIX}-expanderSummary`,
  expanderSummaryExpanded: `${PREFIX}-expanderSummaryExpanded`,
  expanderIconExpanded: `${PREFIX}-expanderIconExpanded`,
  expanderDetails: `${PREFIX}-expanderDetails`,
  expanderContent: `${PREFIX}-expanderContent`,
}

const StyledMenuItemContent = styled(MenuItemContent)(({ theme }) => ({
  [`& .${classes.expander}`]: {
    borderBottom: 'none',
  },

  [`& .${classes.expanderMargins}`]: {
    padding: 0,
  },

  [`& .${classes.expanderSummary}`]: {
    textTransform: 'uppercase',
    '&:first-child': {
      padding: `10px ${theme.spacing(2)}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },

  [`& .${classes.expanderSummaryExpanded}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },

  [`& .${classes.expanderIconExpanded}`]: {
    color: theme.palette.secondary.contrastText,
  },

  [`& .${classes.expanderDetails}`]: {
    '$expander &': {
      paddingBottom: 0,
    },
  },

  [`& .${classes.expanderContent}`]: {
    textTransform: 'none',
  },
}))

export {}

const MenuBranch = React.memo(props => {
  const { depth, item, ExpanderComponent, itemProps } = props
  const isLeaf = !item.items.some(child => child.items && child.items.length > 0)

  if (item.expanded != null && item.items && item.items.length && isLeaf) {
    return (
      <ExpanderComponent
        title={item.text}
        defaultExpanded={item.expanded}
        classes={{
          root: classes.expander,
          margins: classes.expanderMargins,
          summary: classes.expanderSummary,
          summaryExpanded: classes.expanderSummaryExpanded,
          expandIconExpanded: classes.expanderIconExpanded,
          details: classes.expanderDetails,
        }}
      >
        {item.items.map((child, i) => (
          <MenuLeaf
            key={i}
            item={child}
            depth={depth}
            classes={{ listItem: classes.expanderContent }}
          />
        ))}
      </ExpanderComponent>
    )
  }
  return <StyledMenuItemContent item={item} depth={depth} leaf={false} listItemProps={itemProps} />
})

export default MenuBranch

MenuBranch.propTypes = {
  /**
   * Overrides the default component for expandable items
   */
  ExpanderComponent: PropTypes.elementType.isRequired,
  /**
   * Additional props for the underlying ListItem
   */
  itemProps: PropTypes.object,
  depth: PropTypes.number,
  item: PropTypes.object,
}

MenuBranch.defaultProps = {
  ExpanderComponent: ExpandableSection,
}
