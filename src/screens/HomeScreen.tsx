import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, useTheme, Card, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { storageService, SessionLog } from '../services/storageService';

type RootStackParamList = {
    Home: undefined;
    Recording: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
    const theme = useTheme();
    const isFocused = useIsFocused();
    const [sessions, setSessions] = useState<SessionLog[]>([]);

    useEffect(() => {
        if (isFocused) {
            loadLogs();
        }
    }, [isFocused]);

    const loadLogs = async () => {
        const logs = await storageService.getLogs();
        setSessions(logs);
    };

    const renderItem = ({ item }: { item: SessionLog }) => (
        <Card style={styles.card} mode="elevated" elevation={1}>
            <Card.Content>
                {item.goldenThree.nextFocus ? (
                    <View style={styles.focusContainer}>
                        <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>NEXT FOCUS</Text>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.goldenThree.nextFocus}</Text>
                        <Divider style={styles.divider} />
                    </View>
                ) : null}

                <Text variant="bodySmall" style={styles.date}>
                    {new Date(item.date).toLocaleDateString()} • {Math.floor(item.durationSeconds / 60)} min
                </Text>
                <Text variant="bodyMedium" style={styles.summary}>{item.summary}</Text>

                <View style={styles.chipContainer}>
                    {item.techniquesPracticed.map((tech, idx) => (
                        <Chip key={idx} style={styles.chip} textStyle={{ fontSize: 10, lineHeight: 14 }} compact>
                            {tech}
                        </Chip>
                    ))}
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {sessions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text variant="headlineSmall" style={styles.emptyTitle}>Welcome to Judo Flow</Text>
                    <Text variant="bodyLarge" style={styles.emptySubtitle}>
                        Tap the microphone below to log your first post-training reflection.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={sessions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <FAB
                icon="microphone"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="#FFFFFF"
                onPress={() => navigation.navigate('Recording')}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtitle: {
        textAlign: 'center',
        opacity: 0.7,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100, // Space for FAB
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#F5F5F5',
    },
    focusContainer: {
        marginBottom: 12,
    },
    divider: {
        marginTop: 8,
    },
    date: {
        opacity: 0.6,
        marginBottom: 8,
    },
    summary: {
        marginBottom: 12,
        lineHeight: 22,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        height: 24,
    },
    fab: {
        position: 'absolute',
        margin: 24,
        right: 0,
        bottom: 0,
        borderRadius: 30, // circular wrap
    },
});
