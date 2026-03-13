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

function TrashIcon({ highlighted, full }) {
  return (
    <div className={`${styles.trashWrap} ${highlighted ? styles.trashHighlighted : ''} ${full ? styles.trashFull : ''}`}>
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
    onClick,
    onDoubleClick,
    draggable,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    onTouchStart,
    onTouchEnd,
    isHighlighted,
    isSelected,
    isFull,
    className,
    style,
  } = props

  return (
    <div
      ref={ref}
      className={`${styles.icon} ${isSelected ? styles.selected : ''} ${className || ''}`}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {icon === 'folder' && <FolderIcon />}
      {icon === 'notes' && <NotesIcon />}
      {icon === 'trash' && <TrashIcon highlighted={isHighlighted} full={isFull} />}
      <span className={styles.label}>{label}</span>
    </div>
  )
})

export default DesktopIcon
