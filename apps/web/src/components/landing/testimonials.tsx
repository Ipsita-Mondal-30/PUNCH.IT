'use client';

import { Quote } from 'lucide-react';

import { Card, CardContent } from '@punch-it/ui/components/card';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

const testimonials = [
  {
    quote:
      'PUNCH.IT cut our deployment time from 15 minutes to under 2. The AI assistant caught a build issue before it hit production.',
    author: 'Alex Chen',
    role: 'CTO, Nexus Labs',
  },
  {
    quote:
      'We migrated from three different tools to PUNCH.IT. The developer experience is unmatched — it feels like Linear for DevOps.',
    author: 'Sarah Kim',
    role: 'Lead Engineer, Streamline',
  },
  {
    quote:
      'Real-time logs, instant rollbacks, and zero config. Our team ships 3x faster since switching. Best decision we made this year.',
    author: 'Mike Torres',
    role: 'Founder, DevCraft',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by developers worldwide
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Teams shipping faster with PUNCH.IT every day.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.author}>
              <Card className="glass border-border/50 h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="text-primary/40 mb-4 h-5 w-5" />
                  <p className="flex-1 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="border-border/50 mt-6 border-t pt-4">
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
