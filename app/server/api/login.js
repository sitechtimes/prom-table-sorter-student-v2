import connectDB from "../utils/db";
import User from "../models/user";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { email, password } = body;
  const userInfo = await User.findOne({
    email: email,
  });

  if (!userInfo)
    return {
      statusCode: 404,
      message: "Unable to find user",
    };

  if (await verifyPassword(userInfo.password, password)) {
    await setUserSession(event, {
      user: {
        name: "Admin",
      },
    });
    return {
      statusCode: 200,
      message: "Successfully logged in",
    };
  } else {
    throw createError({
      statusCode: 404,
      message: "Invalid login credentials, please try again.",
    });
  }
});
