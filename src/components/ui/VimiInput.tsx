import { forwardRef, type InputHTMLAttributes } from 'react'

export interface VimiInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

function cx(...names: Array<string | false | null | undefined>) {
    return names.filter(Boolean).join(' ')
}

const VimiInput = forwardRef<HTMLInputElement, VimiInputProps>(function VimiInput(
    { error, className, ...props },
    ref
) {
    return (
        <div className="w-full space-y-1.5">
            <input
                ref={ref}
                className={cx(
                    'input-dark w-full',
                    error ? 'border-red-500/50 focus:border-red-500 shadow-destructive/10' : '',
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    )
})

export default VimiInput
