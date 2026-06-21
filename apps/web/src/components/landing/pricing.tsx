'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

import { Button } from '@punch-it/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@punch-it/ui/components/card';
import { cn } from '@punch-it/ui/lib/utils';

import { FadeIn, HoverCard, StaggerContainer, StaggerItem } from '@/components/motion';

const plans = [
  {
    name: 'Hobby',
    price: '$0',
    period: 'forever',
    description: 'Perfect for side projects and experiments.',
    features: ['3 projects', '100 deployments/mo', 'Preview deployments', 'Community support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/month',
    description: 'For professional developers and small teams.',
    features: [
      'Unlimited projects',
      'Unlimited deployments',
      'Custom domains',
      'AI deployment assistant',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations with advanced needs.',
    features: [
      'SSO & SAML',
      'Dedicated infrastructure',
      'SLA guarantees',
      'Audit logs',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-border/50 border-y py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Start free, scale as you grow. No hidden fees.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <HoverCard className="h-full">
                <Card
                  className={cn(
                    'glass h-full transition-colors',
                    plan.highlighted ? 'border-primary/50 glow-green' : 'border-border/50',
                  )}
                >
                  <CardHeader>
                    {plan.highlighted && (
                      <span className="bg-primary/10 text-primary mb-2 inline-flex w-fit rounded-xl px-2 py-0.5 text-xs font-medium">
                        Most Popular
                      </span>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="text-primary h-4 w-4 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.highlighted ? 'default' : 'outline'}
                      className="w-full"
                      asChild
                    >
                      <Link href="/sign-up">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
