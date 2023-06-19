import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { SayHelloComponent } from './components/SayHelloComponent';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: 1,
         refetchOnWindowFocus: false,
      },
   },
});

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <SayHelloComponent />
      </QueryClientProvider>
   );
}

export default App;
