import Image from 'next/image';

interface LogoProps {
  height: number | string;
  width: number | string;
  priority?: boolean;
}

/**
 * Reusable Logo component that ensures the correct logo image path and alt text are used everywhere.
 */
export default function Logo({ height, width, priority = false }: LogoProps) {
  return (
    <Image
      src="/assets/logo.jpg"
      alt="Richmond Centre for Disability Logo"
      height={height}
      width={width}
      priority={priority}
    />
  );
}
