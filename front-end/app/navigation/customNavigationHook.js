// customNavigationHook.js
import { useNavigation } from '@react-navigation/native';

export const useCustomNavigation = () => {
  const navigation = useNavigation();

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToWelcome = () => {
    navigation.navigate('Welcome');
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };



  return {
    navigateToSignUp,
    navigateToLogin,
    navigateToHome,
    navigateToWelcome,
    navigateToProfile,
  };
};
