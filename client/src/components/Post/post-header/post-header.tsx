import { useEffect, useState, useContext } from 'react';
import { If, Then } from 'react-if';
import { Link } from 'wouter';
import { api } from '../../../lib/axios';
import style from './post-header.module.css';
import { UserAuthContext } from '../../../lib/auth';
import UIBox from '../../UIBox/UIBox';

interface Props {
	userName: string;
	displayTime?: boolean;
	authorId: string;
	avatarUrl?: string;
	createdAt?: Date;
	location?: {
		planetId: string;
		latitude: number;
		longitude: number;
		_id: string;
	};
}

export const PostHeader = (props: Props) => {
	const user = useContext(UserAuthContext);
	const currentUserId = user?._id; // Assuming user object has _id property

	const timeOptions: Intl.DateTimeFormatOptions =
		props.displayTime === true ? { hour: 'numeric', minute: 'numeric' } : {};
	const dateFormatter = Intl.DateTimeFormat(navigator.language, {
		month: 'long',
		day: 'numeric',
		...timeOptions,
	});

	const [date, setDate] = useState<Date>();
	useEffect(() => {
		if (!props.createdAt) setDate(undefined);
		else setDate(new Date(props.createdAt));
	}, [props.createdAt]);

	const [locationName, setLocationName] = useState<string>();
	useEffect(() => {
		if (!props.location) return setLocationName(undefined);
		api.get(`/planet/${props.location.planetId}`).then(({ data }) => setLocationName(data.value.name));
	}, [props.location?._id]);

	const handleDelete = () => {
		// Implement delete logic here
		console.log('Delete post');
	};

	return (
		<div className={`w-100 d-flex gap-2 align-items-center pb-1 ${style.postHeaderContainer}`}>
			<If condition={props.avatarUrl}>
				<Then>
					<Link href={'/user/' + props.authorId ?? '/'}>
						<img
							src={props.avatarUrl}
							alt={props.userName + ' Avatar'}
							className='img-thumbnail rounded-circle'
							style={{ maxWidth: '64px', maxHeight: '64px' }}
						/>
					</Link>
				</Then>
			</If>

			<div className='d-flex flex-column align-items-start gap-1'>
				<Link
					href={'/user/' + props.authorId ?? '/'}
					className='text-decoration-none text-white bg-black rounded-4 px-2 py-1'>
					<span>@{props.userName}</span>
				</Link>

				<div className={`d-flex gap-2 ps-1 ${style.infoList}`}>
					<If condition={!!date}>
						<Then>
							<small className='text-muted'>{dateFormatter.format(date)}</small>
						</Then>
					</If>

					<If condition={!!locationName}>
						<Then>
							<small className='text-muted'>{locationName}</small>
						</Then>
					</If>
				</div>
			</div>

			<If condition={props.authorId === currentUserId}>
				<Then>
					<button className={style.deleteButton} onClick={handleDelete}>
						<UIBox
							className={`${style.buttons} p-1 h-100 d-flex align-items-center`}
							content={
								<div className='d-flex gap-1 align-items-center'>
									<span>X</span>
								</div>
							}
							curved
							clickable
							dark
						/>
					</button>
				</Then>
			</If>
		</div>
	);
};
