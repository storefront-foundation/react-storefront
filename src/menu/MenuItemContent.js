import React, { useContext } from 'react'
import { styled } from '@mui/material/styles'
import { ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import MenuContext from './MenuContext'
import MenuExpanderIcon from './MenuExpanderIcon'

const PREFIX = 'RSFMenuItemContent'

const classes = {
  listItem: `${PREFIX}-listItem`,
  listItemImage: `${PREFIX}-listItemImage`,
  listItemIcon: `${PREFIX}-listItemIcon`,
  loadingIcon: `${PREFIX}-loadingIcon`,
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  [`& .${classes.listItem}`]: {
    textTransform: 'uppercase',
    lineHeight: '1.5',
    fontSize: theme.typography.body1.fontSize,
  },

  [`& .${classes.listItemImage}`]: {
    width: '40px',
    height: '40px',
    marginRight: 0,
  },

  [`& .${classes.listItemIcon}`]: {
    marginRight: 0,
    minWidth: 0,
  },

  [`& .${classes.loadingIcon}`]: {
    display: 'block',
  },
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  [`& .${classes.drawer}`]: {
    zIndex: theme.zIndex.modal + 20,
    display: 'flex',
    flexDirection: 'column',
    borderTop: `${theme.headerHeight}px solid transparent`,
    'body.moov-safari &': {
      // Turning off momentum scrolling on iOS here to fix frozen body issue
      // Source: https://moovweb.atlassian.net/browse/PRPL-342
      '-webkit-overflow-scrolling': 'auto',
    },
  },

  [`& .${classes.list}`]: {
    flex: 'none',
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '100%',
    padding: 0,
  },

  [`& .${classes.listPadding}`]: {
    padding: 0,
  },

  [`& .${classes.header}`]: {
    position: 'absolute',
    left: '10px',
    top: '12px',
  },

  [`& .${classes.icon}`]: {
    marginRight: '0',
    width: 24,
  },

  [`& .${classes.headerText}`]: {
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: theme.typography.body1.fontSize,
  },

  [`& .${classes.bodyWrap}`]: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    transition: 'all ease-out .2s',
    maxHeight: '100%',
  },

  [`& .${classes.hidden}`]: {
    display: 'none',
  },

  [`& .${classes.visible}`]: {
    display: 'block',
  },

  [`& .${classes.link}`]: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
  },

  [`& .${classes.leaf}`]: {
    textTransform: 'none',
    ...theme.typography.body1,
  },

  [`& .${classes.drawerFixed}`]: {
    top: 0,
    height: '100vh',
    borderTop: 'none',
  },
}))

export default function MenuItemContent(props) {
  const { renderItemContent, onItemClick } = useContext(MenuContext)

  const { item, depth, leaf, listItemProps } = props
  let contents

  if (renderItemContent) {
    contents = renderItemContent(item, leaf)
  }

  if (!contents) {
    if (leaf) {
      contents = (
        <>
          {item.image && (
            <ListItemIcon>
              <img className={classes.listItemImage} alt={item.text} src={item.image} />
            </ListItemIcon>
          )}
          <ListItemText primary={item.text} disableTypography />
        </>
      )
    } else {
      contents = (
        <>
          {item.image && (
            <ListItemIcon>
              <img className={classes.listItemImage} alt={item.text} src={item.image} />
            </ListItemIcon>
          )}
          <StyledListItemText className={classes.listItem} primary={item.text} disableTypography />
          <ListItemIcon className={classes.listItemIcon}>
            {item.loading ? (
              <CircularProgress
                style={{ height: 24, width: 24, padding: 4 }}
                color="secondary"
                className={classes.loadingIcon}
              />
            ) : (
              <MenuExpanderIcon {...props} />
            )}
          </ListItemIcon>
        </>
      )
    }
  }

  return (
    <StyledListItem
      onClick={leaf ? null : onItemClick.bind(null, item, depth)}
      button
      divider
      classes={{
        root: clsx(classes.listItem, item.className),
      }}
      {...listItemProps}
    >
      {contents}
    </StyledListItem>
  )
}

MenuItemContent.propTypes = {
  /**
   * Additional props for the underlying ListItem
   */
  listItemProps: PropTypes.object,
  item: PropTypes.object,
  depth: PropTypes.number,
  leaf: PropTypes.bool,
}
