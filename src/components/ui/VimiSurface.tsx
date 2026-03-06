import type { ReactNode } from 'react'

export interface VimiSurfaceProps {
    children: ReactNode
    className?: string
    style?: React.CSSProperties
    variant?: 'panel' | 'card' | 'elevated' | 'glass'
    interactive?: boolean
    padded?: boolean
}

function cx(...names: Array<string | false | null | undefined>) {
    return names.filter(Boolean).join(' ')
}

export default function VimiSurface({
    children,
    className,
    style,
    variant = 'panel',
    interactive = false,
    padded = true
}: VimiSurfaceProps) {
    const variantClass =
        variant === 'elevated' ? 'card-clay shadow-float' :
            variant === 'glass' ? 'glass' :
                variant === 'card' ? 'card-clay' :
                    'bg-dark-slate'

    return (
        <div
            style={style}
            className={cx(
                'rounded-lg overflow-hidden border border-white/5',
                variantClass,
                padded ? 'p-4 md:p-6' : '',
                interactive ? 'cursor-pointer hover:border-white/10 hover:bg-matte-clay-hover transition-all' : '',
                className
            )}
        >
            {children}
        </div>
    )
}
