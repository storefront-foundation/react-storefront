import React from 'react'
import PropTypes from 'prop-types'
import TextProductOption from './TextProductOption'
import SwatchProductOption from './SwatchProductOption'
import withDefaultHandler from '../utils/withDefaultHandler'
import get from 'lodash/get'

export default function ProductOption(props) {
  let {
    value,
    selected,
    options,
    selectedOption,
    onSelectedOptionChange,
    onClick,
    variant,
    showLabel,
    onOptionsChange,
    wrapperProps,
    optionProps,
    index,
    selectedClassName,
    ...others
  } = props

  if (selectedOption) {
    selected = get(value, 'id') == get(selectedOption, 'id')
  }

  const handleClick = withDefaultHandler(onClick, _e => {
    if (onSelectedOptionChange) {
      onSelectedOptionChange(value === selectedOption ? null : value)
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
      />
    </div>
  )
}

ProductOption.propTypes = {
  /**
   * The ui variant that controls how the option is displayed
   */
  variant: PropTypes.oneOf(['text', 'swatch']).isRequired,
  /**
   * Set to `false` to hide the label text
   */
  showLabel: PropTypes.bool,
  /**
   * The css class name applied to a selected option
   */
  selectedClassName: PropTypes.string,
}

ProductOption.defaultProps = {
  showLabel: true,
  wrapperProps: Function.prototype,
  optionProps: Function.prototype,
  selectedClassName: 'rsf-po-selected',
}
