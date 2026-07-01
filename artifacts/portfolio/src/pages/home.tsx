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
import {
  contentDataUrl,
  defaultPortfolioContent,
  type PortfolioContent,
  type SkillItem,
} from "@/lib/portfolio-content";

const skillIconMap = {
  canva: SiCanva,
  figma: SiFigma,
  googleads: SiGoogleads,
  googleanalytics: SiGoogleanalytics,
  instagram: SiInstagram,
  meta: SiMeta,
  tiktok: SiTiktok,
  youtube: SiYoutube,
};

function formatBrandLabel(label: string) {
  const dotIndex = label.indexOf(".");

  if (dotIndex === -1) {
    return label;
  }

  return (
    <>
      {label.slice(0, dotIndex)}
      <span className="text-primary">.</span>
      {label.slice(dotIndex + 1)}
    </>
  );
}

function lineBreakText(text: string) {
  return text.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function mergeContent(content: PortfolioContent): PortfolioContent {
  return {
    ...defaultPortfolioContent,
    ...content,
    navbar: { ...defaultPortfolioContent.navbar, ...content.navbar },
    hero: { ...defaultPortfolioContent.hero, ...content.hero },
    about: { ...defaultPortfolioContent.about, ...content.about },
    skills: { ...defaultPortfolioContent.skills, ...content.skills },
    projects: { ...defaultPortfolioContent.projects, ...content.projects },
    gallery: { ...defaultPortfolioContent.gallery, ...content.gallery },
    experience: { ...defaultPortfolioContent.experience, ...content.experience },
    contact: { ...defaultPortfolioContent.contact, ...content.contact },
    footer: { ...defaultPortfolioContent.footer, ...content.footer },
  };
}

export default function Home() {
  const [content, setContent] =
    useState<PortfolioContent>(defaultPortfolioContent);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let mounted = true;

    fetch(contentDataUrl(), { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Portfolio content could not be loaded.");
        }
        return response.json();
      })
      .then((nextContent: PortfolioContent) => {
        if (mounted) {
          setContent(mergeContent(nextContent));
        }
      })
      .catch(() => {
        if (mounted) {
          setContent(defaultPortfolioContent);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100] bg-gradient-to-r from-[#8c4dff] to-[#19b8ff] shadow-[0_0_22px_rgba(140,77,255,0.58)]"
        style={{ scaleX }}
      />
      <FloatingScrollbar />

      <Navbar content={content.navbar} />

      <main>
        <HeroSection content={content.hero} />
        <AboutSection content={content.about} />
        <SkillsSection content={content.skills} />
        <ProjectsSection content={content.projects} />
        <GallerySection content={content.gallery} />
        <ExperienceSection content={content.experience} />
        <ContactSection content={content.contact} />
      </main>

      <Footer content={content.footer} />
    </div>
  );
}

function FloatingScrollbar() {
  const [scrollbar, setScrollbar] = useState({
    canScroll: false,
    thumbHeight: 0,
    thumbTop: 0,
    visible: false,
  });

  useEffect(() => {
    let scrollIdleTimeout: number | undefined;

    const updateScrollbar = () => {
      const { scrollHeight } = document.documentElement;
      const viewportHeight = window.innerHeight;
      const scrollable = scrollHeight - viewportHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const trackHeight = Math.max(0, viewportHeight - 16);
      const thumbHeight =
        scrollable > 0
          ? Math.max(44, Math.round((viewportHeight / scrollHeight) * trackHeight))
          : 0;
      const thumbTop =
        scrollable > 0 ? progress * Math.max(0, trackHeight - thumbHeight) : 0;

      setScrollbar((current) => ({
        ...current,
        canScroll: scrollable > 0,
        thumbHeight,
        thumbTop,
      }));
    };

    const showScrollbar = () => {
      document.documentElement.classList.add("is-scrolling");
      setScrollbar((current) => ({ ...current, visible: true }));

      if (scrollIdleTimeout) {
        window.clearTimeout(scrollIdleTimeout);
      }

      scrollIdleTimeout = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
        setScrollbar((current) => ({ ...current, visible: false }));
      }, 900);
    };

    const handleScroll = () => {
      updateScrollbar();
      showScrollbar();
    };

    updateScrollbar();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollbar);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollbar);
      document.documentElement.classList.remove("is-scrolling");

      if (scrollIdleTimeout) {
        window.clearTimeout(scrollIdleTimeout);
      }
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className={`floating-scrollbar${
        scrollbar.visible && scrollbar.canScroll ? " is-visible" : ""
      }`}
      style={{
        height: `${scrollbar.thumbHeight}px`,
        transform: `translateY(${scrollbar.thumbTop}px)`,
      }}
    />
  );
}

function Navbar({ content }: { content: PortfolioContent["navbar"] }) {
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
        <a href={content.brandHref} className="text-xl font-bold tracking-tighter">
          {formatBrandLabel(content.brandLabel)}
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {content.links.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button
          variant="outline"
          className="hidden md:flex border-primary/20 hover:bg-primary/10 text-primary"
          asChild
        >
          <a href={content.cta.href}>{content.cta.label}</a>
        </Button>
      </div>
    </header>
  );
}

function HeroSection({ content }: { content: PortfolioContent["hero"] }) {
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
              <MapPin className="w-3 h-3" /> {content.location} - {content.availability}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {content.titlePrefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              {content.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {content.description}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              asChild
            >
              <a href={content.primaryCta.href}>
                {content.primaryCta.label} <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base border-border hover:bg-muted"
              asChild
            >
              <a href={content.secondaryCta.href}>{content.secondaryCta.label}</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ content }: { content: PortfolioContent["about"] }) {
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {lineBreakText(content.heading)}
            </h2>
            {content.paragraphs.map((paragraph, index) => (
              <p
                key={`${paragraph.slice(0, 20)}-${index}`}
                className={`text-muted-foreground text-lg leading-relaxed ${
                  index === content.paragraphs.length - 1 ? "mb-8" : "mb-6"
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="flex gap-6">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="contents">
                  {index > 0 ? <div className="w-px bg-border"></div> : null}
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10"></div>
              <img
                src={content.image}
                alt={content.imageAlt}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full mix-blend-screen filter blur-[40px] opacity-50"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-500 rounded-full mix-blend-screen filter blur-[50px] opacity-30"></div>

            {content.badges.map((badge, index) => (
              <motion.div
                key={`${badge.title}-${index}`}
                initial={{ opacity: 0, x: index === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`absolute ${
                  index === 0
                    ? "-right-4 top-12"
                    : "-left-4 bottom-12"
                } bg-card border border-border rounded-xl p-4 shadow-xl`}
              >
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  {badge.eyebrow}
                </div>
                <div className="text-sm font-bold text-foreground">{badge.title}</div>
                <div className="text-xs text-primary mt-1">{badge.detail}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SkillIcon({ skill }: { skill: SkillItem }) {
  const Icon = skillIconMap[skill.icon as keyof typeof skillIconMap] ?? SiFigma;

  return (
    <Icon
      className="text-2xl text-muted-foreground group-hover:scale-110 transition-all duration-300"
      style={{ color: skill.color }}
    />
  );
}

function SkillsSection({ content }: { content: PortfolioContent["skills"] }) {
  return (
    <section id="skills" className="py-32 bg-card relative border-y border-border/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 items-start justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{content.heading}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>

        <div className="space-y-12 mb-16">
          {content.groups.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-6">
                {group.category}
              </h3>
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
                    <SkillIcon skill={skill} />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-6">
            Core Competencies
          </h3>
          <div className="flex flex-wrap gap-3">
            {content.competencies.map((skill, index) => (
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

function ProjectsSection({ content }: { content: PortfolioContent["projects"] }) {
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{content.heading}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <div className="space-y-32">
          {content.items.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${
                index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-12 md:gap-20 items-center`}
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
                  <span className="text-sm font-mono text-primary uppercase tracking-wider">
                    {project.category}
                  </span>
                  <div className="h-px bg-border flex-grow"></div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">{project.title}</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link ? (
                  <Button
                    variant="outline"
                    className="group border-primary/30 hover:bg-primary/10 hover:text-primary transition-all"
                    asChild
                  >
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project{" "}
                      <ExternalLink className="ml-2 h-4 w-4 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ content }: { content: PortfolioContent["gallery"] }) {
  return (
    <section id="gallery" className="py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{content.heading}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {content.items.map((item, index) => (
            <motion.figure
              key={`${item.src}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group"
            >
              <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-sm text-muted-foreground">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({
  content,
}: {
  content: PortfolioContent["experience"];
}) {
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{content.heading}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-8">
              {content.workLabel}
            </h3>
            <div className="space-y-12">
              {content.work.map((exp, index) => (
                <motion.div
                  key={`${exp.role}-${exp.company}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-6 border-l border-border"
                >
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card"></div>
                  <span className="text-muted-foreground font-mono text-xs block mb-2">
                    {exp.period}
                  </span>
                  <h4 className="text-lg font-bold text-foreground mb-1">{exp.role}</h4>
                  <p className="text-primary text-sm font-medium mb-3">{exp.company}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-8">
              {content.educationLabel}
            </h3>
            <div className="space-y-8">
              {content.education.map((edu, index) => (
                <motion.div
                  key={`${edu.degree}-${edu.institution}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-6 border-l border-border"
                >
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-card"></div>
                  <span className="text-muted-foreground font-mono text-xs block mb-2">
                    {edu.period}
                  </span>
                  <h4 className="text-lg font-bold text-foreground mb-1">{edu.degree}</h4>
                  <p className="text-primary text-sm font-medium mb-1">{edu.institution}</p>
                  <p className="text-muted-foreground text-xs">{edu.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-8">
            {content.certificationsLabel}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {content.certifications.map((cert, index) => (
              <motion.div
                key={`${cert.name}-${cert.year}`}
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

function ContactSection({ content }: { content: PortfolioContent["contact"] }) {
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
          <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">
            {content.heading}
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-10 text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] rounded-full"
              asChild
            >
              <a href={`mailto:${content.email}`}>
                <Mail className="mr-3 h-5 w-5" /> {content.email}
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-10 text-lg rounded-full border-border hover:bg-muted"
              asChild
            >
              <a href={content.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-3 h-5 w-5" /> {content.linkedinLabel}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer({ content }: { content: PortfolioContent["footer"] }) {
  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xl font-bold tracking-tighter">
          {formatBrandLabel(content.brandLabel)}
        </div>

        <p className="text-muted-foreground text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} {content.copyrightName}. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {content.socials.map((social) => {
            const Icon =
              social.type === "github"
                ? Github
                : social.type === "linkedin"
                  ? Linkedin
                  : Mail;

            return (
              <a
                key={`${social.type}-${social.href}`}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
