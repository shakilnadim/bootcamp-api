const path = require('path');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    returns bootcamps
 * @route   GET /api/v1/bootcamps
 * @access  Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Response
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    returns single bootcamp
 * @route   GET /api/v1/bootcamps/:id
 * @access  Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @desc    create new bootcamp
 * @route   POST /api/v1/bootcamps
 * @access  Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @desc    Updates bootcamp
 * @route   PUT /api/v1/bootcamps/:id
 * @access  Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @desc    Deletes bootcamp
 * @route   DELETE /api/v1/bootcamps/:id
 * @access  Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @desc    Get bootcamps within a radius
 * @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access  Private
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // Divide distance by radius of earth
  // Earth Radius = 3,963 mi/6,378 km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

/**
 * @desc    Upload photo for bootcamp
 * @route   PUT /api/v1/bootcamps/:id/photo
 * @access  Private
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Check if the sent file is an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        }mb`,
        400
      )
    );
  }

  // renaming the file
  file.name = `photo_${bootcamp.slug}${path.parse(file.name).ext}`;

  // uploading the file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
