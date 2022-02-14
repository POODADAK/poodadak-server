const {
  createReview,
  updateReview,
  findReviewById,
  deleteReviewById,
} = require("../service/review");
const {
  updateLatestToiletPaperInfoById,
  addReviewtoToilet,
  deleteReviewByToiletId,
} = require("../service/toilets");
const { addReviewToUser, deleteReviewByUserId } = require("../service/user");

exports.getReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const existingReview = await findReviewById(reviewId);

    res.json(existingReview);
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: failed to find review...",
    });
  }
};

exports.saveReview = async (req, res, next) => {
  try {
    const { toilet, rating, description, image, hasToiletPaper, updatedAt } =
      req.body;
    const submittedReview = {
      writer: req.userInfo._id,
      toilet,
      rating,
      description,
      image,
      updatedAt,
    };

    const createdReview = await createReview(submittedReview);
    await updateLatestToiletPaperInfoById(toilet, hasToiletPaper);
    await addReviewtoToilet(toilet, createdReview._id);
    await addReviewToUser(req.userInfo._id, createdReview._id);

    res.json({
      result: "ok",
      review: createdReview,
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: failed to create review...",
    });
  }
};

exports.editReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const { toilet, rating, description, image, hasToiletPaper, updatedAt } =
      req.body;
    const submittedReview = {
      toilet,
      rating,
      description,
      image,
      hasToiletPaper,
      updatedAt,
    };

    await updateReview(reviewId, submittedReview);
    await updateLatestToiletPaperInfoById(toilet, hasToiletPaper);

    res.json({
      result: "ok",
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: failed to update review...",
    });
  }
};

exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const { writer, toilet } = await deleteReviewById(reviewId);
    await deleteReviewByToiletId(toilet, reviewId);
    await deleteReviewByUserId(writer, reviewId);

    res.json({
      result: "ok",
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: failed to delete review...",
    });
  }
};
