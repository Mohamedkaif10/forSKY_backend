const db = require("../Config/dbConnection");

const addjobDetailsuser = async (
  userID,
  dept_name,
  job_title,
  stipend_amount,
  last_date,
  vacancies,
  location,
  scholar_link,
  duration,
  description,
  institute,
  link
) => {
  try {
    const insertResult = await db.query(
      "INSERT INTO jobdetailsnew(user_id,department_name,job_title,stipend_amount,last_date,vacancies,location,scholar_link,duration,description,institute,link) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
      [
        userID,
        dept_name,
        job_title,
        stipend_amount,
        last_date,
        vacancies,
        location,
        scholar_link,
        duration,
        description,
        institute,
        link,
      ]
    );

    console.log(insertResult);

    if (insertResult.rowCount > 0) {
      return { success: true, message: "Job details added" };
    } else {
      throw new Error("Failed to add job details");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

const addjobDetailsnew = async (
  userID,
  dept_name,
  job_title,
  stipend_amount,
  last_date,
  vacancies,
  location,
  scholar_link,
  duration,
  description,
  link,
  institute
) => {
  try {
    const insertResult = await db.query(
      "INSERT INTO jobdetailsnew(user_id,department_name,job_title,stipend_amount,last_date,vacancies,location,scholar_link,duration,description,link,institute) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
      [
        userID,
        dept_name,
        job_title,
        stipend_amount,
        last_date,
        vacancies,
        location,
        scholar_link,
        duration,
        description,
        link,
        institute,
      ]
    );

    console.log(insertResult);

    if (insertResult.rowCount > 0) {
      return { success: true, message: "Job details added" };
    } else {
      throw new Error("Failed to add job details");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

const addIdeas = async (userID, title, stream, content, imageUrl) => {
  try {
    const insertResult = await db.query(
      "INSERT INTO ideas (user_id,title,stream,content,imageUrl) VALUES ($1, $2, $3, $4,$5)",
      [userID, title, stream, content, imageUrl]
    );
    console.log(insertResult);
    return { success: true, message: "ideas added" };
  } catch (error) {
    console.log(error);
    throw new Error("Interal Server Error");
  }
};

const bookmarkJob = async (userId, jobId) => {
  try {
    const existingBookmark = await db.query(
      "SELECT * FROM bookmarks WHERE user_id = $1 AND job_id = $2",
      [userId, jobId]
    );

    if (existingBookmark.rows.length === 0) {
      await db.query(
        "INSERT INTO bookmarks (user_id, job_id) VALUES ($1, $2)",
        [userId, jobId]
      );
      return { success: true, message: "Job bookmarked successfully" };
    } else {
      return { success: false, message: "Job is already bookmarked" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};
async function addImage(userId, imageName, imageId) {
  try {
    const result = await db.query(
      "INSERT INTO screenshots (user_id, image_name, image_id) VALUES ($1, $2, $3)",
      [userId, imageName, imageId]
    );
    return result;
  } catch (error) {
    throw error;
  }
}
const getUserProfile = async (userId) => {
  try {
    const result = await db.query(
      "SELECT * FROM user_profiles WHERE user_id = $1",
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

const createUserProfile = async (profileData) => {
  const {
    full_name,
    email,
    mobile_number,
    work_status,
    present_location,
    description,
    user_id,
  } = profileData;

  try {
    const result = await db.query(
      "INSERT INTO user_profiles (full_name, email, mobile_number, work_status, present_location, description, user_id, profile_completed) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE) RETURNING *",
      [
        full_name,
        email,
        mobile_number,
        work_status,
        present_location,
        description,
        user_id,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

module.exports = {
  addIdeas,
  bookmarkJob,
  addImage,
  createUserProfile,
  getUserProfile,
  addjobDetailsnew,
  addjobDetailsuser,
};
