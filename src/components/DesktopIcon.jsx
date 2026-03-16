// src/components/DesktopIcon.jsx
import { forwardRef } from 'react'
import styles from './DesktopIcon.module.css'

export function FolderIcon({ selected }) {
  const fg = selected ? 'white' : 'black'
  const bg = selected ? 'black' : 'white'
  return (
    <svg viewBox="0 0 36 32" xmlns="http://www.w3.org/2000/svg" width="36" height="32">
      <polygon points="2,10 3,7 11,7 12,10" fill={bg} stroke={fg} strokeWidth="1" strokeLinejoin="miter"/>
      <rect x="1" y="9" width="34" height="22" fill={bg} stroke={fg} strokeWidth="1"/>
      <line x1="3" y1="10" x2="11" y2="10" stroke={bg} strokeWidth="1"/>
    </svg>
  )
}

export function NotesIcon({ selected }) {
  const fg = selected ? 'white' : 'black'
  const bg = selected ? 'black' : 'white'
  return (
    <svg viewBox="0 0 30 44" xmlns="http://www.w3.org/2000/svg" width="30" height="44">
      <rect x="0" y="4" width="30" height="40" fill={bg} stroke={fg} strokeWidth="1"/>
      <polygon points="24,4 30,4 30,10" fill={fg}/>
      <polygon points="24,4 24,10 30,10" fill={bg} stroke={fg} strokeWidth="1"/>
      <line x1="4" y1="15" x2="24" y2="15" stroke={fg} strokeWidth="1.5" strokeDasharray="3 1 5 2 4 1 3 2"/>
      <line x1="4" y1="21" x2="24" y2="21" stroke={fg} strokeWidth="1.5" strokeDasharray="5 1 3 2 4 1 2 2"/>
      <line x1="4" y1="27" x2="24" y2="27" stroke={fg} strokeWidth="1.5" strokeDasharray="4 2 3 1 5 2 2 1"/>
      <line x1="4" y1="33" x2="16" y2="33" stroke={fg} strokeWidth="1.5" strokeDasharray="3 1 4 2 2 1"/>
    </svg>
  )
}

function TrashIcon({ highlighted, full }) {
  const fg = highlighted || full ? 'white' : 'black'
  const bg = highlighted || full ? 'black' : 'white'
  const ribs = [7, 12, 17, 22]
  return (
    <svg viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" width="32" height="42">
      <rect x="13" y="0" width="6" height="3" fill={bg} stroke={fg} strokeWidth="1"/>
      <rect x="1" y="2" width="30" height="4" fill={bg} stroke={fg} strokeWidth="1.5"/>
      <rect x="2" y="6" width="28" height="34" fill={bg} stroke={fg} strokeWidth="1.5"/>
      {ribs.map(x => (
        <g key={x}>
          <line x1={x}   y1="11" x2={x}   y2="35" stroke={fg} strokeWidth="1.5"/>
          <line x1={x+1} y1="10" x2={x+1} y2="11" stroke={fg} strokeWidth="1.5"/>
          <line x1={x+1} y1="35" x2={x+1} y2="36" stroke={fg} strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
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
      {icon === 'folder' && <FolderIcon selected={isSelected} />}
      {icon === 'notes'  && <NotesIcon  selected={isSelected} />}
      {icon === 'trash'  && <TrashIcon  highlighted={isHighlighted} full={isFull} />}
      <span className={styles.label}>{label}</span>
    </div>
  )
})

export default DesktopIcon
