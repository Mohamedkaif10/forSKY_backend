const express = require("express");
const router = express.Router();
const verifyToken = require("../Authorization/verifyToken");
const {
  getFilteredJobDetails,
  getJobDetails,
  getIdeas,
  getIdeasByStream,
  getJobDetailsPage,
  getBookmarks,
  searchJobs,
  getIdeaById,
  getJobDetailsadmin,
} = require("../functions/get");
const db = require("../Config/dbConnection");

router.get("/subjects", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM subjects ORDER BY name;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/departments/:subjectId", async (req, res) => {
  const { subjectId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM departments WHERE subject_id = $1",
      [subjectId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting departments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/get_job", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 5;

    const jobDetails = await getJobDetailsPage(page, pageSize);

    res.json({ success: true, jobDetails, page, pageSize });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/get-job-full", async (req, res) => {
  try {
    const jobDetails = await getJobDetailsadmin();
    res.json({ success: true, jobDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/get-ideas", async (req, res) => {
  try {
    const ideas = await getIdeas();
    res.json({ success: true, ideas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/get-ideas/:id", async (req, res) => {
  const ideaId = req.params.id;

  try {
    const idea = await getIdeaById(ideaId);

    if (idea) {
      res.json({ success: true, idea });
    } else {
      res.status(404).json({ error: "Idea not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/user-profile", verifyToken, async (req, res) => {
  try {
    console.log("User information:", req.user);

    const { firstname } = req.user;
    res.json({ user: { firstname } });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/filtered-job-details", async (req, res) => {
  try {
    const filters = {
      location: req.query.location,
      stipend_amount: req.query.stipend_amount,
      department_name: req.query.department_name,
      job_title: req.query.job_title,
    };

    const jobDetails = await getFilteredJobDetails(filters);

    res.json({ success: true, jobDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/job-details/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userJobs = await getJobDetails(userId);

    if (!userJobs || userJobs.length === 0) {
      return res.status(404).json({ error: "No jobs found for the user" });
    }
    res.status(200).json({ success: true, userJobs });
  } catch (error) {
    console.log(error);
    console.error("Error in GET /job-details/:userId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/job_details/user", async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM jobdetailsnew WHERE user_id = $1",
      [userId]
    );
    const jobDetails = result.rows;

    res.json(jobDetails);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/admin/new", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM jobdetailsnew ORDER BY created_at DESC"
    );
    const jobDetails = result.rows;

    res.json(jobDetails);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/ideasByStream/:stream", async (req, res) => {
  const stream = req.params.stream;
  try {
    const ideas = await getIdeasByStream(stream);
    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error getting ideas by stream:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/bookmarks", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await getBookmarks(userId);

    res.json({ success: true, bookmarks });
  } catch (error) {
    console.error("Error in GET /bookmarks:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/search", async (req, res) => {
  const { location, department_name } = req.query;
  if (!location && !department_name) {
    return res
      .status(400)
      .json({ error: "Both location and department_name are required." });
  }

  try {
    const jobs = await searchJobs(location, department_name);
    if (jobs.length === 0) {
      return res.status(404).json({ error: "No matching jobs found." });
    }

    res.json(jobs);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/check-profile", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const profileCheck = await db.query(
      "SELECT profile_completed FROM user_profiles WHERE user_id = $1",
      [user_id]
    );

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: "User profile not found." });
    }

    const isProfileCompleted = profileCheck.rows[0].profile_completed;

    res.json({ profile_completed: isProfileCompleted });
  } catch (error) {
    console.error("Error checking profile status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/ideas", async (req, res) => {
  try {
    const ideas = await getIdeass();

    const ideasWithImages = await Promise.all(
      ideas.map(async (idea) => {
        return {
          ...idea,
          imageUrl: await getImageUrl(idea.id),
        };
      })
    );

    res.status(200).json(ideasWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
const getIdeass = async () => {
  const result = await db.query("SELECT * FROM ideas");
  return result.rows;
};
const getImageUrl = async (ideaId) => {
  try {
    const result = await db.query("SELECT imageUrl FROM ideas WHERE id = $1", [
      ideaId,
    ]);

    if (result.rows.length > 0) {
      return result.rows[0].imageUrl;
    } else {
      throw new Error("Image URL not found for idea_id: " + ideaId);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching image URL");
  }
};

router.get("/count-jrf", async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS jrf_count
      FROM jobdetails
      WHERE Job_title ILIKE 'JRF';
    `;

    const result = await db.query(query);

    const jrfCount = result.rows[0].jrf_count;

    res.json({ jrfCount });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/count-srf", async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS srf_count
      FROM jobdetails
      WHERE Job_title ILIKE 'SRF';
    `;

    const result = await db.query(query);

    const srfCount = result.rows[0].srf_count;

    res.json({ srfCount });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/count-project-associate", async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS projectassociate
      FROM jobdetails
      WHERE Job_title ILIKE 'project associate';
    `;

    const result = await db.query(query);

    const projectassociate = result.rows[0].projectassociate;

    res.json({ projectassociate });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/count-project-manager", async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS projectmanager
      FROM jobdetails
      WHERE Job_title ILIKE 'Project Manager';
    `;

    const result = await db.query(query);

    const projectmanager = result.rows[0].projectmanager;

    res.json({ projectmanager });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
