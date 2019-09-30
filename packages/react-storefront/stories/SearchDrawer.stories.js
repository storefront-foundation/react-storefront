import React from 'react'
import { storiesOf } from '@storybook/react'
import wrapWithProvider from './wrapWithProvider'
import SearchDrawer from '../src/SearchDrawer'

storiesOf('SearchDrawer', module)
  .addDecorator(
    wrapWithProvider({
      search: {
        show: true
      }
    })
  )
  .addWithJSX('with initial content', () => (
    <SearchDrawer
      initialContent={
        <div style={{ margin: 10 }}>
          <h2>Initial Content</h2>
          <h6>Subheading</h6>
          <p>This will be rendered when the search field is blank</p>
          <p>
            Massa tempor nec feugiat nisl. Dictum fusce ut placerat orci nulla pellentesque
            dignissim. Turpis massa sed elementum tempus egestas sed sed. Ac tincidunt vitae semper
            quis lectus nulla at. Ac felis donec et odio pellentesque diam volutpat commodo sed.
            Consectetur lorem donec massa sapien.
          </p>
          <p>Try typing in the search bar and watch this content disappear.</p>
        </div>
      }
    />
  ))

storiesOf('SearchDrawer', module)
  .addDecorator(
    wrapWithProvider({
      search: {
        text: 'Search Query',
        show: true,
        groups: [
          {
            caption: 'Results',
            results: [
              {
                text: 'Goto A',
                url: '/#a',
                thumbnail: 'https://placehold.it/300?text=A'
              },
              {
                text: 'Goto B',
                url: '/#b',
                thumbnail: 'https://placehold.it/300?text=B'
              },
              {
                text: 'Goto C',
                url: '/#c',
                thumbnail: 'https://placehold.it/300?text=C'
              }
            ]
          }
        ]
      }
    })
  )
  .addWithJSX('with default results', () => <SearchDrawer />)
  .addWithJSX('with searchButtonVariant="icon"', () => <SearchDrawer searchButtonVariant="icon" />)
  .addWithJSX('with showClearButton=false', () => (
    <SearchDrawer searchButtonVariant="icon" showClearButton={false} />
  ))
