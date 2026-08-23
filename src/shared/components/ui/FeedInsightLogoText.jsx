import React from 'react'
import FeedInsight from '@assets/FeedInsight.png'

export default function FeedInsightLogoText({ className }) {
  return (
    <img
      src={FeedInsight}
      className={`h-8 w-auto ${className}`}
    />
  )
}
