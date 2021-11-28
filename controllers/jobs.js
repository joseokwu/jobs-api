const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
  const userId = req.user.userId;
  const job = await Job.find({ createdBy: userId });
  if (!job) {
    throw new NotFoundError('No jobs associated with this user');
  }
  res.status(StatusCodes.OK).json({ job, amount: job.length });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError('No jobs associated with this Id');
  }
  res.status(StatusCodes.OK).json(job);
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (!company || !position) {
    throw new BadRequestError('Company and Position are Required');
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError('No jobs associated with this Id');
  }
  res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError('No jobs associated with this Id');
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getJob,
  updateJob,
  deleteJob,
  createJob,
  getAllJobs,
};
