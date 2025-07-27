import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TagList } from '../components/TagList';
import { Tabs } from '../components/Tabs';
import { Package } from 'lucide-react';

export default function RepositoryDetailPage() {
  const { repositoryName } = useParams<{ repositoryName: string }>();

  if (!repositoryName) {
    return <div>Repository not found.</div>;
  }

  const tabs = [
    {
      label: 'Tags',
      content: <TagList repositoryName={repositoryName} />,
    },
    // Future tabs like 'README' can be added here
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Repositories', path: '/' }, { label: repositoryName }]} />
      <div className="mt-4 flex items-center gap-4 border-b border-border pb-4">
        <Package size={40} className="text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-bold break-all">{repositoryName}</h2>
          <p className="text-muted-foreground">Manage tags and view image details.</p>
        </div>
      </div>
      <div className="mt-6">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
