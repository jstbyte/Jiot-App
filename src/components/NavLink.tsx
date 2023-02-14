import { ReactNode, MouseEvent, AnchorHTMLAttributes } from 'react';
import { useRouter } from './Router';
import { IconType } from 'react-icons';
import { createStyles } from '@mantine/core';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
}

export const Link = ({ href, replace, ...props }: LinkProps) => {
  const router = useRouter();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href, replace || false);
    if (props.onClick) props.onClick(e);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {props.children}
    </a>
  );
};

/* NavLink */

const useStyles = createStyles((theme) => ({
  root: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& span': {
      fontSize: theme.fontSizes.xs,
      fontWeight: 600,
    },
  },
  active: {
    filter: 'invert(50%)',
  },
}));

interface StyledProps {
  href: string;
  title: string;
  icon: IconType;
  replace?: boolean;
}

export const NavLink = ({ href, title, ...props }: StyledProps) => {
  const router = useRouter();
  const { classes } = useStyles();
  return (
    <Link href={href} replace={!!props.replace} className={`${classes.root}`}>
      <props.icon
        size={28}
        className={`${router.path === href ? classes.active : ''}`}
      />
      <span>{title}</span>
    </Link>
  );
};
