import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.front);
	const [temp, setTemp] = useState(36.0);
	const [text, setText] = useState('no-mask');
	var ws = new WebSocket('ws://192.168.0.69:5500');

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === 'granted');
			6.0;
		})();
	}, []);
	useEffect(() => {
		ws.onmessage = (e) => {
			let array = e.data.split(',');
			let temp = Math.floor(array[1] * 100) / 100;
			setText(array[0]); // temp 변수
			temp += 0.6;
			setTemp(temp.toFixed(2));
		};
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}
	return (
		<View style={styles.container}>
			<Camera style={styles.camera} type={type}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button}>
						<View style={styles.Circle}></View>
					</TouchableOpacity>
					{text === 'Not-Detected' && null}
					{temp < 37.5 && temp > 30.0 && text === 'mask' && (
						<View style={styles.normalContainer}>
							<Text style={styles.subText}>온도는 {temp}°C 입니다.</Text>
							{text === 'mask' && (
								<Text style={styles.subText}>
									마스크를 착용을 확인 하였습니다.
								</Text>
							)}
							{text === 'no-mask' && (
								<Text style={styles.subText}>마스크를 착용해주세요.</Text>
							)}
						</View>
					)}
					{temp < 37.5 && text === 'no-mask' && (
						<View style={styles.redContainer}>
							<Text style={styles.subText}>온도는 {temp}°C 입니다.</Text>
							{text === 'mask' && (
								<Text style={styles.subText}>
									마스크를 착용을 확인 하였습니다.
								</Text>
							)}
							{text === 'no-mask' && (
								<Text style={styles.subText}>마스크를 착용해주세요.</Text>
							)}
						</View>
					)}
					{temp > 37.5 && (
						<>
							<View style={styles.redContainer}>
								<Text style={styles.subText}>온도가 37.5°C 이상입니다.</Text>
								<Text style={styles.subsubText}>
									재측정 후 같은 온도라면 보건소를 방문해주세요.
								</Text>
								{text === 'mask' && (
									<Text style={styles.subText}>
										마스크를 착용을 확인 하였습니다.
									</Text>
								)}
								{text === 'no-mask' && (
									<Text style={styles.subText}>마스크를 착용해주세요.</Text>
								)}
							</View>
						</>
					)}
				</View>
			</Camera>
		</View>
	);
}

const styles = StyleSheet.create({
	Circle: {
		marginTop: 380,
		width: 20,
		height: 20,
		backgroundColor: 'red',
		borderRadius: 150,
	},
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},

	buttonContainer: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	normalContainer: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: 'green',
		alignContent: 'center',
		justifyContent: 'center',
	},
	redContainer: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: 'red',
		alignContent: 'center',
		justifyContent: 'center',
	},
	subText: {
		textAlign: 'center',
		fontSize: 32,
		color: 'white',
	},
	subsubText: {
		textAlign: 'center',
		fontSize: 25,
		color: 'white',
	},
	button: {
		flex: 5,
		alignItems: 'center',
	},
	text: {
		fontSize: 18,
		color: 'white',
	},
});
