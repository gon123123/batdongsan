import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loading from './Loading';

import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";


export default function Login({ navigation }) {
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState({
        email: '* ',
        password: '* ',
    });
    const load = setTimeout(() => { setLoading(false) }, 1000);
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
                    listFriend: childData.listFriend
                });
            });
            setData(array);
        });
    };
    function kiemTraTaiKhoan(prEmail, prPassword) {
        var arrayErrors = {
            email: '* ',
            password: '* ',
        }
        if (prEmail == '' || prPassword == '') {
            if (prEmail == '') {
                arrayErrors.email = '* cannot be left blank';
            }
            if (prPassword == '') {
                arrayErrors.password = '* cannot be left blank';
            }
            setError(arrayErrors);
        } else {
            getDatabase();
            if (data !== []) {
                var idParams = '';
                var nameParams = '';
                var emailParams = '';
                var passwordParams = '';
                var statusParams = '';
                var avatarParams = '';
                var listFriendParams = [];
                var emailDatabase = false;  // kiểm tra tài khoản tồn tại không , mặc định không
                for (var value of data) {
                    if (value.email == email && value.password == password) {
                        idParams = value.id;
                        nameParams = value.name;
                        emailParams = value.email;
                        passwordParams = value.password;
                        statusParams = value.status;
                        avatarParams = value.avatar;
                        emailDatabase = true;
                        listFriendParams = value.listFriend;
                        break;
                    }
                };
                if (emailDatabase == true) {
                    navigation.navigate('BottomTabNavigation', {
                        id: idParams,
                        name: nameParams,
                        email: emailParams,
                        password: passwordParams,
                        status: statusParams,
                        avatar: avatarParams,
                        listUser: data,
                        listFriend : listFriendParams,
                    });
                } else {
                    alert('login fail');
                }
            } else {
                arrayErrors.email = '* Account does not exist';
                setError(arrayErrors);
            }
        }
    }
    return (
        <>
            {loading ?
                <Loading></Loading> :
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor='#FFFFFF' />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                        <View style={styles.boxLogin}>
                            <Text style={styles.Title}>Log in</Text>
                            <>
                                <View style={styles.boxFrom}>
                                    <View style={styles.groupText}>
                                        <Text style={styles.label}>Email</Text>
                                        <TextInput style={styles.textInput} placeholder='email..'
                                            onChangeText={(text) => setEmail(text.trim())}
                                            value={email}
                                        />
                                        <Text style={styles.textError}>{error.email}</Text>
                                    </View>
                                </View>
                            </>
                            <>
                                <View style={styles.boxFrom}>
                                    <View style={styles.groupText}>
                                        <Text style={styles.label}>Password</Text>
                                        <TextInput style={styles.textInput} placeholder='password...'
                                            onChangeText={(text) => setPassword(text.trim())}
                                            value={password}
                                        />
                                        <Text style={styles.textError}>{error.password}</Text>
                                    </View>
                                </View>
                            </>
                            <TouchableOpacity style={styles.buttonLogin} onPress={() => kiemTraTaiKhoan(email, password)}>
                                <Text style={styles.textButton}>Sing In</Text>
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
                                onPress={() => navigation.navigate('Register')}
                            >
                                <Text style={styles.textRegister}>Do not have an account ? Register</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.register}
                                onPress={() => navigation.navigate('BottomTabNavigation')}
                            >
                                <Text style={styles.textRegister}>di toi BottomTabNavigation</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
        </>
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
        height: '80%',
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
        marginTop: 30,
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
        marginTop: 30,
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
        marginTop: 30,
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
        marginTop: 20,
    },
    textIconLink: {
        fontSize: 10,
        color: 'tomato',
    },
    register: {
        width: '100%',
        marginTop: 20,
    },
    textRegister: {
        fontStyle: 'italic',
        color: 'tomato',
        fontSize: 13,
    },
})