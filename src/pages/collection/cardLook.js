// src/pages/collection/cardLook.js
// Which card style to show (the dev switch), and the classes for it.
import styles from '../Collection.module.css'

// Looks to compare while deciding (dev server only): 'card', the
// collectible cards; 'museum', the same cards in the museum's own style
// (square corners, white, sans, still); 'hybrid', the museum look with
// the collectible's lift, tilt and light.
// Remembered per browser.
const STYLE_KEY = 'ux-archaeologist:collection-style'
export const LOOKS = ['card', 'museum', 'hybrid']
export const readCardLook = () => { try { const v = localStorage.getItem(STYLE_KEY); return LOOKS.includes(v) ? v : 'card' } catch { return 'card' } }

export const saveCardLook = (v) => { try { localStorage.setItem(STYLE_KEY, v) } catch { /* storage blocked */ } }
/** Class names for an ancestor of the cards, for a look */
export const lookClass = (look) => `${look !== 'card' ? styles.museum : ''} ${look === 'hybrid' ? styles.hybrid : ''}`
