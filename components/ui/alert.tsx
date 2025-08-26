import * as React from "react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <div ref={ref} role="alert" className={classes} {...props} />
    )
  }
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "text-sm [&_p]:leading-relaxed"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <div ref={ref} className={classes} {...props} />
    )
  }
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
