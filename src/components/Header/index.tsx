import styles from "./styles.module.scss";
import { SignInButton } from "../SignInButton";
import {ActiveLink} from "../ActiveLink"
import { useRouter } from "next/dist/client/router";

export function Header() {



  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="" />
        <nav>
          <ActiveLink href="/" activeClasseName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClasseName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
