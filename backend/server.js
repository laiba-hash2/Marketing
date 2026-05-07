require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

/* ── Schemas ──────────────────────────────────────────────── */
const taskSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  name:        String,
  desc:        String,
  assignee:    String,
  due:         String,
  priority:    { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status:      { type: String, enum: ['Todo', 'In Progress', 'Review', 'Done'], default: 'Todo' },
  tags:        [String],
  submissions: { type: mongoose.Schema.Types.Mixed, default: [] },
  createdAt:   String,
  completedAt: String,
});

const contactSchema = new mongoose.Schema({
  id:        { type: String, required: true, unique: true },
  name:      String,
  company:   String,
  email:     String,
  phone:     String,
  stage:     { type: String, enum: ['Lead', 'Prospect', 'Qualified', 'Proposal', 'Customer'], default: 'Lead' },
  notes:     String,
  createdAt: String,
});

const assetSchema = new mongoose.Schema({
  id:         { type: String, required: true, unique: true },
  name:       String,
  tags:       [String],
  fileName:   String,
  size:       Number,
  mimeType:   String,
  data:       String,
  isImage:    Boolean,
  uploadedBy: String,
  uploadedAt: String,
});

const notifSchema = new mongoose.Schema({
  id:        { type: String, required: true, unique: true },
  from:      String,
  to:        String,
  message:   String,
  taskName:  String,
  read:      { type: Boolean, default: false },
  createdAt: String,
});

const Task         = mongoose.model('Task',         taskSchema);
const Contact      = mongoose.model('Contact',      contactSchema);
const Asset        = mongoose.model('Asset',        assetSchema);
const Notification = mongoose.model('Notification', notifSchema);

/* ── Tasks ────────────────────────────────────────────────── */
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().select('-__v').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).select('-__v');
    res.json(task);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Contacts ─────────────────────────────────────────────── */
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().select('-__v').sort({ createdAt: -1 });
    res.json(contacts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json(contact);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate({ id: req.params.id }, req.body, { new: true }).select('-__v');
    res.json(contact);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Assets ───────────────────────────────────────────────── */
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await Asset.find().select('-__v').sort({ uploadedAt: -1 });
    res.json(assets);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/assets', async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.json(asset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    await Asset.deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Notifications ────────────────────────────────────────── */
app.get('/api/notifications', async (req, res) => {
  try {
    const notifs = await Notification.find().select('-__v').sort({ createdAt: -1 });
    res.json(notifs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.json(notif);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/notifications/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ to: req.body.user }, { read: true });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { id: req.params.id }, { read: true }, { new: true }
    ).select('-__v');
    res.json(notif);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Seed Demo Data ───────────────────────────────────────── */
app.post('/api/seed', async (req, res) => {
  try {
    const count = await Task.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded' });

    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
    const today = new Date();
    const d = n => { const x = new Date(today); x.setDate(x.getDate() + n); return x.toISOString().split('T')[0]; };

    await Task.insertMany([
      { id: uid(), name: 'Launch Q2 Email Campaign',    assignee: 'Sarah Kim',   priority: 'High',   status: 'In Progress', due: d(2),  tags: ['email','q2'],      desc: 'Set up drip campaign for Q2 product launch.',     createdAt: new Date().toISOString(), submissions: [] },
      { id: uid(), name: 'Design Social Media Banners', assignee: 'Tom Rivera',  priority: 'Medium', status: 'Todo',        due: d(5),  tags: ['design','social'], desc: 'Create banner assets for Instagram and LinkedIn.', createdAt: new Date().toISOString(), submissions: [] },
      { id: uid(), name: 'Update Landing Page Copy',    assignee: 'Aisha Patel', priority: 'High',   status: 'Review',      due: d(-1), tags: ['copy','web'],      desc: 'Refresh homepage headline and sub-copy.',          createdAt: new Date().toISOString(), submissions: [] },
      { id: uid(), name: 'Competitor Analysis Report',  assignee: 'Sarah Kim',   priority: 'Medium', status: 'Done',        due: d(-3), tags: ['research'],        desc: 'Quarterly competitive landscape overview.',        createdAt: new Date().toISOString(), completedAt: new Date().toISOString(), submissions: [] },
      { id: uid(), name: 'Plan Webinar for May',        assignee: 'Tom Rivera',  priority: 'Low',    status: 'Todo',        due: d(14), tags: ['events','webinar'], desc: 'Coordinate speakers and registration page.',      createdAt: new Date().toISOString(), submissions: [] },
      { id: uid(), name: 'A/B Test Ad Copy',            assignee: 'Aisha Patel', priority: 'Medium', status: 'In Progress', due: d(7),  tags: ['ads','testing'],   desc: 'Run two variants on Google Ads.',                  createdAt: new Date().toISOString(), submissions: [] },
    ]);

    await Contact.insertMany([
      { id: uid(), name: 'James Carter', company: 'TechFlow Inc.',   email: 'james@techflow.io',    phone: '+1 555-0101', stage: 'Customer',  notes: 'Key account, renews in Sept.', createdAt: new Date().toISOString() },
      { id: uid(), name: 'Priya Mehta',  company: 'BrightSpark Co.', email: 'priya@brightspark.co', phone: '+1 555-0202', stage: 'Prospect',  notes: 'Interested in premium plan.',  createdAt: new Date().toISOString() },
      { id: uid(), name: 'Carlos Diaz',  company: 'NovaBrand',       email: 'c.diaz@novabrand.com', phone: '+1 555-0303', stage: 'Lead',      notes: 'Met at MarketConf 2026.',      createdAt: new Date().toISOString() },
      { id: uid(), name: 'Emma Wilson',  company: 'GrowthLab',       email: 'emma@growthlab.io',    phone: '+1 555-0404', stage: 'Qualified', notes: 'Requested proposal for Q3.',   createdAt: new Date().toISOString() },
    ]);

    res.json({ ok: true, message: 'Demo data seeded' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ── Health Check ─────────────────────────────────────────── */
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
