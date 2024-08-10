export const dotBackground = ({ zoom }: { zoom: number }) => {
  const dotSpace = 22 / zoom
  const dotSize = 1 / zoom
  return `linear-gradient(90deg, var(--space-background) calc(${dotSpace}px - ${dotSize}px), transparent 1%) center / ${dotSpace}px ${dotSpace}px,
		linear-gradient(var(--space-background) calc(${dotSpace}px - ${dotSize}px), transparent 1%) center / ${dotSpace}px ${dotSpace}px,
		var(--space-grid-color)`
}
