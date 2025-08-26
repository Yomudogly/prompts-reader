import * as React from "react"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className = "", children, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden"
    const classes = className ? `${baseClasses} ${className}` : baseClasses
    
    return (
      <div ref={ref} className={classes} {...props}>
        <div className="h-full w-full overflow-auto">
          {children}
        </div>
      </div>
    )
  }
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
