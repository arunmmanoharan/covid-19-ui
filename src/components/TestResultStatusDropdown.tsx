import React, {FunctionComponent, useState} from 'react';
import { ItemRenderer, Select } from '@blueprintjs/select';
import { Button, Intent, MenuItem } from '@blueprintjs/core';
import {isEmpty} from 'lodash';
import { ITestResultStatus } from '../models';

interface ITestResultStatusDropdownProps {
	status: ITestResultStatus[],
	className?: string,
	getChangedStatus: (status: ITestResultStatus) => void;
}

const TestResultStatus = Select.ofType<ITestResultStatus>();

const TestResultStatusDropdown: FunctionComponent<ITestResultStatusDropdownProps> = (props:ITestResultStatusDropdownProps) => {

	const [selectedStatus, setSelectedStatus] = useState<ITestResultStatus|null>(null);

	const handleSelect = (status: ITestResultStatus) => {
		setSelectedStatus(status);
		props.getChangedStatus(status);
	}

	const renderStatus: ItemRenderer<ITestResultStatus> = (status, { handleClick, modifiers, query }) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}
		return (
			<MenuItem
				active={modifiers.active}
				disabled={modifiers.disabled}
				key={status.id}
				onClick={handleClick}
				text={status.Status}
			/>
		);
	};

	if(!isEmpty(props.status)) {
		return (
			<TestResultStatus
				className={props.className}
				activeItem={selectedStatus}
				onItemSelect={handleSelect}
				itemRenderer={renderStatus}
				items={props.status}
				filterable={false}
				popoverProps={{ minimal: true }}
			>
				<Button
					intent={Intent.PRIMARY}
					rightIcon="caret-down"
					text={selectedStatus ? `${selectedStatus.Status}` : "Select a status"}
				/>
			</TestResultStatus>
		)
	}
	return null
}

export default TestResultStatusDropdown;