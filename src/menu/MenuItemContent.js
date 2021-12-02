import React, { useContext } from 'react'
import { styled } from '@mui/material/styles';
import { ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material'
import MenuContext from './MenuContext'
import MenuExpanderIcon from './MenuExpanderIcon'
import clsx from 'clsx'
import PropTypes from 'prop-types'
const PREFIX = 'RSFMenuItemContent';

const classes = {
  listItem: `${PREFIX}-listItem`,
  listItemImage: `${PREFIX}-listItemImage`,
  listItemIcon: `${PREFIX}-listItemIcon`,
  loadingIcon: `${PREFIX}-loadingIcon`
};

const StyledListItem = styled(ListItem)((
  {
    theme
  }
) => ({
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
  }
}));

export {};

export default function MenuItemContent(props) {
  const { renderItemContent, onItemClick } = useContext(MenuContext)


  let { item, depth, leaf, listItemProps } = props
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
          <ListItemText className={classes.listItem} primary={item.text} disableTypography />
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
  );
}

MenuItemContent.propTypes = {
  /**
   * Additional props for the underlying ListItem
   */
  listItemProps: PropTypes.object,
}
