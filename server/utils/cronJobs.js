const cron = require('node-cron');
const Blog = require('../models/Blog');

// Run job every midnight
const stalePostsCleanup = cron.schedule('0 0 * * *', async () => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 15);

    const result = await Blog.updateMany(
      { 
        status: { $in: ['draft', 'pending'] },
        updatedAt: { $lte: thresholdDate }
      },
      { 
        $set: { 
          status: 'archived',
          adminNote: 'Automatically archived due to 15 days of inactivity.'
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Cron job: Auto-archived ${result.modifiedCount} stale posts.`);
    }
  } catch (error) {
    console.error('Error in cron job stalePostsCleanup:', error.message);
  }
});

module.exports = { stalePostsCleanup };
