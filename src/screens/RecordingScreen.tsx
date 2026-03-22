import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { audioService } from '../services/audioService';
import { storageService, SessionLog } from '../services/storageService';
import { transcriptionService } from '../services/transcriptionService';
import { aiService } from '../services/aiService';

type RootStackParamList = {
    Home: undefined;
    Recording: undefined;
    Review: { initialLogData: SessionLog };
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Recording'>;
};

export default function RecordingScreen({ navigation }: Props) {
    const theme = useTheme();
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        let mounted = true;

        const startAudio = async () => {
            try {
                await audioService.startRecording();
                if (mounted) setIsRecording(true);
            } catch (err) {
                Alert.alert("Permission Required", "Microphone access is needed to log sessions.");
                if (mounted) navigation.goBack();
            }
        };
        startAudio();

        return () => {
            mounted = false;
            // Ensure we stop recording if user somehow unmounts
            audioService.stopRecording().catch(console.error);
        };
    }, []);

    const handleStop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        try {
            const uri = await audioService.stopRecording();
            console.log('Recording stopped and saved at', uri);

            if (!uri) throw new Error("Audio URI is null");

            const transcript = await transcriptionService.transcribeAudio(uri);
            const parsedData = await aiService.parseTranscript(transcript);

            const initialLogData: SessionLog = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                durationSeconds: duration,
                audioUri: uri,
                summary: parsedData.summary,
                techniquesPracticed: parsedData.techniquesPracticed,
                goldenThree: parsedData.goldenThree,
                rpe: parsedData.rpe
            };

            navigation.navigate('Review', { initialLogData });
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to process your session. Please try again.");
            navigation.goBack();
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text variant="displayMedium" style={{ color: theme.colors.primary, marginBottom: 16 }}>
                    {formatTime(duration)}
                </Text>
                <Text variant="headlineSmall">
                    {isProcessing ? "Transcribing..." : "Speak your reflection..."}
                </Text>

                {!isProcessing && (
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        (e.g., "Practiced Uchi-mata, felt off balance...")
                    </Text>
                )}

                <Button
                    mode="contained"
                    buttonColor={theme.colors.error}
                    onPress={handleStop}
                    style={styles.stopButton}
                    icon="stop-circle-outline"
                    disabled={isProcessing}
                    loading={isProcessing}
                >
                    {isProcessing ? "Processing" : "Stop & Save"}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 32,
        opacity: 0.7,
        textAlign: 'center',
    },
    stopButton: {
        marginTop: 16,
    }
});
