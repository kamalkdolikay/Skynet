/* Stylesheet imports */
import styles from './header.module.css';

/* Imports from wouter */
import { useRoute } from 'wouter';

/* Imports from React */
import { useContext } from 'react';

/* Icon imports from react-icons */
import { IoArrowBackCircleOutline } from 'react-icons/io5';

/* Imports from react-bootstrap */
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

/* Import for the authorized user context */
import { UserAuthContext } from '../../lib/auth';

/**
 * The properties and types for the Header.
 */
interface Props {
	pageName?: string;
	enableLogoHeader?: boolean;
}

/**
 * Returns the customized header for the page with the provided properties.
 *
 * @param props the props for this header, as seen outlined in the interface.
 * @param props.pageName (Optional) The name of the page as a string. Needed only if enableLogoHeader is false
 * @param props.enableLogoHeader (Optional) If true, a header with just the website name will be given.
 * @requires props.pageName if enableLogoHeader is false unless empty title is needed.
 * @returns Returns the customized header for the page as a JSX.Element.
 */
const Header = (props: Props) => {
	const [isHomeActive] = useRoute('/home');
	const [isRootActive] = useRoute('/');
	const user = useContext(UserAuthContext);

	return (
		<>
			{props.enableLogoHeader && user ? (
				isHomeActive || isRootActive ? (
					<div
						className={styles.logoHeader}
						style={{ backgroundColor: 'transparent', pointerEvents: 'none' }}>
						<h1>sky.net</h1>
					</div>
				) : (
					<div className={styles.logoHeader}>
						<h1>sky.net</h1>
					</div>
				)
			) : (
				<Navbar expand='lg' className={`${styles.headerContainer}`}>
					<Container>
						<Navbar.Text onClick={handlePageReturn}>
							<IoArrowBackCircleOutline className={styles.returnIcon} />
						</Navbar.Text>
						<Navbar.Text style={{ fontSize: "2remf" }} className={styles.pageTitle}>
							{props.pageName}
						</Navbar.Text>
					</Container>
				</Navbar>
			)}
		</>
	);
};

/**
 * Exports the header for external use.
 */
export default Header;

/**
 * Redirects the window back to the previous page.
 */
function handlePageReturn() {
	history.back();
}
