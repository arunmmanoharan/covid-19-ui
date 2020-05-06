import React, { FunctionComponent } from 'react';
import { H3, H4 } from '@blueprintjs/core';
import { IUser } from '../context/UserContext';
import { IStatus } from '../models';

interface IUserCovidStatusProps {
	status: IStatus;
	userDetails: IUser;
}

const UserCovidStatus: FunctionComponent<IUserCovidStatusProps> = (props: IUserCovidStatusProps) => {
	if (props.userDetails.Name) {
		return (
			<ul>
				<li>
					<H3 className="d-inline">Name:</H3> <H4 className="d-inline">{props.userDetails.Name}</H4>
				</li>
				<li>
					<H3 className="d-inline">Quarantine Status:</H3>
					<H4 className="d-inline">
						{props.status.quarantineStatus.find((item) => item.id === props.userDetails.QuarantineStatus)?.Status}
					</H4>
				</li>
				<li>
					<H3 className="d-inline">Current COVID Status:</H3>
					<H4 className="d-inline">
						{props.status.covidStatus.find((item) => item.id === props.userDetails.CurrentCovidStatus)?.Status}
					</H4>
				</li>
			</ul>
		);
	}
	return null;
};

export default UserCovidStatus;
