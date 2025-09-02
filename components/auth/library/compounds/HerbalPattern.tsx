/**
 * HerbalPattern Component
 * 
 * @implements Dev-Step 3.11: TCM Cultural Design Layer
 * @description SVG decorative pattern inspired by traditional Chinese herbal medicine
 */

import React from 'react'

export interface HerbalPatternProps {
  density?: number // 0.1 to 1.0
  opacity?: number // 0.01 to 0.3
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
}

export function HerbalPattern({
  density = 0.1,
  opacity = 0.05,
  className = '',
  position = 'top-right'
}: HerbalPatternProps) {
  // Clamp values to safe ranges
  const safeDensity = Math.max(0.1, Math.min(1.0, density))
  const safeOpacity = Math.max(0.01, Math.min(0.3, opacity))
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }
  
  // Scale based on density
  const scale = 150 * safeDensity
  
  return (
    <div
      className={`absolute pointer-events-none ${positionClasses[position]} ${className}`}
      aria-hidden="true"
      style={{ opacity: safeOpacity }}
    >
      <svg
        width={scale}
        height={scale}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Herbal leaf pattern */}
        <g transform="translate(100, 100)">
          {/* Central stem */}
          <path
            d="M0,-80 Q-5,-40 0,0 Q5,40 0,80"
            stroke="var(--tcm-sage-400)"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Leaves - arranged in traditional pattern */}
          {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
            <g key={i} transform={`rotate(${rotation})`}>
              <path
                d="M0,0 Q20,-15 40,-10 Q45,0 40,10 Q20,15 0,0"
                fill="var(--tcm-bamboo-400)"
                opacity="0.3"
              />
              <path
                d="M0,0 Q20,-15 40,-10"
                stroke="var(--tcm-sage-500)"
                strokeWidth="1"
                fill="none"
              />
            </g>
          ))}
          
          {/* Secondary leaves */}
          {[30, 90, 150, 210, 270, 330].map((rotation, i) => (
            <g key={`secondary-${i}`} transform={`rotate(${rotation})`}>
              <path
                d="M0,0 Q15,-10 25,-8 Q28,0 25,8 Q15,10 0,0"
                fill="var(--tcm-herb-400)"
                opacity="0.2"
              />
            </g>
          ))}
          
          {/* Decorative dots - representing seeds/berries */}
          {[45, 135, 225, 315].map((rotation, i) => (
            <circle
              key={`dot-${i}`}
              cx={Math.cos(rotation * Math.PI / 180) * 50}
              cy={Math.sin(rotation * Math.PI / 180) * 50}
              r="3"
              fill="var(--tcm-herb-500)"
              opacity="0.4"
            />
          ))}
        </g>
        
        {/* Border pattern */}
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          fill="none"
          stroke="var(--tcm-sage-300)"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.3"
          rx="8"
        />
      </svg>
    </div>
  )
}

export default HerbalPattern