import { createContext, FunctionComponent, ReactNode, useContext, useState } from "react";
import { setToken } from "../utils/spotifyApi";

type SpotifyProviderProps = {
    children?: ReactNode;
}

interface SpotifyTokens {
    access_token: string,
    token_type?: "Bearer",
    scope?: string,
    expires_in?: number,
    refresh_token: string,
}

export type SpotifyContextType = {
    spotifyTokens?: SpotifyTokens;
    setSpotifyTokens: (access_token: string, refresh_token: string) => void;
};

export const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined)


const SpotifyProvider: FunctionComponent<SpotifyProviderProps> = ({ children }) => {
    const [spotifyTokens, setTokens] = useState<SpotifyTokens>();

    function setSpotifyTokens(access_token: string, refresh_token: string) {
        window.localStorage.setItem("spotifyAccessToken", access_token);
        window.localStorage.setItem("spotifyRefreshToken", refresh_token);
        setTokens({ access_token, refresh_token });
        setToken(access_token);
    }

    return (
        <SpotifyContext.Provider value={{ spotifyTokens, setSpotifyTokens }}>
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotifyContext = () => useContext(SpotifyContext);

export default SpotifyProvider;