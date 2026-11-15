'use client'

import type { PointerEvent, ReactNode } from 'react'

// How far the card leans when the cursor is at its edge
const MAX_TILT_DEG = 10

interface TiltCardProps {
  children: ReactNode
  className?: string
}

// Tilts its content toward the cursor. The angles live in CSS variables set straight on the
// element, so moving the mouse never re-renders React.
export const TiltCard = ({ children, className = '' }: TiltCardProps) => {
  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    // Touch has no hovering cursor to follow
    if (event.pointerType !== 'mouse') return

    const rect = event.currentTarget.getBoundingClientRect()
    // -0.5 at the left/top edge, 0.5 at the right/bottom edge
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    event.currentTarget.style.setProperty('--tilt-x', `${(-y * 2 * MAX_TILT_DEG).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${(x * 2 * MAX_TILT_DEG).toFixed(2)}deg`)
  }

  const handleLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty('--tilt-x')
    event.currentTarget.style.removeProperty('--tilt-y')
  }

  return (
    <div
      className="rounded-3xl perspective-distant group-focus-visible:[--tilt-x:6deg] group-focus-visible:[--tilt-y:-8deg]"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div
        className={`transform-[rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] transition-transform duration-150 ease-out transform-3d motion-reduce:transform-none ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
