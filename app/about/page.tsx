import AboutClient from './AboutClient';
import { getAboutSettings } from '@/lib/db';

export default async function AboutPage() {
  const aboutSettings = await getAboutSettings();
  return <AboutClient initialData={aboutSettings} />;
}
