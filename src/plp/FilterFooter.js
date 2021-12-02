import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles';
import React, { useContext } from 'react'
import { Button, Typography } from '@mui/material'
import { Hbox } from '../Box'
import SearchResultsContext from './SearchResultsContext'

const PREFIX = 'RSFFilterFooter';

const classes = {
  root: `${PREFIX}-root`,
  itemsFound: `${PREFIX}-itemsFound`
};

const StyledHbox = styled(Hbox)((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.secondary.main,
    padding: '12px 20px',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /**
   * Styles applied to the "# items found" label.
   */
  [`& .${classes.itemsFound}`]: {
    color: theme.palette.secondary.contrastText,
  }
}));

export {};

/**
 * A footer to be placed at the bottom of the [`Filter`](/apiReference/plp/Filter).
 */
export default function FilterFooter(props) {
  let {  submitOnChange, onViewResultsClick } = props


  const {
    pageData: { filters, filtersChanged },
  } = useContext(SearchResultsContext)

  if (!filters || !filtersChanged || submitOnChange) return null

  return (
    <StyledHbox className={classes.root} justify="space-between">
      <Typography variant="subtitle1" className={classes.itemsFound}>
        {filters.length || 'No'} filter
        {filters.length === 1 ? '' : 's'} selected
      </Typography>
      <Button variant="contained" size="large" onClick={onViewResultsClick}>
        View Results
      </Button>
    </StyledHbox>
  );
}

FilterFooter.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Set to `true` if the filters will be submitted when changed. In this case, the footer will not be shown.
   */
  submitOnChange: PropTypes.bool,

  /**
   * Function to call when the "View Results" button is clicked.
   */
  onViewResultsClick: PropTypes.func,
}
