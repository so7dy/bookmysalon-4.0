import { useState } from "react";
import Navigation from '../Navigation';

export default function NavigationExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-20">
      <Navigation 
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
    </div>
  );
}