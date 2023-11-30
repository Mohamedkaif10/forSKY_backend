const express = require('express');
const router = express.Router();
const verifyToken = require('../Authorization/verifyToken');
const { getProjects } = require('../functions/get');

router.get('/postings',async(req,res)=>{
    try{
        const result=await db.query('SELECT * FROM postings');
        const postings=result.rows;
        res.json({success:true,postings});
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


router.get('/projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await getProjects(userId);

    res.json({ success: true, projects });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
