/**
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState} from 'react';
import {
    ScrollView,
    Text,
    View,
    NativeModules,
    NativeEventEmitter,
    TouchableOpacity, ToastAndroid,
} from 'react-native';
import BleManager, {
    Peripheral,
} from 'react-native-ble-manager';
import { NavigationContainer } from '@react-navigation/native';
import ShowData from "./ShowData";

const SECONDS_TO_SCAN_FOR = 7;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const App = () => {
    const [devices, setDevices] = useState<Peripheral[]>([]);


    useEffect(() => {
        BleManager.start({showAlert: false});

        const handleDiscoverPeripheral = (peripheral) => {
            setDevices((prevDevices) => {
                // Check if the device is already in the list
                const existingDevice = prevDevices.find(
                    (device) => device.id === peripheral.id
                );

                if (existingDevice) {
                    // Update existing device
                    return prevDevices.map((device) =>
                        device.id === peripheral.id ? peripheral : device
                    );
                } else {
                    // Add new device to the list
                    return [...prevDevices, peripheral];
                }
            });
        };

        bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleDiscoverPeripheral
        );

        return () => {
            BleManager.stopScan();
        };
    }, []);

    const startScan = () => {
        console.log("start scan");
        BleManager.scan([], SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES);
    };

    const Connect = (device) => {
        BleManager.connect(device.id).then(() => {
            console.log('connected to device:', device.name);
            ToastAndroid.show('Connected to device: ' + device.name, ToastAndroid.SHORT);
            BleManager.startNotification(device.id, '680c21d9-c946-4c1f-9c11-baa1c21329e7', '003bbdf2-c634-4b3d-ab56-7ec889b89a37')
                .then(() => {
                    console.log('Subscribed to UUID:', '003bbdf2-c634-4b3d-ab56-7ec889b89a37');
                })
                .catch((error) => {
                    console.log('Subscription error:', error);
                });
            bleManagerEmitter.addListener(
                'BleManagerDidUpdateValueForCharacteristic',
                ({ value, peripheral, characteristic, service }) => {
                    console.log('Received data:', value);

                    // 데이터를 Toast로 표시
                    ToastAndroid.show('Received data: ' + value, ToastAndroid.SHORT);
                }
            );
        });
    }

  return (
          <View>
            <View style={{height: 100, backgroundColor:"skyblue"}} >
                <Text style={{
                    fontSize: 40,
                }}>Barrier_free_nav</Text>
            </View>

            <View style={{
                width: 340,
                height: 50,
                marginTop: 50,
                marginLeft: 25,
                marginRight: 20,
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 2,
                borderRadius: 10}
            }>
                <Text style={{fontSize: 20, textAlign: "center", marginTop: 10}} onPress={startScan}>
                    휴대 디바이스와 페어링 해주세요
                </Text>
            </View>

            <View style={{
                width: 270,
                height: 400,
                marginTop: 20,
                marginLeft: 60,
                marginRight: 25,
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 15
            }}>
                <ScrollView>
                {devices.map((device) => (device.name !== null &&
                    <TouchableOpacity key={device.id}
                                      style={{
                                        fontSize: 26,
                                        textAlign: "center",
                                        padding: 10,
                                        borderBottomColor: "black",
                                        borderBottomWidth: 1,
                                        }}
                                      onPress={() => Connect(device)}>
                        <Text>{device.name}</Text></TouchableOpacity>
                ))}
                </ScrollView>
            </View>

              <View>

              </View>
          </View>
  );
};

export default App;
