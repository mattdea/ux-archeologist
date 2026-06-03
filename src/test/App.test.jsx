// src/test/App.test.jsx
import { render, screen } from '@testing-library/react'
import App from '../App'

// Navigation is state-based (no React Router): App renders SharedLayout and
// swaps the inner view via context. These tests assert on the rendered view
// rather than on any URL/route, which no longer exists.
describe('App view system', () => {
  it('starts on the title-screen view', () => {
    render(<App />)
    expect(screen.getByText('Interface Artifacts')).toBeInTheDocument()
    expect(screen.getByText('Begin excavation')).toBeInTheDocument()
  })

  it('does not render any level HUD on the initial title view', () => {
    render(<App />)
    // The "Back to timeline" HUD link only appears on a level view.
    expect(screen.queryByText('← Back to timeline')).not.toBeInTheDocument()
  })
})
