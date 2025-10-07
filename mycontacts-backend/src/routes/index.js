const express = require('express');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');

const router = express.Router();

router.get("/health", (req, res) => {
  return apiResponse(res, 200, "OK", {
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

router.use("/auth", authRoutes);
router.use("/contacts", contactRoutes);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Service health and meta
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     uptime:
 *                       type: number
 *                     timestamp:
 *                       type: number
 */
