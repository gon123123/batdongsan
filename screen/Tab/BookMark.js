import React, { useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Image, Dimensions, Modal, SafeAreaView, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import girl from '../../assets/girl.jpg';
import girl1 from '../../assets/girl1.jpg';
import girl2 from '../../assets/girl2.jpeg'
import girl3 from '../../assets/girl3.jpg';
import girl4 from '../../assets/girl4.jpg';
import girl5 from '../../assets/girl5.jpg';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
console.log(windowWidth);
export default function BookMark() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalChat,setModalChat] = useState(false);
    const [position, setPosition] = useState('88.7%');
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor='tomato' />
            <Text>BookMark</Text>
            <ScrollView>
                <View style={styles.post}>
                    <View style={styles.boxImage}>
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
                            <Image resizeMode='cover' source={girl} style={styles.ImagePost}></Image>
                            <Image resizeMode='cover' source={girl1} style={styles.ImagePost}></Image>
                            <Image resizeMode='cover' source={girl2} style={styles.ImagePost}></Image>
                            <Image resizeMode='cover' source={girl3} style={styles.ImagePost}></Image>
                            <Image resizeMode='cover' source={girl4} style={styles.ImagePost}></Image>
                            <Image resizeMode='cover' source={girl5} style={styles.ImagePost}></Image>
                        </Swiper>
                    </View>
                    <View style={styles.description}>
                        <View style={styles.row1}>
                            <View style={styles.row1Left}>
                                <Image source={girl5} style={styles.imageUser}></Image>
                                <Text style={styles.textNameUse}>Minh Tuan</Text>
                            </View>
                            <View style={styles.row1Right}>
                                <Text style={{ color: '#D5D7D4', marginRight: 10, fontSize: 12, }}>Quan Tâm</Text>
                                <TouchableOpacity>
                                    <Ionicons name='heart' size={25} color='#F61D6C' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.row2}>
                            <Text style={styles.TextDescription}>Căn hộ phía nam Đà Nẵng , diện tích 100 mét vuông Căn hộ phía nam Đà Nẵng , diện tích 100 mét vuôngCăn hộ phía nam Đà Nẵng , diện tích 100 mét vuông.....</Text>
                        </View>
                        <View style={styles.row3}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setModalVisible(true)}>
                                <Ionicons name='location' size={25} color='tomato' />
                                <Text style={styles.textLocation}>location on map</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row4}>
                            <View style={styles.row4Left}>
                                <Text style={[{ fontWeight: 'bold', }, styles.TextPrice1]}>Price :</Text>
                                <Text style={[{ fontWeight: 'bold', }, styles.TextPrice2]}>2 ~ 3 tỷ</Text>
                            </View>
                            <View style={styles.row4Right}>
                                <TouchableOpacity style={styles.bottomChat} onPress={() => setModalChat(true)}>
                                    <Text style={styles.bottomTextChat}>Chat</Text>
                                    <Ionicons name='chatbubble-outline' style={styles.chatbubble} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.bottomSold}>
                                    <Text style={styles.bottomTextSold}>Sold</Text>
                                    <Ionicons name='checkmark-outline' style={styles.checkmark} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {/* modal map */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <SafeAreaView>
                        <View style={styles.modalLocation}>
                            <View style={styles.modalBottom}>
                                <Text onPress={() => setModalVisible(false)} style={styles.textOk}>Xong</Text>
                            </View>
                            <View style={styles.map}>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
                {/* modal chat */}
                {/* modal chat */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalChat}
                >
                    <SafeAreaView>
                        <View style={styles.modalLocation}>
                            <View style={styles.modalBottom}>
                                <TouchableOpacity onPress={() => setModalChat(false)} >
                                    <Text style={styles.chevron}>‹</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row' }}>
                                    <Image source={girl} style={styles.image}></Image>
                                    <Text style={styles.textOk}>Minh Tai</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={[styles.boxMessage, { height: position }]}>
                                    {/* so khớp id nếu trùng thì cho nằm bên phải sai thì nằm bên trái */}
                                    {/* lấy ảnh của nguoi dung */}
                                    {/* <FlatList
                                    data={DATA}
                                    renderItem={({ item }) =>
                                    (
                                        <View style={styles.messageBlock}>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                                <Image source={girl} style={styles.messageBlock_image}></Image>
                                                <View style={styles.message}>
                                                    <Text style={styles.textMessageBox}>ban khoe khong</Text>
                                                    <Text style={styles.textTime}>10:30</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                    }
                                    keyExtractor={item => item.id}
                                /> */}
                                    <View style={[styles.messageBlock, { flexDirection: 'row' }]}>
                                        <Image source={girl} style={styles.messageBlock_image}></Image>
                                        <View style={styles.message}>
                                            <Text style={styles.textMessageBox}>ban khoe khongban khoe khongban khoe khongban khoe khong</Text>
                                            <Text style={styles.textTime}>10:30</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.messageBlock, { flexDirection: 'row-reverse' }]}>
                                        <Image source={girl} style={styles.messageBlock_image}></Image>
                                        <View style={styles.message}>
                                            <Text style={styles.textMessageBox}>ban khoe khongban khoe khongban khoe khongban khoe khong</Text>
                                            <Text style={styles.textTime}>10:30</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.messageBlock, { flexDirection: 'row' }]}>
                                        <Image source={girl} style={styles.messageBlock_image}></Image>
                                        <View style={styles.message}>
                                            <Text style={styles.textMessageBox}>ban khoe khongban khoe khongban khoe khongban khoe khong</Text>
                                            <Text style={styles.textTime}>10:30</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.sendMessage}>
                                <Ionicons name='image-outline' style={styles.sendMessageImage} />
                                <TextInput style={styles.textInputMessage} onFocus={() => setPosition('81.2%')} onBlur={() => setPosition('88.7%')}></TextInput>
                                <Ionicons name='send' style={styles.sendMessageImage} />
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#FFFFFF',
    },
    scrollTab: {
        // height: 40,
    },
    postTab: {
        margin: 5,
        marginLeft: 5,
        marginRight: 5,
        height: 37,
        borderRadius: 13,
    },
    postTabText: {
        // backgroundColor: '#E5E5E5',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'tomato',
        color: 'tomato',
    },
    post: {
        width: '100%',
        paddingBottom: 30,
        paddingTop: 10,
    },
    boxImage: {
        width: windowWidth,
        height: windowHeight / 2,
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
    // modal 
    modalLocation: {
        backgroundColor: '#FFFFFF',
        height: '100%',
    },
    modalBottom: {
        backgroundColor: '#FFFFFF',
        alignItems: 'flex-end',
        padding: 5,
        // shadowColor: '#A4B6BA',
        // shadowOffset: { width: 1, height: 1 },
        // shadowOpacity: 0.2,
        // shadowRadius: 1,
        borderBottomColor: '#A4B6BA',
        borderBottomWidth: 0.5,
    },
    textOk: {
        padding: 2,
        color: 'tomato',
    },
    //chat
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
    }
})