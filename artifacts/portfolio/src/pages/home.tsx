import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import {
  SiCanva,
  SiFigma,
  SiGoogleads,
  SiGoogleanalytics,
  SiInstagram,
  SiMeta,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

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
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#home" className="text-xl font-bold tracking-tighter">
          m<span className="text-primary">.</span>alpi
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <MapPin className="w-3 h-3" /> Surabaya, Indonesia — Open to opportunities
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            I grow brands <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">digitally.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Digital Marketer & IT professional with 5+ years building brand presence across social media, paid ads, and content — backed by a strong technical foundation in networking and accounting.
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Marketing is strategy,<br />not just content.</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              I'm Muhammad Alfi — a Digital Marketer and IT professional from Surabaya. With a background in both Computer Networking (SMK) and Accounting (S1, GPA 3.79), I approach marketing analytically: I don't just create content, I craft systems that drive real results.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Over 5 years across agencies and corporate brands, I've managed multi-platform social media, led paid ad campaigns, built creative assets, and coordinated teams — all while keeping a close eye on data and performance. Adobe Certified Professional. Instinctively technical. Always learning.
            </p>

            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary mb-2">5+</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Years Exp</span>
              </div>
              <div className="w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary mb-2">3</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Projects</span>
              </div>
              <div className="w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary mb-2">5</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Certifications</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10"></div>
              <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                  <div className="text-7xl font-black tracking-tighter text-primary/30 select-none">m.alpi</div>
                  <div className="text-sm text-muted-foreground/50 tracking-widest uppercase font-medium">Muhammad Alfi</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full mix-blend-screen filter blur-[40px] opacity-50"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-500 rounded-full mix-blend-screen filter blur-[50px] opacity-30"></div>

            {/* Certifications badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -right-4 top-12 bg-card border border-border rounded-xl p-4 shadow-xl"
            >
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Certified</div>
              <div className="text-sm font-bold text-foreground">Adobe Professional</div>
              <div className="text-xs text-primary mt-1">ACP 2024</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -left-4 bottom-12 bg-card border border-border rounded-xl p-4 shadow-xl"
            >
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Education</div>
              <div className="text-sm font-bold text-foreground">S1 Accounting</div>
              <div className="text-xs text-primary mt-1">GPA 3.79 / 4.00</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const skillGroups = [
    {
      category: "Digital Marketing",
      skills: [
        { name: "Meta Ads", icon: SiMeta, color: "#0081FB" },
        { name: "Google Ads", icon: SiGoogleads, color: "#4285F4" },
        { name: "Analytics", icon: SiGoogleanalytics, color: "#E37400" },
        { name: "TikTok", icon: SiTiktok, color: "#69C9D0" },
        { name: "Instagram", icon: SiInstagram, color: "#E1306C" },
        { name: "YouTube", icon: SiYoutube, color: "#FF0000" },
      ]
    },
    {
      category: "Design & Creative",
      skills: [
        { name: "Figma", icon: SiFigma, color: "#F24E1E" },
        { name: "Canva", icon: SiCanva, color: "#00C4CC" },
      ]
    }
  ];

  const textSkills = [
    "SEO & SEM Optimization",
    "Social Media Strategy",
    "Copywriting & Content",
    "Paid Ads Management",
    "Data Analytics & Reporting",
    "IT & Networking",
    "Business Administration",
    "Event Coordination",
  ];

  return (
    <section id="skills" className="py-32 bg-card relative border-y border-border/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 items-start justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Tools of the trade.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From campaign strategy to creative execution — I work across the full digital marketing stack. Technically grounded, creatively driven, and data-informed in everything I do.
            </p>
          </div>
        </div>

        <div className="space-y-12 mb-16">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-6">{group.category}</h3>
              <div className="flex flex-wrap gap-4">
                {group.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-colors group"
                  >
                    <skill.icon
                      className="text-2xl text-muted-foreground group-hover:scale-110 transition-all duration-300"
                      style={{ color: skill.color }}
                    />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-6">Core Competencies</h3>
          <div className="flex flex-wrap gap-3">
            {textSkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 rounded-full bg-background border border-border/50 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const projects = [
    {
      title: "BuatCV",
      category: "Web App · 2026",
      description: "An ATS-friendly CV generator built to help Indonesian job seekers create clean, professional resumes that pass applicant tracking systems. Designed with simplicity and local context in mind.",
      image: "/project-1.png",
      tech: ["CV Generator", "ATS Optimized", "Web App"],
      link: "#",
    },
    {
      title: "Dejitaru Shop",
      category: "E-Commerce · 2025–2026",
      description: "An online shop for digital products and needs. Curated digital goods delivered instantly — built to serve a growing market of Indonesian digital consumers looking for fast, reliable access to digital resources.",
      image: "/project-2.png",
      tech: ["E-Commerce", "Digital Products", "Online Shop"],
      link: "#",
    },
    {
      title: "Digital Buddies",
      category: "Consulting · 2023–2024",
      description: "A digital marketing consultancy helping small businesses and entrepreneurs build their online presence — from social media strategy to paid ads, branding, and content creation.",
      image: "/project-3.png",
      tech: ["Digital Marketing", "Social Media", "Consulting"],
      link: "#",
    },
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
            Projects I've built and launched — each one solving a real problem for a real audience.
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
              className={`flex flex-col ${index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} gap-12 md:gap-20 items-center`}
            >
              <div className="w-full md:w-3/5 group">
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 aspect-video">
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%231a1a2e'/%3E%3Ctext x='400' y='225' font-family='sans-serif' font-size='24' fill='%23ffffff' text-anchor='middle' dominant-baseline='middle'%3EProject Preview%3C/text%3E%3C/svg%3E";
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
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
                <Button variant="outline" className="group border-primary/30 hover:bg-primary/10 hover:text-primary transition-all" asChild>
                  <a href={project.link}>
                    View Project <ExternalLink className="ml-2 h-4 w-4 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
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
      role: "Digital Marketing",
      company: "PT Pera Abadi Sentausa",
      period: "Jul 2024 — Present",
      description:
        "Managing the full digital ecosystem for a new construction industry brand — from visual design and copywriting to paid ads, exhibition coordination, and on-site technical sales support.",
    },
    {
      role: "Digital Manager",
      company: "SLC Marketing, Inc.",
      period: "Jan 2020 — Mar 2024",
      description:
        "Led digital strategy for 2 company brands across Facebook, Instagram, Twitter, LinkedIn, TikTok, and YouTube. Managed paid ad campaigns on social media and Google Ads, led the content team, and served as a brand talent for video content.",
    },
  ];

  const education = [
    {
      degree: "S1 Akuntansi",
      institution: "Universitas Wijaya Putra",
      period: "2021 — 2025",
      detail: "GPA 3.79 / 4.00",
    },
    {
      degree: "SMK Teknik Komputer dan Jaringan",
      institution: "SMK Negeri 2 Surabaya",
      period: "2016 — 2019",
      detail: "GPA 3.53 / 4.00",
    },
  ];

  const certs = [
    { name: "Adobe Certified Professional (ACP)", org: "Adobe", year: "2024" },
    { name: "Ujian Standar Keahlian Akuntansi Dasar", org: "IAI Jawa Timur", year: "2025" },
    { name: "Marketing Analyst Academy (MAA) Batch 9", org: "SLC Marketing, Inc.", year: "2022" },
    { name: "Junior Network Administrator", org: "Digitalent VSGA Kominfo", year: "2019" },
    { name: "Junior Networking", org: "BNSP", year: "2019" },
  ];

  return (
    <section id="experience" className="py-32 bg-card relative border-y border-border/50">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Experience.</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* Work Experience */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-8">Work</h3>
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-6 border-l border-border"
                >
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card"></div>
                  <span className="text-muted-foreground font-mono text-xs block mb-2">{exp.period}</span>
                  <h4 className="text-lg font-bold text-foreground mb-1">{exp.role}</h4>
                  <p className="text-primary text-sm font-medium mb-3">{exp.company}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-8">Education</h3>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-6 border-l border-border"
                >
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-card"></div>
                  <span className="text-muted-foreground font-mono text-xs block mb-2">{edu.period}</span>
                  <h4 className="text-lg font-bold text-foreground mb-1">{edu.degree}</h4>
                  <p className="text-primary text-sm font-medium mb-1">{edu.institution}</p>
                  <p className="text-muted-foreground text-xs">{edu.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-8">Certifications</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certs.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="p-4 rounded-xl bg-background border border-border/50 hover:border-primary/40 transition-colors"
              >
                <div className="text-xs text-primary font-mono mb-2">{cert.year}</div>
                <div className="text-sm font-semibold text-foreground mb-1">{cert.name}</div>
                <div className="text-xs text-muted-foreground">{cert.org}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">Let's work together.</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Whether you need a digital marketing strategy, a creative campaign, or someone who gets both the creative and technical side — I'd love to hear about your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-10 text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] rounded-full" asChild>
              <a href="mailto:alpi.muh@gmail.com">
                <Mail className="mr-3 h-5 w-5" /> alpi.muh@gmail.com
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full border-border hover:bg-muted" asChild>
              <a href="https://linkedin.com/in/muhammad-alfi/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-3 h-5 w-5" /> LinkedIn
              </a>
            </Button>
          </div>
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
          m<span className="text-primary">.</span>alpi
        </div>

        <p className="text-muted-foreground text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Muhammad Alfi. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/muhalpi"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/muhammad-alfi/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:alpi.muh@gmail.com"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
