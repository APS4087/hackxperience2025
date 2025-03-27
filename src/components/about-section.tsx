import { FaUsers, FaBolt } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { ShineBorder } from "./magicui/shine-border";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming Card is from the UI library

const highlights = [
  "$50,000 in prizes and scholarships",
  "Mentorship from industry experts",
  "Workshops and technical sessions",
  "Networking opportunities with top companies",
  "Free food and swag for all participants",
  "Post-event job and internship opportunities"
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">About HackXperience 2025</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          {/* Card 1 - Build & Innovate */}
          <Card className="relative overflow-hidden">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardHeader>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto">
                <FaCode className="text-red-500 text-3xl" />
              </div>
              <CardTitle className="font-bold text-lg mt-4 text-white">
                Build & Innovate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mt-2 text-white">
                Develop innovative solutions and showcase your skills.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 2 - Connect & Collaborate */}
          <Card className="relative overflow-hidden rounded-xl p-6 shadow-lg border border-border/40 transition-all duration-300">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardHeader>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto">
                <FaUsers className="text-red-500 text-3xl" />
              </div>
              <CardTitle className="font-bold text-lg mt-4 text-white">
                Connect & Collaborate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mt-2 text-white">
                Work in teams of 3 - 5 people.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Card 3 - Learn & Grow */}
          <Card className="relative overflow-hidden rounded-xl p-6 shadow-lg border border-border/40 transition-all duration-300">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardHeader>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto">
                <FaBolt className="text-red-500 text-3xl" />
              </div>
              <CardTitle className="font-bold text-lg mt-4 text-white">
                Learn & Grow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mt-2 text-white">
                Gain exclusive mentorship, workshops, and networking sessions.
              </CardDescription>
            </CardContent>
          </Card>
          

        </div>
      </div>
    </section>
  );
}
