import React from 'react';
import { useSpeak } from '../hooks/useSpeak';
import Select, { SingleValue } from 'react-select';
import { useVoices } from '../hooks/useVoices';
import { SpeechSynthesisVoiceData } from '../services/SpeechService';

export const SayHelloComponent = () => {
   const [text, setText] = React.useState<string>('Hi there! Are you ready?');
   const [voiceData, setVoiceData] = React.useState<SpeechSynthesisVoiceData | undefined>();
   const [availableVoices, {isUseVoicesError, useVoicesError}] = useVoices();

   const [speak] = useSpeak({
      onError: (error: Error) => {
         console.error('Failed speak:', error);
      },
   });

   React.useEffect(() => {
      if (isUseVoicesError && useVoicesError) {
         console.log("Failed detect voices", useVoicesError);
      }
   }, [isUseVoicesError, useVoicesError])

   const speech = () => {
      if (voiceData) {
         speak({ text, voice: voiceData.voice });
      }
   };

   return (
      <div style={{ margin: '20px', width: '200px' }}>
         <Select
            id="language"
            value={voiceData}
            options={availableVoices as any}
            onChange={(value: SingleValue<SpeechSynthesisVoiceData>) => {
               if (value && value.voice) {
                  setVoiceData(value);
               }
            }}
         />
         <input
            type="text"
            value={text}
            style={{ marginRight: '10px', width: '192px', marginTop: '4px', marginBottom: '4px', height: '28px' }}
            onChange={(event) => {
               setText(event?.target?.value || '');
            }}
         ></input>
         <button
            style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px' }}
            disabled={!voiceData || !availableVoices || availableVoices.length === 0}
            onClick={() => {
               speech();
            }}
         >
            Speak
         </button>
      </div>
   );
};

export default SayHelloComponent;
