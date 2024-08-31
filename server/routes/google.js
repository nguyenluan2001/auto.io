const { v4: uuidv4 } = require("uuid");
const express = require("express");

const router = express.Router();
const { jwtDecode } = require("jwt-decode");
const { prisma } = require("../config/prisma");
const { getToken, setCredentials, driveUpload } = require("../utils/google");

router.get("/callback", async (req, res) => {
  const { code, state } = req.query;
  console.log("🚀 ===== router.get ===== state:", state);
  console.log("🚀 ===== router.get ===== code:", code);
  const userId = state.split("=")[1];
  const tokens = await getToken(code);
  const profile = jwtDecode(tokens?.id_token);
  await prisma.connection.create({
    data: {
      uuid: uuidv4(),
      provider: "google",
      profile,
      token: tokens,
      user: {
        connect: { id: parseInt(userId, 10) },
      },
    },
    include: {
      user: true,
    },
  });
  setCredentials(tokens);
  res.redirect("http://localhost:5173/connections");
});
router.get("/upload", async (req, res) => {
  const connection = await prisma.connection.findFirst();
  const { token } = connection;
  const data = await driveUpload(token);
  res.json({ data });
});
module.exports = router;
