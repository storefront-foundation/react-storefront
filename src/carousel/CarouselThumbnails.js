import React from 'react'
import clsx from 'clsx'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/core/styles'
import Image from '../Image'

export const styles = theme => ({
  thumb: {
    width: 50,
    height: 50,
    boxSizing: 'content-box',
  },
  thumbs: {
    display: 'flex',
    justifyContent: 'center',
  },
  hidden: { display: 'none' },
  tabsIndicator: {
    display: 'none',
    backgroundColor: theme.palette.primary.main,
    height: '3px',
    transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  tabsRoot: {
    marginTop: theme.margins.container,
  },
  noSelection: {
    visibility: 'hidden',
  },
  tabRoot: {
    minWidth: 'auto',
    padding: 0,
    outline: 'none',
    opacity: 0.7,
    transition: 'opacity linear 100ms',
    '&:hover': {
      opacity: 0.9,
    },
  },
  selectedTab: {
    opacity: 1,
  },
  tabWrapper: {
    margin: '0 2px',
    border: '1px solid transparent',
    '$selectedTab &': {
      border: `1px solid rgba(0,0,0,0.3)`,
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFCarouselThumbnails' })

function CarouselThumbnails(props) {
  const { thumbnails, selected, setSelected, classes, className } = props
  const styles = useStyles({ classes })

  return (
    <div className={clsx(className, styles.thumbs)}>
      <Tabs
        value={selected}
        variant="scrollable"
        onChange={(_, index) => setSelected(index)}
        classes={{
          root: styles.tabsRoot,
          indicator: styles.tabsIndicator,
        }}
      >
        {thumbnails.map(({ src, alt }, i) => {
          const icon = <Image contain className={styles.thumb} src={src} alt={alt} />
          return (
            <Tab
              classes={{
                root: styles.tabRoot,
                wrapper: styles.tabWrapper,
                selected: styles.selectedTab,
              }}
              key={i}
              icon={icon}
            />
          )
        })}
      </Tabs>
    </div>
  )
}

export default React.memo(CarouselThumbnails)
