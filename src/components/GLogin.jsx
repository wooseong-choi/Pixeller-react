import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GoogleUserDTO } from "../api/dto/user";
import { loginS } from "../api/login.jsx";

const GLogin = () => {
  const navigate = useNavigate();
  const clientId =
    "99709035135-lq4adkjjk5trck2eg2fsi3aagilljfmv.apps.googleusercontent.com";

  const handleSuccess = async (response) => {
    const token = response.credential;
    const jwt = jwtDecode(token);
    const name = jwt.email;
    console.log("Google Login Success:", jwt);
    const user = new GoogleUserDTO(name, token, jwt.sub);

    const res = await loginS(user);
    console.log(res);
    if (res === "success") {
      navigate("/main");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onFailure={(response) => {
          console.log("Google Login Failure:", response);
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GLogin;
