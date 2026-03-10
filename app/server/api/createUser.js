import connectDB from "../utils/db";
import User from "../models/user";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { email, password } = body;
  const hashedPassword = await hashPassword(password);
  try {
    const newUser = new User({ email: email, password: hashedPassword });
    await newUser.save();
  } catch (err) {
    console.log(err);
  }
});
