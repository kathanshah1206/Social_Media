import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../auth";

const SocialLogin = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const responseGoogle = (response) => {
    console.log(response);
    const { googleId, name, email, imageUrl } = response.profileObj;
    const user = {
      password: googleId,
      name: name,
      email: email,
      imageUrl: imageUrl,
    };

    socialLogin(user).then((data) => {
      console.log("signin data: ", data);
      if (data.error) {
        console.log("Error Login. Please try again..");
      } else if (!data.error) {
        console.log("signin success - setting jwt: ", data);
        authenticate(data, () => {
          setRedirectToReferrer(true);
        });
      } else {
        console.log("Error Login. Please try again..");
      }
    });
  };

  // redirect
  if (redirectToReferrer) {
    return <Redirect to="/" />;
  }

  return (
    <GoogleLogin
      clientId="114364230972-qae87cs9orqi3c874atsg6aujd28n9r6.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
    />
  );
};

export default SocialLogin;
