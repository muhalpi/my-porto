import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, ExternalLink, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SiReact, SiTypescript, SiTailwindcss, SiNextdotjs, SiNodedotjs, SiFramer, SiFigma } from "react-icons/si";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#home" className="text-xl font-bold tracking-tighter">
          J<span className="text-primary">.</span>DEV
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          <a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">Skills</a>
          <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
          <a href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">Experience</a>
        </nav>
        <Button variant="outline" className="hidden md:flex border-primary/20 hover:bg-primary/10 text-primary" asChild>
          <a href="#contact">Let's Talk</a>
        </Button>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              Available for new opportunities
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            I engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">digital experiences</span> that matter.
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Creative developer & designer focused on crafting immersive, high-performance web applications with striking aesthetics and flawless execution.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]" asChild>
              <a href="#projects">View My Work <ChevronRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-border hover:bg-muted" asChild>
              <a href="#contact">Get In Touch</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Design is not just what it looks like.</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              I believe that exceptional digital products require a seamless blend of striking visual design and robust engineering. For the past 5 years, I've been helping startups and established brands translate complex problems into intuitive, beautiful interfaces.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              My approach is rooted in intentionality. Every animation, every color choice, and every line of code serves a purpose. I don't just build websites; I craft digital environments that people actually want to spend time in.
            </p>
            
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary mb-2">5+</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Years Exp</span>
              </div>
              <div className="w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary mb-2">40+</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Projects</span>
              </div>
              <div className="w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary mb-2">12</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Awards</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10"></div>
              {/* Using a placeholder for portrait, standard unplash url removed as per instructions, using a simple geometric shape instead for now since generate_image doesn't support 4:5 */}
              <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[gradient_3s_linear_infinite]"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full mix-blend-screen filter blur-[40px] opacity-50"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-500 rounded-full mix-blend-screen filter blur-[50px] opacity-30"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const skills = [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
    { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  ];

  return (
    <section id="skills" className="py-32 bg-card relative border-y border-border/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 items-start justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Tools of the trade.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              I specialize in modern frontend architectures, leveraging the best tools available to build fast, accessible, and scalable applications. My stack is constantly evolving, but my focus on fundamentals remains unchanged.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-colors group"
            >
              <skill.icon 
                className="text-5xl mb-4 text-muted-foreground group-hover:text-foreground transition-all duration-300 transform group-hover:scale-110" 
                style={{ '--hover-color': skill.color } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const projects = [
    {
      title: "Nexus Dashboard",
      category: "SaaS Application",
      description: "A high-performance analytics dashboard for fintech companies, featuring real-time data visualization, customizable widgets, and a comprehensive design system.",
      image: "/project-1.png",
      tech: ["React", "TypeScript", "Tailwind", "Recharts"],
      link: "#"
    },
    {
      title: "Aura Commerce",
      category: "Mobile Web App",
      description: "A premium e-commerce experience designed for high-end fashion brands. Includes 3D product viewing, seamless checkout, and aggressive performance optimization.",
      image: "/project-2.png",
      tech: ["Next.js", "Framer Motion", "Stripe", "Zustand"],
      link: "#"
    },
    {
      title: "Nova Wallet",
      category: "Web3 Interface",
      description: "A sleek, secure cryptocurrency wallet interface that simplifies complex blockchain interactions without compromising on power user features.",
      image: "/project-3.png",
      tech: ["React", "Ethers.js", "Tailwind", "Radix UI"],
      link: "#"
    }
  ];

  return (
    <section id="projects" className="py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Selected Work.</h2>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            A showcase of recent projects where I was responsible for both design and engineering. Each project presented unique challenges that required innovative solutions.
          </p>
        </motion.div>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <motion.div 
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-20 items-center`}
            >
              <div className="w-full md:w-3/5 group">
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 aspect-video">
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      // Fallback if image not generated yet
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%231a1a2e'/%3E%3Ctext x='400' y='225' font-family='sans-serif' font-size='24' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'%3EProject Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/5">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-mono text-primary uppercase tracking-wider">{project.category}</span>
                  <div className="h-px bg-border flex-grow"></div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">{project.title}</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tech.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
                <Button variant="outline" className="group border-primary/30 hover:bg-primary/10 hover:text-primary transition-all" asChild>
                  <a href={project.link}>
                    View Case Study <ExternalLink className="ml-2 h-4 w-4 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const experiences = [
    {
      role: "Senior Frontend Engineer",
      company: "Studio Void",
      period: "2022 — Present",
      description: "Leading the frontend architecture for high-profile clients. Mentoring junior developers and establishing internal tooling and design system standards."
    },
    {
      role: "UI/UX Designer & Developer",
      company: "Hyperion Tech",
      period: "2020 — 2022",
      description: "Bridged the gap between design and engineering. Designed and built functional prototypes that eventually became core product features."
    },
    {
      role: "Frontend Developer",
      company: "Digital Horizon",
      period: "2018 — 2020",
      description: "Developed interactive marketing sites and e-commerce platforms. Specialized in complex animations and performance optimization."
    }
  ];

  return (
    <section id="experience" className="py-32 bg-card relative border-y border-border/50">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Experience.</h2>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-4 gap-8">
                <div className="md:col-span-1 mb-4 md:mb-0 md:text-right pt-1">
                  <span className="text-muted-foreground font-mono text-sm">{exp.period}</span>
                </div>
                <div className="md:col-span-3 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[-33px] md:left-[-25px] top-2 bottom-[-48px] w-px bg-border hidden md:block"></div>
                  {/* Timeline dot */}
                  <div className="absolute left-[-37px] md:left-[-29px] top-2 w-2 h-2 rounded-full bg-primary ring-4 ring-background hidden md:block"></div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">{exp.role}</h3>
                  <h4 className="text-primary mb-4 font-medium">{exp.company}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">Let's build something extraordinary.</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            I'm currently accepting new projects and open to exciting opportunities. If you have a project in mind or just want to say hi, my inbox is always open.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-10 text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] rounded-full" asChild>
            <a href="mailto:hello@example.com">
              <Mail className="mr-3 h-5 w-5" /> Say Hello
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xl font-bold tracking-tighter">
          J<span className="text-primary">.</span>DEV
        </div>
        
        <p className="text-muted-foreground text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} J.Dev. All rights reserved. Crafted with intent.
        </p>
        
        <div className="flex items-center gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
