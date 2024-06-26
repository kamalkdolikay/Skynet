import mongoose from 'mongoose';
import { Handler } from 'express';
import { authProtected } from '../../../middlewares/auth-protected';
import { Resolve } from '../../../utils/express';
import { UserModel } from '../../../models/user';
import Joi from 'joi';
import { DeletedUserModel } from '../../../models/deletedUser';

interface deleteBody {
	confirmationInput: string;
}

const message = 'I-WANT-TO-DELETE-THIS-ACCOUNT';

/**
 * POST @ /user/deleteaccount
 *
 * This deletes the user that is making the request.
 * This does not actually drop the document from the
 * database because of legal reasons. It simply anonomizes
 * the existing user and saves the previous version of the user
 * in a private spot.
 */
export const post: Handler[] = [
	authProtected,
	async (req, res) => {
		const userID = req.user!.id;
		const User = mongoose.model('User', UserModel.schema);

		const deleteSchema = Joi.object<deleteBody>({
			confirmationInput: Joi.string().uppercase().trim().required().equal(message).messages({
				'string.base': 'The phrase must not contain any numbers or special characters.',
				'string.lowercase': 'The phrase must be typed in uppcase',
				'any.required': 'The identical phrase is required to delete this account.',
				'any.only': 'The phrase entered does not match.',
			}),
		});

		const validationResult = deleteSchema.validate(req.body, { convert: false });
		if (validationResult.error) return Resolve(res).badRequest(validationResult.error.message);

		const userRef = await User.findById(userID);
		if (!userRef) return Resolve(res).notFound('User could not be found.');

		const userCopy = userRef;

		await userRef.updateOne({
			email: null,
			sso: null,
			userName: 'Deleted User',
			password: null,
			location: null,
			bio: null,
			birthDate: null,
			avatarUrl: null,
			deleted: true
		});

		const deletedUser = new DeletedUserModel({
			originID: userCopy._id,
			email: userCopy.email,
			sso: userCopy.sso,
			password: userCopy.password,
			userName: userCopy.userName,
			bio: userCopy.bio,
			location: userCopy.location,
			birthDate: userCopy.birthDate,
			avatarUrl: userCopy.avatarUrl,
			followerCount: userCopy.followerCount,
			followingCount: userCopy.followingCount,
			postCount: userCopy.postCount,
			savedPosts: userCopy.savedPosts,
			admin: userCopy.admin,
			deleted: true,
		});
		
		await deletedUser.save();

		Resolve(res).okWith(userCopy, 'Account deleted successfully.');
	},
];
