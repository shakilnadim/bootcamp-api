const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    returns courses
 * @route   GET /api/v1/courses
 * @route   GET /api/v1/bootcamps/:bootcampId/courses
 * @access  Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc    returns single course
 * @route   GET /api/v1/courses/:id
 * @access  Public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Adds course
 * @route   POST /api/v1/bootcamps/:bootcampId/courses
 * @access  Private
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId;
  req.body.bootcamp = bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${bootcampId}`, 404)
    );
  }

  // Check if user is bootcamp owner or admin
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to add courses to bootcamp ${bootcamp.name}`,
        401
      )
    );
  }

  // create course
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Updates course
 * @route   PUT /api/v1/courses/:id
 * @access  Private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course with the id of ${id}`, 404));
  }

  // Check if user is course owner or admin
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to update this course`,
        401
      )
    );
  }

  // update course
  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Delete course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course with the id of ${id}`, 404));
  }

  // Check if user is course owner or admin
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to delete this course`,
        401
      )
    );
  }

  // update course
  await course.remove();

  res.status(200).json({
    success: true,
    data: course,
  });
});
