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

module.exports = { addAdditionalInfo ,addprojects,scheduleInterview};
