export const COGNITO = {
  REGION: "",
  USER_POOL_ID: "",
  APP_CLIENT_ID: "",
};

export const API = {
  API_BASE_URL:
    process.env.ENVIRONMENT === "production"
      ? "https://<api-gateway-id>.execute-api.<region>.amazonaws.com/<stage>"
      : "http://localhost:3000/dev",
};
