interface IQuarantineStatus {
	id: number,
	Status: string,
	Color: string
}

interface ICovidStatus {
	id: number,
	Status: string
}

export interface ITestResultStatus {
	id: number,
	Status: string
}

export interface IStatus {
	covidStatus: ICovidStatus[],
	quarantineStatus: IQuarantineStatus[],
	testResultStatus: ITestResultStatus[]
}