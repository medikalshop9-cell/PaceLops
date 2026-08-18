import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import {
  Zap, Shield, Clock, Search, Package, Truck, BarChart3,
  CheckCircle2, ArrowRight, Menu, X, Bell, Globe
} from 'lucide-react'

import s from '../styles/landing.module.css'
import logoMark from '@/assets/images/parcelops_logo_mark.png'
import heroBg from '@/assets/images/hero secion.png'
import truckVis from '@/assets/images/truck visualisation.png'
import displayImg from '@/assets/images/display.png'
import _3dVis from '@/assets/images/3D visualisation.png'
import trans3d from '@/assets/images/Transparent 3D.png'

gsap.registerPlugin(Observer)

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

const FEATURES = [
  {
    icon: <Package size={24} />,
    color: '#fe6b00',
    bg: 'rgba(254,107,0,0.08)',
    title: 'Smart Parcel Tracking',
    desc: 'Real-time GPS tracking with live status updates for every parcel across your network.',
  },
  {
    icon: <BarChart3 size={24} />,
    color: '#3e5e95',
    bg: 'rgba(62,94,149,0.08)',
    title: 'Analytics Dashboard',
    desc: 'Deep insights into delivery performance, SLA compliance, and operational KPIs.',
  },
  {
    icon: <Truck size={24} />,
    color: '#31a69a',
    bg: 'rgba(49,166,154,0.08)',
    title: 'Fleet Management',
    desc: 'Manage drivers, vehicles, and routes from a single intelligent control centre.',
  },
  {
    icon: <Shield size={24} />,
    color: '#002d62',
    bg: 'rgba(0,45,98,0.08)',
    title: 'Secure Chain of Custody',
    desc: 'Immutable audit logs and digital proof of delivery at every handoff point.',
  },
  {
    icon: <Bell size={24} />,
    color: '#a04100',
    bg: 'rgba(160,65,0,0.08)',
    title: 'Automated Workflows',
    desc: 'Trigger notifications, escalations, and route changes without lifting a finger.',
  },
  {
    icon: <Globe size={24} />,
    color: '#005049',
    bg: 'rgba(0,80,73,0.08)',
    title: 'Multi-region Support',
    desc: 'Operate across cities and countries with localised compliance and time zones.',
  },
]

const STEPS = [
  { num: '01', color: '#fe6b00', title: 'Create Your Account', desc: 'Sign up in seconds — no credit card required.' },
  { num: '02', color: '#002d62', title: 'Add Fleet & Parcels', desc: 'Import existing data or start fresh with guided onboarding.' },
  { num: '03', color: '#31a69a', title: 'Go Live & Deliver', desc: 'Activate live tracking and operate with full visibility.' },
]

const STATS = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '2M+', label: 'Parcels Tracked' },
  { value: '<2s', label: 'Avg. Refresh' },
  { value: '150+', label: 'Enterprise Clients' },
]

const FOOTER_LINKS = ['Terms of Service', 'Privacy Policy', 'Contact Support', 'Help Centre']

// Custom SplitText Component
const SplitText = ({ text }) => {
  return (
    <span style={{ display: 'inline-block' }}>
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className={s.clipText} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {word.split('').map((char, charIndex) => (
            <span key={charIndex} className={`${s.char} split-char`} style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
          {wordIndex !== text.split(' ').length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navigate = useNavigate()
  
  const containerRef = useRef(null)

  useEffect(() => {
    let sections = document.querySelectorAll(`.${s.gsapSection}`)
    let images = document.querySelectorAll(`.${s.gsapBg}`)
    let outerWrappers = gsap.utils.toArray(`.${s.gsapOuter}`)
    let innerWrappers = gsap.utils.toArray(`.${s.gsapInner}`)
    
    let currentIndex = -1
    let wrap = gsap.utils.wrap(0, sections.length)
    let animating = false

    gsap.set(outerWrappers, { yPercent: 100 })
    gsap.set(innerWrappers, { yPercent: -100 })

    function gotoSection(index, direction) {
      index = wrap(index)
      animating = true
      let fromTop = direction === -1
      let dFactor = fromTop ? -1 : 1
      let tl = gsap.timeline({
        defaults: { duration: 1.25, ease: 'power1.inOut' },
        onComplete: () => { animating = false }
      })
      
      if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 })
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
          .set(sections[currentIndex], { autoAlpha: 0 })
      }
      
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 })
      
      let currentChars = sections[index].querySelectorAll('.split-char')
      
      tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
          yPercent: i => i ? -100 * dFactor : 100 * dFactor
        }, { 
          yPercent: 0 
        }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        
      if (currentChars.length > 0) {
        tl.fromTo(currentChars, { 
            autoAlpha: 0, 
            yPercent: 150 * dFactor
        }, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: 'power2',
            stagger: {
              each: 0.02,
              from: 'random'
            }
        }, 0.2)
      } else {
          let content = sections[index].querySelector(`.${s.slideContent}`)
          if (content) {
             tl.fromTo(content, { autoAlpha: 0, y: 50 * dFactor }, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
          }
      }

      currentIndex = index
    }

    let observer = Observer.create({
      target: containerRef.current,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true
    })

    gotoSection(0, 1)

    return () => {
      observer.kill()
    }
  }, [])

  const handleTransition = (path) => {
    setIsTransitioning(true)
    setTimeout(() => {
      navigate(path)
    }, 1500)
  }

  return (
    <div className={s.pageGsap} ref={containerRef}>

      {/* ══ NAV (Fixed on top) ════════════════════════════════════════ */}
      <header className={s.nav} style={{ position: 'fixed', width: '100%', zIndex: 50 }}>
        <div className={s.navInner}>
          <Link to="/" className={s.logo}>
            <span className={s.logoWordmark}>ParceLops</span>
          </Link>

          <ul className={s.navLinks}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className={s.navLink}>{label}</a>
              </li>
            ))}
          </ul>

          <div className={s.navCta}>
            <button onClick={() => handleTransition('/login')} className={s.btnGhost}>Sign In</button>
            <button onClick={() => handleTransition('/login')} className={s.btnAccent}>Get Started</button>
          </div>

          <button
            className={s.mobileToggle}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className={s.mobileMenu}>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className={s.mobileLink} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <div className={s.mobileDivider}>
              <button onClick={() => handleTransition('/login')} className={s.mobileBtnGhost}>Sign In</button>
              <button onClick={() => handleTransition('/login')} className={s.mobileBtnAccent}>Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* ══ SLIDE 1: HERO ════════════════════════════════════════ */}
      <section className={s.gsapSection}>
        <div className={s.gsapOuter}>
          <div className={s.gsapInner}>
            <div className={s.gsapBg} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.4) 100%), url("${heroBg}")` }}>
              <div className={s.slideContent}>
                <div className={s.heroContent} style={{ margin: '0 auto', textAlign: 'center', maxWidth: '800px', padding: '0 2rem' }}>
                  <div className={s.heroBadge} style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                    <span className={s.badgeDot} />
                    <span>Next-Gen Logistics Platform</span>
                  </div>
                  <h1 className={s.heroTitle} style={{ color: 'white', marginBottom: '2rem' }}>
                    <SplitText text="Smart Parcel Delivery & Management" />
                  </h1>
                  <p className={s.heroSub} style={{ color: '#eee', marginBottom: '3rem' }}>
                    Track, manage, and deliver with unparalleled precision.
                    The next generation of logistics intelligence built for modern operations.
                  </p>
                  <div className={s.heroCtas} style={{ justifyContent: 'center' }}>
                    <button onClick={() => handleTransition('/login')} className={s.ctaPrimary}>
                      Get Started Free <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SLIDE 2: TRACK PARCEL ════════════════════════════════════════ */}
      <section className={s.gsapSection}>
        <div className={s.gsapOuter}>
          <div className={s.gsapInner}>
            <div className={s.gsapBg} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.4) 100%), url("${truckVis}")` }}>
              <div className={s.slideContent}>
                <div className={s.trackSection} style={{ margin: '0 auto', width: '100%' }}>
                  <h2 className={s.trackTitle} style={{ color: 'white', marginBottom: '30px', textAlign: 'center', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                    <SplitText text="Track a Parcel" />
                  </h2>
                  <div className={s.trackCard}>
                    <p className={s.trackSub}>Enter your tracking ID for real-time delivery status</p>
                    <div className={s.trackRow}>
                      <div className={s.trackInputWrap}>
                        <Search size={18} className={s.trackIcon} />
                        <input
                          type="text"
                          value={trackingId}
                          onChange={e => setTrackingId(e.target.value)}
                          placeholder="Enter your 16-digit Tracking ID…"
                          className={s.trackInput}
                        />
                      </div>
                      <button className={s.trackBtn}>
                        <Truck size={17} />
                        Track Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SLIDE 3: FEATURES ════════════════════════════════════════ */}
      <section className={s.gsapSection}>
        <div className={s.gsapOuter}>
          <div className={s.gsapInner}>
            <div className={s.gsapBg} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%), url("${displayImg}")` }}>
              <div className={s.slideContent}>
                <div className={s.container}>
                  <div className={s.sectionHeader}>
                    <span className={s.eyebrow}>Features</span>
                    <h2 className={s.sectionTitle} style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                      <SplitText text="Deliver Excellence" />
                    </h2>
                  </div>
                  <div className={s.carouselTrack}>
                    <div className={s.carouselInner}>
                      {[...FEATURES, ...FEATURES].map(({ icon, color, bg, title, desc }, i) => (
                        <div key={i} className={s.featureCard} style={{ background: 'rgba(255,255,255,0.95)' }}>
                          <div className={s.featureIconWrap} style={{ background: bg, color }}>
                            {icon}
                          </div>
                          <h3 className={s.featureTitle} style={{ color: 'var(--navy-deep)' }}>{title}</h3>
                          <p className={s.featureDesc}>{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SLIDE 4: HOW IT WORKS ════════════════════════════════════════ */}
      <section className={s.gsapSection}>
        <div className={s.gsapOuter}>
          <div className={s.gsapInner}>
            <div className={s.gsapBg} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%), url("${_3dVis}")` }}>
              <div className={s.slideContent}>
                <div className={s.container}>
                  <div className={s.sectionHeader}>
                    <span className={s.eyebrowDark}>How It Works</span>
                    <h2 className={s.howTitle} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                      <SplitText text="Operational in Minutes" />
                    </h2>
                  </div>
                  <div className={s.stepsRow}>
                    {STEPS.map(({ num, color, title, desc }, i) => (
                      <div key={num} className={s.stepCard} style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <div className={s.stepNum} style={{ background: color }}>
                          {num}
                        </div>
                        <h3 className={s.stepTitle}>{title}</h3>
                        <p className={s.stepDesc}>{desc}</p>
                        {i < STEPS.length - 1 && (
                          <div className={s.stepConnector}>
                            <ArrowRight size={20} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SLIDE 5: CTA / FOOTER ════════════════════════════════════════ */}
      <section className={s.gsapSection}>
        <div className={s.gsapOuter}>
          <div className={s.gsapInner}>
            <div className={s.gsapBg} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%), url("${trans3d}")` }}>
              <div className={s.slideContent} style={{ justifyContent: 'space-between' }}>
                
                <div style={{ marginTop: 'auto', padding: '0 2rem' }}>
                  <div className={s.statsGrid} style={{ maxWidth: '1100px', margin: '0 auto 4rem', position: 'relative', zIndex: 10 }}>
                    {STATS.map(({ value, label }) => (
                      <div key={label} className={s.statItem}>
                        <div className={s.statValue}>{value}</div>
                        <div className={s.statLabel}>{label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={s.ctaBannerContent} style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 className={s.ctaBannerTitle} style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                      <SplitText text="Ready to Transform?" />
                    </h2>
                    <div className={s.ctaBannerActions} style={{ marginTop: '2.5rem' }}>
                      <button onClick={() => handleTransition('/login')} className={s.ctaBannerPrimary}>
                        Start For Free <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>

                <footer className={s.footer} style={{ background: 'rgba(0,0,0,0.5)', width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className={s.footerInner} style={{ padding: '2rem' }}>
                    <div className={s.footerBrand}>
                      <div className={s.footerLogoRow}>
                        <img src={logoMark} alt="ParceLops" className={s.footerLogoImg} />
                        <span className={s.footerBrandName}>ParceLops</span>
                      </div>
                      <span className={s.footerCopy}>© 2025 ParceLops Logistics. All rights reserved.</span>
                    </div>
                    <ul className={s.footerNav}>
                      {FOOTER_LINKS.map(link => (
                        <li key={link}><a href="#" className={s.footerLink} style={{ color: 'rgba(255,255,255,0.7)' }}>{link}</a></li>
                      ))}
                    </ul>
                  </div>
                </footer>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRANSITION OVERLAY ══════════════════════════════════════ */}
      {isTransitioning && (
        <div className={s.transitionOverlay}>
          <div className={s.transitionTrack}>
            <Truck size={48} className={s.transitionTruck} />
          </div>
        </div>
      )}

    </div>
  )
}