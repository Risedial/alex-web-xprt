import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Source_Serif_4 } from 'next/font/google'
import { Monitor, RefreshCw, ShieldCheck, Wrench } from 'lucide-react'
import { HomepageClient } from './HomepageClient'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://alex-web-xprt.vercel.app'),
  title: 'Alex Bitar — Web Design for Small Businesses in Edmonton',
  description:
    'Alex Bitar is a solo web designer in Edmonton helping small and local businesses get professional, affordable websites. Clear pricing, simple process, and support after launch.',
  openGraph: {
    type: 'website',
    title: 'Alex Bitar — Web Design for Small Businesses in Edmonton',
    description: "One person, plain language, and I stick around after it's live.",
    url: 'https://alex-web-xprt.vercel.app',
    images: [{ url: '/images/og-image.png' }],
  },
}

export default function Home() {
  return (
    <div className={plusJakarta.variable + ' ' + sourceSerif.variable}>

      {/* ============================================================
          NAV
      ============================================================ */}
      <header className="nav" id="nav">
        <div className="nav__inner container">

          <a href="#" className="nav__logo" aria-label="Alex Bitar — Home">
            Alex <span className="nav__logo-last">Bitar</span>
          </a>

          {/* Desktop nav links */}
          <nav className="nav__links" aria-label="Primary navigation">
            <a href="#services" className="nav-link">Services</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#portfolio" className="nav-link">Portfolio</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="btn btn-primary nav__cta">Get in touch</a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="nav__hamburger"
            id="nav-hamburger"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="mobile-menu"
          >
            <span className="nav__hamburger-line"></span>
            <span className="nav__hamburger-line"></span>
            <span className="nav__hamburger-line"></span>
          </button>

        </div>

        {/* Mobile menu */}
        <div className="nav__mobile-menu" id="mobile-menu" aria-hidden="true">
          <nav aria-label="Mobile navigation">
            <a href="#services" className="nav__mobile-link">Services</a>
            <a href="#how-it-works" className="nav__mobile-link">How It Works</a>
            <a href="#portfolio" className="nav__mobile-link">Portfolio</a>
            <a href="#about" className="nav__mobile-link">About</a>
            <a href="#contact" className="btn btn-primary nav__mobile-cta">Get in touch</a>
          </nav>
        </div>
      </header>

      {/* ============================================================
          HERO
      ============================================================ */}
      <section id="hero" className="section section--hero">
        <div className="container hero__inner">

          <div className="hero__content">
            <h1 className="hero__headline">You run your business. I&#39;ll handle your website.</h1>
            <p className="hero__subheadline">I work with small and local businesses in Edmonton — one person, plain language, and I stick around after it&#39;s live.</p>
            <div className="hero__ctas">
              <a href="#contact" className="btn btn-primary">Get in touch</a>
              <a href="#portfolio" className="btn btn-ghost">See my work</a>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="browser-mockup">
              <div className="browser-mockup__chrome">
                <div className="browser-mockup__dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="browser-mockup__url-bar"></div>
              </div>
              <div className="browser-mockup__screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/og-image.png"
                  alt="Preview of Alex Bitar's web design work"
                  width={1200}
                  height={630}
                  loading="eager"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SERVICES
      ============================================================ */}
      <section id="services" className="section section--surface">
        <div className="container">

          {/* Section header */}
          <div className="section-header">
            <h2>Here&#39;s exactly what you get</h2>
            <p className="section-intro">Here&#39;s exactly what I build, what&#39;s included, and what it typically costs — no surprises.</p>
          </div>

          {/* Service cards grid */}
          <div className="services-grid">

            {/* Card 1: New Website */}
            <article className="service-card reveal">
              <div className="service-card__icon">
                <Monitor />
              </div>
              <h3 className="service-card__title">New Website</h3>
              <p className="service-card__price">$1,500–$3,500</p>
              <p className="service-card__tagline">A professional website for your business — built from scratch, works on phones, and ready to get you calls.</p>
              <ul className="service-card__list">
                <li>Custom design matched to your business (not a template with your logo slapped on)</li>
                <li>Up to 5 pages — Home, About, Services, Contact, plus one more of your choice</li>
                <li>Mobile-friendly — looks right on phones, tablets, and desktops</li>
                <li>Contact form that sends inquiries straight to your email or phone</li>
                <li>Basic Google setup so people searching for your business can actually find you</li>
                <li>I handle the whole launch — domain, hosting, going live. You don&#39;t touch anything technical</li>
              </ul>
              <p className="service-card__timeline">Usually ready in 2–3 weeks</p>
            </article>

            {/* Card 2: Website Refresh */}
            <article className="service-card reveal">
              <div className="service-card__icon">
                <RefreshCw />
              </div>
              <h3 className="service-card__title">Website Refresh</h3>
              <p className="service-card__price">$1,000–$2,500</p>
              <p className="service-card__tagline">Your current site, but updated — so you&#39;re not embarrassed to share the link anymore.</p>
              <ul className="service-card__list">
                <li>Full redesign of your existing site with a clean, modern look</li>
                <li>Updated content — new photos, current services, correct contact info</li>
                <li>Mobile-friendly layout (if your current site isn&#39;t, this fixes that)</li>
                <li>Speed improvements — if your site is slow, I figure out why and fix it</li>
                <li>Same domain, same address — your customers won&#39;t notice the switch, just the upgrade</li>
              </ul>
              <p className="service-card__timeline">1–2 weeks for most projects</p>
            </article>

            {/* Card 3: Monthly Maintenance */}
            <article className="service-card reveal">
              <div className="service-card__icon">
                <ShieldCheck />
              </div>
              <h3 className="service-card__title">Monthly Maintenance</h3>
              <p className="service-card__price">$75–$150/month</p>
              <p className="service-card__tagline">I keep your site updated, secure, and running — so you never have to think about it.</p>
              <ul className="service-card__list">
                <li>Software and security updates applied every month</li>
                <li>Regular backups of your entire site (if something breaks, I can restore it)</li>
                <li>Small content changes included — new phone number, updated hours, a new photo, a new staff member</li>
                <li>Monthly check that everything is working: forms, links, load speed</li>
                <li>Priority response — if something breaks, you text me and I handle it</li>
              </ul>
              <p className="service-card__timeline">Ongoing — cancel anytime with 30 days notice</p>
            </article>

            {/* Card 4: One-Off Fixes */}
            <article className="service-card reveal">
              <div className="service-card__icon">
                <Wrench />
              </div>
              <h3 className="service-card__title">One-Off Fixes &amp; Updates</h3>
              <p className="service-card__price">$150–$500 per task</p>
              <p className="service-card__tagline">You need something specific fixed or changed on your site — I&#39;ll take care of it without a long-term commitment.</p>
              <ul className="service-card__list">
                <li>Whatever you need done: update content, fix a broken page, add a new section, swap out photos, fix mobile layout issues</li>
                <li>A clear quote before I start — you&#39;ll know exactly what it costs before I touch anything</li>
                <li>Quick turnaround for small changes (usually 1–3 business days)</li>
              </ul>
              <div className="service-card__examples">
                <p className="service-card__examples-label">Common examples:</p>
                <ul className="service-card__examples-list">
                  <li><span>Update text, photos, or contact info</span><strong>$150–$200</strong></li>
                  <li><span>Add a new page or section</span><strong>$200–$400</strong></li>
                  <li><span>Fix a broken form, layout issue, or mobile problem</span><strong>$150–$300</strong></li>
                  <li><span>Speed up a slow site</span><strong>$250–$500</strong></li>
                </ul>
              </div>
              <p className="service-card__timeline">Most fixes done within 1–3 business days</p>
            </article>

          </div>{/* /.services-grid */}

          {/* Comparison table */}
          <div className="comparison-section">
            <h3 className="comparison-title">Hiring me vs. doing it yourself vs. an agency</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">DIY (Wix, Squarespace)</th>
                    <th scope="col" className="comparison-highlight">Me (Solo freelancer)</th>
                    <th scope="col">Agency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Cost</th>
                    <td>$20–$50/month (plus your time)</td>
                    <td className="comparison-highlight">$1,500–$3,500 one-time</td>
                    <td>$5,000–$15,000+</td>
                  </tr>
                  <tr>
                    <th scope="row">Who does the work</th>
                    <td>You</td>
                    <td className="comparison-highlight">I do — you approve</td>
                    <td>A team you&#39;ll rarely talk to directly</td>
                  </tr>
                  <tr>
                    <th scope="row">Timeline</th>
                    <td>Depends on your free time</td>
                    <td className="comparison-highlight">2–3 weeks</td>
                    <td>4–8 weeks (or more)</td>
                  </tr>
                  <tr>
                    <th scope="row">Design</th>
                    <td>Template — looks like everyone else</td>
                    <td className="comparison-highlight">Custom to your business</td>
                    <td>Custom, but built by committee</td>
                  </tr>
                  <tr>
                    <th scope="row">Changes after launch</th>
                    <td>You figure it out</td>
                    <td className="comparison-highlight">You text me, I handle it</td>
                    <td>Submit a ticket, wait in line</td>
                  </tr>
                  <tr>
                    <th scope="row">Who you talk to</th>
                    <td>A help article</td>
                    <td className="comparison-highlight">Me, directly</td>
                    <td>A project manager (maybe)</td>
                  </tr>
                  <tr>
                    <th scope="row">You own everything</th>
                    <td>Sort of — tied to the platform</td>
                    <td className="comparison-highlight">Yes, fully</td>
                    <td>Depends on the contract</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="comparison-honest-take">
              <p><strong>DIY might be right for you if</strong> you have the time, you&#39;re comfortable with technology, and your business doesn&#39;t depend on looking polished online. Wix and Squarespace are solid tools — I won&#39;t pretend otherwise.</p>
              <p><strong>An agency might be right for you if</strong> you need something complex — e-commerce with hundreds of products, a booking system with multiple staff calendars, or a site that integrates with custom business software. That&#39;s not what I do, and I&#39;ll tell you upfront if your project needs more than a solo freelancer.</p>
              <p><strong>I&#39;m the right fit if</strong> you want a professional site without the agency price tag, you want to deal with one person who actually builds the thing, and you don&#39;t want to learn how to update a website yourself. Most small and local businesses land here.</p>
            </div>
          </div>{/* /.comparison-section */}

          {/* FAQ accordion */}
          <div className="faq-section">
            <h3 className="faq-title">Common questions</h3>
            <div className="faq-list">

              <details className="faq-item">
                <summary className="faq-question">What if I need changes after the site is done?</summary>
                <div className="faq-answer">
                  <p>That&#39;s what I&#39;m here for. If you&#39;re on a maintenance plan, small changes are included. If not, I do one-off updates — just tell me what you need and I&#39;ll give you a price before I start. Either way, you&#39;re not stuck.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary className="faq-question">Do I own my website?</summary>
                <div className="faq-answer">
                  <p>Yes, completely. Your domain, your hosting, your content, your code. If you ever want to take your site to someone else, you can — no strings, no fees, no hostage situation.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary className="faq-question">What about hosting?</summary>
                <div className="faq-answer">
                  <p>I&#39;ll set up hosting for you as part of the build. For most small business sites, hosting runs about $10–$20/month. I&#39;ll recommend a reliable, affordable option — you pay the host directly, so you always control the account.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary className="faq-question">How long does it take?</summary>
                <div className="faq-answer">
                  <p>A new site typically takes 2–3 weeks from our first conversation to launch. A refresh is usually 1–2 weeks. The biggest variable is how quickly you can get me your content (photos, text, logo). I won&#39;t hold up your project on my end.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary className="faq-question">What do you need from me?</summary>
                <div className="faq-answer">
                  <p>Your logo (if you have one), any photos you want on the site, and a rough idea of what pages you need. If you don&#39;t have that stuff figured out, I&#39;ll walk you through it — that&#39;s part of the process. You won&#39;t need to write anything or make technical decisions.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary className="faq-question">What if I already have a WordPress site?</summary>
                <div className="faq-answer">
                  <p>I can work with it. If your current site just needs a facelift, I&#39;ll redesign it in place. If it&#39;s beyond saving — slow, bloated with plugins, running on outdated software — I&#39;ll recommend starting fresh and explain why. I&#39;ll look at your site and give you an honest recommendation before you spend a dollar.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary className="faq-question">Can I update the site myself?</summary>
                <div className="faq-answer">
                  <p>If you want to, yes — I can set it up so you can make basic changes. But most of my clients prefer to just text me what they need changed and let me handle it. Either way works.</p>
                </div>
              </details>

            </div>{/* /.faq-list */}
          </div>{/* /.faq-section */}

        </div>{/* /.container */}
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section id="how-it-works" className="section">
        <div className="container">

          <div className="section-header">
            <h2>What happens when you hire me</h2>
            <p className="section-intro">If you&#39;ve never hired a web designer before, here&#39;s what the whole process looks like from first message to launch day.</p>
          </div>

          <div className="process-steps">

            <article className="process-step reveal">
              <div className="process-number" aria-hidden="true">1</div>
              <div className="process-step__content">
                <h3 className="process-step__title">We Talk</h3>
                <p className="process-step__description">Send me a message and tell me what your business needs — that&#39;s the whole first step.</p>
                <p className="process-step__you"><strong>What you do:</strong> Describe your business in your own words. No document or brief required — a quick message or short call is enough.</p>
              </div>
            </article>

            <article className="process-step reveal">
              <div className="process-number" aria-hidden="true">2</div>
              <div className="process-step__content">
                <h3 className="process-step__title">I Send You a Plan</h3>
                <p className="process-step__description">You get a clear outline of what I&#39;ll build and what it&#39;ll cost — no surprises.</p>
                <p className="process-step__you"><strong>What you do:</strong> Read it over, ask any questions, and give me the go-ahead when you&#39;re ready.</p>
              </div>
            </article>

            <article className="process-step reveal">
              <div className="process-number" aria-hidden="true">3</div>
              <div className="process-step__content">
                <h3 className="process-step__title">I Build It</h3>
                <p className="process-step__description">I build your site and share it with you before anything goes live.</p>
                <p className="process-step__you"><strong>What you do:</strong> Look it over and tell me what you&#39;d change. One round of revisions is included — if something&#39;s not right, we fix it.</p>
              </div>
            </article>

            <article className="process-step reveal">
              <div className="process-number" aria-hidden="true">4</div>
              <div className="process-step__content">
                <h3 className="process-step__title">You&#39;re Live — and I&#39;m Still Here</h3>
                <p className="process-step__description">Your site launches, and I stay available for updates and questions after.</p>
                <p className="process-step__you"><strong>What you do:</strong> Nothing, unless you want updates later. If you do, just send me a message.</p>
              </div>
            </article>

          </div>{/* /.process-steps */}

          <p className="process-closing-cta">Ready to get started? <a href="#contact" className="process-closing-cta__link">Send me a message →</a></p>

        </div>{/* /.container */}
      </section>

      {/* ============================================================
          PORTFOLIO
      ============================================================ */}
      <section id="portfolio" className="section section--surface">
        <div className="container">

          <div className="section-header">
            <h2>Real work for real businesses</h2>
            <p className="section-intro">Every site here was built for a real business with a real problem to solve. Read the story behind each one — if it sounds familiar, let&#39;s talk.</p>
          </div>

          <div className="portfolio-grid">

            {/* Card 1: Local plumbing company */}
            <article className="portfolio-card reveal">
              <div className="portfolio-card__frame">
                <div className="portfolio-card__chrome">
                  <div className="browser-mockup__dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="browser-mockup__url-bar"></div>
                </div>
                <div className="portfolio-card__screen" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/portfolio/project-1-desktop.png"
                    alt="Screenshot of the plumbing company website Alex built"
                    width={1440}
                    height={900}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="portfolio-card__content">
                <span className="portfolio-card__label text-label">Local Service Business</span>
                <h3 className="portfolio-card__title">Local plumbing company — Edmonton</h3>
                <p className="portfolio-card__copy">Their old site hadn&#39;t been updated since 2017 and wasn&#39;t showing up when people searched for plumbers in their area.</p>
                <p className="portfolio-card__copy">I built a clean, mobile-friendly site with their services, service area, and a prominent call button on every page.</p>
                <p className="portfolio-card__copy">Within six weeks of launch, they were getting consistent calls from Google — enough that the owner stopped using a third-party lead service.</p>
                <a href="#" className="portfolio-card__link" target="_blank" rel="noopener noreferrer">View the site →</a>
              </div>
            </article>

            {/* Card 2: Health & wellness */}
            <article className="portfolio-card reveal">
              <div className="portfolio-card__frame">
                <div className="portfolio-card__chrome">
                  <div className="browser-mockup__dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="browser-mockup__url-bar"></div>
                </div>
                <div className="portfolio-card__screen" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/portfolio/project-2-desktop.png"
                    alt="Screenshot of the massage therapist website Alex built"
                    width={1440}
                    height={900}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="portfolio-card__content">
                <span className="portfolio-card__label text-label">Health &amp; Wellness</span>
                <h3 className="portfolio-card__title">Local massage therapist — Edmonton</h3>
                <p className="portfolio-card__copy">They had no website and were losing potential clients to competitors who showed up in local search — most bookings were coming through a referral app that charged a cut of every appointment.</p>
                <p className="portfolio-card__copy">I built a clean, welcoming site with their full services and rates, a simple contact form, and clear instructions for booking so new clients could reach them directly.</p>
                <p className="portfolio-card__copy">They filled their schedule within two months of launching and now handle all their bookings without paying a commission to a third party.</p>
                <a href="#" className="portfolio-card__link" target="_blank" rel="noopener noreferrer">View the site →</a>
              </div>
            </article>

          </div>{/* /.portfolio-grid */}

          {/* More projects on the way */}
          <div className="portfolio-more">
            <p className="portfolio-more__heading">More projects on the way.</p>
            <p className="portfolio-more__copy">I add new work here as projects wrap up. In the meantime, reach out — I&#39;m happy to talk through what I&#39;ve built and whether I&#39;m the right fit for what you need.</p>
          </div>

        </div>{/* /.container */}
      </section>

      {/* ============================================================
          ABOUT
      ============================================================ */}
      <section id="about" className="section">
        <div className="container">

          <div className="about-layout">

            <div className="about-content reveal">
              <h2 className="about-headline">I&#39;m Alex</h2>
              <p className="about-transition">Behind every one of those sites is one person: me.</p>

              <div className="about-body">
                <p>I&#39;m Alex Bitar. I build websites for small businesses in Edmonton and across Alberta.</p>
                <p>No agency overhead, no account managers, no runaround. You work directly with me — the person who actually builds your site, answers your messages, and shows up when something needs fixing.</p>
                <p>I&#39;m direct, I respond quickly, and I don&#39;t make things more complicated than they need to be. If you need a site that looks credible, works on a phone, and shows up when customers search — that&#39;s what I build.</p>
              </div>
            </div>

          </div>{/* /.about-layout */}

        </div>{/* /.container */}
      </section>

      {/* ============================================================
          CONTACT
      ============================================================ */}
      <section id="contact" className="section section--dark">
        <div className="container">
          <div className="contact-inner">

            <div className="section-header">
              <h2 className="contact-headline">Let&#39;s talk</h2>
              <p className="contact-intro">If this sounds like what you need, the easiest next step is just sending me a message.</p>
            </div>

            <div className="contact-form-wrap">

              {/* Success message — hidden until form submits */}
              <div className="contact-success" id="contact-success" role="alert" aria-live="polite" hidden>
                <p><strong>Message sent.</strong> I&#39;ll get back to you within one business day.</p>
              </div>

              <form
                className="contact-form"
                id="contact-form"
                action="https://formspree.io/f/mbdzowdp"
                method="POST"
              >

                <div className="form-field">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone" className="form-label">
                    Phone <span className="form-label-optional">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="(780) 555-0123"
                    autoComplete="tel"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-input form-textarea"
                    placeholder="Tell me a bit about your business and what you need."
                    required
                    rows={5}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary contact-submit">Send me a message</button>

              </form>
            </div>{/* /.contact-form-wrap */}

          </div>{/* /.contact-inner */}
        </div>{/* /.container */}
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="footer">
        <div className="footer__inner container">
          <div className="footer__brand">
            <span className="footer__name">Alex Bitar</span>
            <span className="footer__tagline">Web Design for Small Businesses in Edmonton</span>
          </div>
          <nav className="footer__nav" aria-label="Footer navigation">
            <a href="#services" className="footer__link">Services</a>
            <a href="#how-it-works" className="footer__link">How It Works</a>
            <a href="#portfolio" className="footer__link">Portfolio</a>
            <a href="#about" className="footer__link">About</a>
            <a href="#contact" className="footer__link">Contact</a>
          </nav>
        </div>
        <div className="footer__bottom container">
          <p className="footer__copy">© 2026 Alex Bitar · Edmonton, AB</p>
        </div>
      </footer>

      <HomepageClient />
    </div>
  )
}
