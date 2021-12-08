import React, { useRef, forwardRef } from 'react'
import { styled, alpha } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { IconButton, Fab, Button } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import clsx from 'clsx'
import SearchSubmitButton from './SearchSubmitButton'

const PREFIX = 'RSFSearchField'

const defaultClasses = {
  root: `${PREFIX}-root`,
  inputWrap: `${PREFIX}-inputWrap`,
  input: `${PREFIX}-input`,
  inputClearIcon: `${PREFIX}-inputClearIcon`,
  searchFab: `${PREFIX}-searchFab`,
  hidden: `${PREFIX}-hidden`,
}

const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  /**
   * Styles applied to the wrapper element.
   */
  [`& .${defaultClasses.inputWrap}`]: {
    display: 'flex',
    flexGrow: 1,
    border: 0,
    borderRadius: '35px',
    backgroundColor: theme.palette.background.paper,
    margin: 0,
    height: '48px',
  },

  /**
   * Styles applied to the input element.
   */
  [`& .${defaultClasses.input}`]: {
    border: 'none',
    background: 'none',
    flex: 1,
    padding: theme.spacing(0, 2.5, 0, 2.5),
    ...theme.typography.body1,
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      border: '1px solid',
      borderColor: theme.palette.divider,
      borderRadius: theme.spacing(1),
      margin: theme.spacing(0.5, 0, 0.5, 0),
      zIndex: 9999,
      transition: 'border-color linear 0.1s',
      '&:hover': {
        borderColor: alpha(theme.palette.divider, 0.25),
      },
      '&:focus': {
        borderColor: theme.palette.primary.main,
      },
    },
  },

  /**
   * Styles applied to the input if showClearnButton prop is true.
   */
  [`& .${defaultClasses.inputClearIcon}`]: {
    paddingRight: 0,
  },

  /**
   * Styles applied to the submit button element if [submitButtonVariant](#prop-submitButtonVariant)
   * is `'fab'`.
   */
  [`& .${defaultClasses.searchFab}`]: {
    height: '48px',
    width: '48px',
    marginLeft: '10px',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
  },

  /**
   * Styles applied to the clear and submit buttons if the search field is empty.
   */
  [`& .${defaultClasses.hidden}`]: {
    display: 'none',
  },
}))

export {}

/**
 * A search text field. Additional props are spread to the underlying
 * [Input](https://mui.com/api/input/).
 */
const SearchField = forwardRef(
  (
    {
      classes: c = {},
      ariaLabel,
      onChange,
      submitButtonVariant,
      showClearButton,
      SubmitButtonComponent,
      SubmitButtonIcon,
      clearButtonProps,
      inputProps,
      value,
      onFocus,
      submitButtonProps,
      ...others
    },
    ref,
  ) => {
    const classes = { ...defaultClasses, ...c }
    const innerRef = useRef(null)
    const inputRef = ref || innerRef
    const empty = value.trim().length === 0

    const handleInputFocus = () => {
      if (onFocus) {
        onFocus()
      }

      inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }

    const handleClearClick = () => {
      onChange('')
    }

    return (
      <Root className={classes.root} data-empty={value.trim().length === 0 ? 'on' : 'off'}>
        <div className={classes.inputWrap}>
          <input
            {...others}
            aria-label={ariaLabel}
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={handleInputFocus}
            ref={inputRef}
            className={clsx(classes.input, showClearButton && classes.inputClearIcon)}
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
              size="large"
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
                text={value}
                color="primary"
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
            text={value}
            ButtonIcon={SubmitButtonIcon}
            {...submitButtonProps}
          />
        )}
      </Root>
    )
  },
)

SearchField.propTypes = {
  /**
   * Label for accessibility, defaults to search-text
   */
  ariaLabel: PropTypes.string,
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * The component to use for the submit button.
   */
  SubmitButtonComponent: PropTypes.elementType,
  /**
   * An icon to use for the submit button.
   */
  SubmitButtonIcon: PropTypes.elementType,
  /**
   * The type of submit button to display.
   */
  submitButtonVariant: PropTypes.oneOf(['icon', 'fab', 'none']),
  /**
   * If `true`, show the clear button when text is entered.
   */
  showClearButton: PropTypes.bool,
  /**
   * Additional props for the clear button.
   */
  clearButtonProps: PropTypes.object,
  /**
   * Additional props for the Material UI [Input](https://mui.com/api/input/).
   */
  inputProps: PropTypes.object,
  /**
   * Additional props for the submit button.
   */
  submitButtonProps: PropTypes.object,
  /**
   * A function to call when the search query value is changed.
   */
  onChange: PropTypes.func,
  /**
   * Input value.
   */
  value: PropTypes.string,
  /**
   * A function to call when input is focused.
   */
  onFocus: PropTypes.func,
}

SearchField.defaultProps = {
  SubmitButtonComponent: SearchSubmitButton,
  submitButtonVariant: 'fab',
  showClearButton: true,
  placeholder: 'Search...',
  ariaLabel: 'search-text',
  name: 'q',
  value: '',
}

export default SearchField
