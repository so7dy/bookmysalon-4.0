interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function LogoOption5({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Chat Bubble + Scissors - Conversation & Salon */}
      <svg 
        viewBox="0 0 56 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
      >
        {/* Chat bubble */}
        <path 
          d="M10 16 C10 12 12 10 16 10 L40 10 C44 10 46 12 46 16 L46 34 C46 38 44 40 40 40 L22 40 L14 46 L14 40 C11 40 10 38 10 34 Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
          fill="currentColor"
          className="text-primary"
          opacity="0.15"
        />
        <path 
          d="M10 16 C10 12 12 10 16 10 L40 10 C44 10 46 12 46 16 L46 34 C46 38 44 40 40 40 L22 40 L14 46 L14 40 C11 40 10 38 10 34 Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
          fill="none"
          className="text-primary"
        />
        
        {/* Scissors inside bubble */}
        {/* Left blade */}
        <circle cx="22" cy="22" r="3" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
        <path d="M22 25 L28 31" stroke="currentColor" strokeWidth="2" className="text-foreground" />
        
        {/* Right blade */}
        <circle cx="34" cy="22" r="3" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground" />
        <path d="M34 25 L28 31" stroke="currentColor" strokeWidth="2" className="text-foreground" />
        
        {/* Scissors pivot */}
        <circle cx="28" cy="31" r="2" fill="currentColor" className="text-foreground" />
        
        {/* AI dots (typing indicator style) */}
        <circle cx="20" cy="32" r="1.5" fill="currentColor" className="text-primary" />
        <circle cx="26" cy="32" r="1.5" fill="currentColor" className="text-primary" />
        <circle cx="32" cy="32" r="1.5" fill="currentColor" className="text-primary" />
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
