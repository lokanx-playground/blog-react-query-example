import { useQuery } from '@tanstack/react-query';
import SpeechService, { SpeechSynthesisVoiceData } from '../services/SpeechService';

interface UseSpeakParams {
   onSuccess?: (voices: SpeechSynthesisVoiceData[]) => void;
   onError?: (error: Error) => void;
}

const performLoadVoices = async () => {
   try {
      return await SpeechService.loadVoices();
   } catch (error: any) {
      throw error;
   }
};

export const useVoices = (onError: (error: any) => void = () => {}) => {
   const query = useQuery({
      refetchOnWindowFocus: false,
      queryKey: ['Voices'],
      queryFn: async () => {
         try {
            return await SpeechService.loadVoices();
         } catch (error: any) {
            throw error;
         }
      },
      onError: (error: any) => {
         onError(error);
      },
   });

   return [query.data, { ...query, error: query.error }] as const;
};
