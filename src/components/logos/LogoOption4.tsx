interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function LogoOption4({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Salon Chair Silhouette with Tech Elements */}
      <svg 
        viewBox="0 0 56 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
      >
        {/* Chair base */}
        <circle 
          cx="28" 
          cy="46" 
          r="6" 
          fill="currentColor" 
          className="text-foreground"
        />
        
        {/* Chair pole */}
        <rect 
          x="26" 
          y="22" 
          width="4" 
          height="24" 
          fill="currentColor" 
          className="text-foreground"
        />
        
        {/* Chair seat */}
        <ellipse 
          cx="28" 
          cy="22" 
          rx="12" 
          ry="4" 
          fill="currentColor" 
          className="text-foreground"
        />
        
        {/* Chair back */}
        <path 
          d="M16 22 Q16 8 28 8 Q40 8 40 22" 
          stroke="currentColor" 
          strokeWidth="3"
          fill="none"
          className="text-foreground"
        />
        
        {/* AI Tech accent - circuit pattern around chair */}
        <circle 
          cx="28" 
          cy="8" 
          r="3" 
          fill="currentColor" 
          className="text-primary"
        />
        
        {/* Glowing ring effect */}
        <circle 
          cx="28" 
          cy="28" 
          r="20" 
          stroke="currentColor" 
          strokeWidth="2"
          opacity="0.3"
          className="text-primary"
        />
        
        {/* Tech nodes */}
        <circle cx="14" cy="20" r="2" fill="currentColor" className="text-primary" />
        <circle cx="42" cy="20" r="2" fill="currentColor" className="text-primary" />
        <circle cx="28" cy="44" r="2" fill="currentColor" className="text-primary" />
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
