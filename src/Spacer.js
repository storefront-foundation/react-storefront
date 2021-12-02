import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles';
import React from 'react'
const PREFIX = 'RSFSpacer';

const classes = {
 root: `${PREFIX}-root`
};

const Root = styled('div')((
 {
  theme
 }
) => ({
 /**
  * Styles applied to the root element.
  */
 [`&.${classes.root}`]: {
   flex: 1,
 }
}));

/**
 * Renders a simple div with flex: 1 to be used as a spacer.  Since this is a
 * common case, the main purposed of this class is to minimize the amount of
 * css generated for an app.
 */
export {};

/**
 * Renders a simple div with flex: 1 to be used as a spacer.  Since this is a
 * common case, the main purposed of this class is to minimize the amount of
 * css generated for an app.
 */
export default function Spacer(props) {

  return <Root className={classes.root} />;
}

Spacer.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
}
