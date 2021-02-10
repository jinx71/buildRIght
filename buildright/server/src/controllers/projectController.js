const asyncHandler = require('../utils/asyncHandler');
const { ok, fail } = require('../utils/apiResponse');
const Project = require('../models/Project');

// GET /api/projects  (public) — supports ?category=residential&featured=true
const getProjects = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;

  const projects = await Project.find(filter).sort({ year: -1, createdAt: -1 });
  return ok(res, { projects, count: projects.length });
});

// GET /api/projects/:id  (public)
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return fail(res, 'Project not found', 404);
  return ok(res, { project });
});

// POST /api/projects  (admin)
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  return ok(res, { project }, 'Project created', 201);
});

// DELETE /api/projects/:id  (admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return fail(res, 'Project not found', 404);
  return ok(res, null, 'Project deleted');
});

module.exports = { getProjects, getProject, createProject, deleteProject };
