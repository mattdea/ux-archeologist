// src/components/chat/Toast.jsx
import styles from './Toast.module.css'

// Each render with a unique key forces the animation to replay
export default function Toast({ visible, message = 'Thanks for your feedback', toastKey }) {
  if (!visible) return null
  return (
    <div key={toastKey} className={styles.toast}>
      {message}
    </div>
  )
}
