import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import UserDropdown from './UserDropdown';
import AddNewUser from './AddNewUser';
import { Button, Classes, Divider, H3, Intent } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from '@blueprintjs/datetime';
import UserCovidStatus from './UserCovidStatus';
import { IUser } from '../context/UserContext';
import APICacheContext from '../context/APICacheContext';
import { IStatus, ITestResultStatus } from '../models';
import TestResultStatusDropdown from './TestResultStatusDropdown';
import * as API from '../services/API';

const userInitialState: IUser = {
	Contact: '',
	CurrentCovidStatus: 0,
	Name: '',
	QuarantineStatus: 0,
	UpdatedAt: '',
	id: 0,
};

const Layout: FunctionComponent = () => {
	const apiContext = useContext(APICacheContext);

	const [users, setUsers] = useState<IUser[] | []>([]);

	useEffect(() => {
		apiContext?.load(['/users/getUsers'], true).then((response) => setUsers(response[0]));
	}, [apiContext]);

	const [user, setUser] = useState<IUser>(userInitialState);

	const [metUser, setMetUser] = useState<IUser>({
		Contact: '',
		CurrentCovidStatus: 0,
		Name: '',
		QuarantineStatus: 0,
		UpdatedAt: '',
		id: 0,
	});

	const [status, setStatus] = useState<IStatus>({
		covidStatus: [],
		quarantineStatus: [],
		testResultStatus: [],
	});

	const [metPersonDate, setMetPersonDate] = useState<Date | null>(null);
	const [testTakenDate, setTestTakenDate] = useState<Date | null>(null);

	const jsDateFormatter: IDateFormatProps = {
		// note that the native implementation of Date functions differs between browsers
		formatDate: (date) => date.toLocaleDateString(),
		parseDate: (str) => new Date(str),
		placeholder: 'MM/DD/YYYY',
	};

	const changeMetUser = (metUser: IUser) => setMetUser(metUser);

	const [testResultStatus, setTestResultStatus] = useState<ITestResultStatus | null>(null);

	const changeTestResultStatus = (status: ITestResultStatus) => setTestResultStatus(status);

	useEffect(() => {
		apiContext
			?.load(['/status/getCovidStatus', '/status/getQuarantineStatus', '/status/getTestResultStatus'])
			.then((resp) => {
				setStatus({
					covidStatus: resp[0],
					quarantineStatus: resp[1],
					testResultStatus: resp[2],
				});
			});
	}, [apiContext]);

	const updateTestResult = () => {
		API.create('/users/updateUserTestResultStatus', {
			PersonId: user.id,
			TestTakenDate: testTakenDate || Date.now(),
			TestResultStatus: testResultStatus?.id,
		}).then(() => {
			apiContext?.load(['/users/getUsers'], true).then((response) => setUsers(response[0]));
			setUser(userInitialState);
		});
	};

	const getChangedUser = (user: IUser) => {
		setUser(user);
	};

	const updateMeeting = () => {
		API.create('/users/updatePersonMeeting', {
			PersonId: user.id,
			MetPersonId: metUser.id,
			MetPersonDate: metPersonDate || Date.now(),
		});
	};

	return (
		<div className="container border border-primary">
			<div className="p-4">
				<div className="float-left">
					<UserDropdown users={users} getChangedUser={getChangedUser} />
				</div>
				<div className="float-right">
					<AddNewUser />
				</div>
				<div className="clearfix" />
				<Divider className={Classes.INTENT_PRIMARY} />
				<UserCovidStatus status={status} userDetails={user} />
				{user.Name && (
					<>
						<Divider className={Classes.INTENT_PRIMARY} />
						<div className="container">
							<div className="row">
								<div className="col-6">
									<H3>Enter Contact Information</H3>
									<div className="d-flex flex-column">
										<DateInput {...jsDateFormatter} value={metPersonDate} onChange={(date) => setMetPersonDate(date)} />
										<UserDropdown
											className="pt-2"
											users={users.filter((item) => item.id !== user.id)}
											getChangedUser={changeMetUser}
										/>
										<Button className="mt-2" intent={Intent.PRIMARY} onClick={updateMeeting}>
											Save
										</Button>
									</div>
								</div>
								<div className="col-6">
									<H3>Enter Test Results</H3>
									<div className="d-flex flex-column">
										<DateInput {...jsDateFormatter} value={testTakenDate} onChange={(date) => setTestTakenDate(date)} />
										<TestResultStatusDropdown
											className="pt-2"
											status={status.testResultStatus}
											getChangedStatus={changeTestResultStatus}
										/>
										<Button className="mt-2" intent={Intent.PRIMARY} onClick={updateTestResult}>
											Save
										</Button>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Layout;
