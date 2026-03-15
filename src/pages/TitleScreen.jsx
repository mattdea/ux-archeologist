// src/pages/TitleScreen.jsx
import styles from './TitleScreen.module.css'
import { useFadeNavigate } from '../shared/SharedLayout'

export default function TitleScreen() {
  const navigate = useFadeNavigate()

  return (
    <>
      <div className={styles.center}>
        <h1 className={styles.title}>Interface Artifacts</h1>
        <p className={styles.subtitle}>
          Explore how interfaces evolved through the decades.
        </p>
        <button className={styles.btn} onClick={() => navigate('/timeline')}>
          Begin excavation
        </button>
      </div>
      <p className={styles.attribution}>A project by Matthew Dea</p>
    </>
  )
}
