import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="w-full border-b border-border/40 backdrop-blur-sm fixed top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent"
        >
          HackXperience
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#schedule">Schedule</NavLink>
          <NavLink href="#prizes">Prizes</NavLink>
          <NavLink href="#sponsors">Sponsors</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link 
            href="#register" 
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              "hidden sm:block"
            )}
          >
            Register Now
          </Link>
          
          <button className="md:hidden p-2 rounded-md hover:bg-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
} 