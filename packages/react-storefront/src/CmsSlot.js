/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component }  from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = theme => ({
  inline: {
    display: 'inline'
  },
  block: {
    display: 'block'
  }
})

/**
 * A container for HTML blob content from a CMS.  Content is dangerously inserted into the DOM.
 * Pass the html as a string as the child of this component. Additional props are spread to the
 * rendered span element.
 */
@withStyles(styles, { name: 'RSFCmsSlot' })
export default class CmsSlot extends Component {
  static proptypes = {
    /**
     * Use inline prop to use display:inline style
     */
    inline: PropTypes.boolean
  }
  render() {
    const { children, className, classes, inline, ...others } = this.props
    return children ? <span {...others} className={classnames(className, { [classes.inline]: inline, [classes.block]: !inline })} dangerouslySetInnerHTML={{ __html: children }} /> : null
  }
}