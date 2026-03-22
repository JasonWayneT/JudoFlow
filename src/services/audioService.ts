import { Audio } from 'expo-av';

export class AudioService {
    private recording: Audio.Recording | null = null;

    async startRecording(): Promise<void> {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                throw new Error('Microphone permission not granted');
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            this.recording = recording;
        } catch (err) {
            console.error('Failed to start recording', err);
            throw err;
        }
    }

    async stopRecording(): Promise<string | null> {
        if (!this.recording) {
            return null;
        }

        try {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            this.recording = null;
            return uri;
        } catch (err) {
            console.error('Failed to stop recording', err);
            throw err;
        }
    }
}

export const audioService = new AudioService();
