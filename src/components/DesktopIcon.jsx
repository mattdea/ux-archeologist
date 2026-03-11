// src/components/DesktopIcon.jsx
import { forwardRef } from 'react'
import styles from './DesktopIcon.module.css'

function FolderIcon() {
  return (
    <div className={styles.folderWrap}>
      <div className={styles.folderTab} />
      <div className={styles.folderBody} />
    </div>
  )
}

function NotesIcon() {
  return (
    <div className={styles.notesWrap}>
      <div className={styles.notesPage}>
        <div className={styles.notesLine} />
        <div className={styles.notesLine} />
        <div className={styles.notesLine} />
      </div>
    </div>
  )
}

function TrashIcon({ highlighted }) {
  return (
    <div className={`${styles.trashWrap} ${highlighted ? styles.trashHighlighted : ''}`}>
      <div className={styles.trashLid} />
      <div className={styles.trashBody}>
        <div className={styles.trashLine} />
        <div className={styles.trashLine} />
        <div className={styles.trashLine} />
      </div>
    </div>
  )
}

const DesktopIcon = forwardRef(function DesktopIcon(props, ref) {
  const {
    label,
    icon,
    onDoubleClick,
    draggable,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onTouchStart,
    onTouchEnd,
    isHighlighted,
    className,
  } = props

  return (
    <div
      ref={ref}
      className={`${styles.icon} ${className || ''}`}
      onDoubleClick={onDoubleClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {icon === 'folder' && <FolderIcon />}
      {icon === 'notes' && <NotesIcon />}
      {icon === 'trash' && <TrashIcon highlighted={isHighlighted} />}
      <span className={styles.label}>{label}</span>
    </div>
  )
})

export default DesktopIcon
