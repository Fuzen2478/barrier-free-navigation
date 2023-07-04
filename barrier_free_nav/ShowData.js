import React from 'react';
import { View, Text } from 'react-native';

const ShowData = ({ route }) => {
    const { deviceData } = route.params;

    return (
        <View>
            <Text>{deviceData}</Text>
        </View>
    );
};

export default ShowData;