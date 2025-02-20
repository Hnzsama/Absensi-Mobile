// components/auth/LoginForm.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface LoginFormProps {
    onSubmit: (credentials: { email: string; password: string }) => void;
    isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onSubmit({ email, password });
    };

    return (
        <View className="space-y-4 w-full">
            <View>
                <Text className="text-gray-600 mb-2">Email</Text>
                <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View>
                <Text className="text-gray-600 mb-2">Password</Text>
                <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
            >
                <Text className="text-white text-center font-semibold">
                    {isLoading ? 'Loading...' : 'Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}