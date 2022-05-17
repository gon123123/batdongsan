import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import macdinh from '../assets/macdinh.jpg'
import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

export default function Register({ navigation }) {
    const [data, setData] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCF, setPasswordCF] = useState('');
    const [error, setError] = useState({
        errorName: '* ',
        errorEmail: '* ',
        errorPassword: '* ',
        errorPasswordCF: '*',
    });
    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyAfYIJrNCDdzLG4BZa5gDPCBAaoKWYAn6c",
            authDomain: "batdongsan-41470.firebaseapp.com",
            databaseURL: "https://batdongsan-41470-default-rtdb.firebaseio.com",
            projectId: "batdongsan-41470",
            storageBucket: "batdongsan-41470.appspot.com",
            messagingSenderId: "438805796856",
            appId: "1:438805796856:web:3246ae37f20570a037a80d",
            measurementId: "G-3NEQFEHQ1D"
        };
        // firebase.initializeApp(firebaseConfig);
        if (!firebase.apps.length) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            // const analytics = getAnalytics(app);
            console.log('ket noi thanh cong');
            getDatabase();
        }
    }, []);
    function getDatabase() {
        firebase.database().ref('users/').on('value', function (snapshot) {
            let array = [];
            snapshot.forEach(function (item) {
                var childData = item.val();
                array.push({
                    id: item.key,
                    name: childData.name.paramName,
                    email: childData.email,
                    password: childData.password.paramPass,
                    status: childData.status,
                    avatar: childData.avatar,
                });
            });
            setData(array);
            // console.log(array);
        });
    }
    function addDatabase(prId, prName, prEmail, prPassword, prPasswordCF) {
        console.log(prId + ': ' + prName + ' ' + prEmail + ' ' + prPassword + ' ' + prPasswordCF);

        var arrayErrors = {
            errorName: '* ',
            errorEmail: '* ',
            errorPassword: '* ',
            errorPasswordCF: '* ',
        }
        if (prName === '' || prEmail === '' || prPassword === '' || prPasswordCF === '') {
            if (prName === '') {
                arrayErrors.errorName = '* can not be left blank';
            }
            if (prEmail === '') {
                arrayErrors.errorEmail = '* can not be left blank';
            }
            if (prPassword === '') {
                arrayErrors.errorPassword = '* can not be left blank';
            }
            if (prPasswordCF === '') {
                arrayErrors.errorPasswordCF = '* can not be left blank';
            }
            setError(arrayErrors);
        } else {
            if (data == []) {  // nếu chưa có tài khoản thì lập tức add vào
                let paramName = {paramName: prName};
                let paramPass = {paramPass: prPassword};
                firebase.database().ref('users/').push().set({
                    // push() sẽ bổ sung cho id
                    name: paramName,
                    email: prEmail,
                    password: paramPass,
                    status: true,
                    avatar: {
                        type: 'link',
                        image: 'https://static2.yan.vn/YanNews/2167221/202003/dan-mang-du-trend-thiet-ke-avatar-du-kieu-day-mau-sac-tu-anh-mac-dinh-b0de2bad.jpg',
                    },
                }, function (error) {
                    if (error) {
                        alert('error ' + error);
                    } else {
                        alert('success');
                    }
                });
            } else {
                if (prPassword === prPasswordCF) {
                    var arr = Array.from(prEmail);
                    var arrLength = arr.length;
                    var m = arr[arrLength - 1];
                    if (arrLength >= 11) {
                        var lastArray = (arr.slice(-10, -1));
                        var str = '';
                        for (let value of lastArray) {
                            str += value;
                        }
                        var ktr = str + m;
                        if (ktr == '@gmail.com') {
                            var trungEmail = false; // mặc định không trùng
                            getDatabase();
                            // console.log(data);
                            for (let value of data) {
                                if (value.email === prEmail) {
                                    trungEmail = true; // trùng
                                    break;
                                }
                            }
                            console.log(trungEmail);
                            // kiểm tra xem có trùng tài khoản không 
                            if (trungEmail == false) {
                                let paramName = {paramName: prName}
                                let paramPass = {paramPass: prPassword};
                                var keyNew = firebase.database().ref().child('users').push().key;
                                setId(keyNew);  // để có thể lưu trữ key tại đây thì không dùng push trực tiếp mà phải tạo ra key từ push
                                firebase.database().ref('users/' + keyNew).set({
                                    // push() sẽ bổ sung cho id
                                    name: paramName,
                                    email: prEmail,
                                    password: paramPass,
                                    status: true,
                                    avatar: {
                                        type: 'link',
                                        image: 'https://static2.yan.vn/YanNews/2167221/202003/dan-mang-du-trend-thiet-ke-avatar-du-kieu-day-mau-sac-tu-anh-mac-dinh-b0de2bad.jpg',
                                    },
                                }, function (error) {
                                    if (error) {
                                        alert('error' + error);
                                    } else {
                                        alert('success'),
                                            navigation.navigate('Login',
                                            );
                                        setName('')
                                        setEmail('')
                                        setPassword('')
                                        setPasswordCF('')
                                    }
                                });
                            } else {
                                arrayErrors.errorEmail = '* this email already exists';
                            }
                        } else {
                            arrayErrors.errorEmail = '* this email is not valid 1';
                        }
                    } else {
                        arrayErrors.errorEmail = '* this email is not valid 2';
                    }
                } else {
                    arrayErrors.errorPasswordCF = '* password incorrect';
                }
                setError(arrayErrors);
            }
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={styles.container}>
                <StatusBar barStyle='dark-content'></StatusBar>
                <View style={styles.boxLogin}>
                    <Text style={styles.Title}>Register</Text>
                    <>
                        <View style={styles.boxFrom}>
                            <View style={styles.groupText}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput style={styles.textInput} name='name' maxLength={40} placeholder='name...'
                                    onChangeText={(text) => setName(text)}
                                    value={name}
                                />
                                <Text style={styles.textError}>{error.errorName}</Text>
                            </View>
                        </View>
                    </>
                    <>
                        <View style={styles.boxFrom}>
                            <View style={styles.groupText}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput style={styles.textInput} name='email' placeholder='email...'
                                    keyboardType='email-address'
                                    onChangeText={(text) => setEmail(text.trim())}
                                    value={email}
                                />
                                <Text style={styles.textError}>{error.errorEmail}</Text>
                            </View>
                        </View>
                    </>
                    <>
                        <View style={styles.boxFrom}>
                            <View style={styles.groupText}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput style={styles.textInput} placeholder='password...'
                                secureTextEntry={true}
                                    onChangeText={(text) => setPassword(text.trim())}
                                    value={password}
                                />
                                <Text style={styles.textError}>{error.errorPassword}</Text>
                            </View>
                        </View>
                    </>
                    <>
                        <View style={styles.boxFrom}>
                            <View style={styles.groupText}>
                                <Text style={styles.label}>Password Confirm</Text>
                                <TextInput style={styles.textInput} placeholder='password confirm...'
                                secureTextEntry={true}
                                    onChangeText={(text) => setPasswordCF(text.trim())}
                                    value={passwordCF}
                                />
                                <Text style={styles.textError}>{error.errorPasswordCF}</Text>
                            </View>
                        </View>
                    </>
                    <TouchableOpacity style={styles.buttonLogin}
                        onPress={() =>
                            addDatabase('id', name, email, password, passwordCF)
                        }
                    >
                        <Text style={styles.textButton}>Register</Text>
                    </TouchableOpacity>
                    <View style={styles.Or}>
                        <Text style={styles.textOne}></Text>
                        <Text style={styles.textTwo}>Or with</Text>
                        <Text style={styles.textThree}></Text>
                    </View>
                    <View style={styles.iconLink}>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Ionicons name='logo-facebook' size={30} color="tomato" />
                            <Text style={styles.textIconLink}>Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Ionicons name='ios-mail' size={30} color="tomato" />
                            <Text style={styles.textIconLink}>Gmail</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.register}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.textRegister}>Do you already have an account ? LogIn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    boxLogin: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        // height: '80%',
        width: '90%',
        alignItems: 'center',
        padding: 10,
    },
    Title: {
        fontSize: 35,
        color: 'tomato',
        fontWeight: 'bold',
        textShadowColor: 'tomato',
        textShadowOffset: { width: 3, height: 2.5 },
        textShadowRadius: 1,
    },
    boxFrom: {
        width: '100%',
        marginTop: 8,
    },
    label: {
        color: 'tomato',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'tomato',
        marginTop: 10,
        padding: 10,
    },
    textError: {
        fontSize: 10,
        color: 'tomato',
        fontStyle: 'italic',
    },
    buttonLogin: {
        backgroundColor: 'tomato',
        marginTop: 25,
        width: '100%',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        color: '#FFFFFF',
        fontWeight: '500'
    },
    Or: {
        width: '100%',
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    textOne: {
        width: '35%',
        height: 2,
        backgroundColor: 'tomato',
    },
    textTwo: {
        color: 'tomato',
        margin: 5,
        textShadowColor: 'tomato',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    textThree: {
        width: '35%',
        height: 2,
        backgroundColor: 'tomato',
    },
    iconLink: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    textIconLink: {
        fontSize: 10,
        color: 'tomato',
    },
    register: {
        width: '100%',
        marginTop: 15,
    },
    textRegister: {
        fontStyle: 'italic',
        color: 'tomato',
        fontSize: 13,
    },
})