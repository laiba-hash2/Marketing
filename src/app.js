/* ── State ─────────────────────────────────────────────── */
const DB = {
  get tasks()    { return JSON.parse(localStorage.getItem('crm_tasks')    || '[]'); },
  set tasks(v)   { localStorage.setItem('crm_tasks',    JSON.stringify(v)); },
  get contacts() { return JSON.parse(localStorage.getItem('crm_contacts') || '[]'); },
  set contacts(v){ localStorage.setItem('crm_contacts', JSON.stringify(v)); },
  get assets()   { return JSON.parse(localStorage.getItem('crm_assets')   || '[]'); },
  set assets(v)  { localStorage.setItem('crm_assets',   JSON.stringify(v)); },
  get notifications() { return JSON.parse(localStorage.getItem('crm_notifs') || '[]'); },
  set notifications(v){ localStorage.setItem('crm_notifs', JSON.stringify(v)); },
  get currentUser()   { return localStorage.getItem('crm_user') || 'CEO'; },
  set currentUser(v)  { localStorage.setItem('crm_user', v); },
};

const USERS = ['CEO', 'Sarah Kim', 'Tom Rivera', 'Aisha Patel'];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/* ── XSS Guard ─────────────────────────────────────────── */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

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

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

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
  if (view === 'ceo')       renderCEOView();
  if (view === 'assets')    renderAssets();
}

document.querySelectorAll('.nav-item').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); navigate(a.dataset.view); });
});

document.querySelectorAll('[data-view]').forEach(el => {
  if (el.tagName === 'A' && !el.classList.contains('nav-item')) {
    el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.view); });
  }
});

/* ── User Switcher ─────────────────────────────────────── */
function renderUserSwitcher() {
  const u = DB.currentUser;
  document.getElementById('currentUserName').textContent = u;
  document.getElementById('currentUserRole').textContent = u === 'CEO' ? 'CEO Account' : 'Team Member';
  document.getElementById('currentUserAvatar').textContent = initials(u);
}

document.getElementById('switchUserBtn').addEventListener('click', () => {
  const list = document.getElementById('userList');
  list.innerHTML = USERS.map(u => `
    <div class="user-option ${DB.currentUser === u ? 'active' : ''}" data-user="${escHtml(u)}">
      <div class="user-avatar" style="width:32px;height:32px;font-size:12px">${initials(u)}</div>
      <div>
        <div style="font-weight:600;font-size:13px">${escHtml(u)}</div>
        <div style="font-size:11px;color:var(--text-muted)">${u === 'CEO' ? 'CEO Account' : 'Team Member'}</div>
      </div>
      ${DB.currentUser === u ? '<span style="margin-left:auto;color:var(--primary);font-size:12px">✓ Active</span>' : ''}
    </div>
  `).join('');
  list.querySelectorAll('.user-option').forEach(el => {
    el.addEventListener('click', () => {
      DB.currentUser = el.dataset.user;
      renderUserSwitcher();
      closeModal('userModal');
      showToast('Switched to ' + el.dataset.user);
      renderNotifCount();
      refreshCurrentView();
    });
  });
  openModal('userModal');
});

document.getElementById('closeUserModal').addEventListener('click', () => closeModal('userModal'));

/* ── Notifications ─────────────────────────────────────── */
function renderNotifCount() {
  const unread = DB.notifications.filter(n => n.to === DB.currentUser && !n.read).length;
  const badge = document.getElementById('notifCount');
  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}

function renderNotifPanel() {
  const notifs = DB.notifications.filter(n => n.to === DB.currentUser);
  const body = document.getElementById('notifPanelBody');
  if (!notifs.length) {
    body.innerHTML = '<div class="notif-empty">No notifications yet</div>';
    return;
  }
  body.innerHTML = notifs.slice().reverse().map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
      <div class="notif-avatar">${initials(n.from)}</div>
      <div class="notif-content">
        <div class="notif-msg">${escHtml(n.message)}</div>
        <div class="notif-time">${timeAgo(n.createdAt)}</div>
      </div>
      ${!n.read ? '<div class="notif-dot"></div>' : ''}
    </div>
  `).join('');
  body.querySelectorAll('.notif-item').forEach(el => {
    el.addEventListener('click', () => {
      const all = DB.notifications;
      const idx = all.findIndex(n => n.id === el.dataset.id);
      if (idx > -1) { all[idx].read = true; DB.notifications = all; }
      renderNotifPanel();
      renderNotifCount();
    });
  });
}

document.getElementById('notifBellBtn').addEventListener('click', () => {
  document.getElementById('notifPanel').classList.toggle('open');
  document.getElementById('notifBackdrop').classList.toggle('open');
  renderNotifPanel();
});

document.getElementById('notifBackdrop').addEventListener('click', () => {
  document.getElementById('notifPanel').classList.remove('open');
  document.getElementById('notifBackdrop').classList.remove('open');
});

document.getElementById('markAllReadBtn').addEventListener('click', () => {
  const all = DB.notifications.map(n => n.to === DB.currentUser ? { ...n, read: true } : n);
  DB.notifications = all;
  renderNotifPanel();
  renderNotifCount();
});

function sendNotifications(recipients, message, taskName) {
  const all = DB.notifications;
  recipients.forEach(to => {
    all.unshift({ id: uid(), from: DB.currentUser, to, message, taskName, read: false, createdAt: new Date().toISOString() });
  });
  DB.notifications = all;
  renderNotifCount();
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

/* ── Helpers ───────────────────────────────────────────── */
function priorityBadge(p) {
  const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
  return `<span class="badge ${map[p] || ''}">${p}</span>`;
}

function statusBadge(s) {
  const map = { 'Todo': 'badge-todo', 'In Progress': 'badge-inprogress', 'Review': 'badge-review', 'Done': 'badge-done' };
  return `<span class="badge ${map[s] || 'badge-todo'}">${s}</span>`;
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
  if (diff < 0)  return `<span class="due-overdue">${fmt}</span>`;
  if (diff <= 3) return `<span class="due-soon">${fmt}</span>`;
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
  if (id === 'ceo')       renderCEOView();
  if (id === 'assets')    renderAssets();
}

/* ── CEO View ──────────────────────────────────────────── */
function renderCEOView() {
  const tasks    = DB.tasks;
  const ongoing  = tasks.filter(t => t.status !== 'Done');
  const done     = tasks.filter(t => t.status === 'Done');

  // Stats
  const today = new Date(); today.setHours(0,0,0,0);
  const statsGrid = document.getElementById('ceo-stats-grid');
  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon stat-icon--blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div>
      <div class="stat-body"><span class="stat-label">Total Tasks</span><span class="stat-value">${tasks.length}</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon--yellow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
      <div class="stat-body"><span class="stat-label">Ongoing</span><span class="stat-value">${ongoing.length}</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon--green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="stat-body"><span class="stat-label">Completed</span><span class="stat-value">${done.length}</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon--red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <div class="stat-body"><span class="stat-label">Overdue</span><span class="stat-value">${tasks.filter(t => t.due && new Date(t.due+'T00:00:00') < today && t.status !== 'Done').length}</span></div>
    </div>
  `;

  // Ongoing
  document.getElementById('ceo-ongoing-count').textContent = ongoing.length;
  const ongoingTbody = document.getElementById('ceo-ongoing-tbody');
  const ongoingEmpty = document.getElementById('ceo-ongoing-empty');
  if (!ongoing.length) {
    ongoingTbody.innerHTML = '';
    ongoingEmpty.style.display = '';
  } else {
    ongoingEmpty.style.display = 'none';
    ongoingTbody.innerHTML = ongoing.map(t => `
      <tr>
        <td>
          <div class="td-name">${escHtml(t.name)}</div>
          ${t.desc ? `<div class="td-desc">${escHtml(t.desc.slice(0,80))}${t.desc.length>80?'…':''}</div>` : ''}
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
      </tr>
    `).join('');
  }

  // Completed
  document.getElementById('ceo-done-count').textContent = done.length;
  const doneTbody = document.getElementById('ceo-done-tbody');
  const doneEmpty = document.getElementById('ceo-done-empty');
  if (!done.length) {
    doneTbody.innerHTML = '';
    doneEmpty.style.display = '';
  } else {
    doneEmpty.style.display = 'none';
    doneTbody.innerHTML = done.map(t => {
      const subs = t.submissions || [];
      const subsHtml = subs.length
        ? subs.map(s => s.type === 'link'
            ? `<a href="${escHtml(s.url)}" target="_blank" class="deliverable-chip link-chip" title="${escHtml(s.note||'')}">🔗 ${escHtml(s.label||s.url)}</a>`
            : `<span class="deliverable-chip file-chip" title="${escHtml(s.note||'')}">📎 ${escHtml(s.name)}</span>`
          ).join('')
        : '<span style="color:var(--text-muted);font-size:12px">None yet</span>';
      return `
        <tr>
          <td><div class="td-name">${escHtml(t.name)}</div></td>
          <td>
            <div style="display:flex;align-items:center;gap:7px">
              <div class="mini-avatar">${initials(t.assignee)}</div>
              <span>${escHtml(t.assignee)}</span>
            </div>
          </td>
          <td><div class="deliverables-cell">${subsHtml}</div></td>
          <td style="font-size:12px;color:var(--text-muted)">${t.completedAt ? new Date(t.completedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}</td>
        </tr>
      `;
    }).join('');
  }
}

/* ── Dashboard ─────────────────────────────────────────── */
function renderDashboard() {
  const tasks   = DB.tasks;
  const today   = new Date(); today.setHours(0,0,0,0);
  const total      = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done       = tasks.filter(t => t.status === 'Done').length;
  const overdue    = tasks.filter(t => t.due && new Date(t.due + 'T00:00:00') < today && t.status !== 'Done').length;

  document.getElementById('stat-total').textContent      = total;
  document.getElementById('stat-inprogress').textContent = inProgress;
  document.getElementById('stat-done').textContent       = done;
  document.getElementById('stat-overdue').textContent    = overdue;

  const container = document.getElementById('recent-tasks');
  const recent = tasks.slice(0, 6);
  if (!recent.length) {
    container.innerHTML = '<div class="empty-state" style="padding:30px"><p>No tasks yet. Click "+ New Task" to create one.</p></div>';
  } else {
    container.innerHTML = recent.map(t => `
      <div class="task-item">
        <div class="task-check ${t.status === 'Done' ? 'done' : ''}" data-id="${t.id}"></div>
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
        <div class="priority-bar-track"><div class="priority-bar-fill ${cls}" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');
}

function toggleTaskDone(id) {
  const tasks = DB.tasks;
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.status = t.status === 'Done' ? 'Todo' : 'Done';
  if (t.status === 'Done') t.completedAt = new Date().toISOString();
  DB.tasks = tasks;
  refreshCurrentView();
}

/* ── Task Modal ────────────────────────────────────────── */
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

document.getElementById('closeTaskModal').addEventListener('click', () => closeModal('taskModal'));
document.getElementById('cancelTask').addEventListener('click',     () => closeModal('taskModal'));
document.getElementById('dashAddTask').addEventListener('click',    () => openTaskModal());
document.getElementById('tasksAddTask').addEventListener('click',   () => openTaskModal());
document.getElementById('pipelineAddTask').addEventListener('click',() => openTaskModal());

document.getElementById('taskForm').addEventListener('submit', e => {
  e.preventDefault();
  const id      = document.getElementById('taskId').value;
  const name    = document.getElementById('taskName').value.trim();
  const assignee= document.getElementById('taskAssignee').value.trim();
  if (!name || !assignee) return;

  const task = {
    id:       id || uid(),
    name,
    desc:     document.getElementById('taskDesc').value.trim(),
    assignee,
    due:      document.getElementById('taskDue').value,
    priority: document.getElementById('taskPriority').value,
    status:   document.getElementById('taskStatus').value,
    tags:     document.getElementById('taskTags').value.split(',').map(t => t.trim()).filter(Boolean),
    createdAt: id ? undefined : new Date().toISOString(),
  };

  if (task.status === 'Done' && !task.completedAt) task.completedAt = new Date().toISOString();

  const tasks = DB.tasks;
  if (id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx > -1) {
      task.createdAt   = tasks[idx].createdAt;
      task.submissions = tasks[idx].submissions || [];
      task.completedAt = tasks[idx].completedAt || task.completedAt;
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

/* ── Tasks Table ───────────────────────────────────────── */
function renderTasksTable() {
  const search    = (document.getElementById('taskSearch').value   || '').toLowerCase();
  const fStatus   = document.getElementById('filterStatus').value  || '';
  const fPriority = document.getElementById('filterPriority').value|| '';
  const fAssignee = document.getElementById('filterAssignee').value|| '';

  let tasks = DB.tasks;

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

  if (!tasks.length) { tbody.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';

  tbody.innerHTML = tasks.map(t => {
    const subs = t.submissions || [];
    const subsCell = subs.length
      ? subs.map(s => s.type === 'link'
          ? `<a href="${escHtml(s.url)}" target="_blank" class="deliverable-chip link-chip">🔗 ${escHtml(s.label||'Link')}</a>`
          : `<span class="deliverable-chip file-chip">📎 ${escHtml(s.name)}</span>`
        ).join('')
      : '<span style="color:var(--text-muted);font-size:12px">—</span>';

    return `
      <tr>
        <td>
          <div class="td-name">${escHtml(t.name)}</div>
          ${t.desc ? `<div class="td-desc">${escHtml(t.desc.slice(0,80))}${t.desc.length>80?'…':''}</div>` : ''}
          <div style="margin-top:4px">${(t.tags||[]).map(tag=>`<span class="tag">${escHtml(tag)}</span>`).join('')}</div>
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
        <td><div class="deliverables-cell">${subsCell}</div></td>
        <td>
          <div class="actions-cell">
            <button class="btn-icon" title="Submit Work" onclick="openSubmitWork('${t.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
            <button class="btn-icon" title="Edit" onclick="openTaskModal(DB.tasks.find(t=>t.id==='${t.id}'))">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon" title="Delete" style="color:var(--red)" onclick="confirmDelete('task','${t.id}','${escHtml(t.name).replace(/'/g,"\\'")}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

['taskSearch','filterStatus','filterPriority','filterAssignee'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderTasksTable);
});

/* ── Submit Work ───────────────────────────────────────── */
let submitWorkTaskId = null;
let workFileData = null;

function openSubmitWork(taskId) {
  submitWorkTaskId = taskId;
  workFileData = null;
  const task = DB.tasks.find(t => t.id === taskId);
  document.getElementById('submitTaskLabel').textContent = task ? task.name : '';
  document.getElementById('submitUrl').value = '';
  document.getElementById('submitUrlLabel').value = '';
  document.getElementById('submitNote').value = '';
  document.getElementById('workFilePreview').style.display = 'none';
  document.getElementById('workFileName').textContent = '';
  document.getElementById('notifyOnSubmit').checked = false;
  document.getElementById('notifyRecipientsList').style.display = 'none';

  // Build recipients list (all users except current)
  const recipients = USERS.filter(u => u !== DB.currentUser);
  document.getElementById('notifyRecipientsList').innerHTML = recipients.map(u => `
    <label class="recipient-label">
      <input type="checkbox" class="notif-recipient" value="${escHtml(u)}"/>
      <div class="mini-avatar">${initials(u)}</div>
      ${escHtml(u)}
    </label>
  `).join('');

  // Switch to link tab by default
  switchSubmitTab('link');
  openModal('submitWorkModal');
}

function switchSubmitTab(tab) {
  document.querySelectorAll('.submit-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.submit-tab-pane').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
}

document.querySelectorAll('.submit-tab').forEach(btn => {
  btn.addEventListener('click', () => switchSubmitTab(btn.dataset.tab));
});

document.getElementById('notifyOnSubmit').addEventListener('change', function() {
  document.getElementById('notifyRecipientsList').style.display = this.checked ? '' : 'none';
});

document.getElementById('closeSubmitModal').addEventListener('click', () => closeModal('submitWorkModal'));
document.getElementById('cancelSubmit').addEventListener('click',     () => closeModal('submitWorkModal'));

// File handling for work submission
document.getElementById('workFileInput').addEventListener('change', function() {
  handleWorkFile(this.files[0]);
});

document.getElementById('workDropZone').addEventListener('dragover', e => {
  e.preventDefault();
  document.getElementById('workDropZone').classList.add('drag-over');
});
document.getElementById('workDropZone').addEventListener('dragleave', () => {
  document.getElementById('workDropZone').classList.remove('drag-over');
});
document.getElementById('workDropZone').addEventListener('drop', e => {
  e.preventDefault();
  document.getElementById('workDropZone').classList.remove('drag-over');
  handleWorkFile(e.dataTransfer.files[0]);
});

document.getElementById('clearWorkFile').addEventListener('click', () => {
  workFileData = null;
  document.getElementById('workFilePreview').style.display = 'none';
  document.getElementById('workFileInput').value = '';
});

function handleWorkFile(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('File too large — max 2 MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    workFileData = { name: file.name, size: file.size, type: file.type, data: e.target.result };
    document.getElementById('workFileName').textContent = file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
    document.getElementById('workFilePreview').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

document.getElementById('confirmSubmit').addEventListener('click', () => {
  if (!submitWorkTaskId) return;
  const activeTab = document.querySelector('.submit-tab.active').dataset.tab;
  const note = document.getElementById('submitNote').value.trim();
  let submission = null;

  if (activeTab === 'link') {
    const url = document.getElementById('submitUrl').value.trim();
    if (!url) { showToast('Please enter a URL'); return; }
    submission = { id: uid(), type: 'link', url, label: document.getElementById('submitUrlLabel').value.trim() || url, note, uploadedAt: new Date().toISOString() };
  } else {
    if (!workFileData) { showToast('Please select a file'); return; }
    submission = { id: uid(), type: 'file', name: workFileData.name, size: workFileData.size, fileType: workFileData.type, data: workFileData.data, note, uploadedAt: new Date().toISOString() };
  }

  const tasks = DB.tasks;
  const idx = tasks.findIndex(t => t.id === submitWorkTaskId);
  if (idx > -1) {
    if (!tasks[idx].submissions) tasks[idx].submissions = [];
    tasks[idx].submissions.push(submission);
    if (tasks[idx].status !== 'Done') { tasks[idx].status = 'Done'; tasks[idx].completedAt = new Date().toISOString(); }
    DB.tasks = tasks;
  }

  // Send notifications if checked
  if (document.getElementById('notifyOnSubmit').checked) {
    const checked = [...document.querySelectorAll('.notif-recipient:checked')].map(c => c.value);
    if (checked.length) {
      const taskName = tasks[idx] ? tasks[idx].name : '';
      sendNotifications(checked, `${DB.currentUser} submitted work on "${taskName}"`, taskName);
    }
  }

  showToast('Work submitted!');
  closeModal('submitWorkModal');
  refreshCurrentView();
});

/* ── Assets ────────────────────────────────────────────── */
let pendingAssetFile = null;

document.getElementById('uploadAssetBtn').addEventListener('click', () => {
  pendingAssetFile = null;
  document.getElementById('assetName').value = '';
  document.getElementById('assetTags').value = '';
  document.getElementById('assetFilePreview').style.display = 'none';
  document.getElementById('assetFileInput').value = '';
  openModal('assetUploadModal');
});

document.getElementById('closeAssetModal').addEventListener('click', () => closeModal('assetUploadModal'));
document.getElementById('cancelAsset').addEventListener('click',     () => closeModal('assetUploadModal'));

document.getElementById('assetFileInput').addEventListener('change', function() {
  handleAssetFile(this.files[0]);
});

document.getElementById('assetDropZone').addEventListener('dragover', e => {
  e.preventDefault();
  document.getElementById('assetDropZone').classList.add('drag-over');
});
document.getElementById('assetDropZone').addEventListener('dragleave', () => {
  document.getElementById('assetDropZone').classList.remove('drag-over');
});
document.getElementById('assetDropZone').addEventListener('drop', e => {
  e.preventDefault();
  document.getElementById('assetDropZone').classList.remove('drag-over');
  handleAssetFile(e.dataTransfer.files[0]);
});

document.getElementById('clearAssetFile').addEventListener('click', () => {
  pendingAssetFile = null;
  document.getElementById('assetFilePreview').style.display = 'none';
  document.getElementById('assetFileInput').value = '';
});

function handleAssetFile(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('File too large — max 2 MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    pendingAssetFile = { name: file.name, size: file.size, mimeType: file.type, data: e.target.result };
    document.getElementById('assetFileName').textContent = file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
    document.getElementById('assetFilePreview').style.display = 'flex';
    if (!document.getElementById('assetName').value) {
      document.getElementById('assetName').value = file.name.replace(/\.[^.]+$/, '');
    }
  };
  reader.readAsDataURL(file);
}

document.getElementById('confirmAssetUpload').addEventListener('click', () => {
  if (!pendingAssetFile) { showToast('Please select a file'); return; }
  const name = document.getElementById('assetName').value.trim();
  if (!name) { showToast('Please enter an asset name'); return; }

  const isImage = pendingAssetFile.mimeType.startsWith('image/');
  const asset = {
    id: uid(),
    name,
    tags: document.getElementById('assetTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    fileName: pendingAssetFile.name,
    size: pendingAssetFile.size,
    mimeType: pendingAssetFile.mimeType,
    data: pendingAssetFile.data,
    isImage,
    uploadedBy: DB.currentUser,
    uploadedAt: new Date().toISOString(),
  };

  const assets = DB.assets;
  assets.unshift(asset);
  DB.assets = assets;

  showToast('Asset uploaded!');
  closeModal('assetUploadModal');
  renderAssets();
});

function renderAssets() {
  const search   = (document.getElementById('assetSearch').value || '').toLowerCase();
  const typeFilter = document.getElementById('assetTypeFilter').value;

  let assets = DB.assets;
  if (search)     assets = assets.filter(a => a.name.toLowerCase().includes(search) || (a.tags||[]).some(t=>t.toLowerCase().includes(search)));
  if (typeFilter === 'image')    assets = assets.filter(a => a.isImage);
  if (typeFilter === 'document') assets = assets.filter(a => !a.isImage && a.mimeType && (a.mimeType.includes('pdf') || a.mimeType.includes('word') || a.mimeType.includes('doc')));
  if (typeFilter === 'other')    assets = assets.filter(a => !a.isImage && !(a.mimeType && (a.mimeType.includes('pdf') || a.mimeType.includes('word') || a.mimeType.includes('doc'))));

  const grid  = document.getElementById('assetsGrid');
  const empty = document.getElementById('assets-empty');

  if (!assets.length) { grid.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';

  grid.innerHTML = assets.map(a => `
    <div class="asset-card">
      <div class="asset-preview">
        ${a.isImage
          ? `<img src="${a.data}" alt="${escHtml(a.name)}" loading="lazy"/>`
          : `<div class="asset-file-icon">${fileIcon(a.mimeType)}</div>`}
      </div>
      <div class="asset-info">
        <div class="asset-name" title="${escHtml(a.name)}">${escHtml(a.name)}</div>
        <div class="asset-meta">${(a.size/1024).toFixed(1)} KB · ${escHtml(a.uploadedBy||'')}</div>
        <div class="asset-tags">${(a.tags||[]).map(t=>`<span class="tag">${escHtml(t)}</span>`).join('')}</div>
      </div>
      <div class="asset-actions">
        <a href="${a.data}" download="${escHtml(a.fileName||a.name)}" class="btn btn-secondary btn-sm">Download</a>
        <button class="btn-icon" style="color:var(--red)" onclick="deleteAsset('${a.id}')" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function fileIcon(mime) {
  if (!mime) return '📄';
  if (mime.includes('pdf'))  return '📕';
  if (mime.includes('zip') || mime.includes('rar')) return '🗜️';
  if (mime.includes('word') || mime.includes('doc')) return '📝';
  if (mime.includes('sheet') || mime.includes('excel')) return '📊';
  if (mime.includes('presentation') || mime.includes('powerpoint')) return '📑';
  return '📄';
}

function deleteAsset(id) {
  DB.assets = DB.assets.filter(a => a.id !== id);
  showToast('Asset deleted');
  renderAssets();
}

['assetSearch','assetTypeFilter'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderAssets);
});

/* ── Contacts ──────────────────────────────────────────── */
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

document.getElementById('closeContactModal').addEventListener('click', () => closeModal('contactModal'));
document.getElementById('cancelContact').addEventListener('click',     () => closeModal('contactModal'));
document.getElementById('contactsAddContact').addEventListener('click', () => openContactModal());

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const id   = document.getElementById('contactId').value;
  const name = document.getElementById('contactName').value.trim();
  if (!name) return;

  const contact = {
    id: id || uid(), name,
    company: document.getElementById('contactCompany').value.trim(),
    email:   document.getElementById('contactEmail').value.trim(),
    phone:   document.getElementById('contactPhone').value.trim(),
    stage:   document.getElementById('contactStage').value,
    notes:   document.getElementById('contactNotes').value.trim(),
    createdAt: id ? undefined : new Date().toISOString(),
  };

  const contacts = DB.contacts;
  if (id) {
    const idx = contacts.findIndex(c => c.id === id);
    if (idx > -1) { contact.createdAt = contacts[idx].createdAt; contacts[idx] = contact; }
    showToast('Contact updated');
  } else {
    contacts.unshift(contact);
    showToast('Contact added');
  }
  DB.contacts = contacts;
  closeModal('contactModal');
  renderContacts();
});

function renderContacts() {
  const contacts = DB.contacts;
  const tbody = document.getElementById('contacts-tbody');
  const empty = document.getElementById('contacts-empty');

  if (!contacts.length) { tbody.innerHTML = ''; empty.style.display = ''; return; }
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
          <button class="btn-icon" onclick="openContactModal(DB.contacts.find(c=>c.id==='${c.id}'))">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" style="color:var(--red)" onclick="confirmDelete('contact','${c.id}','${escHtml(c.name).replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ── Delete ────────────────────────────────────────────── */
let pendingDelete = null;

function confirmDelete(type, id, label) {
  pendingDelete = { type, id };
  document.getElementById('deleteMessage').textContent = `Delete "${label}"? This cannot be undone.`;
  openModal('deleteModal');
}

document.getElementById('closeDeleteModal').addEventListener('click', () => closeModal('deleteModal'));
document.getElementById('cancelDelete').addEventListener('click',     () => closeModal('deleteModal'));

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

/* ── Pipeline ──────────────────────────────────────────── */
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

/* ── Seed Demo Data ────────────────────────────────────── */
function seedIfEmpty() {
  if (DB.tasks.length) return;
  const today = new Date();
  const d = n => { const x = new Date(today); x.setDate(x.getDate()+n); return x.toISOString().split('T')[0]; };
  DB.tasks = [
    { id: uid(), name: 'Launch Q2 Email Campaign',    assignee: 'Sarah Kim',   priority: 'High',   status: 'In Progress', due: d(2),  tags: ['email','q2'],     desc: 'Set up drip campaign for Q2 product launch.', createdAt: new Date().toISOString(), submissions: [] },
    { id: uid(), name: 'Design Social Media Banners', assignee: 'Tom Rivera',  priority: 'Medium', status: 'Todo',        due: d(5),  tags: ['design','social'], desc: 'Create banner assets for Instagram and LinkedIn.', createdAt: new Date().toISOString(), submissions: [] },
    { id: uid(), name: 'Update Landing Page Copy',    assignee: 'Aisha Patel', priority: 'High',   status: 'Review',      due: d(-1), tags: ['copy','web'],      desc: 'Refresh homepage headline and sub-copy.', createdAt: new Date().toISOString(), submissions: [] },
    { id: uid(), name: 'Competitor Analysis Report',  assignee: 'Sarah Kim',   priority: 'Medium', status: 'Done',        due: d(-3), tags: ['research'],        desc: 'Quarterly competitive landscape overview.', createdAt: new Date().toISOString(), completedAt: new Date().toISOString(), submissions: [] },
    { id: uid(), name: 'Plan Webinar for May',        assignee: 'Tom Rivera',  priority: 'Low',    status: 'Todo',        due: d(14), tags: ['events','webinar'],desc: 'Coordinate speakers and registration page.', createdAt: new Date().toISOString(), submissions: [] },
    { id: uid(), name: 'A/B Test Ad Copy',            assignee: 'Aisha Patel', priority: 'Medium', status: 'In Progress', due: d(7),  tags: ['ads','testing'],   desc: 'Run two variants on Google Ads.', createdAt: new Date().toISOString(), submissions: [] },
  ];
  DB.contacts = [
    { id: uid(), name: 'James Carter',  company: 'TechFlow Inc.',   email: 'james@techflow.io',    phone: '+1 555-0101', stage: 'Customer',  notes: 'Key account, renews in Sept.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Priya Mehta',   company: 'BrightSpark Co.', email: 'priya@brightspark.co', phone: '+1 555-0202', stage: 'Prospect',  notes: 'Interested in premium plan.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Carlos Diaz',   company: 'NovaBrand',       email: 'c.diaz@novabrand.com', phone: '+1 555-0303', stage: 'Lead',      notes: 'Met at MarketConf 2026.', createdAt: new Date().toISOString() },
    { id: uid(), name: 'Emma Wilson',   company: 'GrowthLab',       email: 'emma@growthlab.io',    phone: '+1 555-0404', stage: 'Qualified', notes: 'Requested proposal for Q3.', createdAt: new Date().toISOString() },
  ];
}

/* ── Init ──────────────────────────────────────────────── */
seedIfEmpty();
renderUserSwitcher();
renderNotifCount();
navigate('dashboard');
