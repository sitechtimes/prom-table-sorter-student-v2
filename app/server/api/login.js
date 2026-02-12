import connectDB from "../utils/db";
import User from "../models/user";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { email, password } = body;
  const userInfo = await User.findOne({
    email: email,
  });
  if (userInfo) {
    const verify = await verifyPassword(userInfo.password, password);
    if (verify) {
      const login = true;
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
    } else if (!verify) {
      return;
    }
  }
});
