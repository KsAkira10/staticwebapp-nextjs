import SmallCard from '../src/components/SmallCard';
import { projectIcons } from '../src/components/Icons';

import { projects } from '../src/utils/projectsData';

const Home = () => (
  <div className="home">
    <h1>What Can I Deploy to Static Apps?</h1>
    <div className="card-grid">
      {projects.map((project) => {
        const Icon = projectIcons?.[project.id];
        return (
          <SmallCard
            key={project.id}
            Icon={Icon}
            title={project.name}
            slug={project.slug}
          />
        );
      })}
    </div>
  </div>
);

export default Home;
