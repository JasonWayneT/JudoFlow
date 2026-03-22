import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { storageService, SessionLog } from '../services/storageService';
import { aiService } from '../services/aiService';
import { youtubeService, YouTubeVideo } from '../services/youtubeService';



type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;
type ReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Review'>;

type Props = {
    route: ReviewScreenRouteProp;
    navigation: ReviewScreenNavigationProp;
};

export default function ReviewScreen({ route, navigation }: Props) {
    const theme = useTheme();
    const { initialLogData } = route.params;

    const [summary, setSummary] = useState(initialLogData.summary || '');
    const [learned, setLearned] = useState(initialLogData.goldenThree.learned || '');
    const [mistake, setMistake] = useState(initialLogData.goldenThree.mistake || '');
    const [nextFocus, setNextFocus] = useState(initialLogData.goldenThree.nextFocus || '');
    const [rpe, setRpe] = useState(initialLogData.rpe?.toString() || '5');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Build the final log object
            const finalLog: SessionLog = {
                ...initialLogData,
                summary,
                goldenThree: { learned, mistake, nextFocus },
                rpe: parseInt(rpe, 10) || 5,
            };

            // Generate Safe Sensei Prompt based on final data
            const safeSenseiPrompt = await aiService.generateSafeSenseiPrompt(finalLog);

            // Fetch a YouTube resource for the primary technique practiced (if any)
            let video: YouTubeVideo | null = null;
            if (finalLog.techniquesPracticed && finalLog.techniquesPracticed.length > 0) {
                video = await youtubeService.searchTechnique(finalLog.techniquesPracticed[0]);
            }

            // Append the generated AI coaching payload onto our log
            // Extending the SessionLog interface on the fly or just adding fields we will render 
            // (We should formally update SessionLog type in storageService later)
            const logToSave = {
                ...finalLog,
                safeSenseiPrompt,
                youtubeResource: video
            };

            await storageService.saveLog(logToSave as any);

            // Pop to top (Home)
            navigation.popToTop();
        } catch (error) {
            console.error("Error saving finalized log", error);
            Alert.alert("Save Error", "Could not save log locally.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text variant="headlineSmall" style={styles.headerTitle}>Review & Edit</Text>

                <Text variant="titleMedium" style={styles.sectionTitle}>Summary</Text>
                <TextInput
                    mode="outlined"
                    multiline
                    value={summary}
                    onChangeText={setSummary}
                    style={styles.input}
                    activeOutlineColor={theme.colors.primary}
                />

                <Divider style={styles.divider} />

                <Text variant="titleMedium" style={styles.sectionTitle}>The Golden Three</Text>

                <TextInput
                    label="What I Learned"
                    mode="outlined"
                    value={learned}
                    onChangeText={setLearned}
                    style={styles.input}
                    activeOutlineColor={theme.colors.primary}
                />
                <TextInput
                    label="Mistake to Fix"
                    mode="outlined"
                    value={mistake}
                    onChangeText={setMistake}
                    style={styles.input}
                    activeOutlineColor={theme.colors.primary}
                />
                <TextInput
                    label="Focus for Next Class"
                    mode="outlined"
                    value={nextFocus}
                    onChangeText={setNextFocus}
                    style={styles.input}
                    activeOutlineColor={theme.colors.primary}
                />

                <Divider style={styles.divider} />

                <Text variant="titleMedium" style={styles.sectionTitle}>RPE (1-10)</Text>
                <TextInput
                    mode="outlined"
                    keyboardType="numeric"
                    value={rpe}
                    onChangeText={setRpe}
                    style={styles.input}
                    activeOutlineColor={theme.colors.primary}
                />

                <Text variant="titleMedium" style={styles.sectionTitle}>Techniques Recognized</Text>
                <View style={styles.chipContainer}>
                    {initialLogData.techniquesPracticed.map((tech: string, idx: number) => (
                        <Chip key={idx} style={styles.chip} compact>{tech}</Chip>
                    ))}
                    {initialLogData.techniquesPracticed.length === 0 && (
                        <Text variant="bodySmall" style={{ opacity: 0.5 }}>None detected</Text>
                    )}
                </View>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                    loading={isSaving}
                    disabled={isSaving}
                >
                    Save to Journal
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    headerTitle: {
        fontWeight: 'bold',
        marginBottom: 24,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
    },
    divider: {
        marginVertical: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 32,
    },
    chip: {
        height: 32,
    },
    saveButton: {
        marginTop: 16,
        paddingVertical: 6,
    }
});
