import React from 'react'; 
import {Image, View, Text, StyleSheet } from 'react-native'; 
import  theme  from '../../styles/theme.js'; 

const WelcomePage = () => { 
    return (
        <View styles={StyleSheet.container}>
            <Image source={require("./../../assets/images/logo.png")} />
            <Text> Little Dress Code</Text>

        </View>
    

    ); 
}

export default WelcomePage; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgrounds.primary, 
    }
})