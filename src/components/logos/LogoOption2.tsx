interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function LogoOption2({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Phone + Calendar - AI Receptionist & Booking */}
      <svg 
        viewBox="0 0 56 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
      >
        {/* Phone handset - black in light mode, white in dark mode */}
        <path 
          d="M16 12 C16 10 17 9 19 9 L24 9 C26 9 27 10 27 12 L27 44 C27 46 26 47 24 47 L19 47 C17 47 16 46 16 44 Z" 
          stroke="currentColor" 
          strokeWidth="2.5"
          fill="none"
          className="text-gray-900 dark:text-white"
        />
        
        {/* Phone speaker */}
        <line x1="19" y1="13" x2="24" y2="13" stroke="currentColor" strokeWidth="1.5" className="text-gray-700 dark:text-gray-300" />
        
        {/* Phone button */}
        <circle cx="21.5" cy="42" r="2" fill="currentColor" className="text-gray-700 dark:text-gray-300" />
        
        {/* Calendar overlay */}
        <rect 
          x="26" 
          y="18" 
          width="22" 
          height="24" 
          rx="2" 
          stroke="currentColor" 
          strokeWidth="2.5"
          fill="currentColor"
          className="text-primary"
          opacity="0.2"
        />
        <rect 
          x="26" 
          y="18" 
          width="22" 
          height="24" 
          rx="2" 
          stroke="currentColor" 
          strokeWidth="2.5"
          fill="none"
          className="text-primary"
        />
        
        {/* Calendar header */}
        <line x1="26" y1="24" x2="48" y2="24" stroke="currentColor" strokeWidth="2" className="text-primary" />
        
        {/* Calendar dots (appointments) */}
        <circle cx="32" cy="30" r="1.5" fill="currentColor" className="text-primary" />
        <circle cx="37" cy="30" r="1.5" fill="currentColor" className="text-primary" />
        <circle cx="42" cy="30" r="1.5" fill="currentColor" className="text-primary" />
        <circle cx="32" cy="35" r="1.5" fill="currentColor" className="text-primary" />
        <circle cx="42" cy="35" r="1.5" fill="currentColor" className="text-primary" />
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
