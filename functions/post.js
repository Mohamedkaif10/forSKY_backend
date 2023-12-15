// post.js

const db = require('../Config/dbConnection'); // Import your database connection module

const addAdditionalInfo = async (userId, department, specialization, researchAreas) => {
  try {
    // Insert the additional information into the 'additional' table
    const insertResult = await db.query(
      'INSERT INTO additional (user_id, department, specialization, research_areas) VALUES ($1, $2, $3, $4)',
      [userId, department, specialization, researchAreas]
    );
      console.log(insertResult)
    return { success: true, message: 'Additional information added successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
};

const addprojects=async(userID,position,vacancy,pi,project_title,start_date,end_date)=>{
    try{
        const insertResult=await db.query(
            'INSERT INTO projects (user_id,position,vacancy,pi,project_title,start_date,end_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [userID,position,vacancy,pi,project_title,start_date,end_date]
        );
        console.log(insertResult)
        return{success:true,message:"projects added"}
    }catch(error){
        console.log(error);
        throw new Error('Interal Server Error')
    }
}

const scheduleInterview = async (userID, date_interview, from_time, link) => {
  try {
    const insertResult = await db.query('INSERT INTO interview(user_id, date_interview, from_time, link) VALUES($1, $2, $3, $4)',
      [userID, date_interview, from_time, link]
    );
    
    console.log(insertResult);

    if (insertResult.rowCount > 0) {
      return { success: true, message: "Interview details added" };
    } else {
      throw new Error('Failed to add interview details'); 
    }
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
};
 
const addjobDetails = async (userID, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdf_id) => {
  try {
    const insertResult = await db.query('INSERT INTO jobdetails(user_id,department_name,job_title,stipend_amount,last_date,vacancies,location,scholar_link,duration,description,pdf_name,pdf_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
      [userID, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdf_id]
    );

    console.log(insertResult);

    if (insertResult.rowCount > 0) {
      return { success: true, message: "Job details added" };
    } else {
      throw new Error('Failed to add job details');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
};

const addIdeas = async(userID,title,stream,content)=>{
    try{
        const insertResult=await db.query(
            'INSERT INTO ideas (user_id,title,stream,content) VALUES ($1, $2, $3, $4)',
            [userID,title,stream,content]
        );
        console.log(insertResult)
        return{success:true,message:"ideas added"}
    }catch(error){
        console.log(error);
        throw new Error('Interal Server Error')
    }
}

const bookmarkJob = async (userId, jobId) => {
  try {
    // Check if the bookmark already exists
    const existingBookmark = await db.query('SELECT * FROM bookmarks WHERE user_id = $1 AND job_id = $2', [userId, jobId]);

    if (existingBookmark.rows.length === 0) {
      // Bookmark the job if it doesn't exist in bookmarks table
      await db.query('INSERT INTO bookmarks (user_id, job_id) VALUES ($1, $2)', [userId, jobId]);
      return { success: true, message: 'Job bookmarked successfully' };
    } else {
      return { success: false, message: 'Job is already bookmarked' };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
};

module.exports = { addAdditionalInfo ,addprojects,scheduleInterview, addjobDetails,addIdeas,bookmarkJob};
