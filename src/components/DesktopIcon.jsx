// src/components/DesktopIcon.jsx
import { forwardRef } from 'react'
import styles from './DesktopIcon.module.css'

export function FolderIcon({ selected }) {
  const fg = selected ? 'white' : 'black'
  const bg = selected ? 'black' : 'white'
  return (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
<rect x="4" y="32" width="120" height="76" fill={bg}/>
<rect x="12" y="24" width="40" height="4" fill={bg}/>
<rect x="16" y="20" width="32" height="4" fill={bg}/>
<path d="M0 32H4V36H0V32Z" fill={fg}/>
<path d="M0 36H4V40H0V36Z" fill={fg}/>
<path d="M0 40H4V44H0V40Z" fill={fg}/>
<path d="M0 44H4V48H0V44Z" fill={fg}/>
<path d="M0 48H4V52H0V48Z" fill={fg}/>
<path d="M0 52H4V56H0V52Z" fill={fg}/>
<path d="M0 56H4V60H0V56Z" fill={fg}/>
<path d="M0 60H4V64H0V60Z" fill={fg}/>
<path d="M0 64H4V68H0V64Z" fill={fg}/>
<path d="M0 68H4V72H0V68Z" fill={fg}/>
<path d="M0 72H4V76H0V72Z" fill={fg}/>
<path d="M0 76H4V80H0V76Z" fill={fg}/>
<path d="M0 80H4V84H0V80Z" fill={fg}/>
<path d="M0 84H4V88H0V84Z" fill={fg}/>
<path d="M0 88H4V92H0V88Z" fill={fg}/>
<path d="M0 92H4V96H0V92Z" fill={fg}/>
<path d="M0 96H4V100H0V96Z" fill={fg}/>
<path d="M0 100H4V104H0V100Z" fill={fg}/>
<path d="M0 104H4V108H0V104Z" fill={fg}/>
<path d="M124 32H128V36H124V32Z" fill={fg}/>
<path d="M124 36H128V40H124V36Z" fill={fg}/>
<path d="M124 40H128V44H124V40Z" fill={fg}/>
<path d="M124 44H128V48H124V44Z" fill={fg}/>
<path d="M124 48H128V52H124V48Z" fill={fg}/>
<path d="M124 52H128V56H124V52Z" fill={fg}/>
<path d="M124 56H128V60H124V56Z" fill={fg}/>
<path d="M124 60H128V64H124V60Z" fill={fg}/>
<path d="M124 64H128V68H124V64Z" fill={fg}/>
<path d="M124 68H128V72H124V68Z" fill={fg}/>
<path d="M124 72H128V76H124V72Z" fill={fg}/>
<path d="M124 76H128V80H124V76Z" fill={fg}/>
<path d="M124 80H128V84H124V80Z" fill={fg}/>
<path d="M124 84H128V88H124V84Z" fill={fg}/>
<path d="M124 88H128V92H124V88Z" fill={fg}/>
<path d="M124 92H128V96H124V92Z" fill={fg}/>
<path d="M124 96H128V100H124V96Z" fill={fg}/>
<path d="M124 100H128V104H124V100Z" fill={fg}/>
<path d="M124 104H128V108H124V104Z" fill={fg}/>
<path d="M0 108H4V112H0V108Z" fill={fg}/>
<path d="M4 108H8V112H4V108Z" fill={fg}/>
<path d="M8 108H12V112H8V108Z" fill={fg}/>
<path d="M12 108H16V112H12V108Z" fill={fg}/>
<path d="M16 108H20V112H16V108Z" fill={fg}/>
<path d="M20 108H24V112H20V108Z" fill={fg}/>
<path d="M24 108H28V112H24V108Z" fill={fg}/>
<path d="M28 108H32V112H28V108Z" fill={fg}/>
<path d="M32 108H36V112H32V108Z" fill={fg}/>
<path d="M36 108H40V112H36V108Z" fill={fg}/>
<path d="M40 108H44V112H40V108Z" fill={fg}/>
<path d="M44 108H48V112H44V108Z" fill={fg}/>
<path d="M48 108H52V112H48V108Z" fill={fg}/>
<path d="M52 108H56V112H52V108Z" fill={fg}/>
<path d="M56 108H60V112H56V108Z" fill={fg}/>
<path d="M60 108H64V112H60V108Z" fill={fg}/>
<path d="M64 108H68V112H64V108Z" fill={fg}/>
<path d="M68 108H72V112H68V108Z" fill={fg}/>
<path d="M72 108H76V112H72V108Z" fill={fg}/>
<path d="M76 108H80V112H76V108Z" fill={fg}/>
<path d="M80 108H84V112H80V108Z" fill={fg}/>
<path d="M84 108H88V112H84V108Z" fill={fg}/>
<path d="M88 108H92V112H88V108Z" fill={fg}/>
<path d="M92 108H96V112H92V108Z" fill={fg}/>
<path d="M96 108H100V112H96V108Z" fill={fg}/>
<path d="M100 108H104V112H100V108Z" fill={fg}/>
<path d="M104 108H108V112H104V108Z" fill={fg}/>
<path d="M108 108H112V112H108V108Z" fill={fg}/>
<path d="M112 108H116V112H112V108Z" fill={fg}/>
<path d="M116 108H120V112H116V108Z" fill={fg}/>
<path d="M120 108H124V112H120V108Z" fill={fg}/>
<path d="M4 28H8V32H4V28Z" fill={fg}/>
<path d="M8 28H12V32H8V28Z" fill={fg}/>
<path d="M8 24H12V28H8V24Z" fill={fg}/>
<path d="M12 20H16V24H12V20Z" fill={fg}/>
<path d="M16 16H20V20H16V16Z" fill={fg}/>
<path d="M52 24H56V28H52V24Z" fill={fg}/>
<path d="M48 20H52V24H48V20Z" fill={fg}/>
<path d="M44 16H48V20H44V16Z" fill={fg}/>
<path d="M40 16H44V20H40V16Z" fill={fg}/>
<path d="M36 16H40V20H36V16Z" fill={fg}/>
<path d="M32 16H36V20H32V16Z" fill={fg}/>
<path d="M28 16H32V20H28V16Z" fill={fg}/>
<path d="M24 16H28V20H24V16Z" fill={fg}/>
<path d="M20 16H24V20H20V16Z" fill={fg}/>
<path d="M12 28H16V32H12V28Z" fill={fg}/>
<path d="M16 28H20V32H16V28Z" fill={fg}/>
<path d="M20 28H24V32H20V28Z" fill={fg}/>
<path d="M24 28H28V32H24V28Z" fill={fg}/>
<path d="M28 28H32V32H28V28Z" fill={fg}/>
<path d="M32 28H36V32H32V28Z" fill={fg}/>
<path d="M36 28H40V32H36V28Z" fill={fg}/>
<path d="M40 28H44V32H40V28Z" fill={fg}/>
<path d="M44 28H48V32H44V28Z" fill={fg}/>
<path d="M48 28H52V32H48V28Z" fill={fg}/>
<path d="M52 28H56V32H52V28Z" fill={fg}/>
<path d="M56 28H60V32H56V28Z" fill={fg}/>
<path d="M60 28H64V32H60V28Z" fill={fg}/>
<path d="M64 28H68V32H64V28Z" fill={fg}/>
<path d="M68 28H72V32H68V28Z" fill={fg}/>
<path d="M72 28H76V32H72V28Z" fill={fg}/>
<path d="M76 28H80V32H76V28Z" fill={fg}/>
<path d="M80 28H84V32H80V28Z" fill={fg}/>
<path d="M84 28H88V32H84V28Z" fill={fg}/>
<path d="M88 28H92V32H88V28Z" fill={fg}/>
<path d="M92 28H96V32H92V28Z" fill={fg}/>
<path d="M96 28H100V32H96V28Z" fill={fg}/>
<path d="M100 28H104V32H100V28Z" fill={fg}/>
<path d="M104 28H108V32H104V28Z" fill={fg}/>
<path d="M108 28H112V32H108V28Z" fill={fg}/>
<path d="M112 28H116V32H112V28Z" fill={fg}/>
<path d="M116 28H120V32H116V28Z" fill={fg}/>
<path d="M120 28H124V32H120V28Z" fill={fg}/>
<path d="M124 108H128V112H124V108Z" fill={fg}/>
    </svg>
  )
}

export function NotesIcon({ selected }) {
  const fg = selected ? 'white' : 'black'
  const bg = selected ? 'black' : 'white'
  return (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
<path d="M18 4H90L100 14L111 25.5V124H18V4Z" fill={bg}/>
<path d="M14 4H18V8H14V4Z" fill={fg}/>
<path d="M14 0H18V4H14V0Z" fill={fg}/>
<path d="M18 0H22V4H18V0Z" fill={fg}/>
<path d="M22 0H26V4H22V0Z" fill={fg}/>
<path d="M26 0H30V4H26V0Z" fill={fg}/>
<path d="M30 0H34V4H30V0Z" fill={fg}/>
<path d="M34 0H38V4H34V0Z" fill={fg}/>
<path d="M38 0H42V4H38V0Z" fill={fg}/>
<path d="M42 0H46V4H42V0Z" fill={fg}/>
<path d="M46 0H50V4H46V0Z" fill={fg}/>
<path d="M50 0H54V4H50V0Z" fill={fg}/>
<path d="M54 0H58V4H54V0Z" fill={fg}/>
<path d="M58 0H62V4H58V0Z" fill={fg}/>
<path d="M62 0H66V4H62V0Z" fill={fg}/>
<path d="M66 0H70V4H66V0Z" fill={fg}/>
<path d="M70 0H74V4H70V0Z" fill={fg}/>
<path d="M74 0H78V4H74V0Z" fill={fg}/>
<path d="M78 0H82V4H78V0Z" fill={fg}/>
<path d="M82 0H86V4H82V0Z" fill={fg}/>
<path d="M86 0H90V4H86V0Z" fill={fg}/>
<path d="M90 4H94V8H90V4Z" fill={fg}/>
<path d="M94 8H98V12H94V8Z" fill={fg}/>
<path d="M98 12H102V16H98V12Z" fill={fg}/>
<path d="M102 16H106V20H102V16Z" fill={fg}/>
<path d="M106 20H110V24H106V20Z" fill={fg}/>
<path d="M110 24H114V28H110V24Z" fill={fg}/>
<path d="M110 28H114V32H110V28Z" fill={fg}/>
<path d="M110 32H114V36H110V32Z" fill={fg}/>
<path d="M110 36H114V40H110V36Z" fill={fg}/>
<path d="M110 40H114V44H110V40Z" fill={fg}/>
<path d="M110 44H114V48H110V44Z" fill={fg}/>
<path d="M110 48H114V52H110V48Z" fill={fg}/>
<path d="M110 52H114V56H110V52Z" fill={fg}/>
<path d="M110 56H114V60H110V56Z" fill={fg}/>
<path d="M110 60H114V64H110V60Z" fill={fg}/>
<path d="M110 64H114V68H110V64Z" fill={fg}/>
<path d="M110 68H114V72H110V68Z" fill={fg}/>
<path d="M110 72H114V76H110V72Z" fill={fg}/>
<path d="M110 76H114V80H110V76Z" fill={fg}/>
<path d="M110 80H114V84H110V80Z" fill={fg}/>
<path d="M110 84H114V88H110V84Z" fill={fg}/>
<path d="M110 88H114V92H110V88Z" fill={fg}/>
<path d="M110 92H114V96H110V92Z" fill={fg}/>
<path d="M110 96H114V100H110V96Z" fill={fg}/>
<path d="M110 100H114V104H110V100Z" fill={fg}/>
<path d="M110 104H114V108H110V104Z" fill={fg}/>
<path d="M110 108H114V112H110V108Z" fill={fg}/>
<path d="M110 112H114V116H110V112Z" fill={fg}/>
<path d="M110 116H114V120H110V116Z" fill={fg}/>
<path d="M110 120H114V124H110V120Z" fill={fg}/>
<path d="M110 124H114V128H110V124Z" fill={fg}/>
<path d="M106 124H110V128H106V124Z" fill={fg}/>
<path d="M102 124H106V128H102V124Z" fill={fg}/>
<path d="M98 124H102V128H98V124Z" fill={fg}/>
<path d="M94 124H98V128H94V124Z" fill={fg}/>
<path d="M90 124H94V128H90V124Z" fill={fg}/>
<path d="M86 124H90V128H86V124Z" fill={fg}/>
<path d="M82 124H86V128H82V124Z" fill={fg}/>
<path d="M78 124H82V128H78V124Z" fill={fg}/>
<path d="M74 124H78V128H74V124Z" fill={fg}/>
<path d="M70 124H74V128H70V124Z" fill={fg}/>
<path d="M66 124H70V128H66V124Z" fill={fg}/>
<path d="M62 124H66V128H62V124Z" fill={fg}/>
<path d="M58 124H62V128H58V124Z" fill={fg}/>
<path d="M54 124H58V128H54V124Z" fill={fg}/>
<path d="M50 124H54V128H50V124Z" fill={fg}/>
<path d="M46 124H50V128H46V124Z" fill={fg}/>
<path d="M42 124H46V128H42V124Z" fill={fg}/>
<path d="M38 124H42V128H38V124Z" fill={fg}/>
<path d="M34 124H38V128H34V124Z" fill={fg}/>
<path d="M30 124H34V128H30V124Z" fill={fg}/>
<path d="M26 124H30V128H26V124Z" fill={fg}/>
<path d="M22 124H26V128H22V124Z" fill={fg}/>
<path d="M106 24H110V28H106V24Z" fill={fg}/>
<path d="M102 24H106V28H102V24Z" fill={fg}/>
<path d="M98 24H102V28H98V24Z" fill={fg}/>
<path d="M94 24H98V28H94V24Z" fill={fg}/>
<path d="M90 24H94V28H90V24Z" fill={fg}/>
<path d="M86 24H90V28H86V24Z" fill={fg}/>
<path d="M86 20H90V24H86V20Z" fill={fg}/>
<path d="M82 20H86V24H82V20Z" fill={fg}/>
<path d="M78 20H82V24H78V20Z" fill={fg}/>
<path d="M74 20H78V24H74V20Z" fill={fg}/>
<path d="M66 20H70V24H66V20Z" fill={fg}/>
<path d="M62 20H66V24H62V20Z" fill={fg}/>
<path d="M58 20H62V24H58V20Z" fill={fg}/>
<path d="M54 20H58V24H54V20Z" fill={fg}/>
<path d="M46 20H50V24H46V20Z" fill={fg}/>
<path d="M42 20H46V24H42V20Z" fill={fg}/>
<path d="M38 20H42V24H38V20Z" fill={fg}/>
<path d="M38 28H42V32H38V28Z" fill={fg}/>
<path d="M46 28H50V32H46V28Z" fill={fg}/>
<path d="M50 28H54V32H50V28Z" fill={fg}/>
<path d="M54 28H58V32H54V28Z" fill={fg}/>
<path d="M62 28H66V32H62V28Z" fill={fg}/>
<path d="M66 28H70V32H66V28Z" fill={fg}/>
<path d="M70 28H74V32H70V28Z" fill={fg}/>
<path d="M74 28H78V32H74V28Z" fill={fg}/>
<path d="M78 28H82V32H78V28Z" fill={fg}/>
<path d="M34 28H38V32H34V28Z" fill={fg}/>
<path d="M30 28H34V32H30V28Z" fill={fg}/>
<path d="M30 36H34V40H30V36Z" fill={fg}/>
<path d="M34 36H38V40H34V36Z" fill={fg}/>
<path d="M38 36H42V40H38V36Z" fill={fg}/>
<path d="M42 36H46V40H42V36Z" fill={fg}/>
<path d="M46 36H50V40H46V36Z" fill={fg}/>
<path d="M54 36H58V40H54V36Z" fill={fg}/>
<path d="M58 36H62V40H58V36Z" fill={fg}/>
<path d="M62 36H66V40H62V36Z" fill={fg}/>
<path d="M66 36H70V40H66V36Z" fill={fg}/>
<path d="M70 36H74V40H70V36Z" fill={fg}/>
<path d="M74 36H78V40H74V36Z" fill={fg}/>
<path d="M82 36H86V40H82V36Z" fill={fg}/>
<path d="M86 36H90V40H86V36Z" fill={fg}/>
<path d="M90 36H94V40H90V36Z" fill={fg}/>
<path d="M90 44H94V48H90V44Z" fill={fg}/>
<path d="M86 44H90V48H86V44Z" fill={fg}/>
<path d="M82 44H86V48H82V44Z" fill={fg}/>
<path d="M78 44H82V48H78V44Z" fill={fg}/>
<path d="M70 44H74V48H70V44Z" fill={fg}/>
<path d="M66 44H70V48H66V44Z" fill={fg}/>
<path d="M62 44H66V48H62V44Z" fill={fg}/>
<path d="M54 44H58V48H54V44Z" fill={fg}/>
<path d="M50 44H54V48H50V44Z" fill={fg}/>
<path d="M46 44H50V48H46V44Z" fill={fg}/>
<path d="M38 44H42V48H38V44Z" fill={fg}/>
<path d="M34 44H38V48H34V44Z" fill={fg}/>
<path d="M94 36H98V40H94V36Z" fill={fg}/>
<path d="M30 44H34V48H30V44Z" fill={fg}/>
<path d="M38 56H42V60H38V56Z" fill={fg}/>
<path d="M42 56H46V60H42V56Z" fill={fg}/>
<path d="M46 56H50V60H46V56Z" fill={fg}/>
<path d="M50 56H54V60H50V56Z" fill={fg}/>
<path d="M58 56H62V60H58V56Z" fill={fg}/>
<path d="M62 56H66V60H62V56Z" fill={fg}/>
<path d="M66 56H70V60H66V56Z" fill={fg}/>
<path d="M70 56H74V60H70V56Z" fill={fg}/>
<path d="M78 56H82V60H78V56Z" fill={fg}/>
<path d="M82 56H86V60H82V56Z" fill={fg}/>
<path d="M86 56H90V60H86V56Z" fill={fg}/>
<path d="M90 56H94V60H90V56Z" fill={fg}/>
<path d="M94 56H98V60H94V56Z" fill={fg}/>
<path d="M30 64H34V68H30V64Z" fill={fg}/>
<path d="M34 64H38V68H34V64Z" fill={fg}/>
<path d="M38 64H42V68H38V64Z" fill={fg}/>
<path d="M42 64H46V68H42V64Z" fill={fg}/>
<path d="M50 64H54V68H50V64Z" fill={fg}/>
<path d="M54 64H58V68H54V64Z" fill={fg}/>
<path d="M58 64H62V68H58V64Z" fill={fg}/>
<path d="M62 64H66V68H62V64Z" fill={fg}/>
<path d="M70 64H74V68H70V64Z" fill={fg}/>
<path d="M74 64H78V68H74V64Z" fill={fg}/>
<path d="M78 64H82V68H78V64Z" fill={fg}/>
<path d="M82 64H86V68H82V64Z" fill={fg}/>
<path d="M90 64H94V68H90V64Z" fill={fg}/>
<path d="M94 64H98V68H94V64Z" fill={fg}/>
<path d="M30 72H34V76H30V72Z" fill={fg}/>
<path d="M34 72H38V76H34V72Z" fill={fg}/>
<path d="M42 72H46V76H42V72Z" fill={fg}/>
<path d="M46 72H50V76H46V72Z" fill={fg}/>
<path d="M50 72H54V76H50V72Z" fill={fg}/>
<path d="M54 72H58V76H54V72Z" fill={fg}/>
<path d="M62 72H66V76H62V72Z" fill={fg}/>
<path d="M66 72H70V76H66V72Z" fill={fg}/>
<path d="M70 72H74V76H70V72Z" fill={fg}/>
<path d="M74 72H78V76H74V72Z" fill={fg}/>
<path d="M82 72H86V76H82V72Z" fill={fg}/>
<path d="M86 72H90V76H86V72Z" fill={fg}/>
<path d="M90 72H94V76H90V72Z" fill={fg}/>
<path d="M94 72H98V76H94V72Z" fill={fg}/>
<path d="M30 80H34V84H30V80Z" fill={fg}/>
<path d="M34 80H38V84H34V80Z" fill={fg}/>
<path d="M38 80H42V84H38V80Z" fill={fg}/>
<path d="M42 80H46V84H42V80Z" fill={fg}/>
<path d="M50 80H54V84H50V80Z" fill={fg}/>
<path d="M54 80H58V84H54V80Z" fill={fg}/>
<path d="M58 80H62V84H58V80Z" fill={fg}/>
<path d="M62 80H66V84H62V80Z" fill={fg}/>
<path d="M66 80H70V84H66V80Z" fill={fg}/>
<path d="M74 80H78V84H74V80Z" fill={fg}/>
<path d="M78 80H82V84H78V80Z" fill={fg}/>
<path d="M82 80H86V84H82V80Z" fill={fg}/>
<path d="M86 80H90V84H86V80Z" fill={fg}/>
<path d="M86 16H90V20H86V16Z" fill={fg}/>
<path d="M86 12H90V16H86V12Z" fill={fg}/>
<path d="M86 8H90V12H86V8Z" fill={fg}/>
<path d="M86 4H90V8H86V4Z" fill={fg}/>
<path d="M14 8H18V12H14V8Z" fill={fg}/>
<path d="M14 12H18V16H14V12Z" fill={fg}/>
<path d="M14 16H18V20H14V16Z" fill={fg}/>
<path d="M14 20H18V24H14V20Z" fill={fg}/>
<path d="M14 24H18V28H14V24Z" fill={fg}/>
<path d="M14 28H18V32H14V28Z" fill={fg}/>
<path d="M14 32H18V36H14V32Z" fill={fg}/>
<path d="M14 36H18V40H14V36Z" fill={fg}/>
<path d="M14 40H18V44H14V40Z" fill={fg}/>
<path d="M14 44H18V48H14V44Z" fill={fg}/>
<path d="M14 48H18V52H14V48Z" fill={fg}/>
<path d="M14 52H18V56H14V52Z" fill={fg}/>
<path d="M14 56H18V60H14V56Z" fill={fg}/>
<path d="M14 60H18V64H14V60Z" fill={fg}/>
<path d="M14 64H18V68H14V64Z" fill={fg}/>
<path d="M14 68H18V72H14V68Z" fill={fg}/>
<path d="M14 72H18V76H14V72Z" fill={fg}/>
<path d="M14 76H18V80H14V76Z" fill={fg}/>
<path d="M14 80H18V84H14V80Z" fill={fg}/>
<path d="M14 84H18V88H14V84Z" fill={fg}/>
<path d="M14 88H18V92H14V88Z" fill={fg}/>
<path d="M14 92H18V96H14V92Z" fill={fg}/>
<path d="M14 96H18V100H14V96Z" fill={fg}/>
<path d="M14 100H18V104H14V100Z" fill={fg}/>
<path d="M14 104H18V108H14V104Z" fill={fg}/>
<path d="M14 108H18V112H14V108Z" fill={fg}/>
<path d="M14 112H18V116H14V112Z" fill={fg}/>
<path d="M14 116H18V120H14V116Z" fill={fg}/>
<path d="M14 120H18V124H14V120Z" fill={fg}/>
<path d="M14 124H18V128H14V124Z" fill={fg}/>
<path d="M18 124H22V128H18V124Z" fill={fg}/>
    </svg>
  )
}

export function TrashIcon({ highlighted, full, selected }) {
  const fg = (highlighted || full || selected) ? 'white' : 'black'
  const bg = (highlighted || full || selected) ? 'black' : 'white'
  return (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
<rect x="26" y="24" width="76" height="100" fill={bg}/>
<rect x="22" y="12" width="84" height="8" fill={bg}/>
<rect x="53" y="4" width="21" height="4" fill={bg}/>
<path d="M22 8H26V12H22V8Z" fill={fg}/>
<path d="M102 8H106V12H102V8Z" fill={fg}/>
<path d="M98 8H102V12H98V8Z" fill={fg}/>
<path d="M94 8H98V12H94V8Z" fill={fg}/>
<path d="M90 8H94V12H90V8Z" fill={fg}/>
<path d="M86 8H90V12H86V8Z" fill={fg}/>
<path d="M82 8H86V12H82V8Z" fill={fg}/>
<path d="M78 8H82V12H78V8Z" fill={fg}/>
<path d="M74 8H78V12H74V8Z" fill={fg}/>
<path d="M70 8H74V12H70V8Z" fill={fg}/>
<path d="M66 8H70V12H66V8Z" fill={fg}/>
<path d="M62 8H66V12H62V8Z" fill={fg}/>
<path d="M58 8H62V12H58V8Z" fill={fg}/>
<path d="M54 8H58V12H54V8Z" fill={fg}/>
<path d="M50 8H54V12H50V8Z" fill={fg}/>
<path d="M50 4H54V8H50V4Z" fill={fg}/>
<path d="M74 4H78V8H74V4Z" fill={fg}/>
<path d="M70 0H74V4H70V0Z" fill={fg}/>
<path d="M66 0H70V4H66V0Z" fill={fg}/>
<path d="M62 0H66V4H62V0Z" fill={fg}/>
<path d="M58 0H62V4H58V0Z" fill={fg}/>
<path d="M54 0H58V4H54V0Z" fill={fg}/>
<path d="M46 8H50V12H46V8Z" fill={fg}/>
<path d="M42 8H46V12H42V8Z" fill={fg}/>
<path d="M38 8H42V12H38V8Z" fill={fg}/>
<path d="M34 8H38V12H34V8Z" fill={fg}/>
<path d="M30 8H34V12H30V8Z" fill={fg}/>
<path d="M26 8H30V12H26V8Z" fill={fg}/>
<path d="M18 12H22V16H18V12Z" fill={fg}/>
<path d="M18 16H22V20H18V16Z" fill={fg}/>
<path d="M18 20H22V24H18V20Z" fill={fg}/>
<path d="M22 20H26V24H22V20Z" fill={fg}/>
<path d="M22 24H26V28H22V24Z" fill={fg}/>
<path d="M22 28H26V32H22V28Z" fill={fg}/>
<path d="M22 32H26V36H22V32Z" fill={fg}/>
<path d="M22 36H26V40H22V36Z" fill={fg}/>
<path d="M22 40H26V44H22V40Z" fill={fg}/>
<path d="M22 44H26V48H22V44Z" fill={fg}/>
<path d="M22 48H26V52H22V48Z" fill={fg}/>
<path d="M22 52H26V56H22V52Z" fill={fg}/>
<path d="M22 56H26V60H22V56Z" fill={fg}/>
<path d="M22 60H26V64H22V60Z" fill={fg}/>
<path d="M22 64H26V68H22V64Z" fill={fg}/>
<path d="M22 68H26V72H22V68Z" fill={fg}/>
<path d="M22 72H26V76H22V72Z" fill={fg}/>
<path d="M22 76H26V80H22V76Z" fill={fg}/>
<path d="M22 80H26V84H22V80Z" fill={fg}/>
<path d="M22 84H26V88H22V84Z" fill={fg}/>
<path d="M22 88H26V92H22V88Z" fill={fg}/>
<path d="M22 92H26V96H22V92Z" fill={fg}/>
<path d="M22 96H26V100H22V96Z" fill={fg}/>
<path d="M22 100H26V104H22V100Z" fill={fg}/>
<path d="M22 104H26V108H22V104Z" fill={fg}/>
<path d="M22 108H26V112H22V108Z" fill={fg}/>
<path d="M22 112H26V116H22V112Z" fill={fg}/>
<path d="M22 116H26V120H22V116Z" fill={fg}/>
<path d="M22 120H26V124H22V120Z" fill={fg}/>
<path d="M26 124H30V128H26V124Z" fill={fg}/>
<path d="M30 124H34V128H30V124Z" fill={fg}/>
<path d="M34 124H38V128H34V124Z" fill={fg}/>
<path d="M38 124H42V128H38V124Z" fill={fg}/>
<path d="M42 124H46V128H42V124Z" fill={fg}/>
<path d="M46 124H50V128H46V124Z" fill={fg}/>
<path d="M50 124H54V128H50V124Z" fill={fg}/>
<path d="M54 124H58V128H54V124Z" fill={fg}/>
<path d="M58 124H62V128H58V124Z" fill={fg}/>
<path d="M62 124H66V128H62V124Z" fill={fg}/>
<path d="M66 124H70V128H66V124Z" fill={fg}/>
<path d="M70 124H74V128H70V124Z" fill={fg}/>
<path d="M74 124H78V128H74V124Z" fill={fg}/>
<path d="M78 124H82V128H78V124Z" fill={fg}/>
<path d="M82 124H86V128H82V124Z" fill={fg}/>
<path d="M86 124H90V128H86V124Z" fill={fg}/>
<path d="M90 124H94V128H90V124Z" fill={fg}/>
<path d="M94 124H98V128H94V124Z" fill={fg}/>
<path d="M98 124H102V128H98V124Z" fill={fg}/>
<path d="M26 20H30V24H26V20Z" fill={fg}/>
<path d="M30 20H34V24H30V20Z" fill={fg}/>
<path d="M34 20H38V24H34V20Z" fill={fg}/>
<path d="M38 20H42V24H38V20Z" fill={fg}/>
<path d="M42 20H46V24H42V20Z" fill={fg}/>
<path d="M42 32H46V36H42V32Z" fill={fg}/>
<path d="M38 36H42V40H38V36Z" fill={fg}/>
<path d="M38 40H42V44H38V40Z" fill={fg}/>
<path d="M38 44H42V48H38V44Z" fill={fg}/>
<path d="M38 48H42V52H38V48Z" fill={fg}/>
<path d="M38 52H42V56H38V52Z" fill={fg}/>
<path d="M38 56H42V60H38V56Z" fill={fg}/>
<path d="M38 60H42V64H38V60Z" fill={fg}/>
<path d="M38 64H42V68H38V64Z" fill={fg}/>
<path d="M38 68H42V72H38V68Z" fill={fg}/>
<path d="M38 72H42V76H38V72Z" fill={fg}/>
<path d="M38 76H42V80H38V76Z" fill={fg}/>
<path d="M38 80H42V84H38V80Z" fill={fg}/>
<path d="M38 84H42V88H38V84Z" fill={fg}/>
<path d="M38 88H42V92H38V88Z" fill={fg}/>
<path d="M38 92H42V96H38V92Z" fill={fg}/>
<path d="M38 96H42V100H38V96Z" fill={fg}/>
<path d="M38 100H42V104H38V100Z" fill={fg}/>
<path d="M38 104H42V108H38V104Z" fill={fg}/>
<path d="M38 108H42V112H38V108Z" fill={fg}/>
<path d="M42 112H46V116H42V112Z" fill={fg}/>
<path d="M58 32H62V36H58V32Z" fill={fg}/>
<path d="M54 36H58V40H54V36Z" fill={fg}/>
<path d="M54 40H58V44H54V40Z" fill={fg}/>
<path d="M54 44H58V48H54V44Z" fill={fg}/>
<path d="M54 48H58V52H54V48Z" fill={fg}/>
<path d="M54 52H58V56H54V52Z" fill={fg}/>
<path d="M54 56H58V60H54V56Z" fill={fg}/>
<path d="M54 60H58V64H54V60Z" fill={fg}/>
<path d="M54 64H58V68H54V64Z" fill={fg}/>
<path d="M54 68H58V72H54V68Z" fill={fg}/>
<path d="M54 72H58V76H54V72Z" fill={fg}/>
<path d="M54 76H58V80H54V76Z" fill={fg}/>
<path d="M54 80H58V84H54V80Z" fill={fg}/>
<path d="M54 84H58V88H54V84Z" fill={fg}/>
<path d="M54 88H58V92H54V88Z" fill={fg}/>
<path d="M54 92H58V96H54V92Z" fill={fg}/>
<path d="M54 96H58V100H54V96Z" fill={fg}/>
<path d="M54 100H58V104H54V100Z" fill={fg}/>
<path d="M54 104H58V108H54V104Z" fill={fg}/>
<path d="M54 108H58V112H54V108Z" fill={fg}/>
<path d="M58 112H62V116H58V112Z" fill={fg}/>
<path d="M74 32H78V36H74V32Z" fill={fg}/>
<path d="M70 36H74V40H70V36Z" fill={fg}/>
<path d="M70 40H74V44H70V40Z" fill={fg}/>
<path d="M70 44H74V48H70V44Z" fill={fg}/>
<path d="M70 48H74V52H70V48Z" fill={fg}/>
<path d="M70 52H74V56H70V52Z" fill={fg}/>
<path d="M70 56H74V60H70V56Z" fill={fg}/>
<path d="M70 60H74V64H70V60Z" fill={fg}/>
<path d="M70 64H74V68H70V64Z" fill={fg}/>
<path d="M70 68H74V72H70V68Z" fill={fg}/>
<path d="M70 72H74V76H70V72Z" fill={fg}/>
<path d="M70 76H74V80H70V76Z" fill={fg}/>
<path d="M70 80H74V84H70V80Z" fill={fg}/>
<path d="M70 84H74V88H70V84Z" fill={fg}/>
<path d="M70 88H74V92H70V88Z" fill={fg}/>
<path d="M70 92H74V96H70V92Z" fill={fg}/>
<path d="M70 96H74V100H70V96Z" fill={fg}/>
<path d="M70 100H74V104H70V100Z" fill={fg}/>
<path d="M70 104H74V108H70V104Z" fill={fg}/>
<path d="M70 108H74V112H70V108Z" fill={fg}/>
<path d="M74 112H78V116H74V112Z" fill={fg}/>
<path d="M90 32H94V36H90V32Z" fill={fg}/>
<path d="M86 36H90V40H86V36Z" fill={fg}/>
<path d="M86 40H90V44H86V40Z" fill={fg}/>
<path d="M86 44H90V48H86V44Z" fill={fg}/>
<path d="M86 48H90V52H86V48Z" fill={fg}/>
<path d="M86 52H90V56H86V52Z" fill={fg}/>
<path d="M86 56H90V60H86V56Z" fill={fg}/>
<path d="M86 60H90V64H86V60Z" fill={fg}/>
<path d="M86 64H90V68H86V64Z" fill={fg}/>
<path d="M86 68H90V72H86V68Z" fill={fg}/>
<path d="M86 72H90V76H86V72Z" fill={fg}/>
<path d="M86 76H90V80H86V76Z" fill={fg}/>
<path d="M86 80H90V84H86V80Z" fill={fg}/>
<path d="M86 84H90V88H86V84Z" fill={fg}/>
<path d="M86 88H90V92H86V88Z" fill={fg}/>
<path d="M86 92H90V96H86V92Z" fill={fg}/>
<path d="M86 96H90V100H86V96Z" fill={fg}/>
<path d="M86 100H90V104H86V100Z" fill={fg}/>
<path d="M86 104H90V108H86V104Z" fill={fg}/>
<path d="M86 108H90V112H86V108Z" fill={fg}/>
<path d="M90 112H94V116H90V112Z" fill={fg}/>
<path d="M46 20H50V24H46V20Z" fill={fg}/>
<path d="M50 20H54V24H50V20Z" fill={fg}/>
<path d="M54 20H58V24H54V20Z" fill={fg}/>
<path d="M58 20H62V24H58V20Z" fill={fg}/>
<path d="M62 20H66V24H62V20Z" fill={fg}/>
<path d="M66 20H70V24H66V20Z" fill={fg}/>
<path d="M70 20H74V24H70V20Z" fill={fg}/>
<path d="M74 20H78V24H74V20Z" fill={fg}/>
<path d="M78 20H82V24H78V20Z" fill={fg}/>
<path d="M82 20H86V24H82V20Z" fill={fg}/>
<path d="M86 20H90V24H86V20Z" fill={fg}/>
<path d="M90 20H94V24H90V20Z" fill={fg}/>
<path d="M94 20H98V24H94V20Z" fill={fg}/>
<path d="M98 20H102V24H98V20Z" fill={fg}/>
<path d="M102 20H106V24H102V20Z" fill={fg}/>
<path d="M102 24H106V28H102V24Z" fill={fg}/>
<path d="M102 28H106V32H102V28Z" fill={fg}/>
<path d="M102 32H106V36H102V32Z" fill={fg}/>
<path d="M102 36H106V40H102V36Z" fill={fg}/>
<path d="M102 40H106V44H102V40Z" fill={fg}/>
<path d="M102 44H106V48H102V44Z" fill={fg}/>
<path d="M102 48H106V52H102V48Z" fill={fg}/>
<path d="M102 52H106V56H102V52Z" fill={fg}/>
<path d="M102 56H106V60H102V56Z" fill={fg}/>
<path d="M102 60H106V64H102V60Z" fill={fg}/>
<path d="M102 64H106V68H102V64Z" fill={fg}/>
<path d="M102 68H106V72H102V68Z" fill={fg}/>
<path d="M102 72H106V76H102V72Z" fill={fg}/>
<path d="M102 76H106V80H102V76Z" fill={fg}/>
<path d="M102 80H106V84H102V80Z" fill={fg}/>
<path d="M102 84H106V88H102V84Z" fill={fg}/>
<path d="M102 88H106V92H102V88Z" fill={fg}/>
<path d="M102 92H106V96H102V92Z" fill={fg}/>
<path d="M102 96H106V100H102V96Z" fill={fg}/>
<path d="M102 100H106V104H102V100Z" fill={fg}/>
<path d="M102 104H106V108H102V104Z" fill={fg}/>
<path d="M102 108H106V112H102V108Z" fill={fg}/>
<path d="M102 112H106V116H102V112Z" fill={fg}/>
<path d="M102 116H106V120H102V116Z" fill={fg}/>
<path d="M102 120H106V124H102V120Z" fill={fg}/>
<path d="M106 20H110V24H106V20Z" fill={fg}/>
<path d="M106 16H110V20H106V16Z" fill={fg}/>
<path d="M106 12H110V16H106V12Z" fill={fg}/>
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
      {icon === 'trash'  && <TrashIcon  highlighted={isHighlighted} full={isFull} selected={isSelected} />}
      <span className={`${styles.label} ${isSelected ? styles.labelSelected : ''}`}>{label}</span>
    </div>
  )
})

export default DesktopIcon
