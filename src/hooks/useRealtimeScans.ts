import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeScans = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout: NodeJS.Timeout;

    const setupSubscription = () => {
      const channel = supabase
        .channel('scans_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'scans' },
          (payload) => {
            // Invalidate and refetch scans data
            queryClient.invalidateQueries({ queryKey: ['scans'] });

            // Show toast notification based on the event type
            switch (payload.eventType) {
              case 'INSERT':
                toast.success('Nouveau scan enregistré');
                break;
              case 'UPDATE':
                toast.info('Scan mis à jour');
                break;
              case 'DELETE':
                toast.warning('Scan supprimé');
                break;
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to scans changes');
            retryCount = 0; // Reset retry count on successful subscription
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Error in scans subscription');
            
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying subscription (attempt ${retryCount}/${maxRetries})...`);
              
              // Exponential backoff for retries
              const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
              retryTimeout = setTimeout(() => {
                channel.unsubscribe();
                setupSubscription();
              }, delay);
            } else {
              toast.error('Erreur de synchronisation des scans', {
                description: 'Veuillez rafraîchir la page'
              });
            }
          }
        });

      return () => {
        clearTimeout(retryTimeout);
        channel.unsubscribe();
      };
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup();
    };
  }, [queryClient]);
};