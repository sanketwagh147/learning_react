import CoreComponent from '../CoreComponent/CoreComponent';
import { CORE_CONCEPTS } from '../../data';

export default function CoreConcept() {
  return (
    <section id="core-concepts">
      <h2>Core Concepts</h2>
      <ul>
        {CORE_CONCEPTS.map((concept) => (
          // <CoreComponent
          //   key={concept.title}
          //   title={concept.title}
          //   description={concept.description}
          //   image={concept.image}
          // />
          <CoreComponent {...concept} key={concept.title} />
        ))}
      </ul>
    </section>
  );
}
