import React, { useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Keyboard, Image, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import girl from '../../assets/girl.jpg'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Chat({ navigation }) {
    // for
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [position, setPosition] = useState('88.7%');
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                            />
                            <Ionicons name="search" style={styles.searchIconSearch} />
                            <Ionicons name="close-outline" style={styles.backIcon} onPress={() => setModalSearch(false)} />
                        </View>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.boxUserSearch}>
                                {/* sau nay thay bang FlatList */}
                                <TouchableOpacity style={styles.user} onPress={() => setModalVisible(true)}>
                                    <Image source={girl} style={styles.imageUserSearch}></Image>
                                    <Text style={styles.textUser}>Minh Tuan</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
                {/* flatList user friend */}
                <ScrollView>
                    <TouchableOpacity style={styles.list} onPress={() => setModalVisible(true)}>
                        <View style={styles.listLeft}>
                            <Image style={styles.imageUser} source={girl}></Image>
                            <View style={styles.statusUser}></View>
                        </View>
                        <View style={styles.listRight}>
                            <Text style={styles.textName}>Minh Tuan</Text>
                            <Text style={styles.textMessage} numberOfLines={1}>Hom nay troi kha la dep Hom nay troi kha la depHom nay troi kha la dep</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="trash" size={30} color='#FD9F42' style={styles.IconDelete} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </ScrollView>
                <Text>Chat</Text>
                {/* for */}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text>bat</Text>
                </TouchableOpacity>
                {/* Chat */}
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
            </View>
        </TouchableWithoutFeedback>
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
    }
})