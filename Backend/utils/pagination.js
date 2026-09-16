/**
 * Pagination helper to normalize query params and generate standard pagination metadata
 */

const getPaginationParams = (query, defaultLimit = 20, maxLimit = 100) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMeta = (total, page, limit) => {
  const pages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    pages
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMeta
};
