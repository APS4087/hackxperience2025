import { motion } from "framer-motion";
import "./NavbarButton.css";

interface NavbarButtonProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

const NavbarButton = ({ setIsOpen, isOpen }: NavbarButtonProps) => {
  const variants = {
    animate: { y: isOpen ? "-100%" : "0" },
  };

  return (
    <div className="navbarMainButtonDiv">
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        variants={variants}
        transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] }}
        animate="animate"
        className="navbarWrapper"
      >
        <div className="navButton">
          <Button label="menu" />
        </div>

        <div className="navButton">
          <Button label="close" />
        </div>
      </motion.div>
    </div>
  );
};

const Button = ({ label }: { label: string }) => {
  return (
    <div className="navP">
      <p>{label}</p>
      <p>{label}</p>
    </div>
  );
};

export default NavbarButton; 