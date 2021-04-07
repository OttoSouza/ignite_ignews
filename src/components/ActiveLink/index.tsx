import { useRouter } from "next/dist/client/router";
import Link, { LinkProps } from "next/link";
import { ReactElement ,cloneElement} from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClasseName: string;
}

export function ActiveLink({
  children,
  activeClasseName,
  ...rest
}: ActiveLinkProps) {

  const {asPath} = useRouter();

  const className = asPath === rest.href ? activeClasseName : "";


  return <Link {...rest}>{cloneElement(children, {className})}</Link>;
}



