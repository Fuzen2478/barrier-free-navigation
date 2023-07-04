import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App';
import ShowData from './ShowData';

const Stack = createStackNavigator();

export const navigationRef = React.createRef();

export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="App" component={App} options={{ title: 'BLE Scan' }} />
                <Stack.Screen name="ShowData" component={ShowData} options={{ title: 'Device Data' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;