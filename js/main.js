// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
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
})

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

        // Add archived class if the project is archived
        if (project.archived) {
          projectCard.classList.add('archived')
        }

        // Extract categories from the project's category field
        const categories = project.category
          .split('+')
          .map((cat) => cat.trim().toLowerCase())

        // Store category as data attributes
        projectCard.setAttribute('data-category', project.category)

        // Create project card HTML
        projectCard.innerHTML = `
          <div class="project-image">
            <picture>
              <source srcset="${project.picture}.avif" type="image/avif">
              <source srcset="${project.picture}.webp" type="image/webp">
              <img src="${project.picture}.jpg" alt="${project.title}">
            </picture>
            ${
              project.archived
                ? '<div class="archived-badge">Archived</div>'
                : ''
            }
          </div>
          <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-category">${project.category}</div>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
              ${project.tags
                .map((tag) => `<span class="project-tag">${tag}</span>`)
                .join('')}
            </div>
          </div>
          ${
            !project.archived
              ? `<a href="${project.link}" class="project-link" target="_blank"></a>`
              : ''
          }
        `

        projectsContainer.appendChild(projectCard)
      })

      // Initialize filter functionality
      initProjectFilters()
    })
    .catch((error) => console.error('Error loading projects:', error))
}

// Initialize project filters
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn')
  const projectCards = document.querySelectorAll('.project-card')

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove('active'))

      // Add active class to clicked button
      button.classList.add('active')

      const filter = button.getAttribute('data-filter')

      // Filter projects
      projectCards.forEach((card) => {
        if (filter === 'all') {
          card.style.display = 'block'
        } else {
          const cardCategory = card.getAttribute('data-category')
          if (
            cardCategory
              .toLocaleLowerCase()
              .includes(filter.toLocaleLowerCase())
          ) {
            card.style.display = 'block'
          } else {
            card.style.display = 'none'
          }
        }

        // Animate visible cards
        if (card.style.display === 'block') {
          anime({
            targets: card,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo',
          })
        }
      })
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
        let icon = ''
        if (social.id.includes('mail')) {
          icon = 'fas fa-envelope'
        } else if (social.id.includes('telegram')) {
          icon = 'fa-telegram'
        } else if (social.id.includes('discord')) {
          icon = 'fa-discord'
        } else if (social.id.includes('github')) {
          icon = 'fa-github'
        }

        socialLink.innerHTML = `
          <i class="fab ${icon}"></i>
          <div class="social-link-content">
            <div class="social-link-title">${social.title}</div>
            <div class="social-link-description">${social.description}</div>
          </div>
        `

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
