import { createContext } from 'react';

import APICache from '../services/APICache';

const APICacheContext = createContext<APICache | undefined>(undefined);
APICacheContext.displayName = 'APICacheContext';

export default APICacheContext;