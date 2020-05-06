import { createContext } from 'react';

export interface IUser {
	Name: string, id: number, Contact: string, QuarantineStatus: number, CurrentCovidStatus: number, UpdatedAt: string
}

interface IUserContext {
	user: IUser,
	changeUser: (user: IUser) => void;
}

const UserContext = createContext<IUserContext | null>(null);
UserContext.displayName = 'UserContext';

export default UserContext;