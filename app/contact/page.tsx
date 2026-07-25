import ContactClient from './ContactClient';
import { getGlobalSettings } from '@/lib/db';

export default async function ContactPage() {
  const globalSettings = await getGlobalSettings();
  return <ContactClient initialSettings={globalSettings} />;
}
