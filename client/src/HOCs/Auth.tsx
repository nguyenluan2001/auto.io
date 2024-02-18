import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useUser } from '@/store/user';

const Auth = (Component: React.FC<any>) =>
  function (props: any) {
    const { setCurrentUser, currentUser } = useUser((state: any) => state);
    const {
      data: user,
      isLoading,
      isFetching,
    } = useCurrentUser({
      options: {
        enabled: currentUser === null,
      },
    });
    const navigate = useNavigate();
    useEffect(() => {
      if (user?.id) {
        setCurrentUser(user);
      }
    }, [user]);
    if (isLoading || isFetching) return <LoadingScreen />;
    if (!user?.id) {
      console.log('🚀 ===== user:', user);
      console.log('navigate');
      return <Navigate to="/sign-in" />;
    }

    return <Component {...props} />;
  };
export default Auth;
