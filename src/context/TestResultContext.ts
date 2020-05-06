import { createContext } from 'react';
import { ITestResultStatus } from '../models';

interface ITestResultContext {
	testResultStatus: ITestResultStatus | null,
	changeTestResultStatus: (user: ITestResultStatus) => void;
}

const TestResultContext = createContext<ITestResultContext | null>(null);
TestResultContext.displayName = 'TestResultContext';

export default TestResultContext;