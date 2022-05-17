import React, { useState, useEffect } from 'react'
import {
    StyleSheet, Text, View, StatusBar, TouchableOpacity,
    ScrollView, Image, Dimensions, Modal, SafeAreaView,
    TouchableWithoutFeedback, Keyboard, TextInput, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import Swiper from 'react-native-swiper';
import girl from '../../assets/girl.jpg';
import girl1 from '../../assets/girl1.jpg';
import girl2 from '../../assets/girl2.jpeg';
import girl3 from '../../assets/girl3.jpg';
import girl4 from '../../assets/girl4.jpg';
import girl5 from '../../assets/girl5.jpg';

import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function BookMark({ route, navigation }) {
    var params = route.params.params;
    const [modalMap, setModalMap] = useState(false);
    const [dataPostCare, setDataPostCare] = useState(null);
    const [dataUser, setDataUser] = useState({
        id: params.id,
        name: params.name,
        email: params.email,
        password: params.password,
        status: params.status,
        avatar: params.avatar,
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
        if (!firebase.apps.length) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            console.log('ket noi thanh cong');
        }
        getDatabase();
    }, []);
    function getDatabase() {
        firebase.database().ref('listCare/' + dataUser.id + '/postCare').on('value', function (snapshot) {
            let listCarePost = [];
            snapshot.forEach(function (item, index) {
                listCarePost.push(item.val());
            })
            setDataPostCare(listCarePost);
        });
    }
    function deletePostCare(prIndex) {
        let array = dataPostCare.filter(function (item, index) {
            if (index != prIndex) {
                return item;
            }
        })
        firebase.database().ref('listCare/' + dataUser.id).set({
            postCare: array
        }, function (err) {
            if (err) { } else {
                alert('success')
            }
        });
    }
    return (
        <View style={styles.container}>
            <ScrollView style={{ height: '100%', width: '100%' }}>
                {dataPostCare != null
                    ? dataPostCare.length > 0
                        ? dataPostCare.map(function (item, index) {
                            return <View key={index}>
                                <View style={[styles.post, { borderBottomWidth: 5, borderBottomColor: '#DCDBDA' }]}>
                                    <TouchableOpacity style={styles.deletePost} onPress={() => {
                                        deletePostCare(index);
                                    }}>
                                        <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Delete</Text>
                                    </TouchableOpacity>
                                    <View style={[styles.boxImagePost, { height: windowHeight / 2.5 }]}>
                                        <Swiper
                                            showsButtons={true}
                                            dot={
                                                <View style={{ backgroundColor: '#DCE0DB', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
                                            }
                                            activeDot={
                                                <View style={{ backgroundColor: '#B5B7B4', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
                                            }
                                            nextButton={<Text style={styles.buttonText}>›</Text>}
                                            prevButton={<Text style={styles.buttonText}>‹</Text>}
                                        >
                                            {(item.listImage).map((item2, pos) => {
                                                return <Image key={pos} resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item2 }} style={{ width: '100%', height: '100%' }} />
                                            })}
                                        </Swiper>
                                    </View>
                                    <View style={styles.description}>
                                        <View style={styles.row1}>
                                            <View style={styles.row1Left}>
                                                {(item.imageUser).charAt(5) == ':'
                                                    ? <Image source={{ uri: item.imageUser }} style={styles.imageUser}></Image>
                                                    : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item.imageUser }} style={styles.imageUser} />
                                                }
                                                <Text style={styles.textNameUse}>{item.nameUser}</Text>
                                                <Text style={[styles.textNameUse, { fontWeight: '100', fontStyle: 'italic' }]}>{item.time}</Text>
                                            </View>
                                            <View style={styles.row1Right}>
                                                <TouchableOpacity style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={[styles.textNameUse, { marginRight: 5 }]}>Care</Text>
                                                    <Ionicons name='heart' size={25} color='#F13F93' />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={styles.row2}>
                                            <Text style={styles.TextDescription}>{item.description}</Text>
                                        </View>
                                        <View style={styles.row3}>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                                onPress={() => setModalMap(true)}
                                            >
                                                <Ionicons name='location' size={25} color='tomato' />
                                                <Text style={styles.textLocation}>location on map</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.row4}>
                                            <View style={styles.row4Left}>
                                                <Text style={[{ fontWeight: 'bold', }, styles.TextPrice1]}>Price :</Text>
                                                <Text style={[{ fontWeight: 'bold', }, styles.TextPrice2]}>{item.price}</Text>
                                            </View>
                                            <View style={styles.row4Right}>
                                                <TouchableOpacity style={styles.bottomChat}>
                                                    <Text style={styles.bottomTextChat}>Chat</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.bottomSold}
                                                // onPress={() => updateSold(!item.sold, index)}
                                                >
                                                    <Text style={styles.bottomTextSold}>Sold</Text>
                                                    {item.sold === true
                                                        ? <Ionicons name='checkmark-outline' style={styles.checkmark} />
                                                        : <Text></Text>
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalMap}
                                >
                                    <SafeAreaView>
                                        <View style={styles.modalLocation}>
                                            <View style={styles.modalBottom}>
                                                <Text
                                                    onPress={() => setModalMap(false)}
                                                    style={styles.textOk}>Xong</Text>
                                            </View>
                                            <MapView style={styles.mapPost}
                                                region={item.regions}
                                            >
                                                <MapView.Marker
                                                    coordinate={item.coordinate}
                                                    description={item.description}
                                                    draggable={true}
                                                />
                                            </MapView>
                                        </View>
                                    </SafeAreaView>
                                </Modal>
                            </View>
                        })
                        :<Text style={{ textAlign: 'center', color: 'tomato' }}>There are no favorite posts yet</Text>
                    : <View style={{ flex: 1, width: '100%', height: windowHeight, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size={40} color="tomato" style={{ alignItems: 'center', justifyContent: 'center' }}></ActivityIndicator>
                    </View>
                }
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    // post
    post: {
        width: '100%',
        paddingBottom: 30,
        paddingTop: 20,
        paddingTop: 10,
        position: 'relative',
    },
    deletePost: {
        position: 'absolute',
        zIndex: 1,
        top: 10,
        right: 0,
        backgroundColor: 'tomato',
        padding: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    boxImagePost: {
        width: windowWidth,
        height: windowHeight / 3,
        padding: 3,
        borderWidth: 0.5,
        borderColor: 'tomato',
    },
    buttonText: {
        fontSize: 40,
        color: '#FE8541',
    },
    ImagePost: {
        width: 600,
        height: windowHeight / 2,
    },
    ImagePost2: {
        width: 600,
        height: windowHeight / 3,
    },
    description: {
        // flexDirection: 'row'
        paddingLeft: 10,
        paddingRight: 10,
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    row1Left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textNameUse: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    row1Right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageUser: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    row2: {
        paddingTop: 10,
    },
    TextDescription: {
        color: '#444343',
        textAlign: 'left',
    },
    // row3
    row3: {
        paddingTop: 10,
    },
    textLocation: {
        color: 'tomato',
        fontWeight: 'bold',
        alignItems: 'center',
        paddingTop: 10,
    },
    // row 4
    row4: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row4Left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextPrice1: {
        fontSize: 15,
        color: '#444343',
        marginRight: 10,
    },
    TextPrice2: {
        color: 'tomato',
    },
    row4Right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomChat: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        backgroundColor: 'tomato',
        borderRadius: 11,
        alignItems: 'center',
    },
    bottomTextChat: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        padding: 2,
        paddingLeft: 12,
        paddingRight: 12,
    },
    bottomSold: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'tomato',
        borderRadius: 11,
    },
    bottomTextSold: {
        color: 'tomato',
        fontWeight: 'bold',
        padding: 2,
        paddingLeft: 12,
        paddingRight: 12,
    },
    checkmark: {
        color: 'tomato',
        fontWeight: 'bold',
        fontSize: 25,
    },
    chatbubble: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 3,
        paddingLeft: 0,
    },
    // button XONG 
    modalLocation: {
        backgroundColor: '#FFFFFF',
        // height: '100%',
    },
    modalBottom: {
        backgroundColor: '#FFFFFF',
        alignItems: 'flex-end',
        padding: 5,
        borderBottomColor: '#A4B6BA',
        borderBottomWidth: 0.5,
    },
    textOk: {
        padding: 2,
        color: 'tomato',
    },
    // map Post
    mapPost: {
        height: '100%',
    },
})