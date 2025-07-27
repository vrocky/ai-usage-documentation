import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TagList } from '../components/TagList';

export default function RepositoryDetailPage() {
  const { repositoryName } = useParams<{ repositoryName: string }>();

  if (!repositoryName) {
    return <div>Repository not found.</div>;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Repositories', path: '/' }, { label: repositoryName }]} />
      <h2 className="text-2xl font-bold mt-4 mb-4">{repositoryName}</h2>
      <TagList repositoryName={repositoryName} />
    </div>
  );
}
