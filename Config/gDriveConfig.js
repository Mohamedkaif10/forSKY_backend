const { google } = require("googleapis");

const credentials = require("../forsky_credentials.json");

const drive = google.drive({
  version: "v3",
  auth: new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/drive"]
  ),
});
module.exports = drive;
