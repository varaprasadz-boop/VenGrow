'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const disabled =
      props.value === '' || props.value === undefined || props.disabled

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('hide-password-toggle pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword && !disabled ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>

        {/* hides browsers password toggles */}
        <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }

