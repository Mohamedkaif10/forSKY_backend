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
  if (filters.department_name) {
    queryText += ` AND department_name  = '${filters.department_name}'`;
  }
  if (filters.job_title) {
    queryText += ` AND job_title = '${filters.job_title}'`;
  }
  try {
    const result = await db.query(queryText);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching filtered job details');
  }
};
const getJobDetails = async (userId) => {
  try {
    const sqlQuery = 'SELECT * FROM jobdetails WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1';
    console.log('SQL Query:', sqlQuery);

    const userJobs = await db.query(sqlQuery, [userId]);
    return userJobs;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

const getIdeas = async()=>{
  try{
    const result = await db.query(
      'SELECT * FROM ideas'
    );
    const ideas=result.rows;
    return ideas;
  }catch(error){
    console.log(error);
    throw new Error('Error fetching ideas');
  }
}
const getIdeasByStream = async (stream) => {
  try {
    const result = await db.query('SELECT * FROM ideas WHERE stream = $1', [stream]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getJobDetailsPage = async (page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;
    const queryText = `SELECT * FROM jobdetails LIMIT ${pageSize} OFFSET ${offset}`;

    const result = await db.query(queryText);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching job details');
  }
};

module.exports = { getProjects,getFilteredJobDetails,getJobDetails,getIdeas,getIdeasByStream,getJobDetailsPage};
