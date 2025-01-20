import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";

const checkOwnership = (model, resourceIdField) => {
  return asyncHandler(async (req, res, next) => {
    const resourceId = req.params[resourceIdField];

    if (!resourceId) {
      throw new ErrorHandler(400, `${resourceIdField} is missing`);
    }

    const resource = await model.findById(resourceId);

    if (!resource) {
      throw new ErrorHandler(404, `${model.modelName} not found`);
    }

    if (String(resource.owner) !== String(req.user._id)) {
      throw new ErrorHandler(403, "You are not authorized to perform this action");
    }

    // Attach the resource to the request for further use
    req.resource = resource;

    next();
  });
};

export default checkOwnership;
