// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme()

  // Initialize animations
  initAnimations()

  // Initialize mobile menu
  initMobileMenu()

  // Initialize LMF meaning animation
  initLMFMeaning()

  // Initialize profile image cycling
  initProfileImageCycling()

  // Set current year in footer
  setCurrentYear()

  // Load dynamic content
  loadProjects()
  loadPartners()
  loadSocialLinks()

  // Initialize scroll animations
  initScrollAnimations()

  // Initialize magnetic buttons
  initMagneticButtons()
})

// Theme management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const savedTheme = localStorage.getItem('theme')

  // Set initial theme
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme)
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }

  // Update icon based on theme
  updateThemeIcon()

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    updateThemeIcon()

    // Add rotation animation
    themeToggle.style.transform = 'rotate(360deg)'
    setTimeout(() => {
      themeToggle.style.transform = ''
    }, 400)
  })
}

function updateThemeIcon() {
  const themeToggle = document.getElementById('theme-toggle')
  const currentTheme = document.documentElement.getAttribute('data-theme')

  if (currentTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  }
}

// Initialize animations with Anime.js
function initAnimations() {
  // Hero section animations
  anime({
    targets: '.animate-text',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutExpo',
    delay: anime.stagger(100),
  })

  anime({
    targets: '.animate-image',
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 800,
    easing: 'easeOutExpo',
    delay: 300,
  })

  // Animate skill tags
  anime({
    targets: '.skill-tag',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    easing: 'easeOutExpo',
    delay: anime.stagger(50),
  })

  // Animate project cards
  anime({
    targets: '.project-card',
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 800,
    easing: 'easeOutExpo',
    delay: anime.stagger(100),
  })

  // Animate partner cards
  anime({
    targets: '.partner-card',
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 600,
    easing: 'easeOutExpo',
    delay: anime.stagger(100),
  })

  // Animate social links
  anime({
    targets: '.social-link',
    opacity: [0, 1],
    translateX: [-20, 0],
    duration: 600,
    easing: 'easeOutExpo',
    delay: anime.stagger(100),
  })
}

// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle')
  const navLinks = document.querySelector('.nav-links')

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active')
    navLinks.classList.toggle('active')
  })

  // Close menu when clicking on a link
  const links = document.querySelectorAll('.nav-links a')
  links.forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active')
      navLinks.classList.remove('active')
    })
  })
}

// Load projects from JSON
function loadProjects() {
  fetch('data/projects.json')
    .then((response) => response.json())
    .then((data) => {
      const projectsContainer = document.getElementById('projects-container')

      data.forEach((project) => {
        const projectCard = document.createElement('div')
        projectCard.className = 'project-card'

        if (project.archived) {
          projectCard.classList.add('archived')
        }

        projectCard.setAttribute('data-category', project.category)

        projectCard.innerHTML = `
          <div class="project-image">
            <picture>
              <source srcset="${project.picture}.avif" type="image/avif">
              <source srcset="${project.picture}.webp" type="image/webp">
              <img src="${project.picture}.jpg" alt="${project.title}">
            </picture>
            ${project.archived ? '<div class="archived-badge">Archived</div>' : ''}
          </div>
          <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-category">${project.category}</div>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
          </div>
          ${!project.archived ? '<div class="project-overlay"><span>Click to preview</span></div>' : ''}
        `

        if (!project.archived) {
          projectCard.addEventListener('click', (e) => {
            e.preventDefault()
            openProjectModal(project, projectCard)
          })
          projectCard.style.cursor = 'pointer'
        }

        projectsContainer.appendChild(projectCard)
      })

      initProjectFilters()
      initProjectModal()
    })
    .catch((error) => console.error('Error loading projects:', error))
}

function initProjectModal() {
  const modal = document.getElementById('project-modal')
  const closeBtn = document.querySelector('.close-modal')

  if (!modal || !closeBtn) return

  const closeModal = () => {
    // Morph back or just fade? Fading back is usually safer and clean.
    anime({
      targets: '#project-modal',
      opacity: 0,
      duration: 300,
      easing: 'easeInQuad',
      complete: () => {
        modal.style.display = 'none'
        document.body.style.overflow = 'auto'
        // Reset modal content styles
        const modalContent = document.querySelector('.modal-content')
        modalContent.style.transform = ''
        modalContent.style.opacity = ''
      }
    })
  }

  closeBtn.onclick = closeModal

  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal()
    }
  }

  // Handle Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal()
    }
  })
}

function openProjectModal(project, cardElement) {
  const modal = document.getElementById('project-modal')
  const modalContent = document.querySelector('.modal-content')
  const modalImage = document.getElementById('modal-image')
  const modalTitle = document.getElementById('modal-title')
  const modalCategory = document.getElementById('modal-category')
  const modalDescription = document.getElementById('modal-description')
  const modalTags = document.getElementById('modal-tags')
  const modalLink = document.getElementById('modal-link')

  if (!modal || !modalContent) return

  // 1. Populate data FIRST
  modalImage.src = `${project.picture}.jpg`
  modalImage.alt = project.title
  modalTitle.textContent = project.title
  modalCategory.textContent = project.category
  modalDescription.textContent = project.description
  modalTags.innerHTML = project.tags
    .map((tag) => `<span class="project-tag">${tag}</span>`)
    .join('')
  modalLink.href = project.link

  // 2. Prepare Morphing
  const cardRect = cardElement.getBoundingClientRect()

  // Show modal container but hide content for measurement
  modal.style.display = 'flex'
  modal.style.opacity = '0'
  modalContent.style.opacity = '0'
  modalContent.style.transform = 'none' // Reset any previous transforms
  document.body.style.overflow = 'hidden'

  // Use requestAnimationFrame to ensure layout has happened
  requestAnimationFrame(() => {
    const finalRect = modalContent.getBoundingClientRect()

    // 3. Calculate scales and positions
    const scaleX = cardRect.width / finalRect.width
    const scaleY = cardRect.height / finalRect.height
    const translateX = (cardRect.left + cardRect.width / 2) - (finalRect.left + finalRect.width / 2)
    const translateY = (cardRect.top + cardRect.height / 2) - (finalRect.top + finalRect.height / 2)

    // Set initial morphed state using anime.set for better property tracking
    anime.set(modalContent, {
      translateX: translateX,
      translateY: translateY,
      scaleX: scaleX,
      scaleY: scaleY,
      opacity: 1
    })

    // Animate Background Fade In
    anime({
      targets: modal,
      opacity: 1,
      duration: 400,
      easing: 'linear'
    })

    // Animate Content Morph (Scale & Position)
    anime({
      targets: modalContent,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 800,
      easing: 'spring(1, 85, 14, 0)'
    })

    // Animate internal elements fade in
    anime({
      targets: [modalImage, modalTitle, modalCategory, modalDescription, modalTags, modalLink],
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(60, { start: 200 }),
      duration: 600,
      easing: 'easeOutExpo'
    })
  })
}

// Initialize project filters
// Initialize project filters with smooth animated reordering
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn')
  const projectCards = Array.from(document.querySelectorAll('.project-card'))

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Don't do anything if clicking already active button
      if (button.classList.contains('active')) return

      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove('active'))
      // Add active class to clicked button
      button.classList.add('active')

      const filter = button.getAttribute('data-filter')

      // Identify which cards will hide, show, or stay
      const cardsToHide = []
      const cardsToShow = []
      const cardsToStay = []

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category').toLowerCase()
        const shouldShow =
          filter === 'all' || category.includes(filter.toLowerCase())
        const isCurrentlyVisible =
          window.getComputedStyle(card).display !== 'none'

        // Add a class to disable CSS transitions during animation
        card.classList.add('filtering')

        if (shouldShow && !isCurrentlyVisible) {
          cardsToShow.push(card)
        } else if (!shouldShow && isCurrentlyVisible) {
          cardsToHide.push(card)
        } else if (shouldShow && isCurrentlyVisible) {
          cardsToStay.push(card)
        }
      })

      // Record "First" positions of cards that stay
      const stayPositions = cardsToStay.map((card) => {
        return {
          card,
          rect: card.getBoundingClientRect(),
        }
      })

      // Animate OUT cards that are hiding
      if (cardsToHide.length > 0) {
        anime({
          targets: cardsToHide,
          opacity: 0,
          scale: 0.8,
          translateY: 20,
          duration: 300,
          easing: 'easeInQuad',
          complete: () => {
            cardsToHide.forEach((card) => {
              card.style.display = 'none'
            })
            performLayoutTransition()
          },
        })
      } else {
        performLayoutTransition()
      }

      function performLayoutTransition() {
        // Show "new" cards (but keep them invisible for now)
        cardsToShow.forEach((card) => {
          card.style.display = 'block'
          // Reset any previous transforms and set initial state
          anime.set(card, {
            translateX: 0,
            translateY: 0,
            scale: 0.8,
            opacity: 0,
          })
          // We'll use translateY: 20 in the actual animation
        })

        // Record "Last" positions of cards that stay
        const stayAnimations = stayPositions.map((pos) => {
          const lastRect = pos.card.getBoundingClientRect()
          const dx = pos.rect.left - lastRect.left
          const dy = pos.rect.top - lastRect.top

          return {
            card: pos.card,
            dx,
            dy,
          }
        })

        // "Invert" and "Play" for staying cards
        stayAnimations.forEach((anim) => {
          anime.set(anim.card, {
            translateX: anim.dx,
            translateY: anim.dy,
          })

          anime({
            targets: anim.card,
            translateX: 0,
            translateY: 0,
            duration: 600,
            easing: 'spring(1, 80, 15, 0)',
            complete: () => {
              anim.card.classList.remove('filtering')
            },
          })
        })

        // Animate IN new cards
        if (cardsToShow.length > 0) {
          anime({
            targets: cardsToShow,
            opacity: [0, 1],
            scale: [0.8, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(60),
            complete: (anim) => {
              anim.animatables.forEach((item) => {
                item.target.classList.remove('filtering')
              })
            },
          })
        }

        // If no cards were animated, make sure to remove filtering class
        if (stayAnimations.length === 0 && cardsToShow.length === 0) {
          projectCards.forEach((card) => card.classList.remove('filtering'))
        }
      }
    })
  })
}

// Load partners from JSON
function loadPartners() {
  fetch('data/partners.json')
    .then((response) => response.json())
    .then((data) => {
      const partnersContainer = document.getElementById('partners-container')

      data.forEach((partner) => {
        // Skip archived partners
        if (partner.archived) {
          return
        }

        const partnerCard = document.createElement('div')
        partnerCard.className = 'partner-card'

        // Create partner card HTML with conditional rendering for video or image
        let mediaContent = ''
        if (partner.video) {
          mediaContent = `
            <div class="partner-logo">
              <video autoplay loop muted playsinline>
                <source src="${partner.video}" type="video/webm">
                Your browser does not support the video tag.
              </video>
            </div>
          `
        } else if (partner.image) {
          // Check if the image is an SVG (no need for modern formats)
          if (partner.image.endsWith('.svg')) {
            mediaContent = `
              <div class="partner-logo">
                <img src="${partner.image}" alt="${partner.title}">
              </div>
            `
          } else {
            // For non-SVG images, use picture element with modern formats
            const baseImagePath = partner.image.replace(/\.(jpg|jpeg|png)$/, '')
            mediaContent = `
              <div class="partner-logo">
                <picture>
                  <source srcset="${baseImagePath}.avif" type="image/avif">
                  <source srcset="${baseImagePath}.webp" type="image/webp">
                  <img src="${partner.image}" alt="${partner.title}">
                </picture>
              </div>
            `
          }
        }

        partnerCard.innerHTML = `
                    ${mediaContent}
                    <h3 class="partner-title">${partner.title}</h3>
                    <p class="partner-description">${partner.description}</p>
                    <a href="${partner.link}" class="partner-link" target="_blank">Visit Website</a>
                `

        partnersContainer.appendChild(partnerCard)
      })
    })
    .catch((error) => console.error('Error loading partners:', error))
}

// Load social links from JSON
function loadSocialLinks() {
  fetch('data/socials.json')
    .then((response) => response.json())
    .then((data) => {
      const socialLinksContainer = document.getElementById(
        'connect-links-container'
      )

      data.forEach((social) => {
        const socialLink = document.createElement('a')
        socialLink.className = 'social-link'
        socialLink.href = social.link
        socialLink.target = '_blank'

        // Determine the icon based on the social platform
        let iconClass = ''
        if (social.id.includes('mail')) {
          iconClass = 'fas fa-envelope'
        } else if (social.id.includes('telegram')) {
          iconClass = 'fab fa-telegram'
        } else if (social.id.includes('discord')) {
          iconClass = 'fab fa-discord'
        } else if (social.id.includes('github')) {
          iconClass = 'fab fa-github'
        }

        socialLink.innerHTML = `
          <i class="${iconClass}"></i>
          <div class="social-link-content">
            <div class="social-link-title">${social.title}</div>
            <div class="social-link-description">${social.description}</div>
          </div>
        `

        // Add platform data attribute for styling
        if (social.id.includes('mail')) socialLink.setAttribute('data-platform', 'mail');
        else if (social.id.includes('telegram')) socialLink.setAttribute('data-platform', 'telegram');
        else if (social.id.includes('discord')) socialLink.setAttribute('data-platform', 'discord');
        else if (social.id.includes('github')) socialLink.setAttribute('data-platform', 'github');

        socialLinksContainer.appendChild(socialLink)
      })
    })
    .catch((error) => console.error('Error loading social links:', error))
}

// Initialize scroll animations
function initScrollAnimations() {
  // Header scroll effect
  const header = document.querySelector('header')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }
  })

  // Active navigation link based on scroll position
  const sections = document.querySelectorAll('section')
  const navLinks = document.querySelectorAll('.nav-links a')

  window.addEventListener('scroll', () => {
    let current = ''

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id')
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove('active')
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active')
      }
    })
  })

  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      '.section-title, .about-text p, .skill-tags, .project-card, .partner-card, .social-link'
    )

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 100) {
        if (!element.classList.contains('animated')) {
          element.classList.add('animated')

          anime({
            targets: element,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
          })
        }
      }
    })
  }

  window.addEventListener('scroll', animateOnScroll)
  animateOnScroll() // Initial check

  // Add spotlight effect to sections
  const spotlightSections = document.querySelectorAll('.partners, .socials')
  spotlightSections.forEach(section => {
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      section.style.setProperty('--mouse-x', `${x}px`)
      section.style.setProperty('--mouse-y', `${y}px`)
    })
  })
}

// LMF Meaning Animation
function initLMFMeaning() {
  const meanings = [
    "Logge's Modern Frontier",
    "Logge's Media Factory",
    'Learning Made Fun',
    'Limitless Mind Factory',
    "Let's Make Future",
  ]
  const lmfElement = document.getElementById('lmf-meaning')
  let currentIndex = 0
  let isTyping = false
  let currentText = ''
  let currentWordIndex = 0
  let currentCharIndex = 0
  let typingSpeed = 50 // milliseconds per character

  function typeWriter() {
    if (isTyping) {
      const meaning = meanings[currentIndex]
      const words = meaning.split(' ')

      if (currentWordIndex < words.length) {
        const word = words[currentWordIndex]

        if (currentCharIndex === 0) {
          // Start of a new word, add the first letter with highlight
          currentText += `<span class="highlight">${word.charAt(0)}</span>`
          currentCharIndex = 1
        } else if (currentCharIndex < word.length) {
          // Continue typing the rest of the word
          currentText += word.charAt(currentCharIndex)
          currentCharIndex++
        } else {
          // Word is complete, add space and move to next word
          currentText += ' '
          currentWordIndex++
          currentCharIndex = 0
        }

        lmfElement.innerHTML = currentText
        setTimeout(typeWriter, typingSpeed)
      } else {
        // All words are typed, pause before erasing
        isTyping = false
        setTimeout(eraseText, 2000) // Pause for 2 seconds before erasing
      }
    }
  }

  function eraseText() {
    if (!isTyping) {
      if (currentText.length > 0) {
        // Remove one character at a time
        currentText = currentText.slice(0, -1)
        lmfElement.innerHTML = currentText
        setTimeout(eraseText, typingSpeed / 2) // Erase faster than typing
      } else {
        // Text is completely erased, move to next meaning
        currentIndex = (currentIndex + 1) % meanings.length
        currentWordIndex = 0
        currentCharIndex = 0
        isTyping = true
        setTimeout(typeWriter, 500) // Short pause before starting to type again
      }
    }
  }

  // Start the typewriter animation
  isTyping = true
  typeWriter()
}

// Profile Image Cycling Animation
function initProfileImageCycling() {
  const images = document.querySelectorAll('.profile-image')
  let currentIndex = 0

  function cycleImages() {
    // Remove active class from current image
    images[currentIndex].classList.remove('active')

    // Update index to next image
    currentIndex = (currentIndex + 1) % images.length

    // Add active class to new image
    images[currentIndex].classList.add('active')
  }

  // Change image every 5 seconds
  setInterval(cycleImages, 5000)
}

// Set current year in footer
function setCurrentYear() {
  const yearElement = document.getElementById('current-year')
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear()
  }
}

// Magnetic Buttons Effect
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn')

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`
    })

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)'
    })
  })
}
