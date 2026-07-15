const loadStyles = async (): Promise<void> => {
  await Promise.all([
    import('@/assets/styles/visual-layers.css'),
    import('@/assets/styles/animations.css'),
    import('@/assets/stripe-effects.css')
  ])
}

export const loadVisualEnhancements = (): void => {
  requestAnimationFrame(() => {
    setTimeout(() => void loadStyles(), 0)
  })
}
