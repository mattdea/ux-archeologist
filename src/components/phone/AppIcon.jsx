// src/components/phone/AppIcon.jsx
//
// Single app icon: rounded-rect placeholder (or custom image), gloss overlay,
// label underneath. Tap animation: scale-down on press, release on up.
//
// Props:
//   id       — unique identifier (e.g. 'notes')
//   name     — display label
//   iconSrc  — optional image URL (placeholder gradient if omitted)
//   isFolder — renders the dark folder icon with mini 3×3 grid inside
//   onTap    — called with (id) on click (if not swiping)

import { useRef } from 'react'
import styles from './AppIcon.module.css'

export default function AppIcon({ id, name, iconSrc, isFolder, onTap, showReflection = false }) {
  const imgRef = useRef(null)

  const handleClick = () => {
    if (onTap) onTap(id)
  }

  // Press animation via direct DOM class toggle (no re-render)
  const handlePointerDown = () => {
    if (imgRef.current) imgRef.current.classList.add(styles.pressed)
  }
  const handlePointerUp = () => {
    if (imgRef.current) imgRef.current.classList.remove(styles.pressed)
  }
  const handlePointerLeave = () => {
    if (imgRef.current) imgRef.current.classList.remove(styles.pressed)
  }

  return (
    <button
      className={styles.appIcon}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      aria-label={name}
    >
      {/* iconWrap: positions the reflection absolutely below the icon image,
          behind the label which sits in normal flow above it */}
      <div className={styles.iconWrap}>
        <div
          ref={imgRef}
          className={`${styles.iconImage} ${isFolder ? styles.folderIcon : ''}`}
        >
          {iconSrc ? (
            <img src={iconSrc} alt="" className={styles.iconImg} draggable={false} />
          ) : isFolder ? (
            <div className={styles.folderGrid}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={styles.miniIcon} />
              ))}
            </div>
          ) : null}

          {/* Gloss highlight — semi-transparent ellipse overlay */}
          {!isFolder && <div className={styles.gloss} />}

          {/* Inner shadow ring */}
          <div className={isFolder ? styles.folderInnerShadow : styles.innerShadow} />
        </div>

        {/* Dock reflection — absolutely below icon, behind label */}
        {showReflection && iconSrc && (
          <img
            src={iconSrc}
            alt=""
            className={styles.reflection}
            draggable={false}
            aria-hidden="true"
          />
        )}
      </div>

      <span className={styles.label}>{name}</span>
    </button>
  )
}
