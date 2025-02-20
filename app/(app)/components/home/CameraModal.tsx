import { useState, useRef } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { View } from '@/components/ui/view';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface CameraModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCapture: (photo: string) => void;
}

export const CameraModal = ({ isVisible, onClose, onCapture }: CameraModalProps) => {
    const [facing, setFacing] = useState<CameraType>('front');
    const [permission, requestPermission] = useCameraPermissions();
    const [isProcessing, setIsProcessing] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    if (!permission) {
        return (
            <Modal visible={isVisible} animationType="slide" transparent>
                <View className="items-center justify-center flex-1 bg-black/50">
                    <View className="p-4 bg-white rounded-lg w-[80%]">
                        <Text className="mb-4 text-center">
                            <Text>Loading camera permissions...</Text>
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

    if (!permission.granted) {
        return (
            <Modal visible={isVisible} animationType="slide" transparent>
                <View className="items-center justify-center flex-1 bg-black/50">
                    <View className="p-4 bg-white rounded-lg w-[80%]">
                        <Text className="mb-4 text-center">
                            <Text>We need your permission to use the camera</Text>
                        </Text>
                        <Button onPress={requestPermission}>
                            <ButtonText>Grant Permission</ButtonText>
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={isVisible} animationType="slide">
            <View style={styles.container}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                    onMountError={(error) => console.error(error)}
                >
                    <View className="justify-between flex-1 p-4">
                        <Button
                            variant="solid"
                            className="self-end bg-black/20"
                            onPress={() => setFacing(current =>
                                current === 'back' ? 'front' : 'back'
                            )}
                        >
                            <ButtonText>Flip Camera</ButtonText>
                        </Button>

                        <View className="flex-row justify-around mt-auto">
                            <Button
                                variant="solid"
                                className="bg-red-500"
                                onPress={onClose}
                            >
                                <ButtonText>Cancel</ButtonText>
                            </Button>
                            <Button
                                variant="solid"
                                className="bg-primary-500"
                                isDisabled={isProcessing}
                                onPress={async () => {
                                    if (!cameraRef.current || isProcessing) return;

                                    setIsProcessing(true);
                                    try {
                                        const photo = await cameraRef.current.takePictureAsync({
                                            quality: 0.7,
                                            skipProcessing: true,
                                        });

                                        if (photo?.uri) {
                                            onCapture(photo.uri);
                                            onClose();
                                        }
                                    } catch (error) {
                                        console.error('Failed to take photo:', error);
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                }}
                            >
                                <ButtonText>
                                    {isProcessing ? "Processing..." : "Take Photo"}
                                </ButtonText>
                            </Button>
                        </View>
                    </View>
                </CameraView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
});
