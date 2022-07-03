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
                const jwt = user?.getAccessToken().getJwtToken();
                setAuthenticated(true, jwt);
            } catch (error: any) {
                console.log("Failed to load current session:", error)
                setAuthenticated(false);

                if (error === "No current user") navigate("/login", { replace: true })
            }
        }

        // Check for Cognito Login
        if (!isAuthenticated) onLoad();
    }, [isAuthenticated, location, navigate, setAuthenticated]);

    // Check for Spotify Login
    // TODO: Refresh Token?
    if (isAuthenticated && !spotifyTokens?.access_token) {
        // Check for Spotify Callback
        if (location.search) {
            const params = new URLSearchParams(location.search)
            const error = params.get("error")
            const errorDescription = params.get("errorDescription")
            const accessToken = params.get("access_token")
            const refreshToken = params.get("refresh_token")

            // Update state and clear URL Params
            if (accessToken && refreshToken) {
                setSpotifyTokens(accessToken, refreshToken);
                return <Navigate to={location.pathname} state={{ from: location }} replace />
            } else {
                console.log("Missing access token", error, errorDescription);
                // TODO: Error page... / Sign out
            }
        } else {
            // Redirect to API Gateway Spotify Authentication
            window.location.href = authURL;
        }
    }


    return (<> {children} </>)
}

export default ProtectedRoute;