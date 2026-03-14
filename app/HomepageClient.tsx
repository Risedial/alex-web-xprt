'use client'
import { useEffect } from 'react'

export function HomepageClient() {
  useEffect(() => {
    // Enable reveal animations (progressive enhancement)
    document.documentElement.classList.add('js-loaded')

    // ============================================================
    // Mobile nav toggle
    // ============================================================
    const hamburger = document.getElementById('nav-hamburger')
    const mobileMenu = document.getElementById('mobile-menu')

    function closeMobileMenu() {
      if (!hamburger || !mobileMenu) return
      hamburger.setAttribute('aria-expanded', 'false')
      mobileMenu.setAttribute('aria-hidden', 'true')
      mobileMenu.classList.remove('open')
    }

    let hamburgerHandler: (() => void) | null = null
    let outsideClickHandler: ((e: MouseEvent) => void) | null = null
    const mobileLinkHandlers: Array<[Element, () => void]> = []

    if (hamburger && mobileMenu) {
      hamburgerHandler = () => {
        const isOpen = hamburger.getAttribute('aria-expanded') === 'true'
        hamburger.setAttribute('aria-expanded', String(!isOpen))
        mobileMenu.setAttribute('aria-hidden', String(isOpen))
        mobileMenu.classList.toggle('open', !isOpen)
      }
      hamburger.addEventListener('click', hamburgerHandler)

      mobileMenu.querySelectorAll('a').forEach((link) => {
        const handler = () => closeMobileMenu()
        mobileLinkHandlers.push([link, handler])
        link.addEventListener('click', handler)
      })

      outsideClickHandler = (e: MouseEvent) => {
        const nav = document.getElementById('nav')
        if (nav && !nav.contains(e.target as Node)) {
          closeMobileMenu()
        }
      }
      document.addEventListener('click', outsideClickHandler)
    }

    // ============================================================
    // Nav scroll shadow
    // ============================================================
    const nav = document.getElementById('nav')
    let scrollHandler: (() => void) | null = null

    if (nav) {
      scrollHandler = () => {
        nav.classList.toggle('scrolled', window.scrollY > 40)
      }
      window.addEventListener('scroll', scrollHandler, { passive: true })
      scrollHandler()
    }

    // ============================================================
    // Smooth scroll for anchor links
    // ============================================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    const anchorHandlers: Array<[Element, (e: Event) => void]> = []

    anchorLinks.forEach((anchor) => {
      const handler = (e: Event) => {
        const href = anchor.getAttribute('href')
        if (!href) return
        const targetId = href.slice(1)
        if (!targetId) return
        const target = document.getElementById(targetId)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      anchorHandlers.push([anchor, handler])
      anchor.addEventListener('click', handler)
    })

    // ============================================================
    // Active nav link on scroll (IntersectionObserver)
    // ============================================================
    const sectionIds = ['hero', 'services', 'how-it-works', 'portfolio', 'about', 'contact']
    const navLinks = document.querySelectorAll('.nav-link')

    function setActiveLink(sectionId: string) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href')
        if (href === `#${sectionId}`) {
          link.classList.add('active')
        } else {
          link.classList.remove('active')
        }
      })
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) sectionObserver.observe(el)
    })

    // ============================================================
    // Scroll reveal (IntersectionObserver on .reveal elements)
    // ============================================================
    const revealEls = document.querySelectorAll('.reveal')
    const staggerContainers = new Set<Element>()

    revealEls.forEach((el) => {
      if (el.parentElement) staggerContainers.add(el.parentElement)
    })

    staggerContainers.forEach((container) => {
      const siblings = container.querySelectorAll('.reveal')
      siblings.forEach((el, i) => {
        if (i < 3) {
          ;(el as HTMLElement).style.transitionDelay = `${i * 80}ms`
        }
      })
    })

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    revealEls.forEach((el) => revealObserver.observe(el))

    // ============================================================
    // FAQ accordion — one open at a time
    // ============================================================
    const faqItems = document.querySelectorAll('.faq-item')
    const faqHandlers: Array<[Element, () => void]> = []

    faqItems.forEach((item) => {
      const handler = () => {
        if ((item as HTMLDetailsElement).open) {
          faqItems.forEach((other) => {
            if (other !== item && (other as HTMLDetailsElement).open) {
              ;(other as HTMLDetailsElement).removeAttribute('open')
            }
          })
        }
      }
      faqHandlers.push([item, handler])
      item.addEventListener('toggle', handler)
    })

    // ============================================================
    // Contact form: fetch POST to Formspree
    // ============================================================
    const contactForm = document.getElementById('contact-form') as HTMLFormElement | null
    const contactSuccess = document.getElementById('contact-success')
    let submitHandler: ((e: Event) => void) | null = null

    if (contactForm && contactSuccess) {
      submitHandler = async (e: Event) => {
        e.preventDefault()

        const submitBtn = contactForm.querySelector('[type="submit"]') as HTMLButtonElement | null
        if (!submitBtn) return
        const originalText = submitBtn.textContent
        submitBtn.disabled = true
        submitBtn.textContent = 'Sending…'

        function showFormError(form: HTMLFormElement, message: string) {
          let errorEl = form.querySelector('.form-error') as HTMLElement | null
          if (!errorEl) {
            errorEl = document.createElement('p')
            errorEl.className = 'form-error'
            errorEl.setAttribute('role', 'alert')
            const btn = form.querySelector('[type="submit"]')
            if (btn) form.insertBefore(errorEl, btn)
          }
          errorEl.textContent = message
        }

        try {
          const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' },
          })

          if (response.ok) {
            contactForm.hidden = true
            contactSuccess.hidden = false
            contactSuccess.focus()
          } else {
            const data = await response.json().catch(() => ({})) as { errors?: { message: string }[] }
            const msg =
              data?.errors?.map((err) => err.message).join(', ') ||
              'Something went wrong. Please try again or email me directly.'
            showFormError(contactForm, msg)
            submitBtn.disabled = false
            submitBtn.textContent = originalText
          }
        } catch {
          showFormError(
            contactForm,
            'Could not send your message — check your connection and try again.'
          )
          submitBtn.disabled = false
          submitBtn.textContent = originalText
        }
      }
      contactForm.addEventListener('submit', submitHandler)
    }

    // Cleanup
    return () => {
      if (hamburger && hamburgerHandler) hamburger.removeEventListener('click', hamburgerHandler)
      mobileLinkHandlers.forEach(([link, handler]) => link.removeEventListener('click', handler))
      if (outsideClickHandler) document.removeEventListener('click', outsideClickHandler)
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
      anchorHandlers.forEach(([anchor, handler]) =>
        anchor.removeEventListener('click', handler as EventListener)
      )
      sectionObserver.disconnect()
      revealObserver.disconnect()
      faqHandlers.forEach(([item, handler]) => item.removeEventListener('toggle', handler))
      if (contactForm && submitHandler) contactForm.removeEventListener('submit', submitHandler)
    }
  }, [])

  return null
}
