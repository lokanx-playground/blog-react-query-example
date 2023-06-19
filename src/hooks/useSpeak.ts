import { useMutation } from "@tanstack/react-query";
import SpeechService, { SpeakParams } from "../services/SpeechService";

interface UseSpeakParams {
   onSuccess?: () => void;
   onError?: (error: Error) => void;
}

const performSpeak = async (params: SpeakParams) => {
   try {
      return await SpeechService.speak(params);
   } catch (error: any) {
      throw error;
   }
};

export const useSpeak = ({
   onSuccess = () => {},
   onError = () => {},
}: UseSpeakParams) => {
   const mutator = useMutation(performSpeak, {
      onSuccess: () => {
         onSuccess();
      },
      onError: (error: Error) => {
         onError(error);
      },
      retry: false,
   });

   return [
      mutator.mutate,
      { isSaving: mutator.isLoading, ...mutator },
   ] as const;
};