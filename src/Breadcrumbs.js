import React from 'react'
import { KeyboardArrowRight as ArrowRight } from '@material-ui/icons'
import Link from './link/Link'
import clsx from 'clsx'
import { Typography, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  breadcrumbs: {
    backgroundColor: '#F4F2F1',
    padding: '12px 0',

    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  },

  /**
   * Styles applied to the separators.
   */
  separator: {
    height: '12px',
    position: 'relative',
    top: '2px',
    width: '16px',
  },

  /**
   * Styles applied to the currently active breadcrumb's element.
   */
  current: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
})

const useStyles = makeStyles(styles, 'RSFBreadcrumbs')

export default function Breadcrumbs({ items, classes }) {
  classes = useStyles({ classes })

  return (
    <Typography display="block" className={classes.breadcrumbs} variant="caption">
      <Container>
        {items &&
          items.map((item, i) => {
            const arrow = i > 0 ? <ArrowRight className={classes.separator} /> : null
            const isLastItem = items.length - 1 === i

            if (item.href) {
              return (
                <span key={i} className={clsx(isLastItem && classes.current)}>
                  {arrow}
                  <Link href={item.href} as={item.as}>
                    {item.text}
                  </Link>
                </span>
              )
            } else {
              return (
                <span key={i} className={clsx(isLastItem && classes.current)}>
                  {arrow}
                  {item.text}
                </span>
              )
            }
          })}
        <span>&nbsp;</span>
      </Container>
    </Typography>
  )
}

Breadcrumbs.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * The items to display, each with text, [`href`](/apiReference/link/Link#prop-href), and
   * [`as`](/apiReference/link/Link#props-as) values.
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      as: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
}
