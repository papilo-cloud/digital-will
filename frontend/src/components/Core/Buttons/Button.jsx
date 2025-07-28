import React from 'react'
import clsx from 'clsx'
import ButtonLoadingContent from './ButtonLoadingContent'
import ButtonText from './ButtonText'

const Button = ({loading, disabled, className, children, loadingContent, onClick, ...props}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={clsx('flex items-center justify-center ring-[.1em] w-full gap-[.75em] rounded-full py-[0.625em] px-[1.625em] text-lg ring-inset',
                isDisabled ? 'cursor-not-allowed opacity-30 ': 'cursor-pointer',
                className
            )}
            style={props.style}
            onClick={isDisabled ? undefined : onClick}
            {...props}
        >
            {loading 
                ? loadingContent ?? <ButtonLoadingContent><ButtonText>Loading...</ButtonText></ButtonLoadingContent>
                : children}
        </button>
    )
}

export default Button