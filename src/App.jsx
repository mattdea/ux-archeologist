// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SharedLayout from './shared/SharedLayout'
import TitleScreen from './pages/TitleScreen'
import Level1 from './levels/Level1'
import Level2 from './levels/Level2'
import Level3 from './levels/Level3'
import Level4 from './levels/Level4'
import Collection from './pages/Collection'
import TestMuseumUI from './pages/TestMuseumUI'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SharedLayout />}>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/level/1" element={<Level1 />} />
          <Route path="/level/2" element={<Level2 />} />
          <Route path="/level/3" element={<Level3 />} />
          <Route path="/level/4" element={<Level4 />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/test/museum-ui" element={<TestMuseumUI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
