import { useEffect, useState } from "react";
import Button from "../common/Button";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import {
  getProductReviews,
  createReview,
} from "../../services/productApi";

const ProductReviews = ({
  productId,
  reviews: initialReviews = [],
  isAuthenticated = false,
  onReviewSubmitted,
  className = "",
}) => {
  const [reviews, setReviews] = useState(initialReviews);

  const [loading, setLoading] = useState(
    initialReviews.length === 0
  );

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [formError, setFormError] = useState("");

  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState("");

  /*
   * Fetch reviews if they were not provided
   * by the parent component.
   */
  useEffect(() => {
    if (!productId || initialReviews.length > 0) {
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductReviews(productId);

        setReviews(response.data || []);
      } catch (err) {
        console.error("Failed to load reviews:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load product reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, initialReviews]);

  /*
   * Display the correct number of stars.
   */
  const renderStars = (
    value,
    interactive = false,
    size = "medium"
  ) => {
    const starSize =
      size === "small"
        ? "text-sm"
        : size === "large"
        ? "text-2xl"
        : "text-lg";

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const activeValue = interactive
            ? hoverRating || rating
            : value;

          const isActive = star <= activeValue;

          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() =>
                  setHoverRating(star)
                }
                onMouseLeave={() =>
                  setHoverRating(0)
                }
                className={`
                  ${starSize}
                  transition-transform
                  hover:scale-110
                  focus:outline-none
                `}
                aria-label={`Rate ${star} out of 5`}
              >
                <span
                  className={
                    isActive
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            );
          }

          return (
            <span
              key={star}
              className={`
                ${starSize}
                ${
                  isActive
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              `}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  /*
   * Submit review.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!isAuthenticated) {
      setFormError(
        "Please log in to submit a review."
      );
      return;
    }

    if (!rating) {
      setFormError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setFormError("Please write a review.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createReview(productId, {
        rating,
        comment: comment.trim(),
      });

      /*
       * Add the newly created review to the list.
       */
      if (response.data) {
        setReviews((currentReviews) => [
          response.data,
          ...currentReviews,
        ]);

        if (onReviewSubmitted) {
          onReviewSubmitted(response.data);
        }
      }

      /*
       * Reset form.
       */
      setRating(0);
      setHoverRating(0);
      setComment("");
      setFormError("");
    } catch (err) {
      console.error(
        "Failed to submit review:",
        err
      );

      setFormError(
        err.response?.data?.message ||
          "Failed to submit your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className={`
        border-t
        border-gray-200
        pt-8
        ${className}
      `}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#031008]">
          Customer Reviews
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          See what customers think about this product.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-10">
          <Loader text="Loading reviews..." />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            window.location.reload();
          }}
        />
      )}

      {/* Reviews */}
      {!loading && !error && (
        <div className="space-y-6">

          {reviews.length === 0 ? (
            <div
              className="
                rounded-lg
                border
                border-gray-200
                bg-[#F8F5EF]
                p-6
                text-center
              "
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <span className="text-xl text-yellow-500">
                  ★
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold text-[#031008]">
                No reviews yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Be the first customer to review this
                product.
              </p>
            </div>
          ) : (
            reviews.map((review, index) => {
              const reviewer =
                review.user?.name ||
                review.customer?.name ||
                review.user_name ||
                review.customer_name ||
                "Anonymous";

              const reviewText =
                review.comment ||
                review.review ||
                review.content ||
                "";

              const reviewRating =
                Number(review.rating) || 0;

              const reviewDate =
                review.created_at ||
                review.createdAt;

              return (
                <article
                  key={review.id || index}
                  className="
                    border-b
                    border-gray-200
                    pb-6
                    last:border-b-0
                  "
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    {/* Reviewer */}
                    <div>
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#031008]
                            text-sm
                            font-semibold
                            text-white
                          "
                        >
                          {reviewer
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-[#031008]">
                            {reviewer}
                          </h3>

                          {reviewDate && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              {new Date(
                                reviewDate
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      {renderStars(
                        reviewRating,
                        false,
                        "small"
                      )}
                    </div>
                  </div>

                  {/* Review text */}
                  {reviewText && (
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      "{reviewText}"
                    </p>
                  )}
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Review Form */}
      <div className="mt-10 border-t border-gray-200 pt-8">

        <h3 className="text-lg font-semibold text-[#031008]">
          Write a Review
        </h3>

        {!isAuthenticated ? (
          <div
            className="
              mt-4
              rounded-lg
              border
              border-gray-200
              bg-[#F8F5EF]
              p-5
            "
          >
            <p className="text-sm text-gray-600">
              Please log in to write a review.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-5 max-w-2xl"
          >

            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#031008]">
                Your Rating
              </label>

              <div className="flex items-center gap-3">
                {renderStars(
                  rating,
                  true,
                  "large"
                )}

                {rating > 0 && (
                  <span className="text-sm text-gray-500">
                    {rating} / 5
                  </span>
                )}
              </div>
            </div>

            {/* Review */}
            <div className="mt-5">
              <label
                htmlFor="review-comment"
                className="mb-2 block text-sm font-medium text-[#031008]"
              >
                Your Review
              </label>

              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                rows={5}
                maxLength={1000}
                placeholder="Tell us what you think about this product..."
                disabled={submitting}
                className="
                  w-full
                  resize-none
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#031008]
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-[#33473B]
                  focus:ring-2
                  focus:ring-[#33473B]/20
                  disabled:cursor-not-allowed
                  disabled:bg-gray-100
                "
              />

              <div className="mt-1 flex justify-end">
                <span className="text-xs text-gray-400">
                  {comment.length}/1000
                </span>
              </div>
            </div>

            {/* Form Error */}
            {formError && (
              <div className="mt-4">
                <ErrorMessage
                  message={formError}
                  showIcon={false}
                />
              </div>
            )}

            {/* Submit */}
            <div className="mt-5">
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
              >
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;