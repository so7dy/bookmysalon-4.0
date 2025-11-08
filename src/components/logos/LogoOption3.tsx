interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function LogoOption3({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Minimalist Geometric - B+S Letterform */}
      <svg 
        viewBox="0 0 56 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
      >
        {/* Outer square frame */}
        <rect 
          x="8" 
          y="8" 
          width="40" 
          height="40" 
          rx="8"
          stroke="currentColor" 
          strokeWidth="2.5"
          className="text-primary"
        />
        
        {/* B shape (Book) - left side */}
        <path 
          d="M18 18 L18 38 M18 18 L26 18 C28.5 18 30 19.5 30 22 C30 24.5 28.5 26 26 26 L18 26 M18 26 L27 26 C29.5 26 31 27.5 31 30 C31 32.5 29.5 34 27 34 L18 34" 
          stroke="currentColor" 
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        />
        
        {/* S shape (Salon) - right side with primary color */}
        <path 
          d="M35 20 C37 18 40 18 42 20 C44 22 44 24 42 26 C40 28 36 28 34 30 C32 32 32 34 34 36 C36 38 39 38 41 36" 
          stroke="currentColor" 
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
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
