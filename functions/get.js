// Import the database connection
const db = require('../Config/dbConnection');

// Function to get project details
const getProjects = async (userId) => {
  try {
    const result = await db.query(
      'SELECT * FROM jobdetails WHERE user_id = $1',
      [userId]
    );

    const jobdetails = result.rows;
    return jobdetails;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching projects');
  }
};

const getFilteredJobDetails = async (filters) => {
  let queryText = 'SELECT * FROM jobdetails WHERE 1=1';

  if (filters.location) {
    queryText += ` AND location = '${filters.location}'`;
  }

  if (filters.stipend) {
    queryText += ` AND stipend_amount >= ${filters.stipend_amount}`;
  }

  try {
    const result = await db.query(queryText);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching filtered job details');
  }
};

module.exports = { getProjects,getFilteredJobDetails};
