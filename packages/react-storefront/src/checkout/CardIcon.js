import React from 'react'
import VisaIcon from '../icons/cards/visa'
import AmexIcon from '../icons/cards/amex'
import PlainIcon from '../icons/cards/plain'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = theme => ({
  cardIcon: {
    width: 29,
    height: 19
  }
})

function getIcon(type) {
  if (type === 'visa') {
    return VisaIcon
  }
  if (type === 'americanexpress') {
    return AmexIcon
  }
  return PlainIcon
}

@withStyles(styles, { name: 'RSFCardIcon' })
class CardIcon extends React.Component {
  render() {
    const { type, classes } = this.props
    const Icon = getIcon(type)
    return <Icon className={classes.cardIcon} />
  }
}

export default CardIcon
