import connectDB from "../utils/db";
import User from "../models/user";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { user, pass } = body;
  const login = await User.findOne({ email: user, password: pass }).exec();
  if (!login) {
    throw createError({
      statusCode: 404,
      message: "Invalid login credentials, please try again.",
    });
  }
});
