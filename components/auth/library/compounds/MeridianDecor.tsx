/**
 * MeridianDecor Component
 * 
 * @implements Dev-Step 3.11: TCM Cultural Design Layer
 * @description SVG decorative pattern inspired by traditional Chinese medicine meridian charts
 */

import React from 'react'

export interface MeridianDecorProps {
  opacity?: number // 0.01 to 0.3
  variant?: 'flowing' | 'circular' | 'wave'
  className?: string
  position?: 'left' | 'right' | 'top' | 'bottom' | 'background'
}

export function MeridianDecor({
  opacity = 0.05,
  variant = 'flowing',
  className = '',
  position = 'background'
}: MeridianDecorProps) {
  // Clamp opacity to safe range
  const safeOpacity = Math.max(0.01, Math.min(0.3, opacity))
  
  // Position classes
  const positionClasses = {
    'left': 'absolute left-0 top-0 h-full',
    'right': 'absolute right-0 top-0 h-full',
    'top': 'absolute top-0 left-0 w-full',
    'bottom': 'absolute bottom-0 left-0 w-full',
    'background': 'absolute inset-0 w-full h-full'
  }
  
  const renderPattern = () => {
    switch (variant) {
      case 'flowing':
        return (
          <>
            {/* Flowing meridian lines */}
            <path
              d="M20,0 Q50,50 30,100 T40,200 Q60,250 50,300"
              stroke="var(--tcm-sage-400)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M80,0 Q60,30 70,80 T90,160 Q70,210 80,300"
              stroke="var(--tcm-bamboo-400)"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M120,0 Q140,40 130,100 T120,200 Q140,260 130,300"
              stroke="var(--tcm-herb-400)"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            
            {/* Energy points (acupoints) */}
            {[
              { x: 30, y: 50 },
              { x: 70, y: 80 },
              { x: 130, y: 100 },
              { x: 40, y: 150 },
              { x: 90, y: 160 },
              { x: 120, y: 200 }
            ].map((point, i) => (
              <circle
                key={`point-${i}`}
                cx={point.x}
                cy={point.y}
                r="2"
                fill="var(--tcm-sage-500)"
                opacity="0.5"
              />
            ))}
          </>
        )
        
      case 'circular':
        return (
          <>
            {/* Circular energy flow */}
            <circle
              cx="75"
              cy="75"
              r="50"
              stroke="var(--tcm-sage-400)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="5,10"
              opacity="0.4"
            />
            <circle
              cx="75"
              cy="75"
              r="30"
              stroke="var(--tcm-bamboo-400)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,7"
              opacity="0.3"
            />
            
            {/* Yin-Yang inspired center */}
            <path
              d="M75,45 A15,15 0 0,1 75,75 A7.5,7.5 0 0,0 75,60 A7.5,7.5 0 0,1 75,45"
              fill="var(--tcm-sage-400)"
              opacity="0.2"
            />
            <path
              d="M75,75 A15,15 0 0,1 75,45 A7.5,7.5 0 0,0 75,60 A7.5,7.5 0 0,1 75,75"
              fill="var(--tcm-bamboo-400)"
              opacity="0.2"
            />
          </>
        )
        
      case 'wave':
        return (
          <>
            {/* Wave energy pattern */}
            <path
              d="M0,75 Q37.5,25 75,75 T150,75"
              stroke="var(--tcm-sage-400)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M0,100 Q37.5,50 75,100 T150,100"
              stroke="var(--tcm-bamboo-400)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M0,125 Q37.5,75 75,125 T150,125"
              stroke="var(--tcm-herb-400)"
              strokeWidth="1"
              fill="none"
              opacity="0.2"
            />
            
            {/* Energy nodes */}
            {[0, 37.5, 75, 112.5, 150].map((x, i) => (
              <circle
                key={`node-${i}`}
                cx={x}
                cy={75 + Math.sin(x * 0.05) * 25}
                r="1.5"
                fill="var(--tcm-sage-600)"
                opacity="0.4"
              />
            ))}
          </>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div
      className={`${positionClasses[position]} pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ opacity: safeOpacity }}
    >
      <svg
        width={position === 'left' || position === 'right' ? '150' : '100%'}
        height={position === 'top' || position === 'bottom' ? '150' : '100%'}
        viewBox={variant === 'circular' ? '0 0 150 150' : '0 0 150 300'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {renderPattern()}
      </svg>
    </div>
  )
}

export default MeridianDecor