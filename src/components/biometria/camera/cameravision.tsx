import {View} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import styles from "../../../app/style";


export  function CameraView() {
    return (
        <View style = {styles.container}>
            <CameraView><CameraView/>

        </View>
    )
}   