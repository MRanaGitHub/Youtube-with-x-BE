import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "next/dist/server/api-utils/index.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
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

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User name or email is already exist");
  }

  const avatarLoaclPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files?.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLoaclPath) {
    throw new ApiError(409, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLoaclPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(409, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Someting went wrong while createing user");
  }

  return res.json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  );
});

export { registerUser };
