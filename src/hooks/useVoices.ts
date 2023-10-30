import { useQuery } from '@tanstack/react-query';
import SpeechService from '../services/SpeechService';

export const useVoices = () => {
   const query = useQuery({
      refetchOnWindowFocus: false,
      queryKey: ['Voices'],
      queryFn: async () => {
         try {
            return await SpeechService.loadVoices();
         } catch (error: any) {
            throw error;
         }
      }
   });

   return [query.data, { ...query, useVoicesError: query.error, isUseVoicesSuccess: query.isSuccess, isUseVoicesError: query.isError }] as const;
};
