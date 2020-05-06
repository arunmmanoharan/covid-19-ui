import React, { FunctionComponent, useState, useContext } from 'react';
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import * as Api from '../services/API';
import APICacheContext from '../context/APICacheContext';

const AddNewUser: FunctionComponent = () => {
	const apiContext = useContext(APICacheContext);

	const [isDialogOpen, setDialogState] = useState<boolean>(false);
	const [username, setUsername] = useState<string>('');
	const [userContact, setUsercontact] = useState<string>('');

	const handleDialogState = () => {
		setDialogState(true);
	};

	const closeDialog = () => {
		setUsername('');
		setUsercontact('');
		setDialogState(false);
	};

	const handleUserNameChange = (e: any) => {
		setUsername(e.currentTarget.value);
	};

	const handleUserContactChange = (e: any) => {
		setUsercontact(e.currentTarget.value);
	};

	const addUser = () => {
		Api.create('/users/createNewUsers', {
			Name: username,
			Contact: userContact,
		}).then(() => apiContext?.load(['/users/getUsers']).then(() => closeDialog()));
	};

	return (
		<>
			<Button intent={Intent.PRIMARY} onClick={handleDialogState}>
				Add New User
			</Button>
			<Dialog title="Add New User" isOpen={isDialogOpen} onClose={closeDialog}>
				<div className={Classes.DIALOG_BODY}>
					<FormGroup label="User Name" labelInfo="(required)">
						<InputGroup
							id="username-input"
							placeholder="Enter a user name"
							onChange={handleUserNameChange}
							value={username}
						/>
					</FormGroup>
					<FormGroup label="User Contact" helperText="Enter an email address or phone number" labelInfo="(required)">
						<InputGroup
							id="usercontact-input"
							placeholder="Enter a user contact"
							onChange={handleUserContactChange}
							value={userContact}
						/>
					</FormGroup>
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button onClick={closeDialog}>Close</Button>
						<Button intent={Intent.PRIMARY} onClick={addUser}>
							Add User
						</Button>
					</div>
				</div>
			</Dialog>
		</>
	);
};

export default AddNewUser;
