import { FolderKanban, Rocket, TrendingUp, Users } from 'lucide-react';

import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { DeploymentsChart } from '@/components/dashboard/charts/deployments-chart';
import { SuccessRateChart } from '@/components/dashboard/charts/success-rate-chart';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { mockActivity } from '@/lib/mock-data';

export default function OverviewPage() {
  return (
    <div>
      <PageHeader
        title="Overview"
        description="Monitor your deployments, projects, and team activity."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Projects"
          value="6"
          change="+2 this month"
          changeType="positive"
          icon={FolderKanban}
        />
        <StatCard
          title="Deployments Today"
          value="24"
          change="+8 vs yesterday"
          changeType="positive"
          icon={Rocket}
        />
        <StatCard
          title="Success Rate"
          value="94.2%"
          change="+1.2% this week"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Team Members"
          value="4"
          change="1 pending invite"
          changeType="neutral"
          icon={Users}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <DeploymentsChart />
        <SuccessRateChart />
      </div>

      <ActivityFeed items={mockActivity} />
    </div>
  );
}
