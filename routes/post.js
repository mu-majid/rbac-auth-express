const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { authorizePermission } = require('../middleware/permissionMiddleware');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management and moderation
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Post object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (missing permission)
 */
router.post(
  '/',
  protect,
  authorizePermission('create:post'),
  postController.createPost
);

/**
 * @swagger
 * /api/posts/{id}/approve:
 *   patch:
 *     summary: Approve a post (moderators, admins)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Post ID to approve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (missing permission)
 *       404:
 *         description: Post not found
 */
router.patch(
  '/:id/approve',
  protect,
  authorizePermission('approve:post'),
  postController.approvePost
);

/**
 * @swagger
 * /api/posts/{id}/hide:
 *   patch:
 *     summary: Hide a post (admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Post ID to hide
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post hidden
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (missing permission)
 *       404:
 *         description: Post not found
 */
router.patch(
  '/:id/hide',
  protect,
  authorizePermission('hide:post'),
  postController.hidePost
);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post (owner or authorized roles)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Post ID to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (missing permission)
 *       404:
 *         description: Post not found
 */
router.delete(
  '/:id',
  protect,
  authorizePermission('delete:post'),
  postController.deletePost
);

module.exports = router;
