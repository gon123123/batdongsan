import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, Image, TouchableOpacity, Dimensions,
    ScrollView, Modal, SafeAreaView, TouchableWithoutFeedback, Keyboard,
    StatusBar, TextInput, Alert, FlatList, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import Swiper from 'react-native-swiper';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import girl from '../../assets/girl.jpg';
import girl1 from '../../assets/girl1.jpg';
import girl2 from '../../assets/girl2.jpeg'
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
var date = new Date();
var ngay = date.toISOString();
var str = ((ngay.slice(0, 10).split('-')).reverse()).join('/');
// console.log(str);

export default function Me({ route, navigation }) {
    // console.log(route);
    var params = route.params.params;
    const [dataUser, setDataUser] = useState({
        id: params.id,
        name: params.name,
        email: params.email,
        password: params.password,
        status: params.status,
        avatar: params.avatar,
    });
    const [errorUpdate, setErrorUpdate] = useState({
        errorName: '* ',
        errorPasswordOL: '* ',
        errorPasswordNew: '* ',
        errorPasswordNewCF: '* ',
    })
    const [modalUpdateName, setModalUpdateName] = useState(false);
    const [newName, setNewName] = useState(params.name);

    const [modalUpdatePass, setModalUpdatePass] = useState(false);
    const [oldPassUpdate, setOldPassUpdate] = useState('');
    const [newPassUpdate, setNewPassUpdate] = useState('');
    const [newPassUpdateCF, setNewPassUpdateCF] = useState('');

    const [modalAvatar, setModalAvatar] = useState(false);
    const [typeImage, setTypeImage] = useState(dataUser.avatar.type);
    const [imageBase64, setImageBase64] = useState(dataUser.avatar.image);

    const [modalPost, setModalPost] = useState(false);
    const [modalMapPost, setModalMapPost] = useState(false);
    const [modalMapMyPost, setModalMapMyPost] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [modalMapUpdate, setModalMapUpdate] = useState(false);

    var [listImagePost, setListImagePost] = useState(null);
    const [okListImageHouse, setOkListImageHouse] = useState(false);
    const [pricePost, setPricePost] = useState('');
    const [descriptionPost, setDescriptionPost] = useState('');
    const [errorPost, setErrorPost] = useState(
        {
            price: '* ',
            description: '* ',
            listImage: '* ',
        }
    );
    const [errorMyPostUpdate, setErrorMyPostUpdate] = useState(
        {
            price: '* ',
            description: '* ',
            listImage: '* ',
        }
    );
    const [regionsPost, setRegionsPost] = useState({
        latitude: 16.9016955,
        latitudeDelta: 0.05344377267959999,
        longitude: 107.0186967,
        longitudeDelta: 0.050673969089999105,
    });
    const [coordinatePost, setCoordinatePost] = useState({
        latitude: 16.9016955,
        longitude: 107.0186967,
    });
    const [modalMyPost, setModalMyPost] = useState(false);
    const [listMyPost, setListMyPost] = useState([]);
    const [imageListMyPost, setImageListMyPost] = useState(null);
    const [okUpListImageUpdateMyPost, setOkUpListImageUpdateMyPost] = useState(false);
    const [priceMyPostUpdate, setPriceMyPostUpdate] = useState('');
    const [descriptionMyPostUpdate, setDescriptionMyPostUpdate] = useState('');
    const [regionMyPostUpdate, setRegionMyPostUpdate] = useState({
        latitude: 16.9016955,
        latitudeDelta: 0.05344377267959999,
        longitude: 107.0186967,
        longitudeDelta: 0.050673969089999105,
    });
    const [coordinateMyPostUpdate, setCoordinateMyPostUpdate] = useState({
        latitude: 16.9016955,
        longitude: 107.0186967,
    });
    const [indexUpdateMyPost, setIndexUpdateMyPost] = useState(null);
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
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status == 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                setRegionsPost({
                    latitude: location.coords.latitude,
                    latitudeDelta: 0.05344377267959999,
                    longitude: location.coords.longitude,
                    longitudeDelta: 0.050673969089999105,
                });
                // console.log(location.coords);
                setCoordinatePost({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } else {
                alert('khong dc cap quyen')
            }
        })();
        // firebase.initializeApp(firebaseConfig);
        if (!firebase.apps.length) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            // const analytics = getAnalytics(app);
            console.log('ket noi thanh cong');
        }
        getDatabase();
    }, []);
    function getDatabase() {
        firebase.database().ref('posts/' + params.id).on('value', function (snapshot) {
            var childData = [];
            snapshot.forEach(function (item, index) {
                childData = item.val();
            });
            // console.log(childData);
            setListMyPost(childData);
        });
    }
    function updateName(paramName) {
        if (paramName == '') {
            setErrorUpdate({
                errorName: '* cannot be left blank',
                errorPasswordOL: '* ',
                errorPasswordNew: '* ',
                errorPasswordNewCF: '* ',
            })
        } else {
            firebase.database().ref('users/' + params.id).set({
                name: paramName,
                email: dataUser.email,
                password: dataUser.password,
                status: dataUser.status,
                avatar: {
                    type: dataUser.avatar.type,
                    image: dataUser.avatar.image,
                },
            }, function (error) {
                if (error) {
                    alert('error ' + error);
                } else {
                    alert('success');
                }
            });
        }
    }
    function updatePass(oldPass, newPass, newPassCF) {
        let error = {
            errorName: '* ',
            errorPasswordOL: '* ',
            errorPasswordNew: '* ',
            errorPasswordNewCF: '* ',
        };
        if (oldPass === '' || newPass === '' || newPassCF === '') {
            if (oldPass === '') {
                error.errorPasswordOL = '* can not be left blank';
            }
            if (newPass === '') {
                error.errorPasswordNew = '* can not be left blank';
            }
            if (newPassCF === '') {
                error.errorPasswordNewCF = '* can not be left blank';
            }
            setErrorUpdate(error);
        } else {
            if (oldPass == dataUser.password) {
                if (newPass == newPassCF) {
                    firebase.database().ref('users/' + params.id).set({
                        name: newName, // lấy new name vì ban đầu giá trị của nó là name cũ , nếu có cập nhật thì mới thành name mới 
                        email: dataUser.email,
                        password: newPass,
                        status: dataUser.status,
                        avatar: {
                            type: dataUser.avatar.type,
                            image: dataUser.avatar.image,
                        },
                    }, function (error) {
                        if (error) {
                            alert('error ' + error);
                        } else {
                            alert('success');
                            navigation.navigate('Login')
                        }
                    });
                } else {
                    error.errorPasswordNewCF = '* password incorrect';
                    setErrorUpdate(error);
                }
            } else {
                error.errorPasswordOL = '* wrong password';
                setErrorUpdate(error);
            }
        }
    }
    function updateAvatar(uriImage) {
        setTypeImage('base64');
        firebase.database().ref('users/' + params.id).set({
            name: newName, // lấy new name vì ban đầu giá trị của nó là name cũ , nếu có cập nhật thì mới thành name mới 
            email: dataUser.email,
            password: dataUser.password,
            status: dataUser.status,
            avatar: {
                type: 'base64',
                image: uriImage,
            },
        }, function (error) {
            if (error) {
                alert('error ' + error);
            } else {
                alert('success');
            }
        });
    }
    let openImagePickerAsync = async () => {
        // cấp quyền
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }
        // cho phép truy cập thư viện ảnh
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        // console.log(pickerResult.uri);
        if (pickerResult.uri != '') {
            const base64 = await FileSystem.readAsStringAsync(pickerResult.uri, { encoding: 'base64' });
            // updateAvatar(base64);
            setImageBase64(base64);
        }
    };
    let listImageHouse = async () => {
        // cấp quyền
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }
        // cho phép truy cập thư viện ảnh 
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        if (pickerResult.uri != '') {
            const uriBase64 = await FileSystem.readAsStringAsync(pickerResult.uri, { encoding: 'base64' });
            let arrList = [];
            arrList.push(uriBase64);
            let arrListImage = arrList.concat(listImagePost);
            firebase.database().ref('listImagePost/' + params.id).set({
                image: arrListImage,
            }, function (error) {
                if (error) {
                    // alert('error ' + error);
                } else {
                    firebase.database().ref('listImagePost/').on('value', function (snapshot) {
                        let array = [];
                        snapshot.forEach(function (item) {
                            var childData = item.val();
                            array = childData.image;
                        });
                        setListImagePost(array);
                    });
                }
            });
        }
    };
    function clearListImageHouse() {
        firebase.database().ref('listImagePost/' + params.id).remove();
    }
    function okListImage() {
        if (listImagePost.length > 0) {
            setOkListImageHouse(true);
        }
    }
    function postNew(listImage, price, description) {
        let Error = {
            price: '',
            description: '',
            listImage: '',
        }
        if (listImage == null || price == '' || description == '') {
            if (listImage == null) {
                Error.listImage = '* can not the blank';
            }
            if (price == '') {
                Error.price = '* can not the blank';
            }
            if (description == '') {
                Error.description = '* can not the blank';
            }
            setErrorPost(Error);
        } else {
            getDatabase();
            let post = [
                {
                    listImage: listImagePost,
                    price: pricePost,
                    description: descriptionPost,
                    regions: regionsPost,
                    coordinate: coordinatePost,
                    sold: false,
                    bookMark: [],
                    nameUser: newName,
                    idUser: dataUser.id,
                    imageUser: dataUser.avatar.image,
                    time: str
                }
            ]
            let newPost = listMyPost.concat(post);
            firebase.database().ref('posts/' + params.id).set({
                // push() sẽ bổ sung cho id
                post: newPost
            }, function (error) {
                if (error) {
                    alert('error' + error);
                } else {
                    alert('success');
                }
            });
            deleteImageOld();
            setPricePost('');
            setDescriptionPost('');
        }
    };
    function clearOneImage(item) {
        var array2 = listImagePost.filter(function (value, index) {
            return value != item;
        })
        setListImagePost(array2);
        // console.log(array2.length);
    }
    function deleteImageOld() {
        firebase.database().ref('listImagePost/' + params.id).remove();
    }
    function updateSold(sold, index) {
        let array = listMyPost;
        array[index].sold = sold;
        // console.log(array);
        firebase.database().ref('posts/' + params.id).set({
            post: array
        }, function (error) {
            if (error) {
                alert('error ' + error);
            } else {
                alert('success');
            }
        });
    }
    function deletePost() {
        firebase.database().ref('posts/' + params.id + '/post/' + indexUpdateMyPost).remove();
    }
    function clearListImageUpdateMyPost() {
        setImageListMyPost([]);
    }
    let listImageHouseUpdateMyPost = async () => {
        // cấp quyền
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }
        // cho phép truy cập thư viện ảnh 
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        if (pickerResult.uri != '') {
            const uriBase64 = await FileSystem.readAsStringAsync(pickerResult.uri, { encoding: 'base64' });
            let arrList = [];
            arrList.push(uriBase64);
            setImageListMyPost(imageListMyPost.concat(arrList));
        }
    };
    function clearOneImageUpdateMyPost(item) {
        let array = imageListMyPost.filter(function (value, index) {
            return value != item;
        })
        setImageListMyPost(array);
    }
    function updateMyPost(sold) {
        let Error = {
            price: '* ',
            description: '* ',
            listImage: '* ',
        }
        if (imageListMyPost == null || priceMyPostUpdate == '' || descriptionMyPostUpdate == '') {
            if (imageListMyPost == null) {
                Error.listImage = '* can not the blank';
            }
            if (priceMyPostUpdate == '') {
                Error.price = '* can not the blank';
            }
            if (descriptionMyPostUpdate == '') {
                Error.description = '* can not the blank';
            }
            setErrorMyPostUpdate(Error);
        } else {
            let post =
            {
                listImage: imageListMyPost,
                price: priceMyPostUpdate,
                description: descriptionMyPostUpdate,
                regions: regionMyPostUpdate,
                coordinate: coordinateMyPostUpdate,
                sold: sold,
                bookMark: [],
                nameUser: newName,
                idUser: dataUser.id,
                imageUser: dataUser.avatar.image,
                time: str
            }
            // let current = [];
            // firebase.database().ref('posts/').on('value', function (snapshot) {
            //     snapshot.forEach(function (item) {
            //         var childData = item.val();
            //         current = childData.post;
            //     });
            // });
            var len = listMyPost.length;
            let listUpdate = [];
            for (var i = 0; i < len; i++) {
                if (i != indexUpdateMyPost) {
                    listUpdate.push(listMyPost[i]);
                }
            }
            listUpdate.push(post);
            // console.log(listUpdate.length);
            firebase.database().ref('posts/' + params.id).set({
                // push() sẽ bổ sung cho id
                post: listUpdate.reverse()
            }, function (error) {
                if (error) {
                    alert('error' + error);
                } else {
                    alert('success');
                }
            });
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.boxBanner}>
                {dataUser.avatar.type == 'link'
                    ? <Image source={{ uri: dataUser.avatar.image }} style={styles.imageBanner}></Image>
                    : <Text></Text>
                }
                {dataUser.avatar.type == 'base64'
                    ? <Image source={{ uri: 'data:image/jpeg;base64,' + imageBase64 }} style={styles.imageBanner} />
                    : <Text></Text>
                }
                <Text style={styles.textBanner}>{newName == '' ? dataUser.name : newName}</Text>
            </View>
            {/* option */}
            <View style={styles.boxOptions}>
                <TouchableOpacity onPress={() => setModalUpdateName(true)}>
                    <View style={styles.option}>
                        <Ionicons name='create-outline' style={styles.iconOption} />
                        <Text style={styles.textOption}>Update Name</Text>
                    </View>
                </TouchableOpacity>
                {/* modal update name */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalUpdateName}
                >
                    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.boxUpdateName}>
                        <View style={styles.UpdateName}>
                            <Text style={styles.labelUpdateName}>New Name</Text>
                            <TextInput placeholder="type name..." style={styles.textUpdateName}
                                onChangeText={(text) => { setNewName(text) }}
                                value={newName}
                            ></TextInput>
                            <Text style={[styles.textError, { fontSize: 7 }]}>{errorUpdate.errorName}</Text>
                            <View style={styles.boxButtonUpdateName}>
                                <TouchableOpacity onPress={() => {
                                    setModalUpdateName(false),
                                        setNewName('')
                                }}>
                                    <Text style={styles.textButtonUpdateName}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setModalUpdateName(false),
                                        updateName(newName)
                                }}>
                                    <Text style={styles.textButtonUpdateName}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <TouchableOpacity onPress={() => setModalUpdatePass(true)}>
                    <View style={styles.option}>
                        <Ionicons name='settings-outline' style={styles.iconOption} />
                        <Text style={styles.textOption}>Update Password</Text>
                    </View>
                </TouchableOpacity>
                {/* modal update Pass */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalUpdatePass}
                >
                    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.boxUpdateName}>
                        <View style={styles.UpdatePass}>
                            <Text style={styles.labelUpdateName}>Old password</Text>
                            <TextInput placeholder="type old password" style={styles.textUpdateName}
                                onChangeText={(text) => setOldPassUpdate(text.trim())}
                                value={oldPassUpdate}
                            ></TextInput>
                            <Text style={[styles.textError, { fontSize: 7 }]}>{errorUpdate.errorPasswordOL}</Text>
                            <Text style={styles.labelUpdateName}>New password</Text>
                            <TextInput placeholder="type new password" style={styles.textUpdateName}
                                onChangeText={(text) => setNewPassUpdate(text.trim())}
                                value={newPassUpdate}
                            ></TextInput>
                            <Text style={[styles.textError, { fontSize: 7 }]}>{errorUpdate.errorPasswordNew}</Text>
                            <Text style={styles.labelUpdateName}>Confirm password</Text>
                            <TextInput placeholder="type confirm password" style={styles.textUpdateName}
                                onChangeText={(text) => setNewPassUpdateCF(text.trim())}
                                value={newPassUpdateCF}
                            ></TextInput>
                            <Text style={[styles.textError, { fontSize: 7 }]}>{errorUpdate.errorPasswordNewCF}</Text>
                            <View style={styles.boxButtonUpdateName}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalUpdatePass(false),
                                            setOldPassUpdate(''),
                                            setNewPassUpdate(''),
                                            setNewPassUpdateCF('')
                                    }}
                                >
                                    <Text style={styles.textButtonUpdateName}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalUpdatePass(false),
                                            updatePass(oldPassUpdate, newPassUpdate, newPassUpdateCF);
                                    }}
                                >
                                    <Text style={styles.textButtonUpdateName}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <TouchableOpacity onPress={() => setModalAvatar(true)}>
                    <View style={styles.option}>
                        <Ionicons name='ios-camera-outline' style={styles.iconOption} />
                        <Text style={styles.textOption}>Update Avatar</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalPost(true)}>
                    <View style={styles.option}>
                        <Ionicons name='logo-buffer' style={styles.iconOption} />
                        <Text style={styles.textOption}>Post For Sale</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setModalMyPost(true), getDatabase() }} >
                    <View style={styles.option}>
                        <Ionicons name='ios-clipboard-outline' style={styles.iconOption} />
                        <Text style={styles.textOption}>My Post</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Login') }} >
                    <View style={styles.option}>
                        <Ionicons name='ios-log-out-outline' style={styles.iconOption} />
                        <Text style={styles.textOption}>Log Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* end option */}
            {/* modal avatar */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalAvatar}
            >
                <SafeAreaView>
                    <View style={styles.modalLocation}>
                        <View style={[styles.modalBottom, { borderBottomWidth: 0 }]}>
                            <Text onPress={() => setModalAvatar(false)} style={styles.textOk}>Xong</Text>
                        </View>
                        <View style={styles.chooseAvatar}>
                            {imageBase64 == null
                                ? <TouchableOpacity onPress={openImagePickerAsync}>
                                    <View style={styles.avatarChoose}>
                                        <Ionicons name='ios-images' size={35} color='#B7B7AC' />
                                    </View>
                                </TouchableOpacity>
                                : typeImage == 'base64' ? <View style={{
                                    height: 300,
                                    width: '100%',
                                    backgroundColor: '#E9E5E5'
                                }}>
                                    <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageBase64 }} style={{ width: '100%', height: '100%' }} />
                                </View>
                                    : <View style={{
                                        height: 300,
                                        width: '100%',
                                        backgroundColor: '#E9E5E5'
                                    }}>
                                        <Image resizeMode='cover' source={{ uri: imageBase64 }} style={{ width: '100%', height: '100%' }} />
                                    </View>
                            }
                            <View style={styles.boxButton}>
                                <TouchableOpacity onPress={() => setImageBase64(null)}>
                                    <View style={styles.buttonChooseAvatar}>
                                        <Text style={styles.textButtonAvatar}>Clear</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => updateAvatar(imageBase64)}>
                                    <View style={styles.buttonChooseAvatar}>
                                        <Text style={styles.textButtonAvatar}>OK</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
            {/* end modal avatar */}
            {/* dang bai */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPost}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <ScrollView>
                        <View style={styles.postNews}>
                            <View style={styles.modalLocation}>
                                <View style={[styles.modalBottom, { borderBottomWidth: 0 }]}>
                                    <Text onPress={() => setModalPost(false)} style={styles.textOk}>Xong</Text>
                                </View>
                            </View>
                            {okListImageHouse == true
                                ? <View style={{ height: 300, marginBottom: 30 }}>
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
                                        {listImagePost.map((item, index) => {
                                            return <Image key={index} resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item }} style={{ width: '100%', height: '100%' }} />
                                        })}
                                    </Swiper>
                                </View>
                                :
                                <>
                                    <TouchableOpacity style={styles.boxChooseImage} onPress={listImageHouse}>
                                        <Ionicons name='ios-images' size={35} color='#B7B7AC' />
                                    </TouchableOpacity>
                                    <Text style={styles.textError}>{errorPost.listImage}</Text>
                                    {
                                        listImagePost == null
                                            ? <Text></Text>
                                            : <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                {listImagePost.map((value, viTri) => {
                                                    return <View key={viTri} style={{ width: 115, height: 100, position: 'relative', margin: 3, marginBottom: 5, }}>
                                                        <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + value }} style={{ width: 100, height: 100 }} />
                                                        <Ionicons name='ios-close-circle' size={25} color='#DCDBDA' style={{ position: 'absolute', right: 0, top: -10 }} onPress={() => clearOneImage(value)} />
                                                    </View>
                                                })}
                                            </View>
                                    }
                                </>
                            }
                            <View style={[styles.boxClear, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <TouchableOpacity style={styles.clear} onPress={() => {
                                    setOkListImageHouse(false),
                                        clearListImageHouse()
                                }}>
                                    <Text style={styles.clearImage}>Clear</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.clear} onPress={() => okListImage()}>
                                    <Text style={styles.clearImage}>OK</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.boxInput}>
                                <>
                                    <View style={styles.boxFrom}>
                                        <View style={styles.groupText}>
                                            <Text style={styles.label}>Price</Text>
                                            <TextInput style={styles.textInput} name='price' maxLength={40} placeholder='type price...'
                                                onChangeText={(text) => setPricePost(text)}
                                                value={pricePost}
                                            />
                                            <Text style={styles.textError}>{errorPost.price}</Text>
                                        </View>
                                    </View>
                                </>
                                <>
                                    <View style={styles.boxFrom}>
                                        <View style={styles.groupText}>
                                            <Text style={styles.label}>Description</Text>
                                            <TextInput style={styles.textInput} name='description' placeholder='type description...'
                                                onChangeText={(text) => setDescriptionPost(text)}
                                                value={descriptionPost}
                                            />
                                            <Text style={styles.textError}>{errorPost.description}</Text>
                                        </View>
                                    </View>
                                </>
                            </View>
                            <View style={{ alignItems: 'flex-start', width: '100%', marginTop: 10, marginBottom: 10 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-end' }} onPress={() => setModalMapPost(true)}>
                                    <Ionicons name='location' size={25} color='tomato' />
                                    <Text style={styles.textLocation}>location on map</Text>
                                </TouchableOpacity>
                            </View>
                            {/* modal map post */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalMapPost}
                            >
                                <SafeAreaView>
                                    <View style={styles.modalLocation}>
                                        <View style={styles.modalBottom}>
                                            <Text onPress={() => setModalMapPost(false)} style={styles.textOk}>Xong</Text>
                                        </View>
                                        <MapView style={styles.mapPost}
                                            onRegionChangeComplete={(...region) =>
                                                setRegionsPost(region[0])
                                            }
                                            region={regionsPost}
                                        >
                                            <MapView.Marker
                                                coordinate={{
                                                    latitude: coordinatePost.latitude,
                                                    longitude: coordinatePost.longitude,
                                                }}
                                                description={descriptionPost}
                                                draggable={true}
                                                onDragStart={(value) =>
                                                    setCoordinatePost(value.nativeEvent.coordinate)
                                                }
                                            />
                                        </MapView>
                                    </View>
                                </SafeAreaView>
                            </Modal>
                            <View style={styles.boxClear}>
                                <TouchableOpacity style={styles.clear} onPress={() => postNew(listImagePost, pricePost, descriptionPost)}>
                                    <Text style={styles.clearImage}>Post</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </Modal>
            {/* end dang bai */}
            {/* modal my post */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalMyPost}
            >
                <SafeAreaView>
                    <View style={[styles.modalLocation, { height: '100%' }]}>
                        <View style={[styles.modalBottom, { borderBottomWidth: 0 }]}>
                            <Text onPress={() => setModalMyPost(false)} style={styles.textOk}>Xong</Text>
                        </View>
                        <ScrollView style={{ height: '100%', width: '100%' }}>
                            {listMyPost.length > 0
                                ?
                                listMyPost.map((item, index) => {
                                    return <View key={item.price}>
                                        <View style={[styles.post, { borderBottomWidth: 5, borderBottomColor: '#DCDBDA' }]}>
                                            <TouchableOpacity style={styles.deletePost} onPress={() => {
                                                setIndexUpdateMyPost(index),
                                                    deletePost()
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
                                                        {typeImage === 'base64'
                                                            ? <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + imageBase64 }} style={styles.imageUser} />
                                                            : <Image source={{ uri: dataUser.avatar.image }} style={styles.imageUser}></Image>
                                                        }
                                                        <Text style={styles.textNameUse}>{newName}</Text>
                                                        <Text style={[styles.textNameUse, { fontWeight: '100', fontStyle: 'italic' }]}>{item.time}</Text>
                                                        <TouchableOpacity style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={[styles.textNameUse, { marginRight: 5 }]}>report</Text>
                                                            <Ionicons name='ios-flag' size={15} color='tomato' />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={styles.row1Right}>
                                                        <Text style={{ color: '#D5D7D4', marginRight: 10, fontSize: 12, }}>Care</Text>
                                                        <TouchableOpacity>
                                                            <Ionicons name='heart' size={25} color='#F61D6C' />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View style={styles.row2}>
                                                    <Text style={styles.TextDescription}>{item.description}</Text>
                                                </View>
                                                <View style={styles.row3}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                                        onPress={() => setModalMapMyPost(true)}
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
                                                        <TouchableOpacity style={styles.bottomChat} onPress={() => {
                                                            setImageListMyPost(item.listImage),
                                                                setPriceMyPostUpdate(item.price),
                                                                setDescriptionMyPostUpdate(item.description),
                                                                setIndexUpdateMyPost(index)
                                                            setModalUpdate(true)
                                                        }}>
                                                            <Text style={styles.bottomTextChat}>Update</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.bottomSold} onPress={() => updateSold(!item.sold, index)}>
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
                                            visible={modalMapMyPost}
                                        >
                                            <SafeAreaView>
                                                <View style={styles.modalLocation}>
                                                    <View style={styles.modalBottom}>
                                                        <Text onPress={() => setModalMapMyPost(false)} style={styles.textOk}>Xong</Text>
                                                    </View>
                                                    <MapView style={styles.mapPost}
                                                        // onRegionChangeComplete={(...region) =>
                                                        //     setRegionsPost(region[0])
                                                        // }
                                                        region={item.regions}
                                                    >
                                                        <MapView.Marker
                                                            coordinate={item.coordinate}
                                                            description={item.description}
                                                            draggable={true}
                                                        // onDragStart={(value) =>
                                                        //     setCoordinatePost(value.nativeEvent.coordinate)
                                                        // }
                                                        />
                                                    </MapView>
                                                </View>
                                            </SafeAreaView>
                                        </Modal>
                                        <Modal
                                            animationType="slide"
                                            transparent={true}
                                            visible={modalUpdate}
                                        >
                                            {/* modal update my post */}
                                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                                                <View style={styles.postNews}>
                                                    <View style={styles.modalLocation}>
                                                        <View style={[styles.modalBottom, { borderBottomWidth: 0 }]}>
                                                            <Text onPress={() => setModalUpdate(false)} style={styles.textOk}>Xong</Text>
                                                        </View>
                                                    </View>
                                                    {okUpListImageUpdateMyPost === true
                                                        ?
                                                        <View View style={[styles.boxImagePost, { height: windowHeight / 2.5, width: windowWidth - 20 }]}>
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
                                                                {imageListMyPost.map((item2, pos) => {
                                                                    return <Image key={pos} resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + item2 }} style={{ width: '100%', height: '100%' }} />
                                                                })}
                                                            </Swiper>
                                                        </View> :
                                                        <TouchableOpacity style={styles.boxChooseImage} onPress={() => listImageHouseUpdateMyPost()}>
                                                            <Ionicons name='ios-images' size={35} color='#B7B7AC' />
                                                        </TouchableOpacity>
                                                    }
                                                    <Text style={styles.textError}>{errorMyPostUpdate.listImage}</Text>
                                                    {
                                                        imageListMyPost == null
                                                            ? <Text></Text>
                                                            : <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                                {imageListMyPost.map((giaTri, viTri) => {
                                                                    return <View key={viTri} style={{ width: 115, height: 100, position: 'relative', margin: 3, marginBottom: 5, }}>
                                                                        <Image resizeMode='cover' source={{ uri: 'data:image/jpeg;base64,' + giaTri }} style={{ width: 100, height: 100 }} />
                                                                        <Ionicons name='ios-close-circle' size={25} color='#DCDBDA' style={{ position: 'absolute', right: 0, top: -10 }} onPress={() => clearOneImageUpdateMyPost(giaTri)} />
                                                                    </View>
                                                                })}
                                                            </View>
                                                    }
                                                    <View style={[styles.boxClear, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }]}>
                                                        <TouchableOpacity style={styles.clear} onPress={() => { clearListImageUpdateMyPost(), setOkUpListImageUpdateMyPost(false) }}>
                                                            <Text style={styles.clearImage}>Clear</Text>
                                                        </TouchableOpacity>
                                                        {okUpListImageUpdateMyPost === true
                                                            ? <TouchableOpacity style={styles.clear} onPress={() => setOkUpListImageUpdateMyPost(false)}>
                                                                <Text style={styles.clearImage}>Back</Text>
                                                            </TouchableOpacity>
                                                            : <TouchableOpacity style={styles.clear} onPress={() => setOkUpListImageUpdateMyPost(true)}>
                                                                <Text style={styles.clearImage}>OK</Text>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>
                                                    <View style={styles.boxInput}>
                                                        <>
                                                            <View style={styles.boxFrom}>
                                                                <View style={styles.groupText}>
                                                                    <Text style={styles.label}>Price</Text>
                                                                    <TextInput style={styles.textInput} name='price' maxLength={40} placeholder='type price...'
                                                                        onChangeText={(text) => setPriceMyPostUpdate(text)}
                                                                        value={priceMyPostUpdate}
                                                                    />
                                                                    <Text style={styles.textError}>{errorMyPostUpdate.price}</Text>
                                                                </View>
                                                            </View>
                                                        </>
                                                        <>
                                                            <View style={styles.boxFrom}>
                                                                <View style={styles.groupText}>
                                                                    <Text style={styles.label}>Description</Text>
                                                                    <TextInput style={styles.textInput} name='description' placeholder='type description...'
                                                                        onChangeText={(text) => setDescriptionMyPostUpdate(text)}
                                                                        value={descriptionMyPostUpdate}
                                                                    />
                                                                    <Text style={styles.textError}>{errorMyPostUpdate.description}</Text>
                                                                </View>
                                                            </View>
                                                        </>
                                                    </View>
                                                    <View style={{ alignItems: 'flex-start', width: '100%', marginTop: 10, marginBottom: 10 }}>
                                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-end' }} onPress={() => {
                                                            setRegionMyPostUpdate(item.regions),
                                                                setCoordinateMyPostUpdate(item.coordinate),
                                                                setModalMapUpdate(true)
                                                        }}>
                                                            <Ionicons name='location' size={25} color='tomato' />
                                                            <Text style={styles.textLocation}>location on map</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={styles.boxClear}>
                                                        <TouchableOpacity style={styles.clear} onPress={() => updateMyPost(item.sold)}>
                                                            <Text style={styles.clearImage}>Update</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    {/* modal map update my post */}
                                                    <Modal
                                                        animationType="slide"
                                                        transparent={true}
                                                        visible={modalMapUpdate}
                                                    >
                                                        <SafeAreaView>
                                                            <View style={styles.modalLocation}>
                                                                <View style={styles.modalBottom}>
                                                                    <Text onPress={() => setModalMapUpdate(false)} style={styles.textOk}>Xong</Text>
                                                                </View>
                                                                <MapView style={styles.mapPost}
                                                                    onRegionChangeComplete={(...region) => {
                                                                        // console.log(region),
                                                                            setRegionMyPostUpdate(region[0])
                                                                    }
                                                                    }
                                                                    region={regionMyPostUpdate}
                                                                >
                                                                    <MapView.Marker
                                                                        coordinate={coordinateMyPostUpdate}
                                                                        description={descriptionMyPostUpdate}
                                                                        draggable={true}
                                                                        onDragStart={(value) =>
                                                                            setCoordinateMyPostUpdate(value.nativeEvent.coordinate)
                                                                        }
                                                                    />
                                                                </MapView>
                                                            </View>
                                                        </SafeAreaView>
                                                    </Modal>
                                                </View>
                                            </TouchableWithoutFeedback>
                                            {/* end modal update my post */}
                                        </Modal>
                                    </View>
                                })
                                : <View style={{ flex: 1, width: '100%', height: windowHeight, alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator size={40} color="tomato" style={{ alignItems: 'center', justifyContent: 'center' }}></ActivityIndicator>
                                </View>
                            }
                        </ScrollView>
                    </View>
                </SafeAreaView >
            </Modal >
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        // padding: 1,
        paddingBottom: 0,
    },
    boxBanner: {
        backgroundColor: 'tomato',
        height: 300,
        width: '100%',
        borderBottomRightRadius: 150,
        flexDirection: 'row',
    },
    imageBanner: {
        width: 120,
        height: 120,
        borderRadius: 120 / 2,
        marginTop: 120,
        marginLeft: 50,
    },
    textBanner: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 160,
        marginLeft: 15,
    },
    boxOptions: {
        padding: 20,
        paddingBottom: 0,
        height: '100%',
    },
    option: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
        margin: 2,
        marginTop: 20,
    },
    iconOption: {
        fontSize: 40,
        color: 'tomato',
        marginRight: 15,
    },
    textOption: {
        fontSize: 15,
        color: 'tomato',
        borderColor: '#E9E5E5',
        borderBottomWidth: 0.5,
        width: '80%',
        padding: 10,
        paddingLeft: 0,
    },
    // modal update name
    boxUpdateName: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    UpdateName: {
        width: 350,
        height: 150,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
    },
    UpdatePass: {
        width: 350,
        height: 320,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
    },
    labelUpdateName: {
        color: 'tomato',
        marginTop: 6,
        marginBottom: 4,
        fontSize: 13,
    },
    textUpdateName: {
        padding: 2,
        paddingLeft: 10,
        borderColor: 'tomato',
        borderWidth: 0.5,
        fontSize: 10,
    },
    boxButtonUpdateName: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
    },
    textButtonUpdateName: {
        padding: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'tomato',
        width: 90,
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold',
        borderRadius: 10,
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
    // // modal post dang bai
    postNews: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingBottom: 0,

    },
    boxChooseImage: {
        width: '100%',
        height: 250,
        backgroundColor: '#E9E5E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    boxClear: {
        width: '100%',
        alignItems: 'flex-end',
    },
    clear: {
        width: 100,
        backgroundColor: 'tomato',
        padding: 2,
        paddingLeft: 13,
        paddingRight: 13,
        paddingBottom: 3,
        borderRadius: 5,
        borderRadius: 8,
    },
    clearImage: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    boxInput: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        // height: '80%',
        width: '100%',
        alignItems: 'center',
        // padding: 10,
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
    textLocation: {
        color: 'tomato',
        fontWeight: 'bold',
        alignItems: 'center',
        paddingTop: 10,
    },
    // Picker
    Picker: {
        width: '100%',
        borderColor: 'tomato',
        borderWidth: 0.5,
        marginTop: 5,
    },
    pickerStyle: {
        height: 50,
        width: "100%",
        color: 'tomato',
        justifyContent: 'center',
    },
    // modal choose avatar
    chooseAvatar: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        paddingRight: 20,
        paddingLeft: 20,
    },
    avatarChoose: {
        height: 300,
        width: '100%',
        backgroundColor: '#E9E5E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxButton: {
        width: '100%',
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 10,
    },
    buttonChooseAvatar: {
        backgroundColor: 'tomato',
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        padding: 2,
    },
    textButtonAvatar: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // map Post
    mapPost: {
        height: '100%',
    },
})