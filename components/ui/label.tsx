import * as React from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <label ref={ref} className={classes} {...props} />
    )
  }
)
Label.displayName = "Label"

export { Label }
