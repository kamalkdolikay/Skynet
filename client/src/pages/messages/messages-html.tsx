import { FaVideo } from 'react-icons/fa';
import { IoCall } from 'react-icons/io5';
import { IoChevronBackCircleSharp } from 'react-icons/io5';
import { IoSend } from 'react-icons/io5';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { RxAvatar } from 'react-icons/rx';
import { Else, If, Then } from 'react-if';

import styles from './messages.module.css';

const MessagesHtml = ({ message, messages, setMessage, submitForm, id, isChat, user }: any) => {
	function handlePageReturn() {
		history.back();
	}
	return (
		<>
			<div className={`container ${styles.container}`}>
				<header className='border-bottom lh-1 py-3'>
					<div className='row flex-nowrap justify-content-between align-items-center'>
						<div className='col-4 pt-1'>
							<IoChevronBackCircleSharp size={30} onClick={handlePageReturn} />
						</div>
						<div className='col-4 text-center'>
							<a className='blog-header-logo text-body-emphasis text-decoration-none' href='#'>
								<RxAvatar size={50} />
								<h3 className={styles.h3}>{user.userName}</h3>
							</a>
						</div>
						<div className='col-4 d-flex justify-content-end align-items-center'>
							<FaVideo size={20} />
							<IoCall size={20} />
						</div>
					</div>
				</header>

				<main className='container'>
					<div className='row'>
						{isChat ? (
							messages.map((message: any, index: number) => {
								return (
									<div className='d-inline' key={index}>
										<If condition={id === message.senderId}>
											<Then>
												<div className='d-flex text-body-secondary'>
													<RxAvatar size={25} />
													<p className={styles.p} key={index}>
														{message.content}
													</p>
													<br />
												</div>
											</Then>
											<Else>
												<div className='d-flex justify-content-end '>
													<RxAvatar size={25} />
													<p className={styles.p} key={index}>
														{message.content}
													</p>
													<br />
												</div>
											</Else>
										</If>
									</div>
								);
							})
						) : (
							<div className='d-flex text-body-secondary'>
								<p>No Messages to Show</p>
							</div>
						)}
					</div>
				</main>

				<div className={`container fixed-bottom mb-2 ${styles.lol}`}>
					<div className='row'>
						<div className='col-1 themed-grid-col'>
							<MdOutlineEmojiEmotions size={40} />
						</div>
						<div className='col-10 themed-grid-col'>
							<form onSubmit={submitForm}>
								<input
									type='text'
									className='form-control form-control-lg'
									id='address'
									placeholder='Type Here'
									required
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>
							</form>
						</div>
						<div className='col-1 themed-grid-col'>
							<IoSend size={40} />
						</div>
					</div>
					{/* <button
						id='myBtn'
						type='button'
						className={`${styles.btnDefault} form-control btn btn-block confirm-button`}>
						Send
					</button> */}
				</div>
			</div>
		</>
	);
};

export default MessagesHtml;
