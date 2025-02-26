// frontend/app/(auth)/login.jsx
import React, { useEffect } from 'react'; // Import useEffect
import {Image, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import  theme  from '../../styles/theme.js';
import {  Stack, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { googleSignIn, emailPasswordSignUp } from '@/store/slices/user.slices'; // Import your auth actions


export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.user.isAuthenticated); // Get isAuthenticated from Redux

    const handleGoogleSignIn = () => {
        dispatch(googleSignIn());
    };

    const handleEmailPasswordSignUp = () => {
        dispatch(emailPasswordSignUp({ email: 'test@example.com', password: 'password123' })); // Example dispatch
    };

    const handleLogin = () => {
        // Implement Log In logic here (for existing users)
        console.log("Log In button pressed");
    };

    // useEffect to redirect after successful login
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(main)/(tabs)'); // Use replace to prevent going back to login page
        }
    }, [isAuthenticated, router]); // Run when isAuthenticated or router changes


    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Login',
                    headerBackTitleVisible: false,
                    headerShown: false,
                }}
            />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require("./../../assets/images/logo.png")} style={styles.logo} />
                </View>
                <Text style={styles.title}>Let's get started</Text>

                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                    <Text style={styles.googleButtonText}>Sign up with Google</Text>
                </TouchableOpacity>

                <View style={styles.orSeparator}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.separatorLine} />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={theme.colors.text.medium}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={theme.colors.text.medium}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.signUpButton} onPress={handleEmailPasswordSignUp}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.orSeparator}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.separatorLine} />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>


            </View>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgrounds.primary,
        padding: 20,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.large,
    },
    logo: {
        height: 100,
        width: 100,
        borderRadius: theme.borderRadius.default,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.neutral.gray,
        marginBottom: theme.spacing.medium,
    },
    googleButton: {
        backgroundColor: theme.colors.neutral.gray,
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        borderRadius: theme.borderRadius.small,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.medium,
        borderWidth: 1,
        borderColor: theme.colors.icons.light,
    },
    googleButtonText: {
        color: theme.colors.neutral.black,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: theme.spacing.small,
    },
    orSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.medium,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.icons.light,
    },
    orText: {
        width: 50,
        textAlign: 'center',
        color: theme.colors.text.medium,
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
        marginBottom: theme.spacing.large,
    },
    input: {
        backgroundColor: theme.colors.neutral.gray,
        borderWidth: 1,
        borderColor: theme.colors.icons.light,
        borderRadius: theme.borderRadius.small,
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        marginBottom: theme.spacing.small,
        color: theme.colors.neutral.black,
    },
    signUpButton: {
        backgroundColor: theme.colors.accent.lightPink,
        paddingVertical: theme.spacing.medium,
        borderRadius: theme.borderRadius.small,
        alignItems: 'center',
    },
    signUpButtonText: {
        color: theme.colors.neutral.black,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: theme.colors.primary.pink,
        paddingVertical: theme.spacing.medium,
        borderRadius: theme.borderRadius.small,
        alignItems: 'center',
        width: '100%',
    },
    loginButtonText: {
        color: theme.colors.text.lightest,
        fontSize: 16,
        fontWeight: 'bold',
    },
});