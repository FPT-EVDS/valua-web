import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';

interface Props {}

const GoogleLoginButton = (props: Props) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  console.log(process.env);
  const onSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    console.log(response);
  };

  const onFailure = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    console.log(response);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId!}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        render={props => (
          <Button
            onClick={props.onClick}
            disabled={props.disabled}
            variant="contained"
            fullWidth
            color={'google'}
            size="large"
            sx={{ mt: 3, mb: 2 }}
            startIcon={<GoogleIcon />}
          >
            Login with Google
          </Button>
        )}
      />
    </div>
  );
};

export default GoogleLoginButton;
