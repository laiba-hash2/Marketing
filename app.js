// === NAV TOGGLE ===
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

// === PLATFORM GUIDES DATA ===
const platformGuides = {
  meta: {
    name: 'Meta Ads (Facebook & Instagram)',
    icon: 'f',
    iconClass: 'meta-icon',
    intro: 'Meta Ads are one of the most powerful tools for reaching your ideal customer. With over 3 billion users, you can target by age, interest, behavior, and even life events.',
    steps: [
      'Create a Facebook Business Manager account at business.facebook.com',
      'Set up your Facebook Pixel on your website to track visitors',
      'Create your first campaign — choose "Sales" or "Lead Generation" as objective',
      'Define your audience: location, age, gender, interests',
      'Set your daily or lifetime budget',
      'Upload your image/video and write your ad copy',
      'Launch and monitor results in Ads Manager'
    ],
    tips: [
      'Start with a $10–$20/day budget while testing',
      'Use carousel ads to show multiple products',
      'Retarget website visitors within 30 days',
      'Test 3 different audiences to find the best performer',
      'Use Instagram Stories placement for lower CPM'
    ],
    metrics: 'Key metrics to watch: CTR (aim for 1%+), CPM (cost per 1000 views), CPC (cost per click), ROAS (return on ad spend — aim for 3x+)',
    budget: 'Starter: $300–$500/month | Growth: $1,000–$3,000/month | Scale: $5,000+/month'
  },
  google: {
    name: 'Google Ads',
    icon: 'G',
    iconClass: 'google-icon',
    intro: 'Google Ads puts your business in front of people who are actively searching for what you offer. Unlike social ads, Google captures intent — these users want to buy.',
    steps: [
      'Create a Google Ads account at ads.google.com',
      'Install Google Tag/Conversion tracking on your website',
      'Choose your campaign type: Search, Display, or Performance Max',
      'Research keywords using Google Keyword Planner',
      'Write 3 headlines and 2 descriptions for each ad',
      'Set your daily budget and target CPA (cost per acquisition)',
      'Launch and check performance every 3–5 days'
    ],
    tips: [
      'Use Exact Match keywords to control spend early on',
      'Add negative keywords to avoid irrelevant clicks',
      'Write headlines that match what users are searching',
      'Use ad extensions (sitelinks, callouts, call) to increase CTR',
      'Enable Smart Bidding after you have 30+ conversions'
    ],
    metrics: 'Key metrics: Quality Score (aim 7+), CTR (aim 5%+ for search), CPC, Conversion Rate (aim 3%+), Cost Per Conversion',
    budget: 'Starter: $500–$1,000/month | Growth: $2,000–$5,000/month | Scale: $10,000+/month'
  },
  tiktok: {
    name: 'TikTok Ads',
    icon: 'T',
    iconClass: 'tiktok-icon',
    intro: 'TikTok Ads are ideal for brands that can create engaging short-form video content. The platform\'s algorithm gives even new accounts strong reach if content resonates.',
    steps: [
      'Create a TikTok Ads Manager account at ads.tiktok.com',
      'Install TikTok Pixel on your website',
      'Choose campaign objective: Traffic, Conversions, or App Install',
      'Define your target audience (age, gender, interests, device)',
      'Create a vertical video ad (9:16 ratio, 15–60 seconds)',
      'Set daily budget minimum $20/day',
      'Monitor and iterate quickly — TikTok moves fast'
    ],
    tips: [
      'Make videos feel native and organic, not like traditional ads',
      'Hook viewers in the first 2–3 seconds',
      'Use trending sounds to boost organic reach',
      'Collaborate with TikTok creators via Spark Ads',
      'Test multiple video concepts — fail fast, scale winners'
    ],
    metrics: 'Key metrics: Video View Rate (aim 25%+), CTR (aim 1.5%+), CPM, Conversion Rate, ROAS',
    budget: 'Starter: $600–$900/month | Growth: $2,000–$5,000/month | Scale: $10,000+/month'
  },
  linkedin: {
    name: 'LinkedIn Ads',
    icon: 'in',
    iconClass: 'linkedin-icon',
    intro: 'LinkedIn Ads are the gold standard for B2B marketing. You can target by job title, company size, industry, and seniority level — reaching the exact decision makers you need.',
    steps: [
      'Create a LinkedIn Campaign Manager account',
      'Install LinkedIn Insight Tag on your website',
      'Choose objective: Brand Awareness, Lead Gen, or Website Visits',
      'Build your audience using job title, industry, company size filters',
      'Choose ad format: Sponsored Content, Message Ad, or Lead Gen Form',
      'Set bid type — CPC works well for beginners',
      'Launch and expect slower results — LinkedIn runs at a different pace'
    ],
    tips: [
      'Use Lead Gen Forms to capture leads without leaving LinkedIn',
      'Offer a valuable lead magnet (guide, webinar, free audit)',
      'Target by seniority — "Director" and above convert better for B2B',
      'Retarget website visitors and video viewers',
      'Message Ads (InMail) have high open rates — keep them personal'
    ],
    metrics: 'Key metrics: CTR (aim 0.5%+ for B2B), Lead Form Open Rate, Cost Per Lead, Lead Conversion Rate',
    budget: 'Starter: $1,000–$2,000/month | Growth: $3,000–$7,000/month | Scale: $15,000+/month'
  },
  youtube: {
    name: 'YouTube Ads',
    icon: '▶',
    iconClass: 'youtube-icon',
    intro: 'YouTube is the 2nd largest search engine in the world. Video ads on YouTube build brand trust, demonstrate products, and reach audiences both via search and during video watching.',
    steps: [
      'YouTube Ads are run through Google Ads — create your account there',
      'Link your YouTube channel to your Google Ads account',
      'Upload your ad video to YouTube (as unlisted)',
      'Create a Video Campaign in Google Ads',
      'Choose ad format: In-Stream Skippable, Non-Skippable, or Bumper',
      'Target by keyword, topic, audience, or placement',
      'Set your CPV (cost per view) bid and daily budget'
    ],
    tips: [
      'The first 5 seconds are critical before the skip button appears',
      'Include a clear verbal and visual CTA',
      'Use "Director\'s Cut" cuts for organic, standard cuts for ads',
      'Bumper ads (6 seconds) are great for retargeting and brand recall',
      'Layer YouTube targeting with Google\'s in-market audiences'
    ],
    metrics: 'Key metrics: View Rate (aim 30%+), CPV (cost per view), CTR, Earned Views (organic views from ad exposure), Brand Lift',
    budget: 'Starter: $500–$1,000/month | Growth: $2,000–$5,000/month | Scale: $10,000+/month'
  }
};

function showPlatformGuide(platform) {
  const guide = platformGuides[platform];
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
      <div class="platform-icon ${guide.iconClass}" style="flex-shrink:0;">${guide.icon}</div>
      <h2>${guide.name}</h2>
    </div>
    <p class="modal-intro">${guide.intro}</p>

    <div class="modal-section">
      <h4>Step-by-Step Setup</h4>
      <ul>
        ${guide.steps.map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${s}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <h4>Pro Tips</h4>
      <ul>
        ${guide.tips.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <h4>Key Metrics to Track</h4>
      <p>${guide.metrics}</p>
    </div>

    <div class="modal-section">
      <h4>Recommended Budget</h4>
      <p>${guide.budget}</p>
    </div>
  `;

  document.getElementById('platformModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('platformModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// === BUDGET CALCULATOR ===
function calculateBudget() {
  const revenue = parseInt(document.getElementById('revenue').value);
  const goal = document.getElementById('goal').value;
  const competition = document.getElementById('competition').value;
  const platform = document.getElementById('calcPlatform').value;

  // Base: 5–15% of revenue for ads
  let pct = 0.07;
  if (goal === 'sales') pct = 0.10;
  if (goal === 'awareness') pct = 0.05;
  if (goal === 'leads') pct = 0.08;
  if (goal === 'traffic') pct = 0.05;

  if (competition === 'high') pct += 0.03;
  if (competition === 'low') pct -= 0.02;

  const monthlyBudget = Math.round(revenue * pct / 10) * 10;
  const dailyBudget = Math.round(monthlyBudget / 30);

  // Estimated results based on platform
  const cpcMap = { meta: 0.80, google: 2.50, tiktok: 0.50, linkedin: 5.00 };
  const cvrMap = { meta: 0.025, google: 0.04, tiktok: 0.02, linkedin: 0.03 };
  const cpc = cpcMap[platform] || 1.5;
  const cvr = cvrMap[platform] || 0.025;

  const clicks = Math.round(monthlyBudget / cpc);
  const conversions = Math.round(clicks * cvr);
  const cpa = conversions > 0 ? (monthlyBudget / conversions).toFixed(0) : 'N/A';

  const goalLabel = { awareness: 'Impressions', leads: 'Leads', sales: 'Sales', traffic: 'Clicks' };

  document.getElementById('calcResults').innerHTML = `
    <div class="result-data">
      <h3>Your Recommended Budget</h3>
      <div class="result-item">
        <span class="result-label">Monthly Ad Budget</span>
        <span class="result-value highlight-val">$${monthlyBudget.toLocaleString()}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Daily Budget</span>
        <span class="result-value">$${dailyBudget}/day</span>
      </div>
      <div class="result-item">
        <span class="result-label">Estimated Clicks/Month</span>
        <span class="result-value">${clicks.toLocaleString()}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Est. ${goalLabel[goal]}/Month</span>
        <span class="result-value">${conversions.toLocaleString()}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Est. Cost Per Result</span>
        <span class="result-value">$${cpa}</span>
      </div>
      <div class="result-item">
        <span class="result-label">% of Revenue</span>
        <span class="result-value">${(pct * 100).toFixed(0)}%</span>
      </div>
    </div>
  `;
}

// === AD VISUAL GENERATOR ===
const adTemplates = {
  social: (biz, customer, offer) => [
    {
      title: 'Headline Option A',
      text: `Stop scrolling — this is for you.\n\n${biz}. Built for ${customer}.\n\n${offer ? `Special offer: ${offer}` : 'Click to learn more and get started today.'}\n\n→ Tap the link in bio or click below.`
    },
    {
      title: 'Headline Option B',
      text: `Tired of [problem your customer faces]?\n\nWe help ${customer} with ${biz}.\n\n${offer || 'Join hundreds of happy customers.'}\n\nShop now — link below. ⬇️`
    },
    {
      title: 'Visual Brief',
      text: `Image concept: Show a real customer or product in a lifestyle setting. Use bright, warm lighting. Overlay text: "${offer || 'Shop Now'}" in bold. Include your logo in the corner. Avoid stock photo look — use authentic imagery.`
    }
  ],
  search: (biz, customer, offer) => [
    {
      title: 'Search Ad — Headline Set 1',
      text: `Headline 1: ${biz.split(' ').slice(0, 5).join(' ')}\nHeadline 2: Trusted by ${customer}\nHeadline 3: ${offer || 'Get Started Today'}\n\nDescription: Looking for results? We deliver exactly what ${customer} need. ${offer || 'See why customers love us.'} Click to learn more.`
    },
    {
      title: 'Search Ad — Headline Set 2',
      text: `Headline 1: #1 Choice For ${customer}\nHeadline 2: ${offer || 'Free Consultation Available'}\nHeadline 3: View Our Packages\n\nDescription: ${biz}. Fast, reliable, and trusted by thousands. ${offer || 'Get your free quote today — no commitment required.'}`
    }
  ],
  video: (biz, customer, offer) => [
    {
      title: 'Video Ad Script (30 sec)',
      text: `[0–3s — HOOK]: "If you're a ${customer} and you're struggling with [main problem]... pay attention."\n\n[3–10s — PROBLEM]: "Most people in your position deal with [pain point]. It's frustrating, time-consuming, and expensive."\n\n[10–20s — SOLUTION]: "That's exactly why we built [your brand]. ${biz}. We make it simple."\n\n[20–27s — PROOF]: "Join thousands of ${customer} who've already [achieved result]."\n\n[27–30s — CTA]: "${offer || 'Click the link. Get started today.'}"`
    },
    {
      title: 'Video Visual Direction',
      text: `Format: Vertical (9:16) for TikTok/Reels, Horizontal (16:9) for YouTube.\nOpening shot: Close-up of a person (your target customer) looking at a problem.\nMid: Screen recording or product demo — show don't tell.\nEnd: Happy customer + your branding + CTA overlay.\nMusic: Upbeat, royalty-free. Match energy to your brand.`
    }
  ],
  banner: (biz, customer, offer) => [
    {
      title: 'Display Banner Copy',
      text: `Headline: "${offer ? offer.split(' ').slice(0, 4).join(' ') : 'Grow Your Business'}\nSubheadline: For ${customer}\nBody: ${biz}.\nCTA Button: "Learn More" or "Get Started"\n\nDesign notes: Use high-contrast colors. Keep text minimal. Your logo top-left, CTA button bottom-right. Use 300x250, 728x90, and 160x600 sizes.`
    },
    {
      title: 'Banner Retargeting Version',
      text: `Headline: "Still thinking about it?"\nSubheadline: ${offer || 'Come back and see what you missed.'}\nCTA: "Complete My Order" or "See the Offer"\n\nDesign notes: Use urgency-driven language. Show product image if applicable. Consider animated banner — even subtle motion increases CTR by 40%.`
    }
  ]
};

function generateAd() {
  const biz = document.getElementById('bizDesc').value.trim();
  const customer = document.getElementById('targetCustomer').value.trim();
  const offer = document.getElementById('offer').value.trim();
  const format = document.getElementById('adFormat').value;

  if (!biz || !customer) {
    document.getElementById('genOutput').innerHTML = `
      <div style="text-align:center; color: #ef4444; padding: 40px;">
        <p>Please fill in your business description and target customer to generate ad ideas.</p>
      </div>
    `;
    return;
  }

  const templates = adTemplates[format](biz, customer, offer);

  document.getElementById('genOutput').innerHTML = `
    <div class="ad-result">
      ${templates.map(t => `
        <div class="ad-card">
          <h4>${t.title}</h4>
          <p>${t.text}</p>
          <button class="copy-btn" onclick="copyText(this, \`${t.text.replace(/`/g, '\\`')}\`)">Copy Text</button>
        </div>
      `).join('')}
    </div>
  `;
}

function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy Text'; }, 2000);
  });
}

// === EMAIL SIGNUP ===
function submitEmail() {
  const email = document.getElementById('emailInput').value.trim();
  const msg = document.getElementById('emailMsg');

  if (!email || !email.includes('@')) {
    msg.textContent = 'Please enter a valid email address.';
    msg.style.color = '#fbbf24';
    return;
  }

  msg.textContent = `✓ You're on the list! We'll reach out to ${email} when we launch.`;
  msg.style.color = '#86efac';
  document.getElementById('emailInput').value = '';
}

// === SMOOTH SCROLL ACTIVE NAV ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--primary)' : '';
  });
});
