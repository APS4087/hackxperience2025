import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Github } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const socialLinks = [
  { href: "https://github.com/SIMITClub", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/company/sim-information-technology-club/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://www.instagram.com/simitclub/", icon: Instagram, label: "Instagram" },
] as const;

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#partners", label: "Partners" },
  { href: "#schedule", label: "Schedule" },
  { href: "#faq", label: "FAQ" },
  { href: "#register", label: "Register" },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 py-16 bg-black/5 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2"
          >
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
              SIMIT Club
            </h3>
            <p className="text-muted-foreground/90 mb-6 max-w-md text-lg">
              Technology-based club at Singapore Institute of Management. We offer workshops, 
              events, and updates from the tech industry.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <SocialLink key={social.label} {...social} />
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="font-bold text-xl bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <FooterLink key={link.label} {...link}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h4 className="font-bold text-xl bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
              Contact Us
            </h4>
            <address className="not-italic space-y-3">
              <div className="text-muted-foreground/90">
                Have questions? Reach out to us at:
              </div>
              <div className="pt-2">
                <a 
                  href="mailto:it@mymail.sim.edu.sg" 
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  <span>it@mymail.sim.edu.sg</span>
                </a>
              </div>
            </address>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative border-t border-border/40 mt-12 pt-8 text-center"
        >
          <p className="text-sm text-muted-foreground/75">
            © {new Date().getFullYear()} SIMIT Club. Empowering Technology Innovation at SIM.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-muted-foreground/90 hover:text-primary transition-all duration-200 hover:translate-x-1 inline-flex items-center space-x-1"
      >
        <span>{children}</span>
      </Link>
    </li>
  );
}

function SocialLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <motion.a 
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2.5 rounded-full bg-primary/5 hover:bg-primary/10 hover:text-primary transition-all duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5" />
    </motion.a>
  );
} 