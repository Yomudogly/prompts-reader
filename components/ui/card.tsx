import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "rounded-lg border bg-card text-card-foreground shadow-sm"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <div ref={ref} className={classes} {...props} />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "flex flex-col space-y-1.5 p-6"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <div ref={ref} className={classes} {...props} />
    )
  }
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "text-2xl font-semibold leading-none tracking-tight"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <h3 ref={ref} className={classes} {...props} />
    )
  }
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "text-sm text-muted-foreground"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <p ref={ref} className={classes} {...props} />
    )
  }
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "p-6 pt-0"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <div ref={ref} className={classes} {...props} />
    )
  }
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "flex items-center p-6 pt-0"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <div ref={ref} className={classes} {...props} />
    )
  }
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
