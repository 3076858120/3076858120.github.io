import { useEffect, useRef, useState } from 'react'
import portfolio from './data/portfolio.json'

const Icon = ({ name }) => {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    down: <path d="M12 4v15m0 0 6-6m-6 6-6-6" />,
    up: <path d="M12 20V5m0 0 6 6m-6-6-6 6" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    spark: <path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
    check: <path d="m5 13 4 4L19 7" />,
    pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
    github: <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" fill="currentColor" stroke="none" />,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function SectionTitle({ label, title, text }) {
  return <div className="section-title reveal"><span className="kicker">{label}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
}

function Media({ media }) {
  if (!media || media.type !== 'image') return null
  return <div className="project-media"><img src={media.src} alt={media.alt} loading="lazy" /></div>
}

function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const handleKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [onClose])
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={project.title} onMouseDown={(e) => e.stopPropagation()}>
      <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="关闭"><Icon name="close" /></button>
      <span className="kicker">{project.category} · {project.year}</span><h2>{project.title}</h2>
      <p className="modal-lead">{project.description}</p>
      <div className="detail-grid"><div><b>问题分析</b><p>{project.problem}</p></div><div><b>解决方案</b><p>{project.solution}</p></div></div>
      <div className="detail-block"><b>技术栈</b><div className="chips">{project.technology.map((item) => <span key={item}>{item}</span>)}</div></div>
      <div className="detail-block"><b>成果</b><ul className="result-list">{project.results.map((item) => <li key={item}><Icon name="check" />{item}</li>)}</ul></div>
      <Media media={project.media} />
    </section>
  </div>
}

function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setDisplay(value); return }
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const duration = 1400
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])
  return <span ref={ref} className="stat-value">{display}{suffix}</span>
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }
  return { theme, toggle }
}

function Marquee() {
  const items = [...new Set([
    ...portfolio.skills.programming.slice(0, 4),
    ...portfolio.skills.ai.slice(2),
    ...portfolio.research[0].methods,
    'Stable Diffusion', 'ComfyUI', ...portfolio.skills.analysis.slice(0, 4),
  ])]
  const strip = [...items, ...items]
  return <div className="marquee" aria-hidden="true">
    <div className="marquee-track">{strip.map((item, index) => <span key={index}>{item}<i>✦</i></span>)}</div>
  </div>
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const { theme, toggle } = useTheme()
  const cardRef = useRef(null)
  const navItems = [['关于', '#about'], ['实习', '#experience'], ['科研', '#research'], ['项目', '#projects'], ['创意', '#creative'], ['荣誉', '#awards'], ['联系', '#contact']]
  const scrollTo = (href) => { setMenuOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) }

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const top = window.scrollY
        const height = document.documentElement.scrollHeight - window.innerHeight
        setScrolled(top > 24)
        setProgress(height > 0 ? top / height : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id))
    }, { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('visible')
      const delay = Number.parseInt(entry.target.style.transitionDelay, 10) || 0
      window.setTimeout(() => { entry.target.style.transitionDelay = '0ms' }, delay + 900)
      observer.unobserve(entry.target)
    }), { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onMove = (event) => {
      const card = event.target.closest?.('.spot')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      card.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const tilt = (event) => {
    const card = cardRef.current
    if (!card || window.matchMedia('(pointer: coarse)').matches) return
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`
  }
  const untilt = () => { if (cardRef.current) cardRef.current.style.transform = '' }

  const heroStatement = portfolio.profile.heroStatement
  const highlight = portfolio.profile.heroHighlight
  const [before, after] = highlight && heroStatement.includes(highlight) ? heroStatement.split(highlight) : [heroStatement, '']

  return <>
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
    <div className="ambient ambient-a" /><div className="ambient ambient-b" />
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <a className="wordmark" href="#home" onClick={(e) => { e.preventDefault(); scrollTo('#home') }}>QY<span>.</span></a>
      <nav className="nav" aria-label="页面导航">{navItems.map(([label, href]) => <a key={href} href={href} className={activeSection === href.slice(1) ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo(href) }}>{label}</a>)}</nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggle} aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
        <button className="menu" aria-label="切换导航" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </div>
    </header>
    <div className={menuOpen ? 'menu-panel open' : 'menu-panel'}>
      {navItems.map(([label, href], index) => <a key={href} href={href} style={{ transitionDelay: menuOpen ? `${index * 45 + 120}ms` : '0ms' }} onClick={(e) => { e.preventDefault(); scrollTo(href) }}>{label}</a>)}
    </div>

    <main>
      <section id="home" className="hero page-wrap">
        <div className="hero-copy reveal visible">
          <span className="status-badge"><i />AVAILABLE FOR COLLABORATION</span>
          <h1>{before}{highlight && <em className="gradient-text">{highlight}</em>}{after}</h1>
          <p>{portfolio.profile.intro}</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollTo('#projects')}>查看项目 <Icon name="arrow" /></button>
            <button className="text-button" onClick={() => scrollTo('#research')}>科研工作 <Icon name="down" /></button>
          </div>
          <div className="hero-stats">
            {portfolio.profile.stats.map((stat) => <div key={stat.label}><Counter value={stat.value} suffix={stat.suffix} /><small>{stat.label}</small></div>)}
          </div>
        </div>
        <aside className="profile-orbit reveal visible">
          <div className="orbit-line" />
          <span className="orbit-chip chip-a">Python</span>
          <span className="orbit-chip chip-b">AI Agent</span>
          <span className="orbit-chip chip-c">TVP-VAR</span>
          <div className="identity-card spot" ref={cardRef} onMouseMove={tilt} onMouseLeave={untilt}>
            <div className="monogram">雷</div>
            <span className="identity-status"><i />OPEN TO RESEARCH & BUILD</span>
            <h2>{portfolio.profile.name}</h2>
            <p>{portfolio.profile.title}</p>
            <div className="identity-tags">{portfolio.profile.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="identity-location"><Icon name="pin" />{portfolio.profile.location}</div>
            {portfolio.profile.phone && <a className="identity-location" href={`tel:${portfolio.profile.phone}`}><Icon name="phone" />{portfolio.profile.phone}</a>}
          </div>
          <div className="orbit-label">DATA × AI × REAL WORLD</div>
        </aside>
        <button className="scroll-hint" onClick={() => scrollTo('#about')} aria-label="向下滚动"><span /><Icon name="down" /></button>
      </section>

      <Marquee />

      <section id="about" className="page-wrap section about">
        <SectionTitle label="01 — ABOUT" title="从问题意识出发，走向跨学科实践。" text="以经济管理为基础，以数据、算法和工程实现为工具，持续探索技术如何回应真实问题。" />
        <div className="about-grid">
          <div className="timeline">{portfolio.about.story.map((item, index) => <article className="timeline-item reveal spot" style={{ transitionDelay: `${index * 90}ms` }} key={item.period}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.period}</small><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
          <div className="education-card reveal">
            <span className="kicker">EDUCATION</span>
            {portfolio.about.education.map((item) => <div className="education" key={item.school}><h3>{item.school}</h3><p>{item.degree}</p><small>{item.detail}</small></div>)}
            <div className="skill-groups">{Object.entries(portfolio.skills).map(([group, skills]) => <div key={group}><b>{group.toUpperCase()}</b><p>{skills.join(' · ')}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section id="experience" className="page-wrap section experience">
        <SectionTitle label="02 — INTERNSHIP" title="在业务现场，验证分析与自动化的价值。" />
        <div className="experience-list">{portfolio.experience.map((item) => <article className="experience-row reveal spot" key={item.company}><span>{item.period}</span><div><h3>{item.company}</h3><p>{item.role}</p></div><p className="experience-description">{item.description}</p><div className="chips">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>)}</div>
      </section>

      <section id="research" className="page-wrap section research">
        <SectionTitle label="03 — RESEARCH" title="用模型理解不确定性。" text="研究关注能源安全、政策不确定性与可再生能源采纳；两篇论文分获期刊录用与 SCI 一区期刊在投。" />
        {portfolio.research.map((item, index) => <article className="research-card reveal spot" style={{ transitionDelay: `${index * 90}ms` }} key={item.title}>
          <div className="research-top"><span className="research-index">R / 0{index + 1}</span><span>{item.role}</span></div>
          <h3>{item.title}</h3>
          <div className="research-grid"><div><b>研究背景</b><p>{item.background}</p></div><div><b>研究问题</b><p>{item.question}</p></div><div><b>数据</b><p>{item.data}</p></div><div><b>成果</b><p>{item.outcome}</p></div></div>
          <div className="method-row"><div><b>方法</b><div className="chips">{item.methods.map((x) => <span key={x}>{x}</span>)}</div></div><div><b>创新</b><ul>{item.innovation.map((x) => <li key={x}>{x}</li>)}</ul></div></div>
        </article>)}
      </section>

      <section id="projects" className="page-wrap section projects">
        <SectionTitle label="04 — AI PROJECTS" title="把技术做成可用的解决方案。" text="从真实使用场景出发，完成产品定义、技术选型、原型实现与效果验证。" />
        <div className="project-list">{portfolio.projects.map((project, index) => <article className="project-card reveal spot" style={{ transitionDelay: `${index * 90}ms` }} key={project.id} onClick={() => setActiveProject(project)}>
          <div className="project-card-number">0{index + 1}</div>
          <div className="project-card-main"><span>{project.category} · {project.year}</span><h3>{project.title}</h3><p>{project.description}</p><div className="chips">{project.technology.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div></div>
          <button className="round-button" onClick={(e) => { e.stopPropagation(); setActiveProject(project) }} aria-label={`查看${project.title}详情`}><Icon name="arrow" /></button>
        </article>)}</div>
      </section>

      <section id="creative" className="page-wrap section creative">
        <SectionTitle label="05 — CREATIVE LAB" title="技术之外，也保持视觉与表达的敏感度。" />
        <div className="creative-grid">{portfolio.creative.map((item, index) => <article className="creative-card reveal spot" style={{ transitionDelay: `${index * 90}ms` }} key={item.title}>{item.media?.type === 'video' ? <div className="creative-video"><video src={item.media.src} controls preload="metadata" playsInline muted loop /></div> : <div className={`creative-art art-${index + 1}`}><span>0{index + 1}</span><Icon name="spark" /></div>}<small>{item.type}</small><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      </section>

      <section id="awards" className="page-wrap section awards">
        <SectionTitle label="06 — AWARDS" title="在竞赛中完成协作、决策与交付。" />
        <div className="award-grid">{portfolio.awards.map((item, index) => <article className="award-card reveal spot" style={{ transitionDelay: `${index * 60}ms` }} key={item.name}><span>{item.year}</span><h3>{item.name}</h3><b>{item.level}</b><p>{item.note}</p></article>)}</div>
      </section>

      <section id="contact" className="page-wrap final-section">
        <div className="final-card reveal">
          <span className="kicker">LET'S CONNECT</span>
          <h2>希望在研究、产品与技术的交点，<br />创造下一段值得展开的工作。</h2>
          <p>欢迎通过已约定的渠道联系交流。</p>
          <div className="final-actions">
            {portfolio.profile.github && <a className="primary-button" href={portfolio.profile.github} target="_blank" rel="noreferrer"><Icon name="github" />GitHub</a>}
            <button className="round-button up-button" onClick={() => scrollTo('#home')} aria-label="回到顶部"><Icon name="up" /></button>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <span>© 2026 {portfolio.profile.name} · Personal Digital Portfolio</span>
      <span className="footer-meta">Built with React + Vite · Hosted on GitHub Pages</span>
    </footer>
    <button className={scrolled && progress > 0.08 ? 'back-to-top visible' : 'back-to-top'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="回到顶部"><Icon name="up" /></button>
    {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
  </>
}
