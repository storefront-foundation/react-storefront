import React, { useMemo, useContext } from 'react'
import SearchResultsContext from './SearchResultsContext'
import { makeStyles } from '@material-ui/core/styles'
import ExpandableSection from '../ExpandableSection'
import CheckboxFilterGroup from './CheckboxFilterGroup'
import ButtonFilterGroup from './ButtonFilterGroup'

const styles = theme => ({
  matches: {
    marginLeft: '5px',
    display: 'inline',
  },
  groupLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  groupTitle: {
    [theme.breakpoints.up('sm')]: {
      fontWeight: 'bold',
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFFacetGroup' })

export default function FacetGroup(props) {
  const { group, submitOnChange, defaultExpanded } = props
  const classes = useStyles()
  const {
    pageData: { filters },
  } = useContext(SearchResultsContext)

  return useMemo(() => {
    if (!filters) return null

    const selection = []

    for (let option of group.options) {
      if (filters.indexOf(option.code) !== -1) {
        selection.push(option)
      }
    }

    let Controls

    if (group.ui === 'buttons') {
      Controls = ButtonFilterGroup
    } else {
      Controls = CheckboxFilterGroup
    }

    let caption = null

    if (selection.length === 1) {
      caption = selection[0].name
    } else if (selection.length > 0) {
      caption = `${selection.length} selected`
    }

    return (
      <ExpandableSection
        title={group.name}
        caption={caption}
        defaultExpanded={defaultExpanded}
        classes={{ margins: classes.margins, title: classes.groupTitle }}
      >
        <Controls group={group} submitOnChange={submitOnChange} />
      </ExpandableSection>
    )
  }, [...Object.values(props), filters])
}
