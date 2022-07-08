import { Auth } from "aws-amplify";
import { FunctionComponent, ReactNode, useContext, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { CognitoContext, CognitoContextType } from "../contexts/CognitoProvider";
import { SpotifyContext, SpotifyContextType } from "../contexts/SpotifyProvider";
import { authURL } from "../utils/spotifyApi";

type ProtectedRouteProps = {
    children?: ReactNode;
}

const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, setAuthenticated } = useContext(CognitoContext) as CognitoContextType;
    const { spotifyTokens, setSpotifyTokens } = useContext(SpotifyContext) as SpotifyContextType;

    const location = useLocation();
    const navigate = useNavigate();

    // Check for existing Cognito session
    useEffect(() => {
        async function onLoad() {
            try {
                const user = await Auth.currentSession();
                const jwt = user?.getIdToken().getJwtToken();
                setAuthenticated(true, jwt);
            } catch (error: any) {
                console.log("Failed to load current session:", error)
                setAuthenticated(false);

                if (error === "No current user") navigate("/sign-in", { replace: true })
            }
        }

        // Check for Cognito Login
        if (!isAuthenticated) onLoad();
    }, [isAuthenticated, location, navigate, setAuthenticated]);

    // Check for Spotify Login
    // TODO: Refresh Token?
    if (isAuthenticated && !spotifyTokens?.access_token) {
        const storedAccessToken = window.localStorage.getItem("spotifyAccessToken");
        const storedRefreshToken = window.localStorage.getItem("spotifyRefreshToken");
        const storedExpiryTime = window.localStorage.getItem("spotifyExpiresAt");
        let expiresAt = storedExpiryTime ? new Date(storedExpiryTime) : new Date();

        // Check current spotify credentials are valid
        if (storedAccessToken && storedRefreshToken && expiresAt > new Date()) {
            setSpotifyTokens(storedAccessToken, storedRefreshToken);
        } else if (location.search) {
            const params = new URLSearchParams(location.search)
            const error = params.get("error")
            const errorDescription = params.get("errorDescription")
            const accessToken = params.get("access_token")
            const refreshToken = params.get("refresh_token")
            const expiresAt = params.get("expires_at") || "";

            if (error) {
                console.log("Spotify failed to authorise", error, errorDescription);
                // TODO: Error page... / Sign out
            }

            if (accessToken && refreshToken) {
                setSpotifyTokens(accessToken, refreshToken);
                window.localStorage.setItem("spotifyExpiresAt", expiresAt);
                return <Navigate to={location.pathname} state={{ from: location }} replace />
            }
        } else {
            // Redirect to API Gateway Spotify Authentication
            window.location.href = authURL;
        }
    }


    return (<> {children} </>)
}

export default ProtectedRoute;