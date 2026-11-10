// Data loader for all JSON data files

document.addEventListener('DOMContentLoaded', () => {
  // Load all data
  Promise.all([
    fetch('data/profile.json').then(res => res.json()),
    fetch('data/navigation.json').then(res => res.json()),
    fetch('data/about.json').then(res => res.json()),
    fetch('data/resume.json').then(res => res.json()),
    fetch('data/portfolio.json').then(res => res.json()),
    fetch('data/interests.json').then(res => res.json()),
    fetch('data/honors.json').then(res => res.json()),
    fetch('data/contact.json').then(res => res.json())
  ])
  .then(([profileData, navigationData, aboutData, resumeData, portfolioData, interestsData, honorsData, contactData]) => {
    // Load profile data (Sidebar and Mobile Header)
    loadProfileData(profileData);
    
    // Load navigation (Main Tabs)
    loadNavigation(navigationData); 
    
    // Load content sections
    loadAboutSection(aboutData);
    loadResumeSection(resumeData);
    loadInterestsSection(interestsData);
    loadSkillsPage(resumeData);
    loadHonorsSection(honorsData);
    loadContactSection(contactData);
    
    // Set footer
    loadFooter(profileData.footer);
    
    // Reinitialize tab navigation AFTER data and buttons are loaded
    if (typeof setupTabNavigation === 'function') {
      setupTabNavigation();
    }

    // Debug log to check if skills data exists
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
  
  // Load profile data into sidebar and mobile header/menu
  function loadProfileData(data) {
    // Name and Title (Sidebar & Mobile Header)
    document.querySelectorAll('.sidebar .name, .mobile-profile .name').forEach(el => {
      el.textContent = data.name;
    });
    document.querySelectorAll('.sidebar .title, .mobile-profile .title').forEach(el => {
      el.textContent = data.title;
    });
    
    // Avatar (Sidebar & Mobile Header)
    document.querySelectorAll('.sidebar .avatar img, .mobile-profile img').forEach(el => {
      el.src = data.avatar;
      el.alt = data.name ? `${data.name}'s profile picture` : 'Profile picture'; 
    });
    
    // Contact info (Sidebar)
    const contactInfoContainerSidebar = document.querySelector('.sidebar .contact-info');
    if (contactInfoContainerSidebar) {
      contactInfoContainerSidebar.innerHTML = '';
      data.contactInfo.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        // Extra numbers: "a / b" on the original-design pages, one per line in the redesigned sidebar
        const [primary, ...extra] = item.text.split(' / ');
        const extraHTML = extra.map(x => `<span class="contact-extra"><span class="contact-sep"> / </span>${x}</span>`).join('');
        infoItem.innerHTML = `
          <i class="${item.icon}"></i>
          <span>${primary}${extraHTML}</span>
        `;
        contactInfoContainerSidebar.appendChild(infoItem);
      });
    }

    // Contact info (Mobile Menu)
    const contactInfoContainerMobileMenu = document.querySelector('.mobile-contact-info');
    if (contactInfoContainerMobileMenu) {
      contactInfoContainerMobileMenu.innerHTML = ''; // Clear existing
      data.contactInfo.forEach(item => {
          const infoItem = document.createElement('div');
          infoItem.className = 'info-item mobile'; // Add specific class if needed
          infoItem.innerHTML = `
              <i class="${item.icon}"></i>
              <span>${item.text}</span>
          `;
          contactInfoContainerMobileMenu.appendChild(infoItem);
      });
    }

    // Contact info (Mobile Header)
    const contactInfoContainerMobileHeader = document.querySelector('.mobile-header-contact');
    if (contactInfoContainerMobileHeader) {
      contactInfoContainerMobileHeader.innerHTML = ''; // Clear existing
      data.contactInfo.forEach(item => {
          const infoItem = document.createElement('div');
          // Use a different class to allow separate styling if needed
          infoItem.className = 'mobile-header-contact-item'; 
          // Omit icon for brevity in header
          infoItem.innerHTML = `<span>${item.text}</span>`; 
          contactInfoContainerMobileHeader.appendChild(infoItem);
      });
    }
    
    // Social links (Sidebar only - could be added to mobile too if desired)
    const socialLinksContainer = document.querySelector('.sidebar .social-links');
    if (socialLinksContainer) {
      socialLinksContainer.innerHTML = '';
      data.socialLinks.forEach(item => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'social-icon';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="${item.icon}"></i>`;
        link.setAttribute('aria-label', item.platform && item.platform !== item.label ? `${item.label} on ${item.platform}` : item.label);
        socialLinksContainer.appendChild(link);
      });
      const downloadLink = document.createElement('a');
      downloadLink.className = 'btn btn-primary social-icon';
      downloadLink.id = 'download-cv-btn';
      downloadLink.innerHTML = '<i class="fas fa-download"></i>';
      downloadLink.setAttribute('aria-label', 'Download CV');
      socialLinksContainer.appendChild(downloadLink);
    }

    // Socials section with labels (redesigned sidebar)
    const socialsList = document.querySelector('.sidebar-socials-list');
    if (socialsList) {
      socialsList.innerHTML = '';
      data.socialLinks.forEach(item => {
        const link = document.createElement('a');
        link.className = 'social-row';
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `
          <i class="${item.icon}" aria-hidden="true"></i>
          <span class="social-text">
            <span class="social-label">${item.label}</span>
            ${item.handle ? `<span class="social-handle">${item.handle}</span>` : ''}
          </span>
          <svg class="social-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
        link.setAttribute('aria-label', `${item.platform && item.platform !== item.label ? `${item.label} on ${item.platform}` : item.label} (opens in a new tab)`);
        socialsList.appendChild(link);
      });
      socialsList.closest('.sidebar-socials').hidden = !data.socialLinks.length;
    }

    // Social links (Mobile drawer) — mirror of sidebar links, no download
    // button here (the drawer has its own full-width "download cv" action).
    const mobileSocial = document.querySelector('.mobile-social-links');
    if (mobileSocial) {
      mobileSocial.innerHTML = '';
      data.socialLinks.forEach(item => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'social-icon';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="${item.icon}"></i>`;
        link.setAttribute('aria-label', item.platform && item.platform !== item.label ? `${item.label} on ${item.platform}` : item.label);
        mobileSocial.appendChild(link);
      });
    }
  }
  
  // Load main navigation tabs (for Desktop/Tablet view)
  function loadNavigation(data) {
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      tabNavigation.innerHTML = ''; // Clear only main tab buttons
      // Filter out hidden tabs
      const visibleTabs = data.tabs.filter(tab => !tab.hidden);
      visibleTabs.forEach(tab => {
        const button = document.createElement('button');
        button.className = 'tab-btn' + (tab.active ? ' active' : '');
        button.dataset.tab = tab.id;
        button.textContent = tab.title;
        tabNavigation.appendChild(button);
      });
    } 
    // Mobile links are now generated in setupTabNavigation in main.js
  }
  
  // Load about section
  function loadAboutSection(data) {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    // Set section title
    const sectionHeader = aboutSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Set about description
    const aboutText = aboutSection.querySelector('.about-text');
    if (aboutText) {
      aboutText.textContent = data.description;
    }
    
    // Set services
    const servicesGrid = aboutSection.querySelector('.services-grid');
    if (servicesGrid) {
      servicesGrid.innerHTML = '';
      
      data.services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
          <i class="${service.icon}"></i>
          <h4>${service.title}</h4>
          <p>${service.description}</p>
        `;
        servicesGrid.appendChild(serviceCard);
      });
    }
  }
  
  // Thin outline icons (Lucide, ISC licence) for entries without a logo
  const ICONS = {
    'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    'languages': '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
    'house-wifi': '<path d="M9.5 13.866a4 4 0 0 1 5 .01"/><path d="M12 17h.01"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M7 10.754a8 8 0 0 1 10 0"/>',
    'briefcase': '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    'trophy': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    'award': '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    'pen': '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'puzzle': '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
    'layers': '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    'calendar': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  };
  const svgIcon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  // Five-segment level bar (no text labels); nothing is drawn when no rating is stored
  function levelBar(level, name) {
    const lvl = Number(level);
    if (level === null || level === undefined || level === '' || !Number.isFinite(lvl)) return '';
    const n = Math.max(0, Math.min(5, Math.round(lvl)));
    let segs = '';
    for (let i = 1; i <= 5; i++) segs += `<span class="seg${i <= n ? ' on' : ''}"></span>`;
    return `<span class="level-bar" role="img" aria-label="${name}: ${n} out of 5">${segs}</span>`;
  }

  // Interests & Skills page: personal skills, software and tools, languages (from resume.json)
  function loadSkillsPage(data) {
    const page = document.getElementById('interests');
    if (!page || !data) return;
    const row = (lead, name, level, cls = '') => `
      <div class="skill-line${cls}">
        ${lead}
        <span class="skill-line-name">${name}</span>
        ${levelBar(level, name)}
      </div>`;
    const iconLead = name => `<span class="skill-line-icon">${svgIcon(name)}</span>`;

    const personal = page.querySelector('#skills-personal');
    if (personal && Array.isArray(data.softSkills)) {
      personal.innerHTML = data.softSkills.map(s => row(iconLead(s.icon), s.name, s.level)).join('');
    }

    const tools = page.querySelector('#skills-tools');
    if (tools && Array.isArray(data.technicalSkills)) {
      const all = data.technicalSkills.flatMap(g => (g && Array.isArray(g.skills)) ? g.skills : []);
      const half = Math.ceil(all.length / 2);
      tools.innerHTML = [all.slice(0, half), all.slice(half)].filter(c => c.length).map(col => `
        <div class="skill-panel tool-panel">${col.map(t => row(
          t.logo ? `<img class="skill-line-logo" src="${t.logo}" alt="" aria-hidden="true">` : iconLead('briefcase'),
          t.name, t.level, levelBar(t.level, t.name) ? '' : ' is-unrated')).join('')}</div>`).join('');
    }

    const langs = page.querySelector('#skills-languages');
    if (langs && Array.isArray(data.languages)) {
      langs.innerHTML = data.languages.map(l => row(iconLead(l.icon || 'message-circle'), l.language, l.level)).join('');
    }
  }

  // Load resume section
  function loadResumeSection(data) {
    const resumeSection = document.getElementById('resume');
    if (!resumeSection) return;
    
    // Set section title
    const sectionHeader = resumeSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Display helpers: short month names and an en dash; the stored text is unchanged
    const MONTHS = { January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr', May: 'May', June: 'Jun', July: 'Jul', August: 'Aug', September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec' };
    const shortPeriod = p => String(p || '').replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g, m => MONTHS[m]).replace(/\s+-\s+/g, ' – ');
    const markHTML = (item, kind) => {
      if (item.logo) {
        const dark = item.logoBackground === 'dark' ? ' is-dark' : '';
        return `<div class="resume-mark${dark}"><img src="${item.logo}" alt="${item.company || ''} logo"></div>`;
      }
      const name = ICONS[item.icon] ? item.icon : (kind === 'education' ? 'graduation-cap' : 'briefcase');
      return `<div class="resume-mark is-icon is-${kind}">${svgIcon(name)}</div>`;
    };
    const timelineItem = inner => {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `<span class="timeline-dot" aria-hidden="true"></span>${inner}`;
      return el;
    };

    // Work Experience
    const experienceTimeline = resumeSection.querySelector('#resume-experience');
    if (experienceTimeline) {
      experienceTimeline.innerHTML = '';
      data.experience.forEach(job => {
        experienceTimeline.appendChild(timelineItem(`
          <article class="resume-card">
            ${markHTML(job, 'work')}
            <div class="resume-body">
              <div class="resume-top">
                <h4>${job.title}</h4>
                <span class="resume-date">${shortPeriod(job.period)}</span>
              </div>
              <p class="resume-org">${job.company}</p>
              <p class="resume-desc">${job.description}</p>
            </div>
          </article>`));
      });
    }

    // Education: "Degree: Field" shows the field as the red line, institution below
    const educationTimeline = resumeSection.querySelector('#resume-education');
    if (educationTimeline) {
      educationTimeline.innerHTML = '';
      data.education.forEach(edu => {
        const [degree, ...rest] = String(edu.degree).split(': ');
        const field = rest.join(': ');
        const org = field
          ? `<p class="resume-org">${field}</p><p class="resume-desc">${edu.institution}</p>`
          : `<p class="resume-org">${edu.institution}</p>`;
        educationTimeline.appendChild(timelineItem(`
          <article class="resume-card">
            ${markHTML(edu, 'education')}
            <div class="resume-body">
              <h4>${degree}</h4>
              ${org}
              <p class="resume-when">${svgIcon('calendar')}${shortPeriod(edu.period)}</p>
            </div>
          </article>`));
      });
    }

    // Certifications
    const certTimeline = resumeSection.querySelector('#resume-certifications');
    if (certTimeline) {
      certTimeline.innerHTML = '';
      data.certifications.forEach(cert => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        const listItems = cert.items.map(item => `<li>${item}</li>`).join('');
        timelineItem.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>${cert.category}</h4>
            <ul class="certification-list">
              ${listItems}
            </ul>
          </div>
        `;
        certTimeline.appendChild(timelineItem);
      });
    }
    
    // ---- Skills: grouped rows with a 5-cell segmented proficiency meter ----
    const TIERS = ['', 'learning', 'familiar', 'proficient', 'advanced', 'expert'];
    const tierName = (lvl) => TIERS[Math.max(0, Math.min(5, lvl))] || '';

    const skillRow = (skill, showTier) => {
      const lvl = Math.max(0, Math.min(5, Number(skill.level) || 0));
      let cells = '';
      for (let i = 1; i <= 5; i++) cells += `<span class="cell ${i <= lvl ? 'on' : ''}"></span>`;
      const tier = tierName(lvl);
      const tierHTML = showTier && tier
        ? `<span class="skill-tier" data-tier="${tier}">${tier}</span>` : '';
      // Icon: a class (devicon / Font Awesome) renders as <i>, a URL as <img>
      let iconHTML = '';
      if (skill.icon) {
        iconHTML = skill.icon.startsWith('http')
          ? `<img src="${skill.icon}" class="skill-icon" alt="" aria-hidden="true">`
          : `<i class="${skill.icon} skill-icon" aria-hidden="true"></i>`;
      }
      return `
        <div class="skill-row">
          <span class="skill-name">${iconHTML}${skill.name}</span>
          <span class="meter" role="img" aria-label="${lvl} of 5">${cells}</span>
          ${tierHTML}
        </div>`;
    };

    // Technical Skills (grouped by category)
    const techSkillsGrid = resumeSection.querySelector('#technical-skills .skills-grid');
    if (techSkillsGrid && Array.isArray(data.technicalSkills)) {
      techSkillsGrid.innerHTML = '';
      data.technicalSkills.forEach(group => {
        if (!group || !Array.isArray(group.skills)) return;
        const cat = document.createElement('div');
        cat.className = 'skill-cat';
        const rows = group.skills.map(s => skillRow(s, true)).join('');
        cat.innerHTML = `
          <span class="skill-cat-label">${group.category}</span>
          <div class="skill-rows">${rows}</div>`;
        techSkillsGrid.appendChild(cat);
      });
    } else {
      console.warn('Technical skills section (#technical-skills .skills-grid) or data not found');
    }

    // Soft Skills (single group, meter without tier label)
    const softSkillsGrid = resumeSection.querySelector('#soft-skills .skills-grid');
    if (softSkillsGrid && Array.isArray(data.softSkills)) {
      softSkillsGrid.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'skill-rows';
      wrap.innerHTML = data.softSkills.map(s => skillRow(s, false)).join('');
      softSkillsGrid.appendChild(wrap);
    } else {
      console.warn('Soft skills section (#soft-skills .skills-grid) or data not found');
    }
  }
  
  // Load interests section
  function loadInterestsSection(data) {
    const interestsSection = document.getElementById('interests');
    if (!interestsSection || !data) {
        console.warn('Interests section element or data not found.');
        return;
    }

    // Set main section title
    const mainHeader = interestsSection.querySelector('.section-header h2');
    if (mainHeader) {
      mainHeader.textContent = data.title || 'Interests & Passions';
    }

    // Helper function to create a card element
    const createCardElement = (itemData, baseClass) => {
        const cardElement = document.createElement('div');
        cardElement.className = baseClass;
        
        const iconHTML = itemData.icon ? `<i class="${itemData.icon} interest-icon"></i>` : '';
        
        // Check for links and generate buttons for ALL valid links
        let linksHTML = '';
        if (itemData.links && Array.isArray(itemData.links) && itemData.links.length > 0) {
            const linkButtons = itemData.links
                .filter(link => link.url && link.icon) // Ensure both url and icon exist
                .map(link => `
                    <a href="${link.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="interest-link-btn" 
                       aria-label="${itemData.title} Link">
                        <i class="${link.icon}"></i>
                    </a>
                `).join(''); // Join multiple buttons
            
            if (linkButtons) { // Only add container if there are buttons
                linksHTML = `<div class="interest-card-links">${linkButtons}</div>`;
            }
        }

        cardElement.innerHTML = `
          <div class="interest-card-header">
            ${iconHTML}
            <h3>${itemData.title}</h3>
          </div>
          <p>${itemData.description}</p>
          ${linksHTML}
        `;
        
        return cardElement; 
    };

    // Redesigned Interests cards: icon above title, centred
    const interestCards = interestsSection.querySelector('.interest-cards');
    if (interestCards && Array.isArray(data.coreInterests)) {
      interestCards.innerHTML = '';
      data.coreInterests.forEach(item => {
        const card = document.createElement('article');
        card.className = 'interest-tile';
        card.innerHTML = `
          <div class="interest-tile-icon"><i class="${item.icon}" aria-hidden="true"></i></div>
          <h4>${item.title}</h4>
          <p>${item.description}</p>`;
        interestCards.appendChild(card);
      });
    }

    // Load Core Interests
    const coreGrid = interestsSection.querySelector('.core-interests-grid');
    if (coreGrid && data.coreInterests) {
      coreGrid.innerHTML = '';
      data.coreInterests.forEach(interest => {
        const cardElement = createCardElement(interest, 'interest-card');
        coreGrid.appendChild(cardElement);
      });
    }

    // Load Fusion Passions
    const fusionContainer = interestsSection.querySelector('.fusion-passions');
    if (fusionContainer && data.fusionPassions) {
      const fusionHeader = fusionContainer.querySelector('h2');
      const fusionGrid = fusionContainer.querySelector('.fusions-grid');
      
      if(fusionHeader) fusionHeader.textContent = data.fusionTitle || 'Where Worlds Collide';
      
      if (fusionGrid) {
          fusionGrid.innerHTML = '';
          data.fusionPassions.forEach(fusion => {
             // Note: createCardElement expects h3, so we use h4 in the baseClass if needed for CSS
             // Or adjust createCardElement to accept title tag type parameter
            const cardElement = createCardElement(fusion, 'interest-card fusion-item'); 
            // Manually change h3 back to h4 if createCardElement always makes h3
            const titleElement = cardElement.querySelector('h3');
            if (titleElement) {
                const h4 = document.createElement('h4');
                h4.textContent = titleElement.textContent;
                titleElement.replaceWith(h4);
            }
            fusionGrid.appendChild(cardElement);
          });
      }
    }

    // Load Homelab Showcase
    const homelabContainer = interestsSection.querySelector('.homelab-showcase');
    if (homelabContainer && data.homelabDetails) {
      const homelabHeader = homelabContainer.querySelector('h2');
      const homelabLinksContainer = homelabContainer.querySelector('.homelab-links'); // Target new links container
      const homelabContent = homelabContainer.querySelector('.homelab-content');

      if(homelabHeader) homelabHeader.textContent = data.homelabTitle || 'The Digital Forge – My Homelab';

      // Populate Homelab Links under the title
      if(homelabLinksContainer && data.homelabDetails.links && Array.isArray(data.homelabDetails.links)) {
          homelabLinksContainer.innerHTML = ''; // Clear previous
          data.homelabDetails.links
              .filter(link => link.url && link.icon) // Keep filtering for valid links
              .forEach(link => {
                  const linkButton = document.createElement('a');
                  linkButton.href = link.url;
                  linkButton.target = '_blank';
                  linkButton.rel = 'noopener noreferrer';
                  linkButton.className = 'homelab-link-btn'; 
                  linkButton.setAttribute('aria-label', link.label || 'Homelab Link');
                  // Add both icon and label text
                  linkButton.innerHTML = `<i class="${link.icon}"></i> <span>${link.label || 'Link'}</span>`; 
                  homelabLinksContainer.appendChild(linkButton);
              });
      }

      // Populate Homelab Content (Image, Description, Specs)
      if(homelabContent) {
          homelabContent.innerHTML = ''; // Clear existing
          
          // Keep image separate, no longer linked itself
          let imageHTML = '';
          if(data.homelabDetails.image) {
              imageHTML = `<img src="${data.homelabDetails.image}" alt="My Homelab Setup" class="homelab-image">`;
          }
          const imageContainerHTML = imageHTML ? `<div class="homelab-image-container">${imageHTML}</div>` : '';

          let descriptionHTML = '';
          if(data.homelabDetails.description) {
              descriptionHTML = `<p class="homelab-description">${data.homelabDetails.description}</p>`;
          }

          let specsHTML = '';
          if(data.homelabDetails.specs && Array.isArray(data.homelabDetails.specs)) {
              const specItems = data.homelabDetails.specs.map(spec => 
                  `<li>${spec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`
              ).join('');
              specsHTML = `<ul class="homelab-specs">${specItems}</ul>`;
          }

          // Structure: description (left) + image (right), specs full width below
          homelabContent.innerHTML = `
              <div class="homelab-text">
                  ${descriptionHTML}
              </div>
              ${imageContainerHTML}
              <div class="homelab-specs-container">
                  ${specsHTML}
              </div>
          `;
      }
    }
  }
  
  // Load honors section
  function loadHonorsSection(data) {
    const honorsSection = document.getElementById('honors');
    if (!honorsSection) return;
    
    // Set section title
    const sectionHeader = honorsSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Redesigned layout: one titled timeline per category (awards, programs)
    const content = honorsSection.querySelector('#honors-content');
    if (content) {
      content.innerHTML = '';
      const groups = Array.isArray(data.categories) && data.categories.length
        ? data.categories
        : [{ id: '', title: data.title }];
      const dash = d => String(d || '').replace(/\s+-\s+/g, ' – ');
      groups.forEach(group => {
        const items = data.awards.filter(a => !group.id || (a.category || groups[0].id) === group.id);
        if (!items.length) return;
        const section = document.createElement('div');
        section.className = 'resume-section';
        section.innerHTML = `<h3 class="about-kicker">${group.title}</h3><div class="timeline"></div>`;
        const timeline = section.querySelector('.timeline');
        items.forEach(award => {
          const item = document.createElement('div');
          item.className = 'timeline-item';
          item.innerHTML = `
            <span class="timeline-dot" aria-hidden="true"></span>
            <article class="resume-card">
              <div class="resume-mark is-icon">${svgIcon(ICONS[award.icon] ? award.icon : 'award')}</div>
              <div class="resume-body">
                <h4>${award.title}</h4>
                <p class="resume-org">${award.organization}</p>
                <p class="resume-when">${svgIcon('calendar')}${dash(award.date)}</p>
                <p class="resume-desc">${award.description}</p>
              </div>
            </article>`;
          timeline.appendChild(item);
        });
        content.appendChild(section);
      });
    }
  }

  // Load contact section
  function loadContactSection(data) {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    
    // Set section title
    const sectionHeader = contactSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Form fields
    const form = contactSection.querySelector('.contact-form');
    if (form) {
      form.innerHTML = '';
      
      // Create form fields
      data.form.fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);
        
        if (field.type === 'textarea') {
          const textarea = document.createElement('textarea');
          textarea.id = field.id;
          textarea.name = field.id;
          textarea.rows = field.rows || 5;
          if (field.required) textarea.required = true;
          formGroup.appendChild(textarea);
        } else {
          const input = document.createElement('input');
          input.type = field.type;
          input.id = field.id;
          input.name = field.id;
          if (field.required) input.required = true;
          formGroup.appendChild(input);
        }
        
        form.appendChild(formGroup);
      });
      
      // Add submit button
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'submit-btn';
      button.textContent = data.form.submitButton;
      form.appendChild(button);
    }
    
    // Map
    const mapContainer = contactSection.querySelector('.map-container');
    if (mapContainer && data.map.embedUrl) {
      mapContainer.innerHTML = `
        <iframe src="${data.map.embedUrl}" 
                style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      `;
    }
  }
  
  // Load footer
  function loadFooter(data) {
    const footer = document.querySelector('.footer');
    if (footer && data) {
      footer.innerHTML = `<p>${data.copyright}</p>`;
    }
  }
}); 
