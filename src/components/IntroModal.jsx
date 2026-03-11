// src/components/IntroModal.jsx
import styles from './IntroModal.module.css'

const TASKS = [
  'Open the Projects folder',
  'Drag Notes to the Trash',
  'Use the File menu',
]

export default function IntroModal({ onBegin }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.year}>1984</div>
        <h1 className={styles.title}>The Desktop Arrives</h1>
        <p className={styles.body}>
          For the first time, computers began to feel less like machines to
          command and more like spaces to navigate.
        </p>
        <div className={styles.taskSection}>
          <div className={styles.taskHeader}>Your Objectives</div>
          <ul className={styles.taskList}>
            {TASKS.map((task, i) => (
              <li key={i} className={styles.taskItem}>
                <span className={styles.checkbox}>☐</span>
                {task}
              </li>
            ))}
          </ul>
        </div>
        <button className={styles.beginBtn} onClick={onBegin}>
          Begin Excavation
        </button>
      </div>
    </div>
  )
}
