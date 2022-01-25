import React, { useRef, useEffect, useState } from 'react'
import { mount } from 'enzyme'
import SearchPopover from 'react-storefront/search/SearchPopover'
import { Popover } from '@mui/material'
import { navigate } from '../mocks/mockRouter'

describe('SearchPopover', () => {
  let wrapper, getRef

  afterEach(() => {
    wrapper.unmount()
    getRef = undefined
  })

  const TestComponent = props => {
    const testRef = useRef(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
      getRef = testRef
      setOpen(true)
    }, [])

    return (
      <>
        <div ref={testRef}>
          <SearchPopover open={open} onClose={() => null} anchor={testRef} {...props}>
            <div id="test" />
          </SearchPopover>
        </div>
      </>
    )
  }

  it('should render children', () => {
    wrapper = mount(<TestComponent />)

    expect(wrapper.find('#test')).toExist()
  })

  it('should work when useQuery and onClose not provided', () => {
    wrapper = mount(<TestComponent onClose={null} />)

    navigate('/foo')
    expect(wrapper.find('#test')).toExist()
  })

  it('should call onClose, reset query and blur on navigation event', async () => {
    const onCloseMock = jest.fn()
    const setQueryMock = jest.fn()
    const blurMock = jest.fn()

    wrapper = mount(<TestComponent onClose={onCloseMock} setQuery={setQueryMock} />)

    getRef.current.blur = blurMock

    expect(onCloseMock).not.toHaveBeenCalled()
    navigate('/foo')
    expect(onCloseMock).toHaveBeenCalled()
    expect(setQueryMock).toHaveBeenCalledWith('')
    expect(blurMock).toHaveBeenCalled()
  })

  it('should spread additional props to the underlying Popover element', () => {
    wrapper = mount(
      <TestComponent
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      />,
    )

    expect(wrapper.find(Popover).props().anchorOrigin).toEqual({
      vertical: 'bottom',
      horizontal: 'right',
    })
  })
})
