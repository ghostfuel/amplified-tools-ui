import { Hub } from "aws-amplify";
import { createContext, FunctionComponent, ReactNode, useContext, useState } from "react";


type CognitoProviderProps = {
    children?: ReactNode;
}

export type CognitoContextType = {
    isAuthenticated: boolean;
    idToken?: string;
    setAuthenticated: (isAuthenticated: boolean, idToken?: string) => void;
};

export const CognitoContext = createContext<CognitoContextType | undefined>(undefined)


const CognitoProvider: FunctionComponent<CognitoProviderProps> = ({ children }) => {
    const [isAuthenticated, updateAuthenticated] = useState(false);
    const [idToken, setIdToken] = useState<string | undefined>();

    function setAuthenticated(isAuthenticated: boolean, idToken?: string) {
        updateAuthenticated(isAuthenticated);
        setIdToken(idToken);
    }

    // Listen for Amplify Auth events and ensure state is reflected 
    Hub.listen('auth', ({ payload }) => {
        if (payload.event === "signOut") {
            updateAuthenticated(false);
        }
    })

    return (
        <CognitoContext.Provider value={{ isAuthenticated, idToken, setAuthenticated }}>
            {children}
        </CognitoContext.Provider>
    );
};

export const useCognitoContext = () => useContext(CognitoContext);

export default CognitoProvider;