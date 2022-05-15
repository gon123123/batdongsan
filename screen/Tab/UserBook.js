import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, TextInput, Modal, SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import girl from '../../assets/girl.jpg';

import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function UserBook({ route, navigation }) {
    var params = route.params.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [position, setPosition] = useState('88.7%');

    const [dataUser, setDataUser] = useState({
        id: params.id,
        name: params.name,
        email: params.email,
        password: params.password,
        status: params.status,
        avatar: params.avatar,
    });
    const [listFriendOther, setListFriendOther] = useState(null);
    const [listFriendSearch, setListFriendSearch] = useState(null);

    const [nameFriendChat, setNameFriendChat] = useState('');
    const [imageUserFriend, setImageUserFriend] = useState('');
    const [imageUserMe, setImageUserMe] = useState(null);
    //mess
    const [textMessage, setTextMessage] = useState('');
    const [idMessageAll, setIdMessageAll] = useState('');
    const [idUserReceive, setIdUserReceive] = useState('');

    const [listMessage, setListMessage] = useState([]);
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
        getUserOther();
    }, []);
    function getUserOther() {
        firebase.database().ref('users/').on('value', function (snapshot) {
            let arrayUserOther = [];
            snapshot.forEach(function (item) {
                var childData = item.val();
                arrayUserOther.push({
                    id: item.key,
                    name: childData.name.paramName,
                    email: childData.email,
                    password: childData.password.paramPass,
                    status: childData.status,
                    avatar: childData.avatar,
                    listFriend: childData.listFriend
                });
            });
            let array = arrayUserOther.filter(function(item, index){
                if(item.id != dataUser.id){
                    return item;
                }
            })
            // console.log(arrayUserOther[1].id);
            setListFriendOther(array);
        });
        let imageUsers = {};
        firebase.database().ref('users/' + dataUser.id + '/avatar').on('value', function (snapshot) {
            imageUsers = snapshot.val();
            setImageUserMe({
                image: imageUsers.image,
                type: imageUsers.type,
            });
        })
    }
    function kiemTraListFriend(idFriend, imageFriend, nameFriend) {
        console.log(idFriend);
        console.log(imageFriend);
        console.log(nameFriend);
        setNameFriendChat(nameFriend);
        setImageUserFriend(imageFriend);
        var keyMess = firebase.database().ref().child('users').push().key; // tạo key mess cho 2 người
        // // lay data nguoi dang dung
        var object1 = {}
        firebase.database().ref('users/' + dataUser.id).on('value', function (snapshot) {
            object1 = snapshot.val();
        })
        // // lay data nguoi chuan bi ket ban
        var object2 = {}
        firebase.database().ref('users/' + idFriend).on('value', function (snapshot) {
            object2 = snapshot.val();
        })
        // tao 2 doi tuong 
        let statusRead1 = {
            status: true,
        }
        let statusRead2 = {
            status: false,
        }
        let objFriendYou = {  // dung de add cho nguoi dang dung 
            idUserFriend: idFriend,
            idMess: keyMess,
            nameUserFriend: nameFriend,
            imageUserFriend: imageFriend,
            statusRead: statusRead2
        }
        let arrayYou = [];
        arrayYou.push(objFriendYou);
        let objFriendMe = {  // dung de add cho nguoi chuan bi ket ban
            idUserFriend: dataUser.id,
            idMess: keyMess,
            nameUserFriend: dataUser.name,
            imageUserFriend: imageUserMe.image,
            statusRead: statusRead1
        }
        let arrayMe = [];
        arrayMe.push(objFriendMe);
        if (object1.listFriend == undefined && object2.listFriend == undefined) {
            // add data lai cho nguoi dang dung
            firebase.database().ref('users/' + dataUser.id).set({
                name: object1.name,
                email: object1.email,
                password: object1.password,
                status: true,
                avatar: {
                    type: imageUserMe.type,
                    image: imageUserMe.image,
                },
                listFriend: arrayYou
            })
            firebase.database().ref('users/' + idFriend).set({
                name: object2.name,
                email: object2.email,
                password: object2.password,
                status: true,
                avatar: {
                    type: object2.avatar.type,
                    image: object2.avatar.image,
                },
                listFriend: arrayMe
            })
            // tin nhan dau tien
            var date = new Date();
            var time = date.getHours() + ':' + date.getMinutes();
            let message = {
                idUser: dataUser.id,
                mess: 'HI',
                time: time,
            }
            let arrayMess = [];
            arrayMess.push(message);
            //  add message first 
            firebase.database().ref('listMessage/' + keyMess).set({
                message: arrayMess
            });
            console.log('case 1');
            setIdMessageAll(keyMess);
            let mess = [];
            firebase.database().ref('listMessage/' + keyMess).on('value', function (snapshot) {
                mess = snapshot.val();
                setListMessage(mess.message);
            });
        } else if (object1.listFriend != undefined && object2.listFriend == undefined) {
            let listFriendMe = object1.listFriend; // chuan bi add them 1 ban cho nguoi dang dung
            listFriendMe.push(objFriendYou);
            // console.log(listFriendMe);
            firebase.database().ref('users/' + dataUser.id).set({
                name: object1.name,
                email: object1.email,
                password: object1.password,
                status: true,
                avatar: {
                    type: imageUserMe.type,
                    image: imageUserMe.image,
                },
                listFriend: listFriendMe
            });
            firebase.database().ref('users/' + idFriend).set({
                name: object2.name,
                email: object2.email,
                password: object2.password,
                status: true,
                avatar: {
                    type: object2.avatar.type,
                    image: object2.avatar.image,
                },
                listFriend: arrayMe // ban kia dang add data cua nguoi dang dung
            });
            // tin nhan dau tien
            var date = new Date();
            var time = date.getHours() + ':' + date.getMinutes()
            let message = {
                idUser: dataUser.id,
                mess: 'HI',
                time: time,
            }
            let arrayMess = [];
            arrayMess.push(message);
            firebase.database().ref('listMessage/' + keyMess).set({
                message: arrayMess
            });
            console.log('case 2');
            setIdMessageAll(keyMess);
            let mess = [];
            firebase.database().ref('listMessage/' + keyMess).on('value', function (snapshot) {
                mess = snapshot.val();
                setListMessage(mess.message);
            });
        } else if (object1.listFriend == undefined && object2.listFriend != undefined) {
            let listFriendYou = object2.listFriend; // chuan bi add them 1 ban cho nguoi dang bai
            listFriendYou.push(objFriendMe);
            // console.log(listFriendYou);
            firebase.database().ref('users/' + dataUser.id).set({
                name: object1.name,
                email: object1.email,
                password: object1.password,
                status: true,
                avatar: {
                    type: imageUserMe.type,
                    image: imageUserMe.image,
                },
                listFriend: arrayYou
            });
            firebase.database().ref('users/' + idFriend).set({
                name: object2.name,
                email: object2.email,
                password: object2.password,
                status: true,
                avatar: {
                    type: object2.avatar.type,
                    image: object2.avatar.image,
                },
                listFriend: listFriendYou
            });
            // tin nhan dau tien
            var date = new Date();
            var time = date.getHours() + ':' + date.getMinutes();
            let message = {
                idUser: dataUser.id,
                mess: 'HI',
                time: time,
            }
            let arrayMess = [];
            arrayMess.push(message);
            firebase.database().ref('listMessage/' + keyMess).set({
                message: arrayMess
            });
            setIdMessageAll(keyMess);
            console.log('case 3');
            let mess = [];
            firebase.database().ref('listMessage/' + keyMess).on('value', function (snapshot) {
                mess = snapshot.val();
                setListMessage(mess.message);
            });
        } else if (object1.listFriend != undefined && object2.listFriend != undefined) {
            console.log('case 4');
            let listFriendMe = object1.listFriend;
            let listFriendYou = object2.listFriend;
            let len1 = listFriendMe.length;
            let len2 = listFriendYou.length;
            let ktID = false;
            let idMess = '';
            for (let i = 0; i < len1; i++) {
                if (listFriendMe[i].idUserFriend == idFriend) {
                    idMess = listFriendMe[i].idMess;
                    ktID = true;
                    break;
                }
            }
            if (ktID) {
                console.log('co');
                setIdMessageAll(idMess);
                // console.log(idMessageAll);
                let mess = [];
                firebase.database().ref('listMessage/' + idMess).on('value', function (snapshot) {
                    mess = snapshot.val();
                    // console.log(mess.message);
                    setListMessage(mess.message);
                })
            } else {
                console.log('khong');
                let listFriendMe = object1.listFriend; // chuan bi add them 1 ban cho nguoi dang dung
                listFriendMe.push(objFriendYou);
                firebase.database().ref('users/' + dataUser.id).set({
                    name: object1.name,
                    email: object1.email,
                    password: object1.password,
                    status: true,
                    avatar: {
                        type: imageUserMe.type,
                        image: imageUserMe.image,
                    },
                    listFriend: listFriendMe
                });
                let listFriendYou = object2.listFriend; // chuan bi add them 1 ban cho nguoi dang bai
                listFriendYou.push(objFriendMe);
                firebase.database().ref('users/' + idFriend).set({
                    name: object2.name,
                    email: object2.email,
                    password: object2.password,
                    status: true,
                    avatar: {
                        type: object2.avatar.type,
                        image: object2.avatar.image,
                    },
                    listFriend: listFriendYou
                });
                // tin nhan dau tien
                var date = new Date();
                var time = date.getHours() + ':' + date.getMinutes();
                let message = {
                    idUser: dataUser.id,
                    mess: 'HI',
                    time: time,
                }
                let arrayMess = [];
                arrayMess.push(message);
                firebase.database().ref('listMessage/' + keyMess).set({
                    message: arrayMess
                });
                setIdMessageAll(keyMess);
                // lay message
                let mess = [];
                firebase.database().ref('listMessage/' + keyMess).on('value', function (snapshot) {
                    mess = snapshot.val();
                    // console.log(mess.message);
                    setListMessage(mess.message);
                });
            }
        }
    }
    function sendMessage(prText) {
        console.log('da gui ...');
        var date = new Date();
        var time = date.getHours() + ':' + date.getMinutes();
        let objectMess = {
            idUser: dataUser.id,
            mess: prText,
            time: time,
        };
        // console.log(idMessageAll);
        let mess = [];
        firebase.database().ref('listMessage/' + idMessageAll).on('value', function (snapshot) {
            mess = snapshot.val();
        });
        let newMess = [];
        newMess = mess.message;
        newMess.push(objectMess);
        firebase.database().ref('listMessage/' + idMessageAll).set({
            message: newMess
        });
        setTextMessage('');
        // console.log(idUserReceive);
        let friendList1 = []; // tao mang chua ban cua nguoi dc nhan mess
        firebase.database().ref('users/' + idUserReceive + '/listFriend').on('value', function (snapshot) {
            friendList1 = snapshot.val();
        });
        let lenListFriend1 = friendList1.length;
        // console.log(lenListFriend1);
        for (let i = 0; i < lenListFriend1; i++) {
            if (friendList1[i].idUserFriend == dataUser.id) {
                firebase.database().ref('users/' + idUserReceive + '/listFriend/' + i + '/statusRead').set({
                    status: true
                });
            }
        }
        let friendList2 = []; // tao mang chua ban cua nguoi dc gui mess
        firebase.database().ref('users/' + dataUser.id + '/listFriend').on('value', function (snapshot) {
            friendList2 = snapshot.val();
        });
        let lenListFriend2 = friendList2.length;
        // console.log(lenListFriend2);
        for (let i = 0; i < lenListFriend2; i++) {
            if (friendList2[i].idUserFriend == idUserReceive) {
                firebase.database().ref('users/' + dataUser.id + '/listFriend/' + i + '/statusRead').set({
                    status: false
                });
            }
        }
    }
    function updateListFriend(prTextSearch) {
        let lenStr = prTextSearch.length;
        if (lenStr > 0) {
            let lenVip = listFriendOther.length;
            let data = [];
            for (let i = 0; i < lenVip; i++) {
                if (listFriendOther[i].name == prTextSearch) {
                    data.push({
                        id: listFriendOther[i].id,
                        name: listFriendOther[i].name,
                        email: listFriendOther[i].email,
                        password: listFriendOther[i].password,
                        status: listFriendOther[i].status,
                        avatar: listFriendOther[i].avatar,
                        listFriend: listFriendOther[i].listFriend
                    })
                }
            }
            setListFriendSearch(data);
            // console.log(data);
        } else {
            setListFriendSearch(listFriendOther);
        }
    }
    return (
        <View style={styles.container}>
            {/* search */}
            {/* <View> */}
            <View style={styles.boxSearch}>
                <StatusBar barStyle="light-content" backgroundColor='tomato' />
                <TextInput
                    placeholder='search'
                    selectionColor='tomato'
                    style={styles.search}
                    // onFocus={() => setModalSearch(true)}
                    onPressOut={() => setModalSearch(true)}
                />
                <Ionicons name="search" style={styles.searchIcon} />
            </View>
            {/* khi nào focus vào thanh tìm kiếm thì hiện ra */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalSearch}
            >
                <View style={styles.modalSearch}>
                    <View style={styles.boxSearch}>
                        <StatusBar barStyle="light-content" backgroundColor='tomato' />
                        <TextInput
                            placeholder='search'
                            selectionColor='tomato'
                            style={styles.search}
                            autoFocus={true}
                            onChangeText={(text) => updateListFriend(text)}
                        />
                        <Ionicons name="search" style={styles.searchIcon} />
                        <Ionicons name="close-outline" style={styles.backIcon} onPress={() => {setModalSearch(false)
                        updateListFriend('')
                        }} />
                    </View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.boxUserSearch}>
                            {listFriendSearch != null
                                ? listFriendSearch.map((item, index) => {
                                    return <TouchableOpacity key={index} style={styles.user} onPress={() => {
                                        setIdUserReceive(item.id)
                                        kiemTraListFriend(item.id, item.avatar.image, item.name)
                                        setModalVisible(true)
                                    }}>
                                        {(item.avatar.image).charAt(5) == ':'
                                            ? <Image source={{ uri: item.avatar.image }} style={styles.imageUser}></Image>
                                            : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item.avatar.image }} style={styles.imageUser} />
                                        }
                                        <Text style={styles.textUser}>{item.name}</Text>
                                    </TouchableOpacity>
                                })
                                : <Text></Text>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={{ height: '100%' }}>
                    {/* sau nay doi thanh FlatList */}
                    {listFriendOther != null
                        ? listFriendOther.map((item, index) => {
                            return <TouchableOpacity key={index} style={styles.user} onPress={() => {
                                setIdUserReceive(item.id)
                                kiemTraListFriend(item.id, item.avatar.image, item.name)
                                setModalVisible(true)
                            }}>
                                {(item.avatar.image).charAt(5) == ':'
                                    ? <Image source={{ uri: item.avatar.image }} style={styles.imageUser}></Image>
                                    : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item.avatar.image }} style={styles.imageUser} />
                                }
                                <Text style={styles.textUser}>{item.name}</Text>
                            </TouchableOpacity>
                        })
                        :<Text style={{ textAlign: 'center', color: 'tomato' }}>You are the first one</Text>
                    }
                </ScrollView>
            </TouchableWithoutFeedback>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <SafeAreaView>
                    <View style={styles.modalLocation}>
                        <View style={styles.modalBottom}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} >
                                <Text style={styles.chevron}>‹</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row' }}>
                                {imageUserFriend.charAt(5) == ':'
                                    ? <Image source={{ uri: imageUserFriend }} style={styles.image}></Image>
                                    : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageUserFriend }} style={styles.image} />
                                }
                                <Text style={styles.textOk}>{nameFriendChat}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.boxMessage, { height: position }]} onPress={Keyboard.dismiss}>
                            <ScrollView style={{ paddingBottom: 20, }}>
                                {listMessage.map((mess, indexMess) => {
                                    return mess.idUser == dataUser.id
                                        ? <View key={indexMess} style={[styles.messageBlock, { flexDirection: 'row-reverse' }]}>
                                            {(imageUserMe.image).charAt(5) == ':'
                                                ? <Image source={{ uri: imageUserMe.image }} style={styles.messageBlock_image}></Image>
                                                : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageUserMe.image }} style={styles.messageBlock_image} />
                                            }
                                            <View style={styles.message}>
                                                <Text style={styles.textMessage}>{mess.mess}</Text>
                                                <Text style={styles.textTime}>{mess.time}</Text>
                                            </View>
                                        </View>
                                        : <View key={indexMess} style={[styles.messageBlock, { flexDirection: 'row' }]}>
                                            {imageUserFriend.charAt(5) == ':'
                                                ? <Image source={{ uri: imageUserFriend }} style={styles.messageBlock_image}></Image>
                                                : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageUserFriend }} style={styles.messageBlock_image} />
                                            }
                                            <View style={styles.message}>
                                                <Text style={styles.textMessage}>{mess.mess}</Text>
                                                <Text style={styles.textTime}>{mess.time}</Text>
                                            </View>
                                        </View>
                                })}
                            </ScrollView>
                        </View>
                        <View style={styles.sendMessage}>
                            <Ionicons name='image-outline' style={styles.sendMessageImage} />
                            <TextInput style={styles.textInputMessage}
                                onFocus={() => setPosition('81.2%')}
                                onBlur={() => setPosition('88.7%')}
                                onChangeText={(text) => setTextMessage(text)}
                                value={textMessage}
                            ></TextInput>
                            <TouchableOpacity onPress={() => sendMessage(textMessage)}>
                                <Ionicons name='send' style={styles.sendMessageImage} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
            {/* </View> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#FFFFFF',
    },
    boxSearch: {
        width: '100%',
        paddingBottom: 5,
    },
    search: {
        padding: 3,
        paddingBottom: 7,
        borderRadius: 7,
        paddingLeft: 31,
        backgroundColor: '#E9E5E5',
        position: 'relative',
    },
    searchIcon: {
        fontSize: 25,
        color: '#B0B2B3',
        position: 'absolute',
        top: 6,
        left: 4,
    },
    modalSearch: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingTop: 20,
        paddingBottom: 0,
    },
    boxUserSearch: {
        flex: 1,
        // backgroundColor: 'red',
        paddingTop: 10,
    },
    backIcon: {
        fontSize: 25,
        color: '#B0B2B3',
        position: 'absolute',
        top: 6,
        right: 4,
    },
    user: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 10,
    },
    imageUser: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        marginRight: 20,
    },
    textUser: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'bold',
        paddingTop: (60 - 20) / 2,
        borderBottomWidth: 1.5,
        borderBottomColor: '#E9E5E5',
    },
    modalLocation: {
        backgroundColor: '#FFFFFF',
        height: '100%',
    },
    modalBottom: {
        flexDirection: 'row',
        backgroundColor: 'tomato',
        alignItems: 'flex-start',
        padding: 5,
        borderBottomColor: '#E9E5E5',
        borderBottomWidth: 0.5,
    },
    textOk: {
        padding: 2,
        color: 'tomato',
        marginTop: 5,
        color: '#FFFFFF',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        marginRight: 10,
    },
    chevron: {
        fontSize: 30,
        color: 'tomato',
        marginRight: 15,
        marginTop: -15,
        color: '#FFFFFF',
    },
    boxMessage: {
    },
    sendMessage: {
        backgroundColor: 'tomato',
        width: '100%',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendMessageImage: {
        fontSize: 30,
        color: '#FFFFFF',
    },
    textInputMessage: {
        backgroundColor: '#FDFDFD',
        width: windowWidth - 75,
        borderRadius: 9,
        padding: 3,
        marginRight: 6,
        marginLeft: 6,
        paddingLeft: 10,
    },
    messageBlock: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    messageBlock_image: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        margin: 15,
        marginBottom: 0,
        marginRight: 10,
    },
    message: {
        maxWidth: '75%',
    },
    textMessage: {
        padding: 5,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 10,
        backgroundColor: '#EBEBEB',
        color: '#3C3C39',
        fontSize: 15
    },
    textTime: {
        fontSize: 7,
        color: '#DCDBCD',
    }
})