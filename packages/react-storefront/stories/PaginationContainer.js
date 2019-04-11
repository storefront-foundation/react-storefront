import React, { Component } from 'react'
import { observer } from 'mobx-react'

const Page = ({ page, total }) => (
  <div
    style={{
      backgroundColor: '#abaca7',
      fontFamily: 'sans-serif',
      fontSize: '24px',
      color: '#5b5d52',
      height: '800px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    }}
  >
    Page {page} / {total}
  </div>
)

@observer
export default class PaginationContainer extends Component {
  render() {
    const { model, children } = this.props
    return (
      <div>
        {Array(model.page + 1)
          .fill()
          .map((_, i) => (
            <Page page={i + 1} total={model.numberOfPages} />
          ))}
        {children}
      </div>
    )
  }
}
