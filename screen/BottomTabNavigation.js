import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Tab/Home';
import Chat from './Tab/Chat';
import UserBook from './Tab/UserBook';
import BookMark from './Tab/BookMark';
import Me from './Tab/Me';

const HomeStack = createNativeStackNavigator();
function HomesStackScreen({ route }) {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen options={{ headerShown: false, }} name="home" component={Home} initialParams={route} />
        </HomeStack.Navigator>
    );
}
const ChatStack = createNativeStackNavigator();
function ChatsStackScreen() {
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen options={{ headerShown: false }} name="chat" component={Chat} />
        </ChatStack.Navigator>
    );
}
const UserStack = createNativeStackNavigator();
function UserScreen() {
    return (
        <UserStack.Navigator>
            <UserStack.Screen options={{ headerShown: false }} name="phoneBook" component={UserBook} />
        </UserStack.Navigator>
    )
}
const BookMarkStack = createNativeStackNavigator();
function BookMarkScreen() {
    return (
        <BookMarkStack.Navigator>
            <BookMarkStack.Screen options={{ headerShown: false }} name="bookMark" component={BookMark} />
        </BookMarkStack.Navigator>
    )
}
const MeStack = createNativeStackNavigator();
function MeScreen({ route }) {
    // console.log(route);
    return (
        <MeStack.Navigator>
            <MeStack.Screen options={{ headerShown: false }} name="me" component={Me} initialParams={route} />
        </MeStack.Navigator>
    )
}

export default function BottomTabNavigation({ route, navigation }) {
    const { id, name, email, password, status, avatar } = route.params;
    // console.log(route);
    var dataUser = {
        id: id,
        name: name,
        email: email,
        password: password,
        status: status,
        avatar: avatar,
    }
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    // backgroundColor: 'transparent',
                    // borderTopWidth: 0,
                    height: 48,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    // console.log(route);
                    let iconName;
                    if (route.name === 'HOME') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    } else if (route.name === 'CHAT') {
                        iconName = focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline';
                    } else if (route.name === 'USER') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'BOOKMARK') {
                        iconName = focused ? 'ios-bookmarks' : 'ios-bookmarks-outline';
                    } else if (route.name === 'ME') {
                        iconName = focused ? 'ios-person' : 'ios-person-outline';
                    }
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 6,
                },
            })
            }
        >
            <Tab.Screen options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: 'tomato',
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: 'white',
                }
            }} name="HOME" component={HomesStackScreen} initialParams={dataUser} />
            <Tab.Screen options={{
                headerShown: true, headerStyle: {
                    backgroundColor: 'tomato',
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: 'white',
                }
            }} name="CHAT" component={ChatsStackScreen} initialParams={dataUser} />
            <Tab.Screen options={{
                headerShown: true, headerStyle: {
                    backgroundColor: 'tomato',
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: 'white',
                }
            }} name="USER" component={UserScreen} />
            <Tab.Screen options={{
                headerShown: true, headerStyle: {
                    backgroundColor: 'tomato',
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: 'white',
                }
            }} name="BOOKMARK" component={BookMarkScreen} />
            <Tab.Screen options={{
                headerShown: false, headerStyle: {
                    backgroundColor: 'tomato',
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: 'white',
                }
            }} name="ME" component={MeScreen} initialParams={dataUser} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({})