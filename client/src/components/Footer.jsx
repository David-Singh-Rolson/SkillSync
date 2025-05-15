import React from "react";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="mt-10 bg-muted p-6 md:px-12 px-4 text-muted-foreground">
      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        {/* Branding */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">SkillSync</h2>
          <p>Your one-stop LMS to learn, grow, and upskill for your dream career.</p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Explore</h3>
          <ul className="space-y-1">
            <li><a href="/courses" className="hover:underline">Courses</a></li>
            <li><a href="/assessments" className="hover:underline">Assessments</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Legal</h3>
          <ul className="space-y-1">
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Connect</h3>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="mailto:contact@skillsync.com">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mt-6 mb-4" />
      <p className="text-xs text-center text-muted-foreground">
        © {new Date().getFullYear()} SkillSync. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
