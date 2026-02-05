import connectDB from "../utils/db";
import User from "../models/user";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { email, password } = body;
  const login = await User.findOne({ email: email, password: password });
  if (!login) {
    throw createError({
      statusCode: 404,
      message: "Invalid login credentials, please try again.",
    });
  } else {
    await setUserSession(event, {
      user: {
        name: "Admin",
      },
    });
    return {
      statusCode: 200,
      message: "Successfully logged in",
    };
  }
});
