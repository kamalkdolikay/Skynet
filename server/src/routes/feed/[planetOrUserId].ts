import { Handler } from 'express';
import { IPost, PostModel } from '../../models/post';
import { Resolve } from '../../utils/express';
import { PlanetModel } from '../../models/planet';
import mongoose from 'mongoose';
import { UserModel } from '../../models/user';
import { authProtected } from '../../middlewares/auth-protected';

export const get: Handler[] = [
	authProtected,
	async (req, res) => {
		const planetOrUserId = req.params.planetOrUserId;
		if (!mongoose.isValidObjectId(planetOrUserId)) return Resolve(res).badRequest('Invalid planet ID specified.');

		let search: mongoose.FilterQuery<IPost>;
		const existingPlanet = await PlanetModel.exists({ _id: planetOrUserId }).lean();
		if (existingPlanet) search = { 'location.planetId': existingPlanet._id };
		else {
			const existingUser = await UserModel.exists({ _id: planetOrUserId }).lean();
			if (existingUser) search = { authorId: existingUser._id };
			else return Resolve(res).notFound('No planet or user by the given ID exists.');
		}
		
		const userId = req.user!._id;

		const rawPage = parseInt(typeof req.query.page === 'string' ? req.query.page : '');
		const page = Math.max(1, typeof rawPage !== 'number' || isNaN(rawPage) ? 1 : rawPage);
		const limit = 20;
		const skip = (page - 1) * limit;

		// TODO aggregate liked and saved variables

		const latestPosts = await PostModel.aggregate([
			{ $match: { ...search, isRoot: { $not: { $eq: false } }, deleted: false } },
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
			{ $addFields: { userName: '$author.userName' } },
			{ $project: { author: 0 } },
		]);

		Resolve(res).okWith(latestPosts);
	},
];
