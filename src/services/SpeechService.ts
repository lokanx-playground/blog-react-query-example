import EasySpeech, { SpeechSynthesisVoice } from 'easy-speech';
import {v4 as UUID}  from 'uuid';

export interface SpeakParams {
   text: string;
   voice: SpeechSynthesisVoice;
}

const speak = ({ text, voice }: SpeakParams): Promise<void> => {
   console.log('About to say:', text, ', using voice:', voice, 'of type', typeof voice);

   return new Promise<void>((resolve, reject) => {
      EasySpeech.speak({
         text: text,
         voice,
         pitch: 1,
         rate: 1,
         volume: 1,
         // there are more events, see the API for supported events
         //boundary: (e: any) => console.debug('boundary reached', e)
      })
         .then(() => {
            console.debug('Done saying:', text, ', using voice:', voice);
            resolve();
         })
         .catch((error: any) => {
            console.error('Failed saying:', text, ', using voice:', voice, error);
            reject(error);
         });
   });
};

const getVoices = (): SpeechSynthesisVoiceData[] => {
   const voices: SpeechSynthesisVoiceData[] = [];
   EasySpeech.voices().forEach((voice: SpeechSynthesisVoice) => {

      if (voice.localService && voice.lang.startsWith('en-') || voice.lang.startsWith('sv-')) {
         console.log(voice);
         const id = UUID().toString();
         voices.push({ value: id, label: `${voice.name} (${voice.lang})`, voice });
      }
   });

   return voices;
};

export interface SpeechSynthesisVoiceData {
   label: string;
   value: string;
   voice: SpeechSynthesisVoice;
}

const loadVoices = (): Promise<SpeechSynthesisVoiceData[]> => {
   return new Promise((resolve, reject) => {
      try {
         const detectResponse = EasySpeech.detect();
         if (!detectResponse.speechSynthesis || !detectResponse.speechSynthesisUtterance) {
            return reject(new Error('Browser incapable of speech synthesis'));
         }

         EasySpeech.init({ maxTimeout: 5000, interval: 250 })
            .then(() => {
               resolve(getVoices());
            })
            .catch((e: Error) => {
               reject(e);
            });
      } catch (error: any) {
         reject(error);
      }
   });
};

const SpeechService = {
   speak,
   loadVoices,
};

export default SpeechService;
