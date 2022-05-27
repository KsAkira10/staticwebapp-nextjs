import {
  StarIcon,
  WatchIcon,
  BugIcon,
  GithubIcon,
  projectIcons,
} from '../../src/components/Icons';
import Link from 'next/link';
import { Project, projects } from '../../src/utils/projectsData';
import { GetStaticPropsContext, NextPage } from 'next';
import useSWR, { SWRConfig } from 'swr';
import { fetcher } from '../../src/utils/fetcher';

const Project: NextPage<{
  project: Project;
  fallback: { [x: string]: Project };
}> = ({ project, fallback }) => {
  const { data } = useSWR(
    `https://api.github.com/repos/${project?.path}`,
    fetcher
  );
  const Icon = projectIcons[project.id];
  return (
    <SWRConfig value={{ fallback }}>
      <div className="project">
        <aside>
          <h3>You can deploy...</h3>
          <ul>
            {projects.map((project) => {
              return (
                <li key={project.id}>
                  <a href={`/project/${project.slug}`}>{project.name}</a>
                </li>
              );
            })}

            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
          </ul>
        </aside>
        <main>
          <div className="card-big">
            <Icon w={249} h={278} />
            <div className="stats">
              <div className="stats-details">
                <div>
                  <StarIcon w={18} h={18} />
                  <p>{data?.stargazers_count || project.stargazers_count}</p>
                </div>
                <p>stars</p>
              </div>

              <div className="stats-details">
                <div>
                  <WatchIcon w={18} h={18} />
                  <p>{data?.subscribers_count || project.subscribers_count}</p>
                </div>
                <p>watchers</p>
              </div>

              <div className="stats-details">
                <div>
                  <BugIcon w={18} h={18} />
                  <p>{data?.open_issues || project.open_issues}</p>
                </div>
                <p>issues</p>
              </div>
            </div>
            <p className="description">
              {data?.description || project.description}
            </p>
            <div className="cta">
              <a
                className="button-github"
                href={data?.html_url || project.html_url}
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon w={24} h={24} />
                Learn more...
              </a>
            </div>
          </div>
        </main>
      </div>
    </SWRConfig>
  );
};

export async function getStaticPaths() {
  const paths = projects.map((project) => ({
    params: { path: project.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ path: string }>) {
  let project: Project;
  project = projects.find((proj) => proj?.slug === params?.path) as Project;
  if (project) {
    const res = await fetch(`https://api.github.com/repos/${project?.path}`);
    const data = await res.json();
    project.open_issues = data?.open_issues || null;
    project.subscribers_count = data?.subscribers_count || null;
    project.stargazers_count = data?.stargazers_count || null;
  }

  return {
    props: {
      project,
      fallback: {
        [`https://api.github.com/repos/${project?.path}`]: project,
      },
    },
  };
}

export default Project;
