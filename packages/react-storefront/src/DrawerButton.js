/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { useState, useContext } from 'react'
import ActionButton from './ActionButton'
import Drawer from './Drawer'
import AmpDrawer from './amp/AmpDrawer'
import AppContext from './AppContext'

/**
 *
 * Example use:
 *
 * <DrawerButton ampStateId="sizeChart" label="Open Size Chart">
 *   <CmsSlot>{product.sizeChartHtml}</CmsSlot>
 * </DrawerButton>
 *
 * The children components are rendered within the drawer content.
 *
 * The `anchor` prop controls which side from which the drawer will appear.
 *
 * You can pass a function as the children of the DrawerButton in order to render a custom
 * close button. You just need to spread the passed argument onto the button's props to
 * handle the toggling of the drawer.
 *
 * And the rest of the `DrawerButton` props are spread to the `ActionButton` which triggers the drawer to open.
 *
 */
export default function DrawerButton({
  ampStateId,
  anchor = 'bottom',
  showCloseButton,
  closeButtonProps,
  children,
  ...props
}) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)
  const {
    app: { amp }
  } = useContext(AppContext)
  const drawerProps = { showCloseButton, closeButtonProps, anchor }
  // Make sure AMP state ID is never undefined
  if (!ampStateId) ampStateId = props.label
  // This should be spread over any custom close buttons used within the content
  const customCloseButtonProps = {
    onClick: toggle,
    on: `tap:AMP.setState({ ${ampStateId}: { open: false } })`
  }
  children = typeof children === 'function' ? children(customCloseButtonProps) : children
  if (amp) {
    const triggerOpen =
      anchor === 'left' || anchor === 'right'
        ? // Triggering sidebar to open and a separate state to control the backdrop
          `tap:${ampStateId}.open,AMP.setState({ ${ampStateId}: { open: true } })`
        : `tap:AMP.setState({ ${ampStateId}: { open: true } })`
    return (
      <>
        <ActionButton {...props} on={triggerOpen} />
        <AmpDrawer ampStateId={ampStateId} {...drawerProps}>
          {children}
        </AmpDrawer>
      </>
    )
  }
  return (
    <>
      <ActionButton {...props} onClick={toggle} />
      <Drawer open={open} onRequestClose={toggle} {...drawerProps}>
        {children}
      </Drawer>
    </>
  )
}
