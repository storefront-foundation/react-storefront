import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';

import ActionButton from '../src/ActionButton'
import AddToCartButton from '../src/AddToCartButton'
// import AppBar from '../src/AppBar'
import BottomDrawer from '../src/BottomDrawer'
import Box from '../src/Box'
import Breadcrumbs from '../src/Breadcrumbs'
import ButtonSelector from '../src/ButtonSelector'
import CartButton from '../src/CartButton'
import CheckoutButton from '../src/CheckoutButton'
import CmsSlot from '../src/CmsSlot'
import Container from '../src/Container'
import DialogClose from '../src/DialogClose'
import Divider from '../src/Divider'
import Drawer from '../src/Drawer'
import Redbox from '../src/Redbox'
import ExpandableSection from '../src/ExpandableSection'
import FilterButton from '../src/FilterButton'
import HeaderLogo from '../src/HeaderLogo'
import Image from '../src/Image'
import ImageSwitcher from '../src/ImageSwitcher'
import Link from '../src/Link'
import LoadMask from '../src/LoadMask'
import Menu, { MenuItemModel, MenuModel } from '../src/Menu'
import NavTabs, { TabsModel } from '../src/NavTabs'
import PromoBanner from '../src/PromoBanner'
import QuantitySelector from '../src/QuantitySelector'
import Rating from '../src/Rating'
import ResponsiveTiles from '../src/ResponsiveTiles'
import SearchPopup, { SuggestedSearch, CategorySearches, ProductSuggestions, SearchPopupModel } from '../src/SearchPopup'
import SearchDrawer from '../src/SearchDrawer'
import ShowMore from '../src/ShowMore'
import { Skeleton, Row, Space, Content, BlankRow } from '../src/Skeleton'
import { FacebookShareButton, TwitterShareButton, GooglePlusShareButton, PinterestShareButton } from '../src/SocialShareButtons'
import SortButton from '../src/SortButton'
import Spacer from '../src/Spacer'
import TabPanel from '../src/TabPanel'
import TabsRow from '../src/TabsRow'
import ToolbarButton from '../src/ToolbarButton'
import BackNav from '../src/BackNav'
import createTheme from '../src/createTheme'

// Models
import { LocationModel } from '../src/model/AppModelBase'
import CartModelBase from '../src/model/CartModelBase'
import SearchModelBase, { ResultsGroupModel, ResultsModel } from '../src/model/SearchModelBase'
import ProductModelBase from '../src/model/ProductModelBase'
import SelectionModelBase from '../src/model/SelectionModelBase'
import OptionModelBase from '../src/model/OptionModelBase'
import SearchResultsModelBase, { FacetGroupModelBase, FacetModelBase, SortBase } from '../src/model/SearchResultsModelBase'
import { BreadcrumbModel } from '../src/model/AppModelBase'
import { Provider, observer } from 'mobx-react';

import createBrowserHistory from 'history/createBrowserHistory'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset, createMuiTheme } from '@material-ui/core/styles'
import jssNested from 'jss-nested'
import { MuiThemeProvider } from '@material-ui/core/styles'
import PhotoCamera from '@material-ui/icons/PhotoCamera'

import PaginationContainer from './PaginationContainer'
import Helmet from 'react-helmet'

setAddon(JSXAddon);

const history = createBrowserHistory();

// JSS configuration
const generateClassName = createGenerateClassName()
const jss = create(jssPreset(), jssNested())
const styleNode = document.createComment("jss-insertion-point");
document.head.insertBefore(styleNode, document.head.firstChild);
jss.options.insertionPoint = 'jss-insertion-point'

// TODO: Pass state in if we need different state for other stories
const wrapWithProvider = extraState => story => {
  const state = {
    location: LocationModel.create({ pathname: '', search: '' }),
    breadcrumbs: [
      BreadcrumbModel.create({ url: '/', text: 'Home' }),
      BreadcrumbModel.create({ url: '/tools', text: 'Tool Storage' }),
      BreadcrumbModel.create({ text: 'Tool Carts' })
    ],
    cart: CartModelBase.create(),
    menu: MenuModel.create({
      open: true,
      levels: [
        MenuItemModel.create({
          root: true,
          items: [
            MenuItemModel.create({ text: 'About', url: '#' }),
            MenuItemModel.create({
              text: 'Categories', url: '#', items: [
                MenuItemModel.create({ text: 'Color', url: '#' }),
                MenuItemModel.create({ text: 'Size', url: '#' }),
                MenuItemModel.create({ text: 'Age', url: '#' }),
              ]
            }),
            MenuItemModel.create({ text: 'Search', url: '#' }),
          ]
        })
      ]
    }),
    tabs: TabsModel.create({
      items: [
        MenuItemModel.create({ text: 'Tab 1', url: '#' }),
        MenuItemModel.create({ text: 'Tab 2', url: '#' }),
        MenuItemModel.create({ text: 'Tab 3', url: '#' })
      ]
    }),
    searchPopup: SearchPopupModel.create({ opened: true }),
    search: SearchModelBase.create()
  }

  const theme = createTheme();
  theme.margins = {};

  return (
    <Provider app={Object.assign(state, extraState)} history={history} router={null}>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <Helmet>
            <style>{`* { box-sizing: border-box }`}</style>
          </Helmet>
          {story()}
        </MuiThemeProvider>
      </JssProvider>
    </Provider>
  )
}

storiesOf('ActionButton', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <ActionButton label="Label" />)
  .addWithJSX('with caption', () => <ActionButton label="Label" value="caption" />)

storiesOf('AddToCartButton', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <AddToCartButton confirmation="Added to cart" />)

// storiesOf('AppBar', module)
// 	.addDecorator(wrapWithProvider())
//     .add('with default props', () => <AppBar />)

storiesOf('BottomDrawer', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <BottomDrawer>Content</BottomDrawer>)

const Placeholder = ({ width = 50, height = 50 }) => <div style={{ width, height, backgroundColor: '#666' }} />

storiesOf('Box', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => (
    <Box>
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))
  .addWithJSX('with split', () => (
    <Box split>
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Box>
  ))

storiesOf('BackNav', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('plain', () => (
    <BackNav 
      text="Rugs"
      url="/c/rugs"
    />
  ))
  .addWithJSX('with layout controls', () => (
    <BackNav 
      text="Rugs"
      url="/c/rugs"
      searchResults={SearchResultsModelBase.create({ })}
    />
  ))

storiesOf('Breadcrumbs', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => (
    <Breadcrumbs 
      items={[
        { url: '#', text: 'Home' },
        { url: '#', text: 'Tool Storage' },
        { url: '#', text: 'Tool Carts' }
      ]} 
    />
  ))

const selectionModelWithImages = SelectionModelBase.create({
  options: [
    OptionModelBase.create({ id: 'big', image: 'http://via.placeholder.com/35/d32f2f/d32f2f' }),
    OptionModelBase.create({ id: 'medium', image: 'http://via.placeholder.com/35/388E3C/388E3C' }),
    OptionModelBase.create({ id: 'small', image: 'http://via.placeholder.com/35/1565c0/1565c0' })
  ],
  selected: OptionModelBase.create({ id: 'medium', image: 'http://via.placeholder.com/35/388E3C/388E3C' })
})

const selectionModelWithText = SelectionModelBase.create({
  options: [
    OptionModelBase.create({ id: 'large', text: 'Large' }),
    OptionModelBase.create({ id: 'medium', text: 'Medium' }),
    OptionModelBase.create({ id: 'small', text: 'Small' })
  ],
  selected: OptionModelBase.create({ id: 'medium', text: 'Medium' })
})

const selectionModelWithColors = SelectionModelBase.create({
  options: [
    OptionModelBase.create({ id: 'large', color: '#ff0000' }),
    OptionModelBase.create({ id: 'medium', color: '#00ff00' }),
    OptionModelBase.create({ id: 'small', color: 'rgb(0, 0, 255)' })
  ],
  selected: OptionModelBase.create({ id: 'medium', text: 'Medium' })
})

const selectionModelWithDisabled = SelectionModelBase.create({
  options: [
    OptionModelBase.create({ id: 'large', color: '#ff0000' }),
    OptionModelBase.create({ id: 'medium', color: '#00ff00' }),
    OptionModelBase.create({ id: 'small', disabled: true, color: 'rgb(0, 0, 255)' })
  ],
  selected: OptionModelBase.create({ id: 'medium', text: 'Medium' })
})

storiesOf('ButtonSelector', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with text options', () => <ButtonSelector
    model={selectionModelWithText}
    onSelectionChange={(_, item) => selectionModelWithText.setSelected(item)}
  />)
  .addWithJSX('with image options', () => <ButtonSelector
    model={selectionModelWithImages}
    onSelectionChange={(_, item) => selectionModelWithImages.setSelected(item)}
  />)
  .addWithJSX('with color options', () => <ButtonSelector
    model={selectionModelWithColors}
    onSelectionChange={(_, item) => selectionModelWithColors.setSelected(item)}
  />)
  .addWithJSX('with disabled options', () => <ButtonSelector
    model={selectionModelWithDisabled}
    strikeThroughDisabled
    strikeTroughAngle={45}
    onSelectionChange={(_, item) => selectionModelWithDisabled.setSelected(item)}
  />)

storiesOf('CartButton', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <CartButton />)

storiesOf('CheckoutButton', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <CheckoutButton />)

storiesOf('CmsSlot', module)
  .addWithJSX('with default props', () => <div>
    <CmsSlot>{'<h1>Title</h1>'}</CmsSlot>
    <CmsSlot>{'<p style="width: 50%">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus semper purus, vitae pharetra tellus vulputate eu. Integer eget ipsum quis magna vehicula elementum a in risus. Pellentesque mollis augue dui, vitae maximus nulla laoreet vitae. Nullam porttitor rutrum velit eu condimentum.</p>'}</CmsSlot>
  </div>)
  .addWithJSX('with inline', () => <div>
    <CmsSlot inline>{'<span style="font-weight: bold">Title:  </span>'}</CmsSlot>
    <CmsSlot inline>{'<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </span>'}</CmsSlot>
  </div>)

storiesOf('Container', module)
  .addWithJSX('with default props', () => <div>
    <Container>{'<h1>Title</h1>'}</Container>
  </div>)

storiesOf('DialogClose', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <DialogClose />)

storiesOf('Divider', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('horizontal', () => <Divider />)
  .addWithJSX('vertical', () => <div style={{ height: '50px' }}><Divider vertical /></div>)

storiesOf('Drawer', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <Drawer title="Drawer" open>Contents</Drawer>)

storiesOf('Redbox', module)
  .addDecorator(wrapWithProvider({ error: 'Something went wrong', stack: 'This is a stack...' }))
  .addWithJSX('with default props', () => <Redbox />)

storiesOf('ExpandableSection', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => {
    return <ExpandableSection title="Hello">New and Interesting</ExpandableSection>
  });

const filterModel = SearchResultsModelBase.create({
  filters: ['red', 'medium'],
  facetGroups: [
    FacetGroupModelBase.create({
      name: 'Color',
      facets: [
        FacetModelBase.create({ code: 'red', name: 'Red', matches: 20 }),
        FacetModelBase.create({ name: 'Green', matches: 10 }),
        FacetModelBase.create({ name: 'Blue', matches: 5 }),
      ]
    }),
    FacetGroupModelBase.create({
      name: 'Size',
      facets: [
        FacetModelBase.create({ name: 'Large', matches: 3 }),
        FacetModelBase.create({ code: 'medium', name: 'Medium', matches: 7 }),
        FacetModelBase.create({ name: 'Small', matches: 1 }),
      ]
    })
  ],
  sort: 'price',
  sortOptions: [
    SortBase.create({ code: 'name', name: 'Name' }),
    SortBase.create({ code: 'price', name: 'Price' }),
    SortBase.create({ code: 'size', name: 'Size' }),
  ]
})

storiesOf('FilterButton', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <FilterButton model={filterModel} />);

storiesOf('HeaderLogo', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <HeaderLogo><img src="https://placehold.it/300x100?text=LOGO" /></HeaderLogo>);

storiesOf('Image', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <Image src="https://placehold.it/200x100" />)
  .addWithJSX('with optimized', () => <Image src="https://placehold.it/200x100" quality={20} />)
  .addWithJSX('with lazy', () => <div>
    <div style={{ height: '2000px' }}>
      Scroll Down Please...
        </div>
    <Image src="https://placehold.it/300x300?text=LAZY" lazy />
  </div>
  );

storiesOf('ImageSwitcher', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <ImageSwitcher arrows showIndicators images={[
    'https://via.placeholder.com/200?text=1',
    'https://via.placeholder.com/200?text=2',
    'https://via.placeholder.com/200?text=3'
  ]} thumbnails={[
    'https://via.placeholder.com/200?text=1',
    'https://via.placeholder.com/200?text=2',
    'https://via.placeholder.com/200?text=3'
  ]} />);

storiesOf('Link', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <Link to="/test">Test</Link>)
  .addWithJSX('with external target', () => <Link server to="http://www.moovweb.com">Moovweb</Link>)

storiesOf('LoadMask', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with show', () => <LoadMask show />);

storiesOf('Menu', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <Menu />);

storiesOf('NavTabs', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <NavTabs />);


storiesOf('PromoBanner', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <PromoBanner src="https://placehold.it/400x50?text=PROMO" />)
  .addWithJSX('with custom alt', () => <PromoBanner src="https://placehold.it/400x50?text=PROMO" alt="This is custom" />)

storiesOf('QuantitySelector', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <QuantitySelector />);

storiesOf('Rating', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <Rating value={2} />);

storiesOf('ResponsiveTiles', module)
  .addWithJSX('with default column sizes', () => <ResponsiveTiles>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#720026' }}>A</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#CE4257' }}>B</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#FF7F51' }}>C</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#FF9B54' }}>D</div>
  </ResponsiveTiles>
  )
  .addWithJSX('with custom column sizes', () => <ResponsiveTiles cols={{ xl: 4, lg: 4, md: 2, sm: 1, xs: 1 }}>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#720026' }}>A</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#CE4257' }}>B</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#FF7F51' }}>C</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#FF9B54' }}>D</div>
  </ResponsiveTiles>
  )
  .addWithJSX('with custom column spacing', () => <ResponsiveTiles spacing={4}>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#720026' }}>A</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#CE4257' }}>B</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#FF7F51' }}>C</div>
    <div style={{ color: 'white', textAlign: 'center', backgroundColor: '#FF9B54' }}>D</div>
  </ResponsiveTiles>
  )

storiesOf('SearchDrawer', module)
  .addDecorator(wrapWithProvider({
    search: SearchModelBase.create({
      text: 'Search Query',
      show: true,
      groups: [ResultsGroupModel.create({
        caption: 'Results',
        results: [
          ResultsModel.create({
            text: 'Goto A',
            url: '/#a',
            thumbnail: 'https://placehold.it/300?text=A'
          }),
          ResultsModel.create({
            text: 'Goto B',
            url: '/#b',
            thumbnail: 'https://placehold.it/300?text=B'
          }),
          ResultsModel.create({
            text: 'Goto C',
            url: '/#c',
            thumbnail: 'https://placehold.it/300?text=C'
          }),
        ]
      })]
    })
  }))
  .addWithJSX('with default props', () => <SearchDrawer />)

storiesOf('ShowMore', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with button', () => {
    const model = SearchResultsModelBase.create({
      numberOfPages: 7
    });
    return (
      <PaginationContainer model={model}>
        <ShowMore model={model} />
      </PaginationContainer>
    );
  })
  .addWithJSX('with infinite scroll', () => {
    const model = SearchResultsModelBase.create({
      numberOfPages: 7
    });
    return (
      <PaginationContainer model={model}>
        <ShowMore infiniteScroll model={model} />
      </PaginationContainer>
    );
  })

storiesOf('Skeleton', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => (
    <div style={{ top: 0, width: 200, height: 300, position: 'relative' }}>
      <Skeleton>
        <BlankRow height="15px" />
        <Row height="16px">
          <Content flex="1" />
        </Row>
        <BlankRow height="10px" />
        <Row height="12px">
          <Content flex="1" />
        </Row>
        <BlankRow height="12px" />
        <Row height="10px">
          <Content flex="1" />
        </Row>
        <BlankRow height="55px" />
      </Skeleton>
    </div>
  ));

storiesOf('Social Share Buttons', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('facebook', () => <FacebookShareButton />)
  .addWithJSX('twitter', () => <TwitterShareButton text="This is text" />)
  .addWithJSX('google', () => <GooglePlusShareButton />)
  .addWithJSX('pinterest', () => <PinterestShareButton description="This is a description" />)

storiesOf('SortButton', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <SortButton model={filterModel} />);

storiesOf('Spacer', module)
  .addWithJSX('with default props', () => <Spacer />);

storiesOf('TabPanel', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => (
    <TabPanel ampStateId={123}>
      <div label="Description">
        Description here
            </div>
      <div label="Instructions">
        Instructions here
            </div>
    </TabPanel>
  ));

storiesOf('TabsRow', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => (
    <TabsRow items={[
      { text: 'hello' },
      { text: 'this' },
      { text: 'is' },
      { text: 'goodbye' }
    ]} />
  ))

storiesOf('ToolbarButton', module)
  .addWithJSX('with label', () => <ToolbarButton icon={<PhotoCamera />} label="Camera" />)
  .addWithJSX('without label', () => <ToolbarButton icon={<PhotoCamera />} />)
