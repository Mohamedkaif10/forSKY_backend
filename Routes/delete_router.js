const express = require("express");
const router = express.Router();
const verifyToken = require("../Authorization/verifyToken");
const db = require("../Config/dbConnection");
const { unbookmarkJob } = require("../functions/delete");

router.delete("/bookmark/:jobId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const result = await unbookmarkJob(userId, jobId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
router.delete("/job/:job_id", async (req, res) => {
  const jobId = req.params.job_id;

  try {
    const checkResult = await db.query(
      "SELECT * FROM jobdetails WHERE job_id = $1",
      [jobId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    await db.query("DELETE FROM jobdetails WHERE job_id = $1", [jobId]);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/jobnew/:job_id", async (req, res) => {
  const jobId = req.params.job_id;

  try {
    const checkResult = await db.query(
      "SELECT * FROM jobdetailsnew WHERE job_id = $1",
      [jobId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    await db.query("DELETE FROM jobdetailsnew WHERE job_id = $1", [jobId]);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
