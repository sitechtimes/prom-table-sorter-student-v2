const Student = require("../models/studentInfo");

const validateStudentsMiddleware = async (req, res, next) => {
  try {
    const { leader, members } = req.body;

    if (!leader || !members) {
      return res.status(400).json({ message: "Missing leader or members " });
    }

    const allPeople = [leader, ...members];
    const failedIndexes = [];

    await Promise.all(
      allPeople.map(async (person, index) => {
        const match = await Student.findOne({
          first_name: person.first_name.toLowerCase(),
          last_name: person.last_name.toLowerCase(),
          email: person.email.toLowerCase(),
        });
        if (!match) failedIndexes.push(index);
      })
    );

    if (failedIndexes.length > 0) {
      return res.status(400).json({
        message: "Some students could not be validated.",
        failedIndexes,
      });
    }

    next();
  } catch (err) {
    console.error("Validation error:", err);
    res
      .status(500)
      .json({ message: "Server error during student validation." });
  }
};

module.exports = validateStudentsMiddleware;
