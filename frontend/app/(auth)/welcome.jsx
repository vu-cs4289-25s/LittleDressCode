// frontend/app/(auth)/welcome.jsx
import React from 'react';
import {Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import  theme  from '../../styles/theme.js';
import {  Stack, useRouter } from 'expo-router';


export default function WelcomePage() {
    const router = useRouter(); // Hook for navigation

    const goToLogin = () => {
        router.push('/(auth)/login'); // Navigate to the login page
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Welcome', // You can set the title here
                    headerBackTitleVisible: false,
                    headerShown: false, // Hide header for welcome screen
                }}
            />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require("./../../assets/images/logo.png")} style={styles.logo} />
                    <Text style={styles.Title}> LittleDressCode</Text>
                    <Text style={styles.motto}> Motto/catchphrase of some sort </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={goToLogin}>
                    <Text style={styles.buttonText}>Let's get started</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgrounds.primary,
        justifyContent: 'center', // Center content vertically
        alignItems: 'center',     // Center content horizontally
        paddingHorizontal: 20,     // Add some horizontal padding
    },
    logoContainer: {
        alignItems: 'center', // Center logo and text
        marginBottom: theme.spacing.medium,      // Add space below logo area
    },
    logo: {
        height: 130,
        width: 130,
        borderRadius: theme.borderRadius.default, // Circular logo using default borderRadius
        marginBottom: theme.spacing.small,    // Add space below logo
    },
    Title: {
        fontWeight: "bold",
        color : theme.colors.neutral.gray,
        fontSize: 40,
        textAlign: 'center', // Center text
    },
    motto: {
        color: theme.colors.text.medium, // Using theme.colors.text.medium for motto color
        fontSize: 16,
        textAlign: 'center',  // Center text
        marginTop: theme.spacing.small,       // Add space above motto
    },
    button: {
        backgroundColor: theme.colors.primary.blue, // Using theme.colors.primary.blue for button background
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        borderRadius: theme.borderRadius.small, // Using theme.borderRadius.small for button borderRadius
    },
    buttonText: {
        color: theme.colors.text.lightest, // Using theme.colors.text.lightest for button text color
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});