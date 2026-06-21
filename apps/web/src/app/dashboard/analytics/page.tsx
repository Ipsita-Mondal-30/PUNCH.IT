import { DeploymentsChart } from '@/components/dashboard/charts/deployments-chart';
import { SuccessRateChart } from '@/components/dashboard/charts/success-rate-chart';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@punch-it/ui/components/card';

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="Performance metrics and deployment insights." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Deployments"
          value="1,247"
          change="+12% this month"
          changeType="positive"
          icon="rocket"
        />
        <StatCard
          title="Avg Build Time"
          value="1m 34s"
          change="-8s vs last week"
          changeType="positive"
          icon="clock"
        />
        <StatCard
          title="Edge Requests"
          value="2.4M"
          change="+18% this month"
          changeType="positive"
          icon="globe"
        />
        <StatCard
          title="P95 Latency"
          value="42ms"
          change="-3ms vs last week"
          changeType="positive"
          icon="zap"
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <DeploymentsChart />
        <SuccessRateChart />
      </div>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Top Projects by Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'punchit-web', count: 342, pct: 85 },
              { name: 'api-gateway', count: 256, pct: 64 },
              { name: 'mobile-backend', count: 189, pct: 47 },
              { name: 'design-system', count: 124, pct: 31 },
            ].map((project) => (
              <div key={project.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-mono">{project.name}</span>
                  <span className="text-muted-foreground">{project.count}</span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${project.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
