import reactImg from '../../assets/react-core-concepts.png';
import styles from './Header.module.css';

const sampleDescriptions = ['Fundamental', 'Crucial', 'Core'];

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function Header({ headerText, headerSize = 1 }) {
  const description = sampleDescriptions[getRandomInt(2)];
  const HeadingTag = `h${headerSize}`;

  return (
    <header className={styles.header}>
      <img src={reactImg} alt="Stylized atom" />
      <HeadingTag>{headerText}</HeadingTag>
      <p>
        {description} React concepts you will need for almost any app you are
        going to build!!
      </p>
    </header>
  );
}

export default Header;
