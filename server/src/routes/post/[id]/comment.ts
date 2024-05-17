import { Handler } from 'express';
import { requireLogin } from '../../../middlewares/require-login';
import mongoose from 'mongoose';
import { assertRequestBody, Resolve } from '../../../utils/express';
import { PostModel } from '../../../models/post';
import { RawDocument } from '../../../@types/model';
import { ILocation, RawLocationSchema } from '../../../models/location';
import { IMedia, RawMediaSchema } from '../../../models/media';
import { getHydratedUser } from '../../../utils/session';
import Joi from 'joi';
import { CommentRelationship } from '../../../models/comment-relationship';

interface PostBody {
	content: string;
	location?: RawDocument<ILocation>;
	media?: RawDocument<IMedia>;
}

export const post: Handler[] = [
	requireLogin,
	async (req, res) => {
		const parentPostId = req.params.id;
		if (!mongoose.isValidObjectId(parentPostId)) return Resolve(res).badRequest('Invalid post ID provided.');

		const parentPost = await PostModel.findById(parentPostId);
		if (!parentPost) return Resolve(res).notFound('Invalid post ID provided.');

		if (parentPost.deleted) return Resolve(res).gone('The given post is deleted.');

		const body = assertRequestBody(
			req,
			res,
			Joi.object<PostBody>({
				content: Joi.string().trim().required(),
				location: RawLocationSchema,
				media: RawMediaSchema,
			}),
		);

		if (!body) return;

		const currentUser = await getHydratedUser(req);
		if (!currentUser) return Resolve(res).unauthorized('You are not authorized to comment.');

		const session = await mongoose.startSession();

		try {
			const commentRelationship = await session.withTransaction(async () => {
				const comment = new PostModel({
					authorId: currentUser._id,
					content: body.content,
					media: body.media,
					location: body.location ?? currentUser.location,
				});

				const relationship = new CommentRelationship({
					parentPost: parentPost._id,
					childPost: comment._id,
				});

				await comment.save({ session });
				await relationship.save({ session });

				currentUser.postCount++;
				await currentUser.save({ session });

				parentPost.commentCount++;
				await parentPost.save({ session });

				return relationship;
			});

			Resolve(res).created(commentRelationship, 'Comment created successfully.');
		} catch {
			Resolve(res).error('Error occured while trying to create this comment.');
		} finally {
			await session.endSession();
		}
	},
];