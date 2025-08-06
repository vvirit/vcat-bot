import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobCreateEditForm } from '../job-create-edit-form';

// ----------------------------------------------------------------------

export function JobEditView({ job }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.job.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Job', href: paths.dashboard.job.root },
          { name: job?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JobCreateEditForm currentJob={job} />
    </DashboardContent>
  );
}
