import type { Metadata } from 'next';

import AdminScreen from '@/components/AdminScreen';

export const metadata: Metadata = {
  title: 'Legends Admin | Detailing Workflow Portal',
  description: 'Internal admin route for customer intake, service status updates, and detailing operations.',
};

export default function AdminPage() {
  return <AdminScreen />;
}
