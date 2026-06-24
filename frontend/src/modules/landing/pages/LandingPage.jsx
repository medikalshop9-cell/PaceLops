import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Zap,
  Shield,
  Clock,
  Search,
  Package,
  Truck,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Bell,
  Globe,
} from 'lucide-react'

import s from '../styles/landing.module.css'
import logoMark from '@/assets/images/parcelops_logo_mark.png'
import heroBg from '@/assets/images/hero secion.png'

/* ─────────────────────────────────────────────────────────────────
   ParceLops — Landing Page (Premium)
───────────────────────────────────────────────────────────────── */

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

// ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navigate = useNavigate()

  const handleTransition = (path) => {
    setIsTransitioning(true)
    setTimeout(() => {
      navigate(path)
    }, 1500) // Duration of the truck animation
  }

  return (
    <div className={s.page}>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header className={s.nav}>
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

      <main style={{ flexGrow: 1 }}>

        {/* ══ HERO — full-width background image ══════════════════ */}
        <section className={s.hero} style={{ backgroundImage: `url(${heroBg})` }}>
          <div className={s.heroOverlay} />
          <div className={s.heroContent}>
            <div className={s.heroBadge}>
              <span className={s.badgeDot} />
              <span>Next-Gen Logistics Platform</span>
            </div>

            <h1 className={s.heroTitle}>
              Smart Parcel{' '}
              <span className={s.heroTitleAccent}>Delivery</span>{' '}
              &amp;&nbsp;Management
            </h1>

            <p className={s.heroSub}>
              Track, manage, and deliver with unparalleled precision.
              The next generation of logistics intelligence built for modern operations.
            </p>

            <div className={s.heroCtas}>
              <button onClick={() => handleTransition('/login')} className={s.ctaPrimary}>
                Get Started Free <ArrowRight size={17} />
              </button>
              <a href="#how-it-works" className={s.ctaSecondary}>
                See How It Works
              </a>
            </div>

            <div className={s.heroPills}>
              {[
                { icon: <Zap size={16} />, label: 'Lightning Fast', color: '#fe6b00' },
                { icon: <Shield size={16} />, label: 'Bank-grade Security', color: '#002d62' },
                { icon: <Clock size={16} />, label: 'Real-time Sync', color: '#31a69a' },
              ].map(({ icon, label, color }) => (
                <div key={label} className={s.pill}>
                  <span className={s.pillIcon} style={{ color }}>{icon}</span>
                  <span className={s.pillText}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TRACK ═══════════════════════════════════════════════ */}
        <section className={s.trackSection}>
          <div className={s.trackCard}>
            <h2 className={s.trackTitle}>Track a Parcel</h2>
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
        </section>

        {/* ══ FEATURES ════════════════════════════════════════════ */}
        <section id="features" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <span className={s.eyebrow}>Features</span>
              <h2 className={s.sectionTitle}>Everything You Need to Deliver Excellence</h2>
              <p className={s.sectionSub}>
                A complete suite of tools to manage your entire delivery operation — from first mile to last.
              </p>
            </div>

            <div className={s.carouselTrack}>
              <div className={s.carouselInner}>
                {[...FEATURES, ...FEATURES].map(({ icon, color, bg, title, desc }, i) => (
                  <div key={i} className={s.featureCard}>
                    <div className={s.featureIconWrap} style={{ background: bg, color }}>
                      {icon}
                    </div>
                    <h3 className={s.featureTitle}>{title}</h3>
                    <p className={s.featureDesc}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════ */}
        <section id="how-it-works" className={s.howItWorks}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <span className={s.eyebrowDark}>How It Works</span>
              <h2 className={s.howTitle}>Operational in Minutes</h2>
              <p className={s.howSub}>
                From onboarding to first delivery in three simple steps.
              </p>
            </div>

            <div className={s.stepsRow}>
              {STEPS.map(({ num, color, title, desc }, i) => (
                <div key={num} className={s.stepCard}>
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
        </section>

        {/* ══ STATS ═══════════════════════════════════════════════ */}
        <section className={s.statsStrip}>
          <div className={s.statsGrid}>
            {STATS.map(({ value, label }) => (
              <div key={label} className={s.statItem}>
                <div className={s.statValue}>{value}</div>
                <div className={s.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA BANNER ══════════════════════════════════════════ */}
        <section className={s.ctaBanner}>
          <div className={s.ctaBannerContent}>
            <h2 className={s.ctaBannerTitle}>
              Ready to Transform Your Delivery Operations?
            </h2>
            <p className={s.ctaBannerSub}>
              Join hundreds of businesses delivering smarter, faster, and more reliably with ParceLops.
            </p>
            <div className={s.ctaBannerActions}>
              <button onClick={() => handleTransition('/login')} className={s.ctaBannerPrimary}>
                Start For Free <ArrowRight size={17} />
              </button>
              <a href="#features" className={s.ctaBannerSecondary}>
                <CheckCircle2 size={17} />
                Explore Features
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div className={s.footerBrand}>
            <div className={s.footerLogoRow}>
              <img src={logoMark} alt="ParceLops" className={s.footerLogoImg} />
              <span className={s.footerBrandName}>ParceLops</span>
            </div>
            <span className={s.footerCopy}>© 2025 ParceLops Logistics. All rights reserved.</span>
          </div>
          <ul className={s.footerNav}>
            {FOOTER_LINKS.map(link => (
              <li key={link}><a href="#" className={s.footerLink}>{link}</a></li>
            ))}
          </ul>
        </div>
      </footer>

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