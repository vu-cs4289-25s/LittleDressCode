import React from 'react'; 
import {Image, View, Text, StyleSheet } from 'react-native'; 
import  theme  from '../../styles/theme.js'; 

const welcomePage = () => { 
    return (
        <View style={styles.container}>
            <Image source={require("./../../assets/images/logo.png")} style={styles.logo} />
            <Text style={styles.Title}> LittleDressCode</Text>
        </View>
    ); 
}

export default welcomePage; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgrounds.primary, 
    }, 
    logo: { 
        height: 130,
        width: 130, 
        alignContent: "center", 
        borderRadius: 50,
    }, 
    Title: {
        fontWeight: "bold",
        color : theme.colors.neutral.gray,
        fontSize: 40, 
    }
});