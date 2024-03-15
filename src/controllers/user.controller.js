import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "next/dist/server/api-utils/index.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frontend
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields is required");
  }

  const existingUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User name or email is already exist");
  }

  const avtarLoaclPath = req.files?.avtar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avtarLoaclPath) {
    throw new ApiError(409, "avtar file is required");
  }

  const avtar = await uploadOnCloudinary(avtarLoaclPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avtar) {
    throw new ApiError(409, "avtar file is required");
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Someting went wrong while createing user");
  }

  return res
    .send(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));
});

export { registerUser };
