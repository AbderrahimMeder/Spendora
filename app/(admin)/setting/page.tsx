import { getCurrentUser } from '@/lib/CurrentUser';
import { redirect } from 'next/navigation';
import { SettingsView } from '@/components/admin/settings/SettingsView';

export const metadata = {
  title: 'Settings & Preferences - Finora Smart Wealth',
  description: 'Manage your profile details, financial preferences, currency, security credentials, and app customization.',
};

export default async function SettingPage() {
  const { user, token } = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '1rem 0' }}>
      <SettingsView user={user} token={token} />
    </div>
  );
}
