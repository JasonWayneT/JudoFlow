import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionLog {
    id: string;
    date: string; // ISO String
    durationSeconds: number;
    audioUri?: string;
    summary: string;
    techniquesPracticed: string[];
    goldenThree: {
        learned: string;
        mistake: string;
        nextFocus: string;
    };
    rpe: number; // 1-10
}

const STORAGE_KEY = '@judo_flow_logs';

export const storageService = {
    async getLogs(): Promise<SessionLog[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
            return [];
        } catch (err) {
            console.error('Error reading logs', err);
            return [];
        }
    },

    async saveLog(log: SessionLog): Promise<void> {
        try {
            const logs = await this.getLogs();
            logs.unshift(log); // Add to the top of the list
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (err) {
            console.error('Error saving log', err);
            throw err;
        }
    },

    async deleteLog(id: string): Promise<void> {
        try {
            let logs = await this.getLogs();
            logs = logs.filter(l => l.id !== id);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (err) {
            console.error('Error deleting log', err);
            throw err;
        }
    }
};
