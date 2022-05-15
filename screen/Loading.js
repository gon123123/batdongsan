import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, StatusBar } from 'react-native'

export default function Loading() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor='tomato' />
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 23, marginBottom: 20 }}>SKY TEAM</Text>
            <ActivityIndicator size={40} color='#FFFFFF'></ActivityIndicator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'tomato'
    }
})