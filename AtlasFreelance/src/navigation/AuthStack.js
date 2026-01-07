import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Auth  = createNativeStackNavigator();

export default function AuthStack(){
    return(
        <Auth.Navigator>
        <Auth.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }}/>
        <Auth.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }}/>
        </Auth.Navigator>
    )
}
