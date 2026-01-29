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

  //Get the list of emails of the people in the old unedited group by the information of the leader
  const oldGroup = await Group.findOne({ "leader.email": leader.email });
  const oldEmails = [oldGroup.leader, ...(oldGroup.members || [])].map(
    (p) => p.email
  );

  console.log("Old Emails: ", oldEmails);

  //get list of emails in the new group(the body) then remove the emails from the old group and run the check to see if any of the new emails are already assigned to other groups
  const newEmails = [leader, ...(members || [])].map((p) => p.email);
  const emailsToCheck = newEmails.filter((email) => !oldEmails.includes(email));
  console.log("Emails to Check: ", emailsToCheck);

  const existingStudents = await Group.aggregate([
    {
      $project: {
        _id: 0,
        matchedEmails: {
          $setIntersection: [
            emailsToCheck,
            {
              $concatArrays: [
                ["$leader.email"],
                { $ifNull: ["$members.email", []] },
              ],
            },
          ],
        },
      },
    },
    { $match: { "matchedEmails.0": { $exists: true } } },
  ]);

  //if there are students already in groups throw an error with their indexes
  if (existingStudents.length > 0) {
    allPeople.forEach((dict, index) => {
      if (
        existingStudents[0].matchedEmails.includes(
          dict.email.trim().toLowerCase()
        )
      ) {
        failedIndexes.push(index);
      }
    });
    throw createError({
      statusCode: 599,
      message: "Some students already exist in other groups.",
      data: { failedIndexes },
    });
  }

  await Group.replaceOne({ "leader.email": leader.email }, body);

  return { message: "Group edited successfully", body };
});
