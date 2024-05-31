/* Imports from React */
import { useEffect, useState } from 'react';

/* Import from wouter */
import { useLocation, useParams } from 'wouter';

/* Imports from other components created */
import Page from '../../components/Page/Page';
import Profile from '../../components/Profile/Profile';
import { PaginatedPostFeed } from '../../components/paginated-post-feed/paginated-post-feed';
import SEO from '../../components/seo/seo';

/* Imports for frontend api call and authentication verification */
import { isUser } from '../../lib/isUser';
import { api } from '../../lib/axios';

/**
 * Constructs, manages, and returns the UserPage component.
 *
 * @return The UserPage component as a JSX.Element
 */
const UserPage = () => {
	const [userData, setUserData] = useState<any>({ userName: '' });
	const [_, navigate] = useLocation();
	let { id = '' } = useParams();

	useEffect(() => {
		const getUserData = async function () {
			if (id !== undefined && (await isUser(id))) {
				return navigate('/profile', { replace: true });
			} else {
				try {
					if (id == '') return;
					const res = await api.get('/user/' + id);
					setUserData(res.data.value);
				} catch (err) {
					console.log(err);
				}
			}
		};

		getUserData();
	}, []);

	return (
		<Page
			pageName={userData.userName.length < 12 ? userData.userName : 'Profile'}
			content={
				<>
					<SEO
						title={`${userData.userName} on Skynet`}
						description={`${userData.userName} is on Skynet, join them now!`}
						og={{ image: userData.avatarUrl, imageAlt: `${userData.userName} Avatar`, type: 'website' }}
					/>

					<Profile {...userData} />

					<PaginatedPostFeed
						feedKey={id}
						fetchPage={(page) => api.get(`/feed/${id}?page=${page}`).then((res) => res.data.value)}
					/>
				</>
			}
		/>
	);
};

export default UserPage;
