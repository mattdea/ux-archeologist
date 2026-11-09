// src/components/MenuBar.jsx
import { useState, useEffect, useRef } from 'react'
import styles from './MenuBar.module.css'
import { getSetting } from './macSettings'

// Apple menu, Finder 1.1 (Inside Macintosh I fig. 16; Easy Guide 1984): About,
// then the desk accessories installed in the System file, in this order.
const APPLE_ITEMS = [
  { label: 'About the Finder...', action: 'da', da: 'about' },
  { label: 'Scrapbook',    action: 'da', da: 'scrapbook' },
  { label: 'Alarm Clock',  action: 'da', da: 'alarm' },
  { label: 'Note Pad',     action: 'da', da: 'notepad' },
  { label: 'Calculator',   action: 'da', da: 'calculator' },
  { label: 'Key Caps',     action: 'da', da: 'keycaps' },
  { label: 'Control Panel', action: 'da', da: 'controlpanel' },
  { label: 'Puzzle',       action: 'da', da: 'puzzle' },
]

// Menu blinking: when you chose an item, Finder 1.0 flashed it (inverted
// off and on) three times before the menu went away — the Control Panel's
// "Menu blinking" setting, 3 by default (now set in the Control Panel). About
// 3 ticks (50ms) a phase.
const BLINK_MS = 50

export default function MenuBar({
  onMenuItemClick, canOpen = false, canClose = false, onOpen, onClose,
  canEmptyTrash = false, onEmptyTrash, canGetInfo = false, onGetInfo,
  onCleanUp, canEject = false, onEject, onDeskAccessory,
  canPutBack = false, onPutBack, onCloseAll, onSelectAll, alarmRinging = false,
  // An application in front (TeachText): its own menus after the Apple menu,
  // and its own first Apple item ({ label, onSelect }); items run onSelect
  menus: appMenus, appleAbout,
}) {
  const [openMenu, setOpenMenu] = useState(null)
  // Label of the item mid-blink and whether it is drawn inverted right now
  const [blink, setBlink] = useState(null)   // { label, on }
  const blinkTimer = useRef(null)
  const menuBarRef = useRef(null)
  useEffect(() => () => clearTimeout(blinkTimer.current), [])

  // Finder 1.1 menus, from Apple's 1984 manual (pp. 104–111) and the Easy
  // Guide's May 1984 screenshots. No separators; New Folder, Shut Down and
  // the MiniFinder came with Finder 4.1 in 1985. Only Duplicate, Get Info,
  // Eject and the Edit items showed ⌘ keys.
  const MENUS = [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'Open',       action: 'open',    disabled: !canOpen },
        { label: 'Duplicate',  shortcut: '⌘D',   disabled: true },
        { label: 'Get Info',   shortcut: '⌘I',   action: 'getInfo',  disabled: !canGetInfo },
        { label: 'Put Back',   action: 'putBack', disabled: !canPutBack },
        { label: 'Close',      action: 'close',   disabled: !canClose },
        { label: 'Close All',  action: 'closeAll', disabled: !canClose },
        { label: 'Print',      disabled: true },
        { label: 'Eject',      shortcut: '⌘E',   action: 'eject',    disabled: !canEject },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo',           shortcut: '⌘Z', disabled: true },
        { label: 'Cut',            shortcut: '⌘X', disabled: true },
        { label: 'Copy',           shortcut: '⌘C', disabled: true },
        { label: 'Paste',          shortcut: '⌘V', disabled: true },
        { label: 'Clear',          disabled: true },
        { label: 'Select All',     shortcut: '⌘A', action: 'selectAll' },
        { label: 'Show Clipboard', disabled: true },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'by Icon', checked: true },
        { label: 'by Name' },
        { label: 'by Date' },
        { label: 'by Size' },
        { label: 'by Kind' },
      ],
    },
    {
      id: 'special',
      label: 'Special',
      items: [
        { label: 'Clean Up',    action: 'cleanUp' },
        { label: 'Empty Trash', action: 'emptyTrash', disabled: !canEmptyTrash },
        { label: 'Erase Disk',  disabled: true },
        { label: 'Set Startup', disabled: true },
      ],
    },
  ]

  useEffect(() => {
    if (!openMenu) return
    const handleMouseDown = (e) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [openMenu])

  useEffect(() => {
    if (!openMenu) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openMenu])

  const runAction = (item) => {
    if (item.onSelect) { item.onSelect(); onMenuItemClick?.(); return }
    switch (item.action) {
      case 'open':       onOpen?.(); return
      case 'close':      onClose?.(); return
      case 'emptyTrash': onEmptyTrash?.(); break
      case 'getInfo':    onGetInfo?.(); break
      case 'cleanUp':    onCleanUp?.(); break
      case 'eject':      onEject?.(); break
      case 'putBack':    onPutBack?.(); break
      case 'closeAll':   onCloseAll?.(); break
      case 'selectAll':  onSelectAll?.(); break
      case 'da':         onDeskAccessory?.(item.da); break
      default: break
    }
    onMenuItemClick?.()
  }

  // With the speaker volume at 0, a beep flashes the menu bar instead
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    let t
    const onFlash = () => { setFlash(true); clearTimeout(t); t = setTimeout(() => setFlash(false), 120) }
    window.addEventListener('mac-flash-menubar', onFlash)
    return () => { window.removeEventListener('mac-flash-menubar', onFlash); clearTimeout(t) }
  }, [])

  // Blink the chosen item, then close the menu and act
  const handleItemClick = (item) => {
    if (item.disabled || blink) return
    let phase = 0                       // 0,2,4 = off; 1,3,5 = on
    const blinks = getSetting('menuBlinks')
    const step = () => {
      if (phase >= blinks * 2) {
        setBlink(null)
        setOpenMenu(null)
        runAction(item)
        return
      }
      setBlink({ label: item.label, on: phase % 2 === 1 })
      phase++
      blinkTimer.current = setTimeout(step, BLINK_MS)
    }
    step()
  }
  const itemClass = (item, base) => {
    const b = blink && blink.label === item.label
    return `${base} ${b ? (blink.on ? styles.blinkOn : styles.blinkOff) : ''}`
  }

  return (
    <div className={`${styles.menuBar} ${flash ? styles.menuBarFlash : ''}`} ref={menuBarRef}>
      <div className={styles.menuItem}>
        <button
          className={`${styles.apple} ${openMenu === 'apple' ? styles.appleActive : ''} ${alarmRinging && openMenu !== 'apple' ? styles.appleBlink : ''}`}
          onClick={() => setOpenMenu(o => o === 'apple' ? null : 'apple')}
          aria-label="Apple menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="16" height="16" shapeRendering="crispEdges">
            <g fill="currentColor">
              <rect x="32" y="8" width="2" height="2"/><rect x="34" y="8" width="2" height="2"/><rect x="36" y="8" width="2" height="2"/><rect x="38" y="8" width="2" height="2"/><rect x="32" y="10" width="2" height="2"/><rect x="34" y="10" width="2" height="2"/><rect x="36" y="10" width="2" height="2"/><rect x="38" y="10" width="2" height="2"/><rect x="28" y="12" width="2" height="2"/><rect x="30" y="12" width="2" height="2"/><rect x="32" y="12" width="2" height="2"/><rect x="34" y="12" width="2" height="2"/><rect x="28" y="14" width="2" height="2"/><rect x="30" y="14" width="2" height="2"/><rect x="32" y="14" width="2" height="2"/><rect x="34" y="14" width="2" height="2"/><rect x="28" y="16" width="2" height="2"/><rect x="30" y="16" width="2" height="2"/><rect x="28" y="18" width="2" height="2"/><rect x="30" y="18" width="2" height="2"/><rect x="16" y="20" width="2" height="2"/><rect x="18" y="20" width="2" height="2"/><rect x="20" y="20" width="2" height="2"/><rect x="22" y="20" width="2" height="2"/><rect x="24" y="20" width="2" height="2"/><rect x="26" y="20" width="2" height="2"/><rect x="32" y="20" width="2" height="2"/><rect x="34" y="20" width="2" height="2"/><rect x="36" y="20" width="2" height="2"/><rect x="38" y="20" width="2" height="2"/><rect x="40" y="20" width="2" height="2"/><rect x="42" y="20" width="2" height="2"/><rect x="16" y="22" width="2" height="2"/><rect x="18" y="22" width="2" height="2"/><rect x="20" y="22" width="2" height="2"/><rect x="22" y="22" width="2" height="2"/><rect x="24" y="22" width="2" height="2"/><rect x="26" y="22" width="2" height="2"/><rect x="32" y="22" width="2" height="2"/><rect x="34" y="22" width="2" height="2"/><rect x="36" y="22" width="2" height="2"/><rect x="38" y="22" width="2" height="2"/><rect x="40" y="22" width="2" height="2"/><rect x="42" y="22" width="2" height="2"/><rect x="12" y="24" width="2" height="2"/><rect x="14" y="24" width="2" height="2"/><rect x="16" y="24" width="2" height="2"/><rect x="18" y="24" width="2" height="2"/><rect x="20" y="24" width="2" height="2"/><rect x="22" y="24" width="2" height="2"/><rect x="24" y="24" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/><rect x="28" y="24" width="2" height="2"/><rect x="30" y="24" width="2" height="2"/><rect x="32" y="24" width="2" height="2"/><rect x="34" y="24" width="2" height="2"/><rect x="36" y="24" width="2" height="2"/><rect x="38" y="24" width="2" height="2"/><rect x="40" y="24" width="2" height="2"/><rect x="42" y="24" width="2" height="2"/><rect x="44" y="24" width="2" height="2"/><rect x="46" y="24" width="2" height="2"/><rect x="12" y="26" width="2" height="2"/><rect x="14" y="26" width="2" height="2"/><rect x="16" y="26" width="2" height="2"/><rect x="18" y="26" width="2" height="2"/><rect x="20" y="26" width="2" height="2"/><rect x="22" y="26" width="2" height="2"/><rect x="24" y="26" width="2" height="2"/><rect x="26" y="26" width="2" height="2"/><rect x="28" y="26" width="2" height="2"/><rect x="30" y="26" width="2" height="2"/><rect x="32" y="26" width="2" height="2"/><rect x="34" y="26" width="2" height="2"/><rect x="36" y="26" width="2" height="2"/><rect x="38" y="26" width="2" height="2"/><rect x="40" y="26" width="2" height="2"/><rect x="42" y="26" width="2" height="2"/><rect x="44" y="26" width="2" height="2"/><rect x="46" y="26" width="2" height="2"/><rect x="12" y="28" width="2" height="2"/><rect x="14" y="28" width="2" height="2"/><rect x="16" y="28" width="2" height="2"/><rect x="18" y="28" width="2" height="2"/><rect x="20" y="28" width="2" height="2"/><rect x="22" y="28" width="2" height="2"/><rect x="24" y="28" width="2" height="2"/><rect x="26" y="28" width="2" height="2"/><rect x="28" y="28" width="2" height="2"/><rect x="30" y="28" width="2" height="2"/><rect x="32" y="28" width="2" height="2"/><rect x="34" y="28" width="2" height="2"/><rect x="36" y="28" width="2" height="2"/><rect x="38" y="28" width="2" height="2"/><rect x="12" y="30" width="2" height="2"/><rect x="14" y="30" width="2" height="2"/><rect x="16" y="30" width="2" height="2"/><rect x="18" y="30" width="2" height="2"/><rect x="20" y="30" width="2" height="2"/><rect x="22" y="30" width="2" height="2"/><rect x="24" y="30" width="2" height="2"/><rect x="26" y="30" width="2" height="2"/><rect x="28" y="30" width="2" height="2"/><rect x="30" y="30" width="2" height="2"/><rect x="32" y="30" width="2" height="2"/><rect x="34" y="30" width="2" height="2"/><rect x="36" y="30" width="2" height="2"/><rect x="38" y="30" width="2" height="2"/><rect x="12" y="32" width="2" height="2"/><rect x="14" y="32" width="2" height="2"/><rect x="16" y="32" width="2" height="2"/><rect x="18" y="32" width="2" height="2"/><rect x="20" y="32" width="2" height="2"/><rect x="22" y="32" width="2" height="2"/><rect x="24" y="32" width="2" height="2"/><rect x="26" y="32" width="2" height="2"/><rect x="28" y="32" width="2" height="2"/><rect x="30" y="32" width="2" height="2"/><rect x="32" y="32" width="2" height="2"/><rect x="34" y="32" width="2" height="2"/><rect x="36" y="32" width="2" height="2"/><rect x="38" y="32" width="2" height="2"/><rect x="12" y="34" width="2" height="2"/><rect x="14" y="34" width="2" height="2"/><rect x="16" y="34" width="2" height="2"/><rect x="18" y="34" width="2" height="2"/><rect x="20" y="34" width="2" height="2"/><rect x="22" y="34" width="2" height="2"/><rect x="24" y="34" width="2" height="2"/><rect x="26" y="34" width="2" height="2"/><rect x="28" y="34" width="2" height="2"/><rect x="30" y="34" width="2" height="2"/><rect x="32" y="34" width="2" height="2"/><rect x="34" y="34" width="2" height="2"/><rect x="36" y="34" width="2" height="2"/><rect x="38" y="34" width="2" height="2"/><rect x="12" y="36" width="2" height="2"/><rect x="14" y="36" width="2" height="2"/><rect x="16" y="36" width="2" height="2"/><rect x="18" y="36" width="2" height="2"/><rect x="20" y="36" width="2" height="2"/><rect x="22" y="36" width="2" height="2"/><rect x="24" y="36" width="2" height="2"/><rect x="26" y="36" width="2" height="2"/><rect x="28" y="36" width="2" height="2"/><rect x="30" y="36" width="2" height="2"/><rect x="32" y="36" width="2" height="2"/><rect x="34" y="36" width="2" height="2"/><rect x="36" y="36" width="2" height="2"/><rect x="38" y="36" width="2" height="2"/><rect x="40" y="36" width="2" height="2"/><rect x="42" y="36" width="2" height="2"/><rect x="44" y="36" width="2" height="2"/><rect x="46" y="36" width="2" height="2"/><rect x="12" y="38" width="2" height="2"/><rect x="14" y="38" width="2" height="2"/><rect x="16" y="38" width="2" height="2"/><rect x="18" y="38" width="2" height="2"/><rect x="20" y="38" width="2" height="2"/><rect x="22" y="38" width="2" height="2"/><rect x="24" y="38" width="2" height="2"/><rect x="26" y="38" width="2" height="2"/><rect x="28" y="38" width="2" height="2"/><rect x="30" y="38" width="2" height="2"/><rect x="32" y="38" width="2" height="2"/><rect x="34" y="38" width="2" height="2"/><rect x="36" y="38" width="2" height="2"/><rect x="38" y="38" width="2" height="2"/><rect x="40" y="38" width="2" height="2"/><rect x="42" y="38" width="2" height="2"/><rect x="44" y="38" width="2" height="2"/><rect x="46" y="38" width="2" height="2"/><rect x="12" y="40" width="2" height="2"/><rect x="14" y="40" width="2" height="2"/><rect x="16" y="40" width="2" height="2"/><rect x="18" y="40" width="2" height="2"/><rect x="20" y="40" width="2" height="2"/><rect x="22" y="40" width="2" height="2"/><rect x="24" y="40" width="2" height="2"/><rect x="26" y="40" width="2" height="2"/><rect x="28" y="40" width="2" height="2"/><rect x="30" y="40" width="2" height="2"/><rect x="32" y="40" width="2" height="2"/><rect x="34" y="40" width="2" height="2"/><rect x="36" y="40" width="2" height="2"/><rect x="38" y="40" width="2" height="2"/><rect x="40" y="40" width="2" height="2"/><rect x="42" y="40" width="2" height="2"/><rect x="44" y="40" width="2" height="2"/><rect x="46" y="40" width="2" height="2"/><rect x="12" y="42" width="2" height="2"/><rect x="14" y="42" width="2" height="2"/><rect x="16" y="42" width="2" height="2"/><rect x="18" y="42" width="2" height="2"/><rect x="20" y="42" width="2" height="2"/><rect x="22" y="42" width="2" height="2"/><rect x="24" y="42" width="2" height="2"/><rect x="26" y="42" width="2" height="2"/><rect x="28" y="42" width="2" height="2"/><rect x="30" y="42" width="2" height="2"/><rect x="32" y="42" width="2" height="2"/><rect x="34" y="42" width="2" height="2"/><rect x="36" y="42" width="2" height="2"/><rect x="38" y="42" width="2" height="2"/><rect x="40" y="42" width="2" height="2"/><rect x="42" y="42" width="2" height="2"/><rect x="44" y="42" width="2" height="2"/><rect x="46" y="42" width="2" height="2"/><rect x="16" y="44" width="2" height="2"/><rect x="18" y="44" width="2" height="2"/><rect x="20" y="44" width="2" height="2"/><rect x="22" y="44" width="2" height="2"/><rect x="24" y="44" width="2" height="2"/><rect x="26" y="44" width="2" height="2"/><rect x="28" y="44" width="2" height="2"/><rect x="30" y="44" width="2" height="2"/><rect x="32" y="44" width="2" height="2"/><rect x="34" y="44" width="2" height="2"/><rect x="36" y="44" width="2" height="2"/><rect x="38" y="44" width="2" height="2"/><rect x="40" y="44" width="2" height="2"/><rect x="42" y="44" width="2" height="2"/><rect x="16" y="46" width="2" height="2"/><rect x="18" y="46" width="2" height="2"/><rect x="20" y="46" width="2" height="2"/><rect x="22" y="46" width="2" height="2"/><rect x="24" y="46" width="2" height="2"/><rect x="26" y="46" width="2" height="2"/><rect x="28" y="46" width="2" height="2"/><rect x="30" y="46" width="2" height="2"/><rect x="32" y="46" width="2" height="2"/><rect x="34" y="46" width="2" height="2"/><rect x="36" y="46" width="2" height="2"/><rect x="38" y="46" width="2" height="2"/><rect x="40" y="46" width="2" height="2"/><rect x="42" y="46" width="2" height="2"/><rect x="20" y="48" width="2" height="2"/><rect x="22" y="48" width="2" height="2"/><rect x="24" y="48" width="2" height="2"/><rect x="26" y="48" width="2" height="2"/><rect x="32" y="48" width="2" height="2"/><rect x="34" y="48" width="2" height="2"/><rect x="36" y="48" width="2" height="2"/><rect x="38" y="48" width="2" height="2"/><rect x="20" y="50" width="2" height="2"/><rect x="22" y="50" width="2" height="2"/><rect x="24" y="50" width="2" height="2"/><rect x="26" y="50" width="2" height="2"/><rect x="32" y="50" width="2" height="2"/><rect x="34" y="50" width="2" height="2"/><rect x="36" y="50" width="2" height="2"/><rect x="38" y="50" width="2" height="2"/>
            </g>
          </svg>
        </button>
        {openMenu === 'apple' && (
          <ul className={styles.dropdown}>
            {(appleAbout ? [{ ...appleAbout }, ...APPLE_ITEMS.slice(1)] : APPLE_ITEMS).map((item, i) =>
              item.dotSeparator ? (
                <li key={i} className={styles.dropdownDotSeparator} />
              ) : (
                <li key={item.label}>
                  <button
                    className={itemClass(item, `${styles.dropdownItem} ${item.disabled ? styles.dropdownItemDisabled : ''}`)}
                    onClick={() => handleItemClick(item)}
                  >
                    <span className={styles.checkCol} />
                    <span className={styles.itemLabel}>{item.label}</span>
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>
      {(appMenus ?? MENUS).map(menu => (
        <div key={menu.id} className={styles.menuItem}>
          <button
            className={`${styles.menuLabel} ${openMenu === menu.id ? styles.menuLabelActive : ''}`}
            onClick={() => setOpenMenu(o => o === menu.id ? null : menu.id)}
          >
            {menu.label}
          </button>
          {openMenu === menu.id && (
            <ul className={styles.dropdown}>
              {menu.items.map((item, i) =>
                item.separator ? (
                  <li key={i} className={styles.dropdownSeparator} />
                ) : item.dotSeparator ? (
                  <li key={i} className={styles.dropdownDotSeparator} />
                ) : (
                  <li key={item.label}>
                    <button
                      className={itemClass(item, `${styles.dropdownItem} ${item.disabled ? styles.dropdownItemDisabled : ''}`)}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className={styles.checkCol}>
                        {item.checked ? '✓' : ''}
                      </span>
                      <span className={styles.itemLabel}>{item.label}</span>
                      {item.shortcut && (
                        <span className={styles.shortcut}>{item.shortcut}</span>
                      )}
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
