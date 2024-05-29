import { Link } from 'wouter';
import Header from '../../components/Header/Header';
import UIBox from '../../components/UIBox/UIBox';
import styles from './page404.module.css';
import { Container, Image } from 'react-bootstrap';

const Page404 = () => {
	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<Header enableLogoHeader />
			</div>
			<div className={styles.panel}>
				<div className={styles.text404}>
					<h1>404</h1>
					<h3>Suspect page not found</h3>
					<h5>The page you were looking for doesn't exist or was moved to the next galaxy.</h5>
					<Container className={styles.buttonGroup}>
						<Link className={styles.linkText} href='/'>
							<UIBox className={styles.buttons} content='Main Page' curved clickable />
						</Link>
						<Link className={styles.linkText} href='/faqs'>
							<UIBox className={styles.buttons} content='FAQs' curved dark clickable />
						</Link>
					</Container>
				</div>
			</div>
		</div>
	);
};

export default Page404;