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
  let queryText = 'SELECT * FROM jobdetailsnew WHERE 1=1';

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
    const sqlQuery = 'SELECT * FROM jobdetails WHERE user_id = $1';
    console.log('SQL Query:', sqlQuery);

    const userJobs = await db.query(sqlQuery, [userId]);
    return userJobs;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

const getJobDetailsadmin = async (userId) => {
  try {
    const sqlQuery = 'SELECT * FROM jobdetails';
    console.log('SQL Query:', sqlQuery);

    const userJobs = await db.query(sqlQuery, [userId]);
    return userJobs;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

const getJobDetailsPage = async (page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;
    const queryText = `SELECT * FROM jobdetailsnew ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`;

    const result = await db.query(queryText);
    const formattedJobDetails = result.rows.map(row => {
      if (row.last_date) {
        const date = new Date(row.last_date);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        row.last_date = `${date.toLocaleDateString('en-US', options).split(' ')[1]} ${date.toLocaleDateString('en-US', options).split(' ')[0]}, ${date.toLocaleDateString('en-US', options).split(' ')[2]}`;
      } else {
        row.last_date = 'Rolling';
      }
      return row;
    });

    return formattedJobDetails;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching job details');
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
const getIdeaById = async (id) => {
  try {
    const result = await db.query(
      'SELECT * FROM ideas WHERE id = $1',
      [id]
    );

    const idea = result.rows[0];
    return idea;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching idea by ID');
  }
};
const getIdeasByStream = async (stream) => {
  try {
    const result = await db.query('SELECT * FROM ideas WHERE stream = $1', [stream]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};



const getBookmarks = async (userId) => {
  try {
    const bookmarks = await db.query('SELECT jobdetails.* FROM jobdetails JOIN bookmarks ON jobdetails.job_id = bookmarks.job_id WHERE bookmarks.user_id = $1', [userId]);
    return bookmarks.rows;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

async function searchJobs(location, department_name) {
  let query = 'SELECT * FROM jobdetails WHERE location ILIKE $1';
  const params = [`%${location}%`];

  if (department_name) {
      query += ' AND department_name ILIKE $2';
      params.push(`%${department_name}%`);
  }

  const result = await db.query(query, params);
  return result.rows;
}

const getUserProfile = async (userId) => {
  try {
    const result = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
module.exports = { getProjects,getFilteredJobDetails,getJobDetails,getIdeas,getIdeasByStream,getJobDetailsPage,getBookmarks,searchJobs,getIdeaById,getUserProfile,getJobDetailsadmin};
