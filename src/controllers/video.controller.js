import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  console.log(req);
});

const uploadVideos = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    const owner = req.user;

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!title) {
      throw new ApiError(409, "Title is required");
    }

    if (!description) {
      throw new ApiError(409, "Description is required");
    }

    if (!videoLocalPath) {
      throw new ApiError(409, "Video file is required");
    }

    if (!thumbnailLocalPath) {
      throw new ApiError(409, "Thambnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
      throw new ApiError(409, "Error occer while video is uploading");
    }

    if (!thumbnail) {
      throw new ApiError(409, "Error occer while thumbnail is uploading");
    }

    const video = await Video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      title,
      description,
      duration: videoFile.duration,
      owner: owner._id,
    });

    return res.json(new ApiResponse(200, video, "Video uploaded successfully"));
  } catch (error) {
    throw new ApiError(500, error || "Error occer while uploading video");
  }
});

export { getAllVideos, uploadVideos };
