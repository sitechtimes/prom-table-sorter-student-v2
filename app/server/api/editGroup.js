import connectDB from "../utils/db";
import Group from "../models/group";
import Student from "../models/student";
export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { leader, members } = body;
  const allPeople = [leader, ...(members || [])];
  const failedIndexes = [];

  //validate students (check if they exist in the big excel)
  await Promise.all(
    allPeople.map(async (person, index) => {
      const match = await Student.findOne({
        firstName: person.firstName.toLowerCase(),
        lastName: person.lastName.toLowerCase(),
        email: person.email.toLowerCase(),
      });
      if (!match) failedIndexes.push(index);
    })
  );

  //if some students dont exist throw an error with the indexes
  if (failedIndexes.length > 0) {
    throw createError({
      statusCode: 599,
      message: "Some students could not be validated.",
      data: { failedIndexes },
    });
  }

  return { message: "Group edited successfully", group };
});
