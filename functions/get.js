// Import the database connection
const db = require('../Config/dbConnection');

// Function to get project details
const getProjects = async (userId) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects WHERE user_id = $1',
      [userId]
    );

    const projects = result.rows;
    return projects;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching projects');
  }
};

module.exports = { getProjects };
