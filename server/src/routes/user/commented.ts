import { Handler } from 'express';
import { authProtected } from '../../middlewares/auth-protected';
import { PostModel } from '../../models/post';
import { Resolve } from '../../utils/express';

/**
 * GET @ /user/commented
 * Fetches paginated commented posts by a user.
 */
export const get: Handler[] = [
	authProtected,
	async (req, res) => {
		const userId = req.user!._id;
		const rawPage = parseInt(typeof req.query.page === 'string' ? req.query.page : '');
		const page = Math.max(1, typeof rawPage !== 'number' || isNaN(rawPage) ? 1 : rawPage);
		const limit = 20;
		const skip = (page - 1) * limit;

		try {
			// Find all non-root posts by the user
			const parentPostIds = await PostModel.find({
				authorId: userId,
				parentPost: { $exists: true },
				deleted: false,
			}).distinct('parentPost').lean();

			if (parentPostIds.length === 0) {
				return Resolve(res).okWith({ commentedPosts: [] });
			}

			// Retrieve parent posts with pagination and join with user details
			const commentedPostsDetails = await PostModel.aggregate([
				{ $match: { _id: { $in: parentPostIds } } },
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: limit },
				{
					$lookup: {
						from: 'users',
						localField: 'authorId',
						foreignField: '_id',
						as: 'author',
					},
				},
				{ $unwind: { path: '$author' } },
				{ $addFields: { userName: '$author.userName', avatarUrl: '$author.avatarUrl' } },
				{ $project: { author: 0 } },
			]);

			return Resolve(res).okWith({ commentedPosts: commentedPostsDetails });
		} catch (error) {
			console.error(error);
			return Resolve(res).error('Error fetching commented posts.');
		}
	},
];
