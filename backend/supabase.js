const { createClient } = require("@supabase/supabase-js");
const multer = require("multer");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Multer Storage (Store files in memory before upload)
const upload = multer({ storage: multer.memoryStorage() });

module.exports = { supabase, upload };
