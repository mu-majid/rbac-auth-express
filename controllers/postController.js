const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post (any user with 'create:post' permission)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id;

    const post = new Post({ title, content, author });
    await post.save();

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// Approve a post (moderator or admin)
exports.approvePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.approved = true;
    await post.save();

    res.json({ message: 'Post approved', post });
  } catch (error) {
    console.error('Approve Post Error:', error);
    res.status(500).json({ message: 'Failed to approve post' });
  }
};

// Hide a post (admin only)
exports.hidePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.hidden = true;
    await post.save();

    res.json({ message: 'Post hidden', post });
  } catch (error) {
    console.error('Hide Post Error:', error);
    res.status(500).json({ message: 'Failed to hide post' });
  }
};

// Delete a post (owner or authorized roles with 'delete:post' permission)
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Allow deletion if user is author OR has 'delete:any_post' permission
    if (post.author.toString() !== userId) {
      // Need to verify user permission for deleting any post
      // Fetch user permissions from DB
      const user = await User.findById(userId).populate('role');
      if (!user || !user.role) {
        return res.status(403).json({ message: 'Role not assigned' });
      }
      if (!user.role.permissions.includes('delete:any_post')) {
        return res.status(403).json({ message: 'Permission denied to delete this post' });
      }
    }
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
