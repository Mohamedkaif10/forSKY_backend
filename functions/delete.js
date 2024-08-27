const db = require("../Config/dbConnection");

const unbookmarkJob = async (userId, jobId) => {
  try {
    const existingBookmark = await db.query(
      "SELECT * FROM bookmarks WHERE user_id = $1 AND job_id = $2",
      [userId, jobId]
    );

    if (existingBookmark.rows.length > 0) {
      await db.query(
        "DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2",
        [userId, jobId]
      );
      return { success: true, message: "Job unbookmarked successfully" };
    } else {
      return { success: false, message: "Job is not bookmarked" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

module.exports = { unbookmarkJob };
