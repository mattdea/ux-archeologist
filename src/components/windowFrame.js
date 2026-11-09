// src/components/windowFrame.js
//
// What a window's contents need to know about the frame around them:
// whether the window is the active (frontmost) one, whether it can be
// resized, and how to start a resize from the grow box. Provided by
// DraggableWindow, read by WindowScrollArea.

import { createContext, useContext } from 'react'

export const WindowFrameContext = createContext({ active: true, resizable: false, onGrowMouseDown: undefined })

export const useWindowFrame = () => useContext(WindowFrameContext)
