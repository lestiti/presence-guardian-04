import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeScans = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
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
        if (status === 'CHANNEL_ERROR') {
          console.error('Error in scans subscription');
          toast.error('Erreur de synchronisation des scans');
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);
};