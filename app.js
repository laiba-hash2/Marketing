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

// Goal pill selector
let selectedGoal = 'leads';
function selectGoal(el) {
  document.querySelectorAll('#goalPills .pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  selectedGoal = el.dataset.val;
}

// Content type selector
let selectedContent = 'static';
function selectContent(el) {
  document.querySelectorAll('#contentTypePills .content-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  selectedContent = el.dataset.val;
}

// Content type performance multipliers: { cpmMult, ctrMult, cvrMult, label, tip }
const contentData = {
  static:   { cpmMult: 1.00, ctrMult: 1.00, cvrMult: 1.00, label: 'Static Post',       tip: 'Consistent performer — great for retargeting and brand consistency.' },
  carousel: { cpmMult: 1.05, ctrMult: 1.25, cvrMult: 1.20, label: 'Carousel',           tip: 'Carousels drive 25% more clicks — ideal for showcasing multiple products or steps.' },
  reels:    { cpmMult: 0.75, ctrMult: 1.40, cvrMult: 1.15, label: 'Reels / Short Video', tip: 'Reels get the widest organic boost. Lower CPM means more people see your ad for less.' },
  story:    { cpmMult: 0.65, ctrMult: 0.85, cvrMult: 0.90, label: 'Story',              tip: 'Stories are the cheapest format for impressions — best for awareness campaigns.' },
  video:    { cpmMult: 0.90, ctrMult: 1.15, cvrMult: 1.25, label: 'Video Ad',           tip: 'Video builds trust fastest. Higher production cost pays off with the best conversion rates.' },
};

// Platform benchmarks (per month, industry-neutral baseline)
const platformData = {
  meta:     { name: 'Meta',     icon: 'f',  cls: 'meta-icon',     cpm: 8,   cpc: 0.80, cvr: 0.025, color: '#1877f2' },
  google:   { name: 'Google',   icon: 'G',  cls: 'google-icon',   cpm: 5,   cpc: 2.50, cvr: 0.040, color: '#ea4335' },
  tiktok:   { name: 'TikTok',   icon: 'T',  cls: 'tiktok-icon',   cpm: 6,   cpc: 0.50, cvr: 0.018, color: '#000000' },
  linkedin: { name: 'LinkedIn', icon: 'in', cls: 'linkedin-icon', cpm: 30,  cpc: 5.50, cvr: 0.030, color: '#0a66c2' },
  youtube:  { name: 'YouTube',  icon: '▶',  cls: 'youtube-icon',  cpm: 10,  cpc: 0.40, cvr: 0.015, color: '#ff0000' },
};

// Industry CPC multipliers
const industryMult = {
  ecommerce: 0.9, food: 0.7, realestate: 1.5,
  health: 1.2, services: 1.3, saas: 1.6, education: 1.1, other: 1.0
};

// Audience size CPM multipliers
const audienceMult = { local: 0.7, regional: 1.0, national: 1.3 };

// Recommended budget split per goal (must sum to 1 across all 5 platforms)
const goalSplit = {
  awareness: { meta: 0.35, google: 0.10, tiktok: 0.25, linkedin: 0.05, youtube: 0.25 },
  leads:     { meta: 0.30, google: 0.40, tiktok: 0.05, linkedin: 0.20, youtube: 0.05 },
  sales:     { meta: 0.40, google: 0.35, tiktok: 0.15, linkedin: 0.05, youtube: 0.05 },
  traffic:   { meta: 0.30, google: 0.50, tiktok: 0.15, linkedin: 0.00, youtube: 0.05 },
  app:       { meta: 0.45, google: 0.15, tiktok: 0.35, linkedin: 0.00, youtube: 0.05 },
};

const goalLabel = { awareness: 'Impressions', leads: 'Leads', sales: 'Sales', traffic: 'Clicks', app: 'Installs' };

function calculateBudget() {
  const budgetInput = parseFloat(document.getElementById('budgetInput').value);
  if (!budgetInput || budgetInput < 50) {
    document.getElementById('calcResults').innerHTML = `
      <div class="result-placeholder"><div class="placeholder-icon">⚠️</div>
      <p>Please enter a monthly budget of at least $50.</p></div>`;
    return;
  }

  const duration   = parseInt(document.getElementById('duration').value);
  const industry   = document.getElementById('industry').value;
  const audience   = document.getElementById('audienceSize').value;
  const goal       = selectedGoal;

  // Which platforms are checked
  const checked = [...document.querySelectorAll('.platform-checks input:checked')].map(c => c.value);
  if (checked.length === 0) {
    document.getElementById('calcResults').innerHTML = `
      <div class="result-placeholder"><div class="placeholder-icon">⚠️</div>
      <p>Please select at least one platform.</p></div>`;
    return;
  }

  const totalBudget = budgetInput * duration;
  const indMult     = industryMult[industry] || 1.0;
  const audMult     = audienceMult[audience] || 1.0;
  const ct          = contentData[selectedContent] || contentData.static;

  // Normalize splits to only selected platforms
  const rawSplit = goalSplit[goal];
  let splitSum = checked.reduce((s, p) => s + (rawSplit[p] || 0), 0);
  if (splitSum === 0) splitSum = 1;

  // Build per-platform projections
  let totalImpressions = 0, totalClicks = 0, totalConversions = 0;
  const platformRows = checked.map(p => {
    const pd = platformData[p];
    const share = (rawSplit[p] || (1 / checked.length)) / splitSum;
    const monthBudget = budgetInput * share;
    const adjCPM = pd.cpm * audMult * ct.cpmMult;
    const adjCPC = pd.cpc * indMult / ct.ctrMult;

    const impressions = Math.round((monthBudget / adjCPM) * 1000);
    const clicks      = Math.round(monthBudget / adjCPC);
    const conversions = Math.round(clicks * pd.cvr * ct.cvrMult);
    const cpa         = conversions > 0 ? (monthBudget / conversions).toFixed(0) : '—';

    totalImpressions += impressions * duration;
    totalClicks      += clicks * duration;
    totalConversions += conversions * duration;

    return { p, pd, share, monthBudget, impressions, clicks, conversions, cpa };
  });

  const overallCPA = totalConversions > 0 ? Math.round(totalBudget / totalConversions) : '—';
  const topPlatform = platformRows.reduce((a, b) => b.conversions > a.conversions ? b : a);

  // Render
  document.getElementById('calcResults').innerHTML = `
    <div class="proj-results">

      <div class="proj-summary">
        <div class="proj-summary-item">
          <span class="proj-big">${fmt(totalImpressions)}</span>
          <span class="proj-lbl">Total Impressions</span>
        </div>
        <div class="proj-summary-item">
          <span class="proj-big">${fmt(totalClicks)}</span>
          <span class="proj-lbl">Total Clicks</span>
        </div>
        <div class="proj-summary-item accent">
          <span class="proj-big">${fmt(totalConversions)}</span>
          <span class="proj-lbl">Est. ${goalLabel[goal]}</span>
        </div>
        <div class="proj-summary-item">
          <span class="proj-big">$${overallCPA}</span>
          <span class="proj-lbl">Avg. Cost Per Result</span>
        </div>
      </div>

      <div class="proj-platform-list">
        ${platformRows.map(r => `
          <div class="proj-platform-row">
            <div class="proj-plat-head">
              <span class="pcheck-icon ${r.pd.cls}" style="width:32px;height:32px;font-size:0.85rem;border-radius:8px;">${r.pd.icon}</span>
              <strong>${r.pd.name}</strong>
              <span class="proj-share">${Math.round(r.share * 100)}% — $${Math.round(r.monthBudget)}/mo</span>
            </div>
            <div class="proj-plat-stats">
              <span><em>${fmt(r.impressions)}</em> impressions</span>
              <span><em>${fmt(r.clicks)}</em> clicks</span>
              <span><em>${r.conversions}</em> ${goalLabel[goal].toLowerCase()}</span>
              <span><em>$${r.cpa}</em> per result</span>
            </div>
            <div class="proj-bar-wrap">
              <div class="proj-bar" style="width:${Math.round(r.share * 100)}%; background:${r.pd.color};"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="proj-tip">
        <strong>Top Pick:</strong> Based on your goal (<em>${goal}</em>), <strong>${topPlatform.pd.name}</strong> is projected to deliver the most results. Consider allocating more budget there as you scale.
      </div>
      <div class="proj-tip content-tip">
        <strong>Content: ${ct.label}</strong> — ${ct.tip}
      </div>

      <div class="proj-footer">
        Over <strong>${duration} month${duration > 1 ? 's' : ''}</strong> — Total spend: <strong>$${totalBudget.toLocaleString()}</strong>
        &nbsp;|&nbsp; Est. total ${goalLabel[goal].toLowerCase()}: <strong>${fmt(totalConversions)}</strong>
      </div>
    </div>
  `;
}

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

// === PERFORMANCE MARKETER ===

let perfFormatVal   = 'static';
let perfPlatformVal = 'meta';

function selectPerfPill(el, groupId) {
  document.querySelectorAll('#' + groupId + ' .pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  if (groupId === 'perfFormat')   perfFormatVal   = el.dataset.val;
  if (groupId === 'perfPlatform') perfPlatformVal = el.dataset.val;
}

function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const placeholder = document.getElementById('uploadPlaceholder');
  const preview     = document.getElementById('uploadPreview');
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => {
      preview.src = ev.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } else {
    placeholder.innerHTML = `<div class="upload-icon">🎬</div><p class="upload-text">${file.name}</p><p class="upload-hint">Video ready for analysis</p>`;
  }
}

// Drag-and-drop
document.addEventListener('DOMContentLoaded', () => {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      document.getElementById('fileInput').files = dt.files;
      handleUpload({ target: { files: [file] } });
    }
  });
});

function analyzePerformance() {
  const budget   = parseFloat(document.getElementById('perfBudget').value) || 0;
  const goal     = document.getElementById('perfGoal').value;
  const copy     = document.getElementById('perfCopy').value.trim();
  const audience = document.getElementById('perfAudience').value.trim();
  const platform = perfPlatformVal;
  const format   = perfFormatVal;
  const hasVisual = document.getElementById('uploadPreview').style.display === 'block' ||
                    document.getElementById('uploadPlaceholder').querySelector('.upload-text')?.textContent !== 'Drop your image or video here';

  if (budget < 50) {
    showPerfError('Please enter a monthly budget of at least $50.');
    return;
  }

  // Score components (0–100 each)
  const budgetScore  = Math.min(100, (budget / 2000) * 100);
  const copyScore    = copy.length > 20 ? Math.min(100, 50 + copy.length) : 30;
  const audScore     = audience.length > 10 ? 80 : 40;
  const visualScore  = hasVisual ? 90 : 55;

  const formatBonus  = { static: 0, carousel: 10, reels: 15, story: 5 };
  const platformConf = { meta: 85, google: 80, tiktok: 75, linkedin: 70, youtube: 72 };

  const rawScore = (budgetScore * 0.25) + (copyScore * 0.2) + (audScore * 0.15) +
                   (visualScore * 0.2) + (platformConf[platform] * 0.2) + (formatBonus[format] || 0);
  const score = Math.min(99, Math.round(rawScore));

  // Projected metrics
  const pd  = platformData[platform];
  const ct  = contentData[format] || contentData.static;
  const adjCPC = pd.cpc * (1 / ct.ctrMult);
  const clicks = Math.round(budget / adjCPC);
  const impressions = Math.round((budget / (pd.cpm * ct.cpmMult)) * 1000);
  const convRate = pd.cvr * ct.cvrMult;
  const conversions = Math.round(clicks * convRate);
  const cpa = conversions > 0 ? (budget / conversions).toFixed(0) : '—';
  const ctr = ((clicks / impressions) * 100).toFixed(2);

  const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D';
  const gradeColor = { A: '#10b981', B: '#a855f7', C: '#f59e0b', D: '#ef4444' };
  const gradeMsg = { A: 'Excellent setup', B: 'Good — room to grow', C: 'Needs improvement', D: 'Major gaps to fix' };

  // Guidance
  const tips = buildGuidance({ budget, copy, audience, hasVisual, format, platform, goal, score });

  document.getElementById('perfResults').innerHTML = `
    <div class="perf-output">

      <!-- Score ring -->
      <div class="score-header">
        <div class="score-ring" style="--score:${score};--clr:${gradeColor[grade]}">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e9e4ff" stroke-width="8"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="${gradeColor[grade]}" stroke-width="8"
              stroke-dasharray="${(score / 100) * 264} 264"
              stroke-linecap="round" transform="rotate(-90 50 50)" style="transition:stroke-dasharray 1s ease"/>
          </svg>
          <div class="score-inner">
            <span class="score-num" style="color:${gradeColor[grade]}">${score}</span>
            <span class="score-label">/ 100</span>
          </div>
        </div>
        <div class="score-meta">
          <div class="score-grade" style="color:${gradeColor[grade]}">Grade ${grade}</div>
          <div class="score-msg">${gradeMsg[grade]}</div>
          <div class="score-tags">
            <span class="stag">${platform.charAt(0).toUpperCase()+platform.slice(1)}</span>
            <span class="stag">${format.charAt(0).toUpperCase()+format.slice(1)}</span>
            <span class="stag">$${budget}/mo</span>
          </div>
        </div>
      </div>

      <!-- Metrics -->
      <div class="perf-metrics">
        <div class="pmet"><span>${fmt(impressions)}</span><em>Impressions/mo</em></div>
        <div class="pmet"><span>${fmt(clicks)}</span><em>Clicks/mo</em></div>
        <div class="pmet accent"><span>${fmt(conversions)}</span><em>${goalLabel[goal]}/mo</em></div>
        <div class="pmet"><span>$${cpa}</span><em>Cost Per Result</em></div>
        <div class="pmet"><span>${ctr}%</span><em>Est. CTR</em></div>
        <div class="pmet"><span>${(convRate*100).toFixed(1)}%</span><em>Conv. Rate</em></div>
      </div>

      <!-- Guidance -->
      <div class="guidance-list">
        <h4 class="guidance-title">Performance Guidance</h4>
        ${tips.map(t => `
          <div class="guidance-item ${t.type}">
            <span class="g-icon">${t.icon}</span>
            <div>
              <strong>${t.title}</strong>
              <p>${t.body}</p>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

function buildGuidance({ budget, copy, audience, hasVisual, format, platform, goal, score }) {
  const tips = [];

  if (!hasVisual) tips.push({ type:'warn', icon:'🖼️', title:'Add Your Creative', body:'Uploading your actual ad visual allows for a much more accurate analysis. Ads with strong visuals get 38% higher CTR.' });

  if (copy.length < 20) tips.push({ type:'warn', icon:'✍️', title:'Ad Copy Too Short', body:'Add your headline or caption. Strong copy directly impacts your Quality Score and CTR — platform algorithms reward relevance.' });
  else if (copy.length > 0) {
    const hasQuestion = copy.includes('?');
    const hasNumber   = /\d/.test(copy);
    const hasCTA      = /shop|buy|get|try|start|join|learn|discover|click|sign|free/i.test(copy);
    if (!hasCTA)      tips.push({ type:'warn', icon:'📣', title:'Missing Call-to-Action', body:'Your copy doesn\'t have a clear CTA. Add words like "Shop Now", "Get Started", or "Claim Offer" to drive clicks.' });
    if (hasQuestion)  tips.push({ type:'good', icon:'✅', title:'Great — You Used a Question', body:'Questions in ad copy increase engagement by up to 15% because they prompt viewers to self-identify.' });
    if (hasNumber)    tips.push({ type:'good', icon:'✅', title:'Numbers in Copy — Nice', body:'Specific numbers (like "20% off" or "500+ customers") boost credibility and click-through rates.' });
  }

  if (!audience) tips.push({ type:'warn', icon:'🎯', title:'Define Your Audience', body:'A specific target audience description helps the algorithm deliver your ad to the right people, reducing wasted spend.' });

  if (budget < 300 && platform === 'linkedin') tips.push({ type:'warn', icon:'💰', title:'Budget Low for LinkedIn', body:'LinkedIn has higher CPCs ($5–$8). We recommend at least $500/month to gather enough data to optimise.' });
  if (budget < 200 && platform === 'google')   tips.push({ type:'warn', icon:'💰', title:'Budget Low for Google Search', body:'Google Search needs enough budget to gather conversion data. Consider $300+/month for meaningful results.' });

  if (format === 'static' && platform === 'tiktok') tips.push({ type:'tip', icon:'💡', title:'Switch to Video for TikTok', body:'Static images underperform heavily on TikTok. Reels and short videos see 3–5x more reach on this platform.' });
  if (format === 'reels')  tips.push({ type:'good', icon:'🚀', title:'Video Format — Smart Choice', body:'Video ads drive 30% more conversions than static on most platforms. You\'re set up for strong performance.' });
  if (format === 'carousel') tips.push({ type:'good', icon:'✅', title:'Carousel = Higher Engagement', body:'Carousel ads let users swipe through multiple offers. Great for e-commerce and storytelling.' });

  if (goal === 'awareness' && budget < 500) tips.push({ type:'tip', icon:'📊', title:'Awareness Needs Reach', body:'Brand awareness campaigns need volume. Allocate at least $500/month to build meaningful recall with your audience.' });
  if (goal === 'leads')   tips.push({ type:'tip', icon:'📋', title:'Use Lead Gen Forms', body:'On Meta and LinkedIn, native Lead Gen Forms convert 2–3x better than landing page links — no page load friction.' });
  if (goal === 'sales')   tips.push({ type:'tip', icon:'🛒', title:'Install Your Pixel First', body:'Make sure your Meta Pixel or Google Tag is installed on your site before spending. Retargeting lifts conversion rates by 10x.' });

  if (score >= 80) tips.push({ type:'good', icon:'⭐', title:'Strong Setup — Ready to Scale', body:'Your campaign is well-configured. Consider A/B testing 2–3 ad variations and scaling your budget 20% per week on winners.' });

  return tips.slice(0, 6);
}

function showPerfError(msg) {
  document.getElementById('perfResults').innerHTML = `
    <div class="result-placeholder"><div class="placeholder-icon">⚠️</div><p>${msg}</p></div>`;
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
