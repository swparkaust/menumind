import { HTMLAttributes } from 'react';

type ResponsiveIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconProps extends HTMLAttributes<SVGElement> {
  size?: number | ResponsiveIconSize;
  color?: string;
}

function getIconSize(size: number | ResponsiveIconSize): number {
  if (typeof size === 'number') {
    return size;
  }
  
  const sizeMap: Record<ResponsiveIconSize, number> = {
    'xs': 12,
    'sm': 14, 
    'md': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 36
  };
  
  return sizeMap[size];
}

export const ChevronDownIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CheckIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.5 4.5L6 12L2.5 8.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const XMarkIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const SparklesIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 2L8.5 5.5L12 6L8.5 6.5L8 10L7.5 6.5L4 6L7.5 5.5L8 2Z"
      fill={color}
    />
    <path
      d="M3 3L3.25 4.25L4.5 4.5L3.25 4.75L3 6L2.75 4.75L1.5 4.5L2.75 4.25L3 3Z"
      fill={color}
    />
    <path
      d="M13 10L13.25 11.25L14.5 11.5L13.25 11.75L13 13L12.75 11.75L11.5 11.5L12.75 11.25L13 10Z"
      fill={color}
    />
  </svg>
  );
};

export const ForkKnifeIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 1V6C3 6.55 3.45 7 4 7S5 6.55 5 6V1M4 7V15M10 1C10 3.21 10.9 5 12 5V15M12 5C11.45 5 11 4.55 11 4V1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const HeartIcon = ({ size = 'md', color = 'currentColor', filled = false, ...props }: IconProps & { filled?: boolean }) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 14S2 10 2 6C2 4.5 3.5 3 5 3C6.5 3 8 4 8 4S9.5 3 11 3C12.5 3 14 4.5 14 6C14 10 8 14 8 14Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const ChefHatIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 11H12V13C12 13.55 11.55 14 11 14H5C4.45 14 4 13.55 4 13V11Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11V12.5M8 2C6.5 2 5.5 3 5.5 4.5C4 4.5 3 5.5 3 7C3 8.5 4 9.5 5.5 9.5H10.5C12 9.5 13 8.5 13 7C13 5.5 12 4.5 10.5 4.5C10.5 3 9.5 2 8 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const ClockIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M8 4V8L11 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const LoadingSpinner = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
      {...props}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="24"
        strokeDashoffset="12"
        opacity="0.3"
      />
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8"
        strokeDashoffset="4"
      />
    </svg>
  );
};

export const SettingsIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M14 8C14 9.1 13.4 10.1 12.5 10.6L12.1 11.4C12.3 12.1 12 12.9 11.4 13.4L13.4 11.4C12.9 12 12.1 12.3 11.4 12.1L10.6 12.5C10.1 13.4 9.1 14 8 14C6.9 14 5.9 13.4 5.4 12.5L4.6 12.1C3.9 12.3 3.1 12 2.6 11.4L4.6 13.4C4 12.9 3.7 12.1 3.9 11.4L3.5 10.6C2.6 10.1 2 9.1 2 8C2 6.9 2.6 5.9 3.5 5.4L3.9 4.6C3.7 3.9 4 3.1 4.6 2.6L2.6 4.6C3.1 4 3.9 3.7 4.6 3.9L5.4 3.5C5.9 2.6 6.9 2 8 2C9.1 2 10.1 2.6 10.6 3.5L11.4 3.9C12.1 3.7 12.9 4 13.4 4.6L11.4 2.6C12 3.1 12.3 3.9 12.1 4.6L12.5 5.4C13.4 5.9 14 6.9 14 8Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
  );
};

export const WifiIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 6C2 6 4.5 3.5 8 3.5S14 6 14 6M4 8.5C4 8.5 5.5 7 8 7S12 8.5 12 8.5M6 11C6 11 6.9 10.1 8 10.1S10 11 10 11M8 13V13.1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const WifiOffIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 2L14 14M6 11C6 11 6.9 10.1 8 10.1S10 11 10 11M8 13V13.1M4 8.5C4 8.5 5.5 7 8 7M2 6C2 6 3.2 4.8 5 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const LightbulbIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 1C10.2 1 12 2.8 12 5C12 6.3 11.4 7.4 10.5 8.1V10C10.5 10.6 10 11 9.5 11H6.5C6 11 5.5 10.6 5.5 10V8.1C4.6 7.4 4 6.3 4 5C4 2.8 5.8 1 8 1ZM6.5 12H9.5M6.5 13H9.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const PhoneIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="4"
      y="1"
      width="8"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M8 12H8.01"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const ServerIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="2"
      y="3"
      width="12"
      height="3"
      rx="1"
      stroke={color}
      strokeWidth="1.5"
    />
    <rect
      x="2"
      y="10"
      width="12"
      height="3"
      rx="1"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle
      cx="4"
      cy="4.5"
      r="0.5"
      fill={color}
    />
    <circle
      cx="4"
      cy="11.5"
      r="0.5"
      fill={color}
    />
  </svg>
  );
};

export const DatabaseIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse
      cx="8"
      cy="4"
      rx="6"
      ry="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M2 4V8C2 9.1 4.9 10 8 10S14 9.1 14 8V4"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M2 8V12C2 13.1 4.9 14 8 14S14 13.1 14 12V8"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
  );
};

export const MapPinIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 6C12 8.5 8 14 8 14S4 8.5 4 6C4 3.8 5.8 2 8 2S12 3.8 12 6Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle
      cx="8"
      cy="6"
      r="1.5"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
  );
};

export const HomeIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 6L8 1L14 6V13C14 13.6 13.6 14 13 14H3C2.4 14 2 13.6 2 13V6Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 14V10H10V14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const WarningIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.5 1L1 11H12L6.5 1Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 6V8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 10H6.51"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const InfoIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M8 11V7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 5H8.01"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const RefreshIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14 2V6H10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 14V10H6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 9C12.2 10.8 10.8 12.2 9 12.5C6.5 13 4 11.5 3.5 9S4.5 5 7 4.5C8.8 4.2 10.2 5.2 11 6.5L14 6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const GlobeIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M8 2C6 2 4 5 4 8C4 11 6 14 8 14C10 14 12 11 12 8C12 5 10 2 8 2Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M2 8H14"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
  );
};

export const BowlIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 7H14C14 10.31 11.31 13 8 13S2 10.31 2 7Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 3V5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const CookieIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle cx="5" cy="6" r="1" fill={color} />
    <circle cx="10" cy="7" r="1" fill={color} />
    <circle cx="7" cy="10" r="1" fill={color} />
  </svg>
  );
};

export const UsersIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="6"
      cy="5"
      r="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M2 13C2 11 4 9 6 9S10 11 10 13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="11"
      cy="5"
      r="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M14 13C14 11 12 9 11 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
  );
};

export const UserIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="5"
      r="3"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M3 14C3 11.5 5.5 9 8 9S13 11.5 13 14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
  );
};

export const StarIcon = ({ size = 'md', color = 'currentColor', filled = false, ...props }: IconProps & { filled?: boolean }) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 2L10 6L14 6.5L11 9.5L11.5 13.5L8 11.5L4.5 13.5L5 9.5L2 6.5L6 6L8 2Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const PizzaIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 2L2 12L8 10L14 12L8 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="6" r="0.5" fill={color} />
    <circle cx="6" cy="8" r="0.5" fill={color} />
    <circle cx="10" cy="8" r="0.5" fill={color} />
  </svg>
  );
};

export const SushiIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse
      cx="8"
      cy="8"
      rx="5"
      ry="3"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M3 8V11C3 12.66 5.24 14 8 14S13 12.66 13 11V8"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle cx="8" cy="8" r="2" fill={color} opacity="0.3" />
  </svg>
  );
};

export const NoodlesIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 8C3 8 4 6 5 6S7 8 8 8S10 6 11 6S13 8 13 8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 10C3 10 4 8 5 8S7 10 8 10S10 8 11 8S13 10 13 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4 4V8M12 4V8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 12H13C13 13.1 11.1 14 8 14S3 13.1 3 12Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
  );
};

export const TacoIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 3C4 3 2 7 2 11C2 12 2.5 13 3.5 13H12.5C13.5 13 14 12 14 11C14 7 12 3 8 3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 8C5 8 6 7 8 7S11 8 11 8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
  );
};

export const BaguetteIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11 2L4 9C3 10 3 11 4 12L5 13C6 14 7 14 8 13L14 7C15 6 15 5 14 4L13 3C12 2 11 2 11 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 5L9 7M9 9L11 11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
  );
};

export const SpiceIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 2C8 2 10 4 10 6C10 8 8 10 8 10S6 8 6 6C6 4 8 2 8 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 7C4 7 5 8 5 9S4 11 4 11S3 10 3 9S4 7 4 7Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7C12 7 11 8 11 9S12 11 12 11S13 10 13 9S12 7 12 7Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12H11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
  );
};

export const BurgerIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 11H13C13 12.1 11.1 13 8 13S3 12.1 3 11Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M3 8H13M3 9.5H13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 6.5C3 4 5 3 8 3S13 4 13 6.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="5" cy="5" r="0.5" fill={color} />
    <circle cx="8" cy="4.5" r="0.5" fill={color} />
    <circle cx="11" cy="5" r="0.5" fill={color} />
  </svg>
  );
};

export const OliveIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <ellipse
      cx="8"
      cy="9"
      rx="3"
      ry="4"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M8 5C8 5 6 3 6 2C6 1 7 1 8 1S10 1 10 2C10 3 8 5 8 5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="9" r="1" fill={color} opacity="0.3" />
  </svg>
  );
};

export const RiceIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 10H13C13 12.76 10.76 15 8 15S3 12.76 3 10Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M5 10V8M8 10V7M11 10V8"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6 3C6 2 7 1 8 1S10 2 10 3C10 4 8 6 8 6S6 4 6 3Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
  );
};

export const CoffeeIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 6H11V11C11 12.1 10.1 13 9 13H5C3.9 13 3 12.1 3 11V6Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M11 7H12C13.1 7 14 7.9 14 9S13.1 11 12 11H11"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M5 2V4M7 2V4M9 2V4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
  );
};

export const PlateIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle
      cx="8"
      cy="8"
      r="3"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
  );
};

export const CalendarIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="2"
      y="4"
      width="12"
      height="10"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M5 2V6M11 2V6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 8H14"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle cx="8" cy="11" r="1" fill={color} />
  </svg>
  );
};

export const SunIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="3"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M8 1V3M8 13V15M15 8H13M3 8H1M13 3L11.5 4.5M4.5 11.5L3 13M13 13L11.5 11.5M4.5 4.5L3 3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
  );
};

export const TrashIcon = ({ size = 'md', color = 'currentColor', ...props }: IconProps) => {
  const iconSize = getIconSize(size);
  return (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 4H13M12 4V13C12 13.6 11.6 14 11 14H5C4.4 14 4 13.6 4 13V4M6 4V2C6 1.4 6.4 1 7 1H9C9.6 1 10 1.4 10 2V4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 7V11M10 7V11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

export const AppIcon = ({ size = 'md', ...props }: Omit<IconProps, 'color'>) => {
  const iconSize = size === '100%' ? '100%' : getIconSize(size);
  return (
    <img
      src="/icon-192x192.png"
      alt="MenuMind App Icon"
      width={iconSize}
      height={iconSize}
      style={{
        borderRadius: '25.89%',
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }}
      {...props}
    />
  );
};