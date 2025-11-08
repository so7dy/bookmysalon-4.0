interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function LogoOption1({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Tech Scissors - Enhanced design with AI circuit nodes */}
      <svg 
        viewBox="0 0 56 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
      >
        {/* Outer tech ring */}
        <circle 
          cx="28" 
          cy="28" 
          r="24" 
          stroke="currentColor" 
          strokeWidth="2.5"
          className="text-primary"
        />
        
        {/* AI Neural connection points */}
        <circle cx="28" cy="8" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="48" cy="28" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="28" cy="48" r="2.5" fill="currentColor" className="text-primary" />
        <circle cx="8" cy="28" r="2.5" fill="currentColor" className="text-primary" />
        
        {/* Connection lines */}
        <line x1="28" y1="10" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-50" />
        <line x1="46" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-50" />
        <line x1="28" y1="46" x2="28" y2="40" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-50" />
        <line x1="10" y1="28" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-50" />
        
        {/* Scissors blades */}
        <path 
          d="M19 22 L24 28 L19 34" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-foreground"
        />
        <path 
          d="M37 22 L32 28 L37 34" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-foreground"
        />
        
        {/* Center AI core */}
        <circle 
          cx="28" 
          cy="28" 
          r="4" 
          fill="currentColor" 
          className="text-primary"
        />
      </svg>
      
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
