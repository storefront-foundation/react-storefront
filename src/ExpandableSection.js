import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import useStateFromProp from './hooks/useStateFromProp'
import withDefaultHandler from './utils/withDefaultHandler'

export const styles = theme => ({
  root: {
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: 'transparent',

    '&::before': {
      display: 'none',
    },

    '& > *:first-child': {
      padding: '0',
      minHeight: '0',
    },
  },

  margins: {
    padding: `0 ${theme.spacing(2)}px`,
  },

  caption: {
    transition: 'opacity .2s linear',
  },

  expandedCaption: {
    opacity: 0,
  },

  largeTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#444',
  },

  details: {
    padding: theme.spacing(0, 0, 2, 0),
    display: 'flex',
    flexDirection: 'column',
  },

  summary: {
    '&:first-child': {
      padding: theme.spacing(1, 0),
    },
  },

  summaryContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
    '[aria-expanded=true] > &': {
      margin: '0 !important',
    },
  },

  summaryExpanded: {},
  expandIconExpanded: {},

  withCollapseIcon: {
    transform: 'rotate(0deg) !important',
  },

  summaryIconWrap: {
    right: 0,
    padding: theme.spacing(0, 1),
  },

  expandedPanel: {
    '&$root': {
      margin: 0,
    },
  },

  title: {},
  expandIcon: {},
  collapseIcon: {},
})

const useStyles = makeStyles(styles, { name: 'RSFExpandableSection' })

/**
 * An expandable info section.  Example:
 *
 * ```js
 *  <ExpandableSection title="Help" caption="Click here for more info">
 *    <Typography>This is a help section</Typography>
 *  </ExpandableSection>
 * ```
 */
export default function ExpandableSection(props) {
  let {
    classes,
    children = [],
    title,
    caption,
    expanded,
    defaultExpanded,
    ExpandIcon,
    CollapseIcon,
    margins,
    onChange,
    ...others
  } = props

  classes = useStyles({ classes })

  const [expandedState, setExpandedState] = useStateFromProp(expanded || defaultExpanded || false)

  /**
   * Gets the classes for the ExpansionPanelSummary
   * Here we add a class to remove the rotate transform if we're using a
   * separate icon for the collapse state.
   */
  function getSummaryClasses() {
    const result = {
      root: clsx({ [classes.summary]: true, [classes.summaryExpanded]: expandedState }),
      content: classes.summaryContent,
      expandIcon: clsx({
        [classes.summaryIconWrap]: true,
        [classes.expandIconExpanded]: expandedState,
      }),
    }

    if (CollapseIcon !== ExpandIcon) {
      result.expandIcon = classes.withCollapseIcon
    }

    return result
  }

  const handleChange = withDefaultHandler(onChange, (e, expanded) => {
    if (props.expanded == null) {
      setExpandedState(expanded)
    }
  })

  return (
    <ExpansionPanel
      classes={{
        root: clsx({
          [classes.root]: true,
          [classes.margins]: margins,
        }),
        expanded: classes.expandedPanel,
      }}
      expanded={expandedState}
      defaultExpanded={defaultExpanded}
      {...others}
      onChange={handleChange}
    >
      <ExpansionPanelSummary
        expandIcon={
          expandedState ? (
            <CollapseIcon className={classes.collapseIcon} />
          ) : (
            <ExpandIcon className={classes.expandIcon} />
          )
        }
        classes={getSummaryClasses()}
      >
        <Typography variant="subtitle1" className={classes.title}>
          {title}
        </Typography>
        {caption && (
          <Typography
            variant="caption"
            className={clsx({
              [classes.caption]: true,
              [classes.expandedCaption]: expandedState,
            })}
          >
            {caption}
          </Typography>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails classes={{ root: classes.details }}>{children}</ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

ExpandableSection.propTypes = {
  /**
   * The title for the header of the expandable section
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Text to display to the right of the heading
   */
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * The icon to use for collapsed groups
   */
  ExpandIcon: PropTypes.object,

  /**
   * The icon to use for expanded groups
   */
  CollapseIcon: PropTypes.object,

  /**
   * Set to false to remove the default left and right margins. Defaults to `true`.
   */
  margins: PropTypes.bool,

  /**
   * Controls the expanded state.  Defaults to false
   */
  expanded: PropTypes.bool,

  /**
   * Defaults the panel to being expanded, without controlling the state.  Defaults to false
   */
  defaultExpanded: PropTypes.bool,
}

ExpandableSection.defaultProps = {
  margins: true,
  ExpandIcon: ExpandMoreIcon,
  CollapseIcon: ExpandMoreIcon,
}
