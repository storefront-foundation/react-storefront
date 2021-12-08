import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import TextProductOption from './TextProductOption'
import SwatchProductOption from './SwatchProductOption'
import withDefaultHandler from '../utils/withDefaultHandler'

/**
 * A button or swatch that displays a representation of a product option within a
 * [`ProductOptionSelector`](/apiReference/option/ProductOptionSelector].
 */
export default function ProductOption(props) {
  let {
    value,
    selected,
    selectedOption,
    onSelectedOptionChange,
    onClick,
    variant,
    showLabel,
    wrapperProps,
    optionProps,
    selectedClassName,
    ...others
  } = props

  if (selectedOption) {
    selected = get(value, 'id') == get(selectedOption, 'id')
  }

  const handleClick = withDefaultHandler(onClick, () => {
    if (onSelectedOptionChange) {
      onSelectedOptionChange(selected ? null : value)
    }
  })

  const Variant = variant === 'text' ? TextProductOption : SwatchProductOption
  const propArgs = { selected, ...props }

  return (
    <div className={selected ? selectedClassName : ''} {...wrapperProps(propArgs)}>
      <Variant
        {...others}
        {...optionProps(propArgs)}
        label={showLabel ? value && value.text : undefined}
        selected={selected}
        onClick={handleClick}
        disabled={get(value, 'disabled')}
      />
    </div>
  )
}

ProductOption.propTypes = {
  /**
   * The UI variant that controls how the option is displayed.
   */
  variant: PropTypes.oneOf(['text', 'swatch']).isRequired,
  /**
   * Set to `false` to hide the label text.
   */
  showLabel: PropTypes.bool,
  /**
   * The CSS class name applied to a selected option.
   */
  selectedClassName: PropTypes.string,
  /**
   * The value for the product option.
   */
  value: PropTypes.object,
  /**
   * If `true`, this option is the selected option.
   */
  selected: PropTypes.bool,
  /**
   * An alternative to using [`selected`](#prop-selected), this is a value that will be tested against
   * the [`value`](#prop-value) prop to determine if this option is selected.
   */
  selectedOption: PropTypes.object,
  /**
   * Called when the selected option is changed.
   */
  onSelectedOptionChange: PropTypes.func,
  /**
   * Called with this option is clicked.
   */
  onClick: PropTypes.func,
  /**
   * A function that returns props to pass to the wrapper element.
   */
  wrapperProps: PropTypes.func,
  /**
   * A function that returns props to pass to the option element.
   */
  optionProps: PropTypes.func,
}

ProductOption.defaultProps = {
  showLabel: true,
  wrapperProps: Function.prototype,
  optionProps: Function.prototype,
  selectedClassName: 'rsf-po-selected',
}
