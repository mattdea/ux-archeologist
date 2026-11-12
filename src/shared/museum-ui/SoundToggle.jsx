// src/shared/museum-ui/SoundToggle.jsx
//
// Classic's sound switch: "Sound on" / "Sound off" as a text link, in the
// style of the links around it (the HUD's Back to timeline, the timeline
// page's About), so it takes their class. The accessible name is "Sound"
// and aria-pressed carries the state. The Index has its own Sound line.
import { useSoundOn, setSoundOn } from '../../audio/sound'

export default function SoundToggle({ className }) {
  const on = useSoundOn()
  return (
    <button type="button" className={className} aria-label="Sound" aria-pressed={on} onClick={() => setSoundOn(!on)}>
      {on ? 'Sound on' : 'Sound off'}
    </button>
  )
}
