import React from 'react'
import { cn } from '@shared/utils/classNames.js'

export default function FeedInsightLogoText({ size = 'text-2xl', className }) {
  return (
    <div className={cn('flex items-center', className)}>
      <span className={`font-bold text-primary ${size}`}>Feed</span>
      <span className={`font-bold text-slate-900 ${size}`}>Insight</span>
    </div>
  )
}
