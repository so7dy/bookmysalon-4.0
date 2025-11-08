interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  showText?: boolean;
}

export default function Logo({ className = "", variant = "full", showText = true }: LogoProps) {
  if (variant === "icon") {
    return (
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Outer circle - represents salon chair/booth */}
        <circle 
          cx="24" 
          cy="24" 
          r="20" 
          stroke="currentColor" 
          strokeWidth="2.5"
          className="text-primary"
        />
        
        {/* AI Brain/Circuit pattern */}
        <path 
          d="M24 8 L24 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          className="text-primary"
        />
        <circle cx="24" cy="14" r="2" fill="currentColor" className="text-primary" />
        
        {/* Scissors blades forming X */}
        <path 
          d="M16 20 L20 24 L16 28 M32 20 L28 24 L32 28" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-foreground"
        />
        
        {/* Center pivot/AI node */}
        <circle 
          cx="24" 
          cy="24" 
          r="3" 
          fill="currentColor" 
          className="text-primary"
        />
        
        {/* Bottom connection - calendar/booking element */}
        <path 
          d="M20 32 L24 36 L28 32" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon */}
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <circle 
          cx="24" 
          cy="24" 
          r="20" 
          stroke="currentColor" 
          strokeWidth="2.5"
          className="text-primary"
        />
        <path 
          d="M24 8 L24 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          className="text-primary"
        />
        <circle cx="24" cy="14" r="2" fill="currentColor" className="text-primary" />
        <path 
          d="M16 20 L20 24 L16 28 M32 20 L28 24 L32 28" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-foreground"
        />
        <circle 
          cx="24" 
          cy="24" 
          r="3" 
          fill="currentColor" 
          className="text-primary"
        />
        <path 
          d="M20 32 L24 36 L28 32" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight">
            Book<span className="text-primary">My</span>Salon
          </span>
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
            AI Receptionist
          </span>
        </div>
      )}
    </div>
  );
}
