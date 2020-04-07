/**
 * @desc    returns all the bootcamps
 * @route   GET /api/v1/bootcamps
 * @access  Public
 */
exports.getBootcamps = (req, res, next) => {
  res.status(200).json(`returns all the bootcamps`);
};

/**
 * @desc    returns single bootcamp
 * @route   GET /api/v1/bootcamps/:id
 * @access  Public
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).json(`returns bootcamp with the id of ${req.params.id}`);
};

/**
 * @desc    create new bootcamp
 * @route   POST /api/v1/bootcamps
 * @access  Private
 */
exports.createBootcamp = (req, res, next) => {
  res.status(200).json(`Creates new bootcamp`);
};

/**
 * @desc    Updates bootcamp
 * @route   PUT /api/v1/bootcamps/:id
 * @access  Private
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json(`updates bootcamp with the id of ${req.params.id}`);
};

/**
 * @desc    Deletes bootcamp
 * @route   DELETE /api/v1/bootcamps/:id
 * @access  Private
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json(`deletes bootcamp with the id of ${req.params.id}`);
};
