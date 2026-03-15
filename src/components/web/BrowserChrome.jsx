// src/components/web/BrowserChrome.jsx
// Internet Explorer 4 / Windows 98 browser chrome
import styles from './BrowserChrome.module.css'

/* ── IE "e" logo icon ─────────────────────────────────────────────── */
function IELogo() {
  return (
    <span className={styles.ieLogo} aria-hidden="true">
      <span className={styles.ieLogoE}>e</span>
    </span>
  )
}

/* ── Title bar window buttons ─────────────────────────────────────── */
function WinButton({ symbol, variant }) {
  return (
    <span className={`${styles.winBtn} ${variant === 'close' ? styles.winBtnClose : ''}`}>
      {symbol}
    </span>
  )
}

/* ── Toolbar button (icon stacked above label) ───────────────────── */
function ToolbarButton({ icon, label, disabled, onClick }) {
  return (
    <span
      className={`${styles.toolbarBtn} ${disabled ? styles.toolbarBtnDisabled : ''}`}
      onClick={!disabled && onClick ? onClick : undefined}
    >
      <span className={styles.toolbarIcon}>{icon}</span>
      <span className={styles.toolbarLabel}>{label}</span>
    </span>
  )
}

/* ── Toolbar separator ────────────────────────────────────────────── */
function ToolbarSep() {
  return <span className={styles.toolbarSep} />
}

/* ── Main component ───────────────────────────────────────────────── */
export default function BrowserChrome({
  children,
  currentUrl   = 'about:blank',
  pageTitle    = 'Microsoft Internet Explorer',
  canGoBack    = false,
  canGoForward = false,
  onBack,
  onForward,
  statusText   = 'Done',
}) {
  const titleBarText = pageTitle
    ? `${pageTitle} - Microsoft Internet Explorer`
    : 'Microsoft Internet Explorer'

  return (
    <div className={styles.browser}>

      {/* ── Title bar ───────────────────────────────────────────── */}
      <div className={styles.titleBar}>
        <div className={styles.titleLeft}>
          <IELogo />
          <span className={styles.titleText}>{titleBarText}</span>
        </div>
        <div className={styles.winBtns}>
          <WinButton symbol="─" />
          <WinButton symbol="□" />
          <WinButton symbol="✕" variant="close" />
        </div>
      </div>

      {/* ── Menu bar ────────────────────────────────────────────── */}
      <div className={styles.menuBar}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(item => (
          <span key={item} className={styles.menuItem}>{item}</span>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <ToolbarButton icon="◀" label="Back"    disabled={!canGoBack}    onClick={onBack} />
        <ToolbarButton icon="▶" label="Forward" disabled={!canGoForward} onClick={onForward} />
        <ToolbarSep />
        <ToolbarButton icon="⊗" label="Stop" />
        <ToolbarButton icon="↺" label="Refresh" />
        <ToolbarSep />
        <ToolbarButton icon="⌂" label="Home" />
        <div className={styles.toolbarSpacer} />
        {/* Throbber — the animated IE logo in the top-right of toolbar */}
        <span className={styles.throbber}>
          <IELogo />
        </span>
      </div>

      {/* ── Address bar ─────────────────────────────────────────── */}
      <div className={styles.addressBar}>
        <span className={styles.addressLabel}>Address</span>
        <span className={styles.addressDrop}>▾</span>
        <span className={styles.addressInput}>{currentUrl}</span>
        <span className={styles.goBtn}>Go</span>
      </div>

      {/* ── Page content ────────────────────────────────────────── */}
      <div className={styles.content}>
        {children}
      </div>

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div className={styles.statusBar}>
        <span className={styles.statusText}>{statusText}</span>
        <span className={styles.statusZone}>Internet zone</span>
      </div>

    </div>
  )
}
