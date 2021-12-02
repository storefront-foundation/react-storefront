import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles';
import React from 'react'
import clsx from 'clsx'
import { Typography } from '@mui/material'
const PREFIX = 'RSFLabel';

const classes = {
  root: `${PREFIX}-root`
};

const StyledTypography = styled(Typography)((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the root element\.
   */
  [`&.${classes.root}`]: {
    fontWeight: 500,
    marginRight: 10,
  }
}));

export default function Label({  className, ...props }) {

  return <StyledTypography {...props} className={clsx(className, classes.root)} />;
}

Label.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * CSS class to apply to the root element
   */
  className: PropTypes.string,
}
