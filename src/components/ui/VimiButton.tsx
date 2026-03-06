import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface VimiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    iconLeft?: ReactNode
    iconRight?: ReactNode
    isLoading?: boolean
}

function cx(...names: Array<string | false | null | undefined>) {
    return names.filter(Boolean).join(' ')
}

const VimiButton = forwardRef<HTMLButtonElement, VimiButtonProps>(function VimiButton(
    {
        variant = 'secondary',
        size = 'md',
        iconLeft,
        iconRight,
        isLoading,
        className,
        children,
        disabled,
        ...props
    },
    ref
) {
    const variantClass =
        variant === 'primary' ? 'btn-primary' :
            variant === 'ghost' ? 'btn-ghost' :
                variant === 'danger' ? 'bg-destructive hover:bg-red-600 text-white' :
                    'btn-secondary'

    const sizeClass =
        size === 'sm' ? 'px-3 py-1.5 text-xs' :
            size === 'lg' ? 'px-8 py-4 text-base' :
                'px-5 py-2.5 text-sm'

    return (
        <button
            ref={ref}
            className={cx(
                'inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md',
                variantClass,
                sizeClass,
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : iconLeft}
            {children}
            {!isLoading && iconRight}
        </button>
    )
})

export default VimiButton
