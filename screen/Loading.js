import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'

export default function Loading() {
    return (
        <View style={styles.container}>
            <Text>SKY TEAM</Text>
            <ActivityIndicator size={30} color='tomato'></ActivityIndicator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})