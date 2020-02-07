import React from 'react'
import MenuItemContent from './MenuItemContent'
import ExpandableSection from '../ExpandableSection'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import MenuLeaf from './MenuLeaf'

export const styles = theme => ({
  expander: {
    borderBottom: 'none',
  },

  expanderMargins: {
    padding: 0,
  },

  expanderSummary: {
    textTransform: 'uppercase',
    '&:first-child': {
      padding: `10px ${theme.spacing(2)}px`,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },

  expanderSummaryExpanded: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },

  expanderIconExpanded: {
    color: theme.palette.secondary.contrastText,
  },

  expanderDetails: {
    '$expander &': {
      paddingBottom: 0,
    },
  },

  expanderContent: {
    textTransform: 'none',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFMenuBranch' })

const MenuBranch = React.memo(props => {
  const { depth, item, ExpanderComponent, itemProps } = props
  const isLeaf = !item.items.some(child => child.items && child.items.length > 0)
  const classes = useStyles()

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
  } else {
    return <MenuItemContent item={item} depth={depth} leaf={false} listItemProps={itemProps} />
  }
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
}

MenuBranch.defaultProps = {
  ExpanderComponent: ExpandableSection,
}
