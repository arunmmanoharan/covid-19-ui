import React, {FunctionComponent, useState} from 'react';
import { ItemRenderer, Select } from '@blueprintjs/select';
import { Button, Intent, MenuItem } from '@blueprintjs/core';
import {isEmpty} from 'lodash';
import { IUser } from '../context/UserContext';

interface IUserDropdownProps {
	users: IUser[],
	className?: string,
	getChangedUser: (user: IUser) => void;
}

const UserSelect = Select.ofType<IUser>();

const UserDropdown: FunctionComponent<IUserDropdownProps> = (props:IUserDropdownProps) => {

	const [selectedUser, setSelectedUser] = useState<IUser|null>(null);

	const handleSelect = (user: IUser) => {
		setSelectedUser(user);
		props.getChangedUser(user)
	}

	const renderUser: ItemRenderer<IUser> = (user, { handleClick, modifiers, query }) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}
		return (
			<MenuItem
				active={modifiers.active}
				disabled={modifiers.disabled}
				key={user.id}
				onClick={handleClick}
				text={user.Name}
			/>
		);
	};

	if(!isEmpty(props.users)) {
		return (
			<UserSelect
				className={props.className}
				activeItem={selectedUser}
				onItemSelect={handleSelect}
				itemRenderer={renderUser}
				items={props.users}
				filterable={false}
				popoverProps={{ minimal: true }}
			>
				<Button
					intent={Intent.PRIMARY}
					icon="user"
					rightIcon="caret-down"
					text={selectedUser ? `${selectedUser.Name}` : "Select a user"}
				/>
			</UserSelect>
		)
	}
	return null
}

export default UserDropdown;