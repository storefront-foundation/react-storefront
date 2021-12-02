import React, { useState, useEffect, useContext } from 'react'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'
import CmsSlot from '../CmsSlot'
import MenuContext from './MenuContext'

const PREFIX = 'RSFMenuFooter';

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
  }
}));

export {};

export default function MenuFooter({  item }) {

  const { renderFooter } = useContext(MenuContext)

  if (typeof renderFooter === 'function') {
    return <Root className={classes.root}>{renderFooter(item)}</Root>;
  }

  if (item.footer) {
    return (
      <div className={classes.root}>
        <CmsSlot>{item.footer}</CmsSlot>
      </div>
    )
  }

  return null
}

MenuFooter.propTypes = {
  /**
   * The menu item record
   */
  item: PropTypes.object,
}

MenuFooter.defaultProps = {}
