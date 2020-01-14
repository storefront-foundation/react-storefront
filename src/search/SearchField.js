import React, { useState, useRef, useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import PropTypes from 'prop-types'
import withDefaultHandler from '../utils/withDefaultHandler'
import SearchContext from './SearchContext'
import { IconButton } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import SearchSubmitButton from './SearchSubmitButton'
import { Fab, Button } from '@material-ui/core'
import clsx from 'clsx'

export const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  inputWrap: {
    display: 'flex',
    flexGrow: 1,
    border: 0,
    borderRadius: '35px',
    backgroundColor: theme.palette.background.paper,
    margin: 0,
    height: '48px',
  },
  input: {
    border: 'none',
    background: 'none',
    flex: 1,
    padding: '0 0 0 20px',
    ...theme.typography.body1,
    '&:focus': {
      outline: 'none',
    },
  },
  searchFab: {
    height: '48px',
    width: '48px',
    marginLeft: '10px',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
  },
  hidden: {
    display: 'none',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchField' })

/**
 * A search text field. Additional props are spread to the underlying input.
 */
export default function SearchField({
  classes,
  onChange,
  submitButtonVariant,
  showClearButton,
  SubmitButtonComponent,
  clearButtonProps,
  inputProps,
  submitButtonProps,
  ...others
}) {
  classes = useStyles({ classes })
  const inputRef = useRef(null)
  const { fetchSuggestions } = useContext(SearchContext)
  const [text, setText] = useState('')
  const empty = text.trim().length === 0

  const handleInputFocus = () => {
    inputRef.current.setSelectionRange(0, inputRef.current.value.length)
  }

  const handleChange = withDefaultHandler(onChange, e => {
    const text = e.target.value
    setText(text)
    fetchSuggestions(text)
  })

  const handleClearClick = () => {
    const text = ''
    setText(text)
    fetchSuggestions(text)
  }

  return (
    <div className={classes.root} data-empty={text.trim().length === 0 ? 'on' : 'off'}>
      <div className={classes.inputWrap}>
        <input
          {...others}
          type="text"
          value={text}
          onChange={handleChange}
          onFocus={handleInputFocus}
          ref={inputRef}
          className={classes.input}
          {...inputProps}
        />
        {showClearButton ? (
          <IconButton
            {...clearButtonProps}
            onClick={handleClearClick}
            rel="clear"
            className={clsx({
              [classes.searchReset]: true,
              [classes.hidden]: empty,
            })}
          >
            <ClearIcon rel="clear" />
          </IconButton>
        ) : (
          submitButtonVariant === 'icon' && (
            <SubmitButtonComponent
              Component={Button}
              className={clsx({
                [classes.searchButton]: true,
                [classes.hidden]: empty,
              })}
              text={text}
              {...submitButtonProps}
            />
          )
        )}
      </div>
      {submitButtonVariant === 'fab' && (
        <SubmitButtonComponent
          Component={Fab}
          className={clsx({
            [classes.searchFab]: true,
            [classes.hidden]: empty,
          })}
          text={text}
          {...submitButtonProps}
        />
      )}
    </div>
  )
}

SearchField.propTypes = {
  /**
   * The component to use for the submit button
   */
  SubmitButtonComponent: PropTypes.func,
  /**
   * The type of submit button to display
   */
  submitButtonVariant: PropTypes.oneOf(['icon', 'fab']),
  /**
   * `true` to show the clear button when text is entered.
   */
  showClearButton: PropTypes.bool,
  /**
   * Additional props for the clearButton
   */
  clearButtonProps: PropTypes.object,
  /**
   * Additional props for the Material UI Input
   */
  inputProps: PropTypes.object,
  /**
   * Additional props for the submit button
   */
  submitButtonProps: PropTypes.object,
}

SearchField.defaultProps = {
  SubmitButtonComponent: SearchSubmitButton,
  submitButtonVariant: 'fab',
  showClearButton: true,
  placeholder: 'Search...',
  name: 'q',
}
