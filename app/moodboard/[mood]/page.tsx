import MoodboardDetailClient from './MoodboardDetailClient'

export function generateStaticParams() {
  return [
    { mood: 'silver-renaissance' },
    { mood: 'meadowcore' },
    { mood: 'retro-cinematic' },
    { mood: 'pearlcore' },
    { mood: 'architectural-minimalism' },
  ]
}

export default async function MoodboardDetailPage({ params }: { params: Promise<{ mood: string }> }) {
  const { mood } = await params
  return <MoodboardDetailClient moodSlug={mood} />
}
