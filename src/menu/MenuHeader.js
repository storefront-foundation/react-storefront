import React, { useState, useEffect, useContext } from 'react'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'
import CmsSlot from '../CmsSlot'
import MenuContext from './MenuContext'

const PREFIX = 'RSFMenuHeader';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  }
}));

export {};

export default function MenuHeader({  item }) {

  const { renderHeader } = useContext(MenuContext)

  if (typeof renderHeader === 'function') {
    return <Root className={classes.root}>{renderHeader(item)}</Root>;
  }

  if (item.header) {
    return (
      <div className={classes.root}>
        <CmsSlot>{item.header}</CmsSlot>
      </div>
    )
  }

  return null
}

MenuHeader.propTypes = {
  /**
   * The menu item record
   */
  item: PropTypes.object,
}

MenuHeader.defaultProps = {}
