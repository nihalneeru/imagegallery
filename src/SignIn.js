import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Button, Flex, Heading } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/gallery');
    }
  }, []);

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" height="100vh" backgroundColor="#f5f5f5">
      <Heading level={2} color="#4285F4">Welcome to Image Gallery</Heading>
      <Authenticator>
        {({ signOut, user }) => (
          <>
            <p>Welcome, {user.username}</p>
            <Button onClick={signOut}>Sign Out</Button>
          </>
        )}
      </Authenticator>
    </Flex>
  );
};

export default SignIn;
