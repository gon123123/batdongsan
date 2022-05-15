import React, { useState, useEffect } from 'react'
import {
    StyleSheet, Text, View, StatusBar, TouchableOpacity, Modal,
    TextInput, TouchableWithoutFeedback,
    Keyboard, Image, ScrollView, Dimensions, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import girl from '../../assets/girl.jpg'


import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Chat({ route, navigation }) {
    var params = route.params.params;
    const [modalVisibleChat, setModalVisibleChat] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [position, setPosition] = useState('88.7%');
    const [listFriend, setListFriend] = useState(null);
    const [listFriendSearch, setListFriendSearch] = useState(null);
    const [nameFriend, setNameFriend] = useState('');
    const [imageFriend, setImageFriend] = useState('');
    const [listMessage, setListMessage] = useState([]);

    const [dataUser, setDataUser] = useState({
        id: params.id,
        name: params.name,
        email: params.email,
        password: params.password,
        status: params.status,
        avatar: params.avatar,
    });
    //mess
    const [textMessage, setTextMessage] = useState('');
    const [idMessageAll, setIdMessageAll] = useState('');
    const [imageUserMe, setImageUserMe] = useState(null);
    // id nguoi nhan
    const [idUserReceive, setIdUserReceive] = useState('');

    // delete user friend
    const [modalOkCancel, setModalOkCancel] = useState(false);
    const [idMessChatDelete, setMessChatDelete] = useState('');
    const [idUserDelete, setIdUserDelete] = useState('');
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
        getListFriend();
    }, []);
    function getListFriend() {
        firebase.database().ref('users/' + dataUser.id + '/listFriend').on('value', function (snapshot) {
            var childData = snapshot.val();
            setListFriend(childData);
            setListFriendSearch(childData);
        });
        // lay image cua nguoi dang dung 
        let imageUsers = {};
        firebase.database().ref('users/' + dataUser.id + '/avatar').on('value', function (snapshot) {
            imageUsers = snapshot.val();
            setImageUserMe({
                image: imageUsers.image,
                type: imageUsers.type,
            });
        })
    }
    function loadMess(idMess, idUserFriend, nameUserFriend, ImageUserFriend) {
        console.log('load da chay');
        setIdUserReceive(idUserFriend),
            setIdMessageAll(idMess),
            setNameFriend(nameUserFriend),
            setImageFriend(ImageUserFriend),
            firebase.database().ref('listMessage/' + idMess).on('value', function (snapshot) {
                setListMessage(snapshot.val().message);
            });
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
        // console.log(newMess);
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
            let lenVip = listFriend.length;
            let data = [];
            for (let i = 0; i < lenVip; i++) {
                if (listFriend[i].nameUserFriend == prTextSearch) {
                    data.push({
                        idMess: listFriend[i].idMess,
                        idUserFriend: listFriend[i].idUserFriend,
                        imageUserFriend: listFriend[i].imageUserFriend,
                        nameUserFriend: listFriend[i].nameUserFriend,
                        statusRead: listFriend[i].statusRead,
                    })
                    console.log('co')
                }
            }
            setListFriendSearch(data);
        } else {
            setListFriendSearch(listFriend);
        }
    }
    function dataFriendDelete(prIdUser, prIdMess) {
        console.log('delete')
        console.log(prIdUser);
        console.log(prIdMess);
        setMessChatDelete(prIdMess);
        setIdUserDelete(prIdUser);
    }
    function deleteFriend() {
        console.log('delete da chay');
        // xóa bạn trong listFriend
        let array = listFriend.filter(function (item) {
            if (item.idMess != idMessChatDelete) {
                return item;
            }
        })
        console.log('delete');
        console.log(array.length);
        // lấy data của người dang xóa 
        let updateData = {}
        firebase.database().ref('users/' + dataUser.id).on('value', function (snapshot) {
            updateData = snapshot.val();
        });
        // cập nhật lại listFriend cho người xóa
        updateData.listFriend = array;
        console.log(updateData);
        firebase.database().ref('users/' + dataUser.id).set({
            name: updateData.name,
            email: updateData.email,
            password: updateData.password,
            status: updateData.status,
            avatar: updateData.avatar,
            listFriend: updateData.listFriend,
        }, function (error) {
            if (error) {
                alert('error' + error);
            } else {
                // lấy data của người bị xóa
                let dataFriend = {};
                firebase.database().ref('users/' + idUserDelete).on('value', function (snapshot) {
                    dataFriend = snapshot.val();
                });
                let updateDataFriend = dataFriend.listFriend;
                // xóa friend đối với người bị xóa 
                let array0 = updateDataFriend.filter(function (item) {
                    if (item.idMess != idMessChatDelete) {
                        return item;
                    }
                });
                dataFriend.listFriend = array0;
                // console.log(dataFriend.listFriend);
                // cập nhật lại data cho người bị xóa 
                firebase.database().ref('users/' + idUserDelete).set({
                    name: dataFriend.name,
                    email: dataFriend.email,
                    password: dataFriend.password,
                    status: dataFriend.status,
                    avatar: dataFriend.avatar,
                    listFriend: dataFriend.listFriend,
                }, function (err) {
                    if (err) {
                    } else {
                        // firebase.database().ref('listMessage/' + idMessChatDelete).set({
                        //     message : null,
                        // });
                    }
                });
            }
        });
    }
    return (
        <View style={styles.container}>
            {/* search */}
            <View style={styles.boxSearch}>
                <TextInput
                    placeholder='search'
                    selectionColor='tomato'
                    style={styles.search}
                    onPressOut={() => setModalSearch(true)}
                />
                <Ionicons name="search" style={styles.searchIcon} />
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalSearch}
            >
                <View style={styles.modalSearch}>
                    <View style={styles.boxSearchFriend}>
                        <StatusBar barStyle="light-content" backgroundColor='tomato' />
                        <TextInput
                            placeholder='search'
                            selectionColor='tomato'
                            style={styles.search}
                            autoFocus={true}
                            onChangeText={(text) => updateListFriend(text)}
                        />
                        <Ionicons name="search" style={styles.searchIconSearch} />
                        <Ionicons name="close-outline" style={styles.backIcon} onPress={() => {
                            setModalSearch(false)
                            updateListFriend('')
                        }} />
                    </View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.boxUserSearch}>
                            {/* sau nay thay bang FlatList */}
                            {listFriendSearch != null
                                ? listFriendSearch.map((item, index) => {
                                    return <TouchableOpacity key={index} style={styles.user} onPress={() => {
                                        setModalVisibleChat(true),
                                            loadMess(item.idMess, item.idUserFriend, item.nameUserFriend, item.imageUserFriend)
                                    }}>
                                        {(item.imageUserFriend).charAt(5) == ':'
                                            ? <Image source={{ uri: item.imageUserFriend }} style={styles.imageUserSearch}></Image>
                                            : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item.imageUserFriend }} style={styles.imageUserSearch} />
                                        }
                                        <Text style={styles.textUser}>{item.nameUserFriend}</Text>
                                    </TouchableOpacity>
                                })
                                : <Text></Text>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
            {/* list user friend */}
            <ScrollView>
                {listFriend == null
                    ? <Text style={{ textAlign: 'center', color: 'tomato' }}>no friends</Text>
                    : listFriend.map((item, index) => {
                        return <View key={index}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.list}
                                    onPress={() => {
                                        setModalVisibleChat(true)
                                        loadMess(item.idMess, item.idUserFriend, item.nameUserFriend, item.imageUserFriend)
                                    }}
                                >
                                    <View style={styles.listLeft}>
                                        {
                                            (item.imageUserFriend).charAt(5) == ':'
                                                ? <Image source={{ uri: item.imageUserFriend }} style={styles.imageUser}></Image>
                                                : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item.imageUserFriend }} style={styles.imageUser} />
                                        }
                                        {item.statusRead.status == true
                                            ? <View style={[styles.statusUser, { backgroundColor: 'red' }]}></View>
                                            : <View style={[styles.statusUser, { backgroundColor: 'gray' }]}></View>
                                        }
                                    </View>
                                    <View style={styles.listRight}>
                                        <Text style={styles.textName}>{item.nameUserFriend}</Text>
                                        {/* <Text style={styles.textMessage} numberOfLines={1}>Hom nay troi kha la dep Hom nay troi kha la depHom nay troi kha la dep</Text> */}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setModalOkCancel(true);
                                    dataFriendDelete(item.idUserFriend, item.idMess)
                                }}>
                                    <Ionicons name="trash" size={30} color='#FD9F42' style={styles.IconDelete} />
                                </TouchableOpacity>
                            </View>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisibleChat}
                            >
                                {/* Chat */}
                                <SafeAreaView>
                                    <View style={styles.modalLocation}>
                                        <View style={styles.modalBottom}>
                                            <TouchableOpacity onPress={() => setModalVisibleChat(false)} >
                                                <Text style={styles.chevron}>‹</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: 'row' }}>
                                                {
                                                    (imageFriend).charAt(5) == ':'
                                                        ? <Image source={{ uri: imageFriend }} style={styles.image}></Image>
                                                        : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageFriend }} style={styles.image} />
                                                }
                                                <Text style={styles.textOk}>{nameFriend}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.boxMessage, { height: position }]} onPress={Keyboard.dismiss}>
                                            <ScrollView style={{ paddingBottom: 20 }}>
                                                {listMessage.map((mess, indexMess) => {
                                                    return mess.idUser == dataUser.id
                                                        ? <View key={indexMess} style={[styles.messageBlock, { flexDirection: 'row-reverse' }]}>
                                                            {(imageUserMe.image).charAt(5) == ':'
                                                                ? <Image source={{ uri: imageUserMe.image }} style={styles.messageBlock_image}></Image>
                                                                : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageUserMe.image }} style={styles.messageBlock_image} />
                                                            }
                                                            <View style={styles.message}>
                                                                <Text style={styles.textMessageBox}>{mess.mess}</Text>
                                                                <Text style={styles.textTime}>{mess.time}</Text>
                                                            </View>
                                                        </View>
                                                        : <View key={indexMess} style={[styles.messageBlock, { flexDirection: 'row' }]}>
                                                            {
                                                                (imageFriend).charAt(5) == ':'
                                                                    ? <Image source={{ uri: imageFriend }} style={styles.messageBlock_image}></Image>
                                                                    : <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageFriend }} style={styles.messageBlock_image} />
                                                            }
                                                            <View style={styles.message}>
                                                                <Text style={styles.textMessageBox}>{mess.mess}</Text>
                                                                <Text style={styles.textTime}>{mess.time}</Text>
                                                            </View>
                                                        </View>
                                                })
                                                }
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
                        </View>
                    })
                }
            </ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalOkCancel}
            >
                <View style={styles.boxOkCancel}>
                    <View style={{ width: 300, height: 100, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15 }}>
                        <Text style={{ textAlign: 'center', color: 'tomato', }}>Delete this person ?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15 }}>
                            <TouchableOpacity onPress={() => setModalOkCancel(false)}>
                                <Text style={styles.textButtonOkCancel}>NO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                deleteFriend(),
                                    setModalOkCancel(false)
                            }}>
                                <Text style={styles.textButtonOkCancel}>YES</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#FFFFFF',
    },
    modalMessage: {
        flex: 1,
        backgroundColor: 'red',
    },
    boxSearch: {
        padding: 15,
        width: '100%',
        // backgroundColor: 'red'
        paddingBottom: 5,
    },
    search: {
        padding: 5,
        paddingBottom: 5,
        borderRadius: 7,
        paddingLeft: 31,
        backgroundColor: '#E9E5E5',
        position: 'relative',
    },
    searchIcon: {
        fontSize: 25,
        color: '#B0B2B3',
        position: 'absolute',
        top: 20,
        left: 18,
    },
    modalSearch: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        // paddingTop: 20,
        paddingBottom: 0,
    },
    boxSearchFriend: {
        width: '100%',
        paddingBottom: 5,
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
    searchIconSearch: {
        fontSize: 25,
        color: '#B0B2B3',
        position: 'absolute',
        top: 6,
        left: 4,
    },
    user: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 10,
    },
    imageUserSearch: {
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
    list: {
        flexDirection: 'row',
        padding: 15,
        paddingBottom: 5,
        alignItems: 'center'
    },
    listLeft: {
        marginRight: 20,
    },
    imageUser: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        position: 'relative',
    },
    statusUser: {
        width: 15,
        height: 15,
        borderRadius: 15 / 2,
        backgroundColor: '#3BFE1C',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        position: 'absolute',
        bottom: 2,
        right: 0
    },
    listRight: {
        // backgroundColor: 'green',
        justifyContent: 'center',
        width: '75%',
        // marginRight: 20,
        paddingRight: 20,
    },
    textName: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 2,
    },
    // modal /////////////////////////////////////////////
    textMessage: {
        color: '#9F9C9C',
        fontSize: 13,
    },
    IconDelete: {
        // justifyContent:"center",
        // alignItems: 'center',
        marginLeft: 10,
    },
    // chat
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
    textMessageBox: {
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
    },
    // delete user
    boxOkCancel: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textButtonOkCancel: {
        color: '#FFFFFF',
        backgroundColor: 'tomato',
        padding: 0,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
    }
})