/* ── State ─────────────────────────────────────────────── */
const DB = {
  get tasks()    { return JSON.parse(localStorage.getItem('crm_tasks')    || '[]'); },
  set tasks(v)   { localStorage.setItem('crm_tasks',    JSON.stringify(v)); },
  get contacts() { return JSON.parse(localStorage.getItem('crm_contacts') || '[]'); },
  set contacts(v){ localStorage.setItem('crm_contacts', JSON.stringify(v)); },
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/* ── Navigation ────────────────────────────────────────── */
function navigate(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (nav) nav.classList.add('active');

  if (view === 'dashboard') renderDashboard();
  if (view === 'tasks')     renderTasksTable();
  if (view === 'contacts')  renderContacts();
  if (view === 'pipeline')  renderPipeline();
}

document.querySelectorAll('.nav-item').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    navigate(a.dataset.view);
  });
});

document.querySelectorAll('[data-view]').forEach(el => {
  if (el.tagName === 'A' && !el.classList.contains('nav-item')) {
    el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.view); });
  }
});

/* ── Toast ─────────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Modals ────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.getElementById('closeTaskModal').addEventListener('click',    () => closeModal('taskModal'));
document.getElementById('cancelTask').addEventListener('click',        () => closeModal('taskModal'));
document.getElementById('closeContactModal').addEventListener('click', () => closeModal('contactModal'));
document.getElementById('cancelContact').addEventListener('click',     () => closeModal('contactModal'));
document.getElementById('closeDeleteModal').addEventListener('click',  () => closeModal('deleteModal'));
document.getElementById('cancelDelete').addEventListener('click',      () => closeModal('deleteModal'));

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

/* ── Task Form ─────────────────────────────────────────── */
function resetTaskForm() {
  document.getElementById('taskId').value = '';
  document.getElementById('taskName').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskAssignee').value = '';
  document.getElementById('taskDue').value = '';
  document.getElementById('taskPriority').value = 'Medium';
  document.getElementById('taskStatus').value = 'Todo';
  document.getElementById('taskTags').value = '';
  document.getElementById('modalTitle').textContent = 'New Task';
}

function openTaskModal(task = null) {
  resetTaskForm();
  if (task) {
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskDesc').value = task.desc || '';
    document.getElementById('taskAssignee').value = task.assignee;
    document.getElementById('taskDue').value = task.due || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskTags').value = (task.tags || []).join(', ');
  }
  openModal('taskModal');
}

document.getElementById('dashAddTask').addEventListener('click',     () => openTaskModal());
document.getElementById('tasksAddTask').addEventListener('click',    () => openTaskModal());
document.getElementById('pipelineAddTask').addEventListener('click', () => openTaskModal());

document.getElementById('taskForm').addEventListener('submit', e => {
  e.preventDefault();
  const id   = document.getElementById('taskId').value;
  const name = document.getElementById('taskName').value.trim();
  const assignee = document.getElementById('taskAssignee').value.trim();
  if (!name || !assignee) return;

  const task = {
    id:       id || uid(),
    name,
    desc:     document.getElementById('taskDesc').value.trim(),
    assignee,
    due:      document.getElementById('taskDue').value,
    priority: document.getElementById('taskPriority').value,
    status:   document.getElementById('taskStatus').value,
    tags:     document.getElementById('taskTags').value
               .split(',').map(t => t.trim()).filter(Boolean),
    createdAt: id ? undefined : new Date().toISOString(),
  };

  const tasks = DB.tasks;
  if (id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx > -1) {
      task.createdAt = tasks[idx].createdAt;
      tasks[idx] = task;
    }
    showToast('Task updated');
  } else {
    tasks.unshift(task);
    showToast('Task created');
  }
  DB.tasks = tasks;
  closeModal('taskModal');
  refreshCurrentView();
});

/* ── Contact Form ──────────────────────────────────────── */
function resetContactForm() {
  document.getElementById('contactId').value = '';
  document.getElementById('contactName').value = '';
  document.getElementById('contactCompany').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactPhone').value = '';
  document.getElementById('contactStage').value = 'Lead';
  document.getElementById('contactNotes').value = '';
  document.getElementById('contactModalTitle').textContent = 'New Contact';
}

function openContactModal(contact = null) {
  resetContactForm();
  if (contact) {
    document.getElementById('contactModalTitle').textContent = 'Edit Contact';
    document.getElementById('contactId').value = contact.id;
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactCompany').value = contact.company || '';
    document.getElementById('contactEmail').value = contact.email || '';
    document.getElementById('contactPhone').value = contact.phone || '';
    document.getElementById('contactStage').value = contact.stage;
    document.getElementById('contactNotes').value = contact.notes || '';
  }
  openModal('contactModal');
}

document.getElementById('contactsAddContact').addEventListener('click', () => openContactModal());

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const id   = document.getElementById('contactId').value;
  const name = document.getElementById('contactName').value.trim();
  if (!name) return;

  const contact = {
    id:       id || uid(),
    name,
    company:  document.getElementById('contactCompany').value.trim(),
    email:    document.getElementById('contactEmail').value.trim(),
    phone:    document.getElementById('contactPhone').value.trim(),
    stage:    document.getElementById('contactStage').value,
    notes:    document.getElementById('contactNotes').value.trim(),
    createdAt: id ? undefined : new Date().toISOString(),
  };

  const contacts = DB.contacts;
  if (id) {
    const idx = contacts.findIndex(c => c.id === id);
    if (idx > -1) {
      contact.createdAt = contacts[idx].createdAt;
      contacts[idx] = contact;
    }
    showToast('Contact updated');
  } else {
    contacts.unshift(contact);
    showToast('Contact added');
  }
  DB.contacts = contacts;
  closeModal('contactModal');
  renderContacts();
});

/* ── Delete ────────────────────────────────────────────── */
let pendingDelete = null;

function confirmDelete(type, id, label) {
  pendingDelete = { type, id };
  document.getElementById('deleteMessage').textContent =
    `Delete "${label}"? This cannot be undone.`;
  openModal('deleteModal');
}

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (!pendingDelete) return;
  const { type, id } = pendingDelete;
  if (type === 'task') {
    DB.tasks = DB.tasks.filter(t => t.id !== id);
    showToast('Task deleted');
    refreshCurrentView();
  } else if (type === 'contact') {
    DB.contacts = DB.contacts.filter(c => c.id !== id);
    showToast('Contact deleted');
    renderContacts();
  }
  pendingDelete = null;
  closeModal('deleteModal');
});

/* ── Helpers ───────────────────────────────────────────── */
function priorityBadge(p) {
  const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
  return `<span class="badge ${map[p] || ''}">${p}</span>`;
}

function statusBadge(s) {
  const map = { 'Todo': 'badge-todo', 'In Progress': 'badge-inprogress', 'Review': 'badge-review', 'Done': 'badge-done' };
  const cls = map[s] || 'badge-todo';
  return `<span class="badge ${cls}">${s}</span>`;
}

function stageBadge(s) {
  const map = { Lead: 'badge-lead', Prospect: 'badge-prospect', Qualified: 'badge-qualified', Proposal: 'badge-proposal', Customer: 'badge-customer' };
  return `<span class="badge ${map[s] || 'badge-lead'}">${s}</span>`;
}

function formatDate(d) {
  if (!d) return '—';
  const date = new Date(d + 'T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const diff  = Math.floor((date - today) / 86400000);
  const fmt   = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (diff < 0)  return `<span class="due-overdue" title="Overdue">${fmt}</span>`;
  if (diff <= 3) return `<span class="due-soon" title="Due soon">${fmt}</span>`;
  return fmt;
}

function initials(name) {
  return (name || '?').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
}

function refreshCurrentView() {
  const active = document.querySelector('.view.active');
  if (!active) return;
  const id = active.id.replace('view-', '');
  if (id === 'dashboard') renderDashboard();
  if (id === 'tasks')     renderTasksTable();
  if (id === 'pipeline')  renderPipeline();
}

/* ── Dashboard ─────────────────────────────────────────── */
function renderDashboard() {
  const tasks   = DB.tasks;
  const today   = new Date(); today.setHours(0,0,0,0);
  const total      = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done       = tasks.filter(t => t.status === 'Done').length;
  const overdue    = tasks.filter(t => t.due && new Date(t.due + 'T00:00:00') < today && t.status !== 'Done').length;

  document.getElementById('stat-total').textContent     = total;
  document.getElementById('stat-inprogress').textContent = inProgress;
  document.getElementById('stat-done').textContent       = done;
  document.getElementById('stat-overdue').textContent    = overdue;

  // Recent tasks
  const container = document.getElementById('recent-tasks');
  const recent = tasks.slice(0, 6);
  if (!recent.length) {
    container.innerHTML = '<div class="empty-state" style="padding:30px"><p>No tasks yet.</p></div>';
  } else {
    container.innerHTML = recent.map(t => `
      <div class="task-item">
        <div class="task-check ${t.status === 'Done' ? 'done' : ''}"
             data-id="${t.id}" title="${t.status === 'Done' ? 'Mark todo' : 'Mark done'}"></div>
        <div class="task-info">
          <div class="task-name ${t.status === 'Done' ? 'done' : ''}">${escHtml(t.name)}</div>
          <div class="task-meta">${escHtml(t.assignee)} · ${formatDate(t.due) || 'No due date'}</div>
        </div>
        ${priorityBadge(t.priority)}
      </div>
    `).join('');

    container.querySelectorAll('.task-check').forEach(el => {
      el.addEventListener('click', () => toggleTaskDone(el.dataset.id));
    });
  }

  // Priority chart
  const high   = tasks.filter(t => t.priority === 'High').length;
  const medium = tasks.filter(t => t.priority === 'Medium').length;
  const low    = tasks.filter(t => t.priority === 'Low').length;
  const chart  = document.getElementById('priority-chart');
  chart.innerHTML = [
    { label: 'High',   count: high,   cls: 'fill-high' },
    { label: 'Medium', count: medium, cls: 'fill-medium' },
    { label: 'Low',    count: low,    cls: 'fill-low' },
  ].map(({ label, count, cls }) => {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return `
      <div class="priority-row">
        <div class="priority-label"><span>${label}</span><span>${count}</span></div>
        <div class="priority-bar-track">
          <div class="priority-bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');
}

function toggleTaskDone(id) {
  const tasks = DB.tasks;
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.status = t.status === 'Done' ? 'Todo' : 'Done';
  DB.tasks = tasks;
  refreshCurrentView();
}

/* ── Tasks Table ───────────────────────────────────────── */
function renderTasksTable() {
  const search   = (document.getElementById('taskSearch').value   || '').toLowerCase();
  const fStatus  = document.getElementById('filterStatus').value  || '';
  const fPriority= document.getElementById('filterPriority').value|| '';
  const fAssignee= document.getElementById('filterAssignee').value|| '';

  let tasks = DB.tasks;

  // Populate assignee filter
  const assignees = [...new Set(tasks.map(t => t.assignee))].sort();
  const sel = document.getElementById('filterAssignee');
  const curVal = sel.value;
  sel.innerHTML = '<option value="">All Assignees</option>' +
    assignees.map(a => `<option value="${a}" ${a===curVal?'selected':''}>${escHtml(a)}</option>`).join('');

  if (search)    tasks = tasks.filter(t => t.name.toLowerCase().includes(search) || (t.assignee||'').toLowerCase().includes(search));
  if (fStatus)   tasks = tasks.filter(t => t.status   === fStatus);
  if (fPriority) tasks = tasks.filter(t => t.priority === fPriority);
  if (fAssignee) tasks = tasks.filter(t => t.assignee === fAssignee);

  const tbody = document.getElementById('tasks-tbody');
  const empty = document.getElementById('tasks-empty');

  if (!tasks.length) {
    tbody.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = tasks.map(t => `
    <tr>
      <td>
        <div class="td-name">${escHtml(t.name)}</div>
        ${t.desc ? `<div class="td-desc">${escHtml(t.desc.slice(0,80))}${t.desc.length > 80 ? '…' : ''}</div>` : ''}
        <div style="margin-top:4px">${(t.tags||[]).map(tag => `<span class="tag">${escHtml(tag)}</span>`).join('')}</div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:7px">
          <div class="mini-avatar">${initials(t.assignee)}</div>
          <span>${escHtml(t.assignee)}</span>
        </div>
      </td>
      <td>${priorityBadge(t.priority)}</td>
      <td>${statusBadge(t.status)}</td>
      <td>${formatDate(t.due)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon" title="Edit" onclick="openTaskModal(DB.tasks.find(t=>t.id==='${t.id}'))">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" title="Delete" style="color:var(--red)" onclick="confirmDelete('task','${t.id}','${escHtml(t.name).replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Live filters
['taskSearch','filterStatus','filterPriority','filterAssignee'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderTasksTable);
});

/* ── Contacts ──────────────────────────────────────────── */
function renderContacts() {
  const contacts = DB.contacts;
  const tbody = document.getElementById('contacts-tbody');
  const empty = document.getElementById('contacts-empty');

  if (!contacts.length) {
    tbody.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = contacts.map(c => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="mini-avatar" style="width:30px;height:30px;font-size:11px">${initials(c.name)}</div>
          <div class="td-name">${escHtml(c.name)}</div>
        </div>
      </td>
      <td>${escHtml(c.company || '—')}</td>
      <td>${c.email ? `<a href="mailto:${escHtml(c.email)}" style="color:var(--primary)">${escHtml(c.email)}</a>` : '—'}</td>
      <td>${escHtml(c.phone || '—')}</td>
      <td>${stageBadge(c.stage)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon" title="Edit" onclick="openContactModal(DB.contacts.find(c=>c.id==='${c.id}'))">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" title="Delete" style="color:var(--red)" onclick="confirmDelete('contact','${c.id}','${escHtml(c.name).replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ── Pipeline (Kanban) ─────────────────────────────────── */
function renderPipeline() {
  const statuses = ['Todo', 'In Progress', 'Review', 'Done'];
  const tasks    = DB.tasks;
  const board    = document.getElementById('kanban-board');

  board.innerHTML = statuses.map(status => {
    const col = tasks.filter(t => t.status === status);
    return `
      <div class="kanban-col">
        <div class="kanban-col-header">
          <span>${status}</span>
          <span class="kanban-count">${col.length}</span>
        </div>
        <div class="kanban-cards">
          ${col.map(t => `
            <div class="kanban-card" onclick="openTaskModal(DB.tasks.find(t=>t.id==='${t.id}'))">
              <div class="kanban-card-title">${escHtml(t.name)}</div>
              <div class="kanban-card-meta">
                ${priorityBadge(t.priority)}
                <div class="kanban-card-assignee">
                  <div class="mini-avatar">${initials(t.assignee)}</div>
                  ${escHtml(t.assignee)}
                </div>
              </div>
              ${t.due ? `<div style="font-size:11px;margin-top:6px;color:var(--text-muted)">Due ${formatDate(t.due)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/* ── XSS Guard ─────────────────────────────────────────── */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ── Seed Demo Data ────────────────────────────────────── */
function seedIfEmpty() {
  if (DB.tasks.length) return;
  const today = new Date();
  const d = n => {
    const x = new Date(today); x.setDate(x.getDate() + n);
    return x.toISOString().split('T')[0];
  };
  DB.tasks = [
    { id: uid(), name: 'Launch Q2 Email Campaign',   assignee: 'Sarah Kim',    priority: 'High',   status: 'In Progress', due: d(2),  tags: ['email','q2'],    desc: 'Set up drip campaign for Q2 product launch.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Design Social Media Banners', assignee: 'Tom Rivera',  priority: 'Medium', status: 'Todo',        due: d(5),  tags: ['design','social'],desc: 'Create banner assets for Instagram and LinkedIn.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Update Landing Page Copy',    assignee: 'Aisha Patel', priority: 'High',   status: 'Review',      due: d(-1), tags: ['copy','web'],     desc: 'Refresh homepage headline and sub-copy.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Competitor Analysis Report',  assignee: 'Sarah Kim',   priority: 'Medium', status: 'Done',        due: d(-3), tags: ['research'],       desc: 'Quarterly competitive landscape overview.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Plan Webinar for May',         assignee: 'Tom Rivera',  priority: 'Low',    status: 'Todo',        due: d(14), tags: ['events','webinar'],desc: 'Coordinate speakers and registration page.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'A/B Test Ad Copy',             assignee: 'Aisha Patel', priority: 'Medium', status: 'In Progress', due: d(7),  tags: ['ads','testing'],  desc: 'Run two variants on Google Ads.', createdAt: new Date().toISOString() },
  ];
  DB.contacts = [
    { id: uid(), name: 'James Carter',  company: 'TechFlow Inc.',   email: 'james@techflow.io',   phone: '+1 555-0101', stage: 'Customer',  notes: 'Key account, renews in Sept.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Priya Mehta',   company: 'BrightSpark Co.', email: 'priya@brightspark.co',phone: '+1 555-0202', stage: 'Prospect',  notes: 'Interested in premium plan.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Carlos Diaz',   company: 'NovaBrand',       email: 'c.diaz@novabrand.com', phone: '+1 555-0303', stage: 'Lead',      notes: 'Met at MarketConf 2026.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Emma Wilson',   company: 'GrowthLab',       email: 'emma@growthlab.io',   phone: '+1 555-0404', stage: 'Qualified', notes: 'Requested proposal for Q3.', createdAt: new Date().toISOString() },
  ];
}

/* ── Init ──────────────────────────────────────────────── */
seedIfEmpty();
navigate('dashboard');
