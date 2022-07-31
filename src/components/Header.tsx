import Image from 'next/image'
import styles from '../styles/Home.module.css'
import logo from '../../public/logo.png'

function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>
        <Image src={logo} alt="Logo" width={236} height={92} />
      </a>

      <h1>Colônia de Férias 2021/2022</h1>
    </header>
  );
}

export default Header
