import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'd':
            event.preventDefault();
            navigate('/');
            toast.info('Raccourci: Dashboard');
            break;
          case 'u':
            event.preventDefault();
            navigate('/users');
            toast.info('Raccourci: Utilisateurs');
            break;
          case 's':
            event.preventDefault();
            navigate('/synods');
            toast.info('Raccourci: Synodes');
            break;
          case 'r':
            event.preventDefault();
            navigate('/reports');
            toast.info('Raccourci: Rapports');
            break;
          case 'a':
            event.preventDefault();
            navigate('/attendance');
            toast.info('Raccourci: Pointage');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
};