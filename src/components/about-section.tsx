import { FaUsers, FaBolt } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import { ShineBorder } from "./magicui/shine-border";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-20 bg-background will-change-transform">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-8 sm:mb-12 px-4"
          style={{ 
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "300% 100%",
            backgroundImage: "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 25%, #ef4444 50%, #e2e8f0 75%, #f1f5f9 100%)",
            filter: "drop-shadow(0 0 20px rgba(226,232,240,0.2))"
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          About HackXperience 2025
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-center">

          {/* Card 1 - Build & Innovate */}
          <Card className="relative overflow-hidden p-4 sm:p-6">
            <ShineBorder 
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} 
              duration={20} 
            />
            <CardHeader className="space-y-2 sm:space-y-4">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 mx-auto">
                <FaCode className="text-red-500 text-2xl sm:text-3xl" />
              </div>
              <CardTitle className="font-bold text-2xl sm:text-3xl md:text-4xl mt-2 sm:mt-4 text-white">
                Build & Innovate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base sm:text-lg mt-1 text-white">
                Develop innovative solutions and showcase your skills!
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 2 - Connect & Collaborate */}
          <Card className="relative overflow-hidden p-4 sm:p-6">
            <ShineBorder 
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} 
              duration={20}
            />
            <CardHeader className="space-y-2 sm:space-y-4">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 mx-auto">
                <FaUsers className="text-red-500 text-2xl sm:text-3xl" />
              </div>
              <CardTitle className="font-bold text-2xl sm:text-3xl md:text-4xl mt-2 sm:mt-4 text-white">
                Connect & Collab
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base sm:text-lg mt-1 text-white">
                Foster collaboration by teamwork, in groups of 3 - 5 people.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 3 - Learn & Grow */}
          <Card className="relative overflow-hidden p-4 sm:p-6">
            <ShineBorder 
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} 
              duration={20}
            />
            <CardHeader className="space-y-2 sm:space-y-4">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 mx-auto">
                <FaBolt className="text-red-500 text-2xl sm:text-3xl" />
              </div>
              <CardTitle className="font-bold text-2xl sm:text-3xl md:text-4xl mt-2 sm:mt-4 text-white">
                Learn & Grow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-base sm:text-lg mt-1 text-white">
                Gain exclusive mentorship, workshops, and networking sessions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
