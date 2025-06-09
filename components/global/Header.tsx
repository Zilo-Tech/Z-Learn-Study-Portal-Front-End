'use client';

import Link from 'next/link';
import { Logo } from '../ui/logo';
import { motion } from 'framer-motion';

const mockBadges = [
	{ name: 'Streak 7 Days', icon: '🔥' },
	{ name: 'Cyber Pro', icon: '🛡️' },
	{ name: 'AI Explorer', icon: '🤖' },
];
const mockCredits = 120;

export default function Header() {
	return (
		<header className="w-full bg-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
				{/* Logo */}
				<Link href="/courses" className="flex items-center gap-2">
					<Logo size="md" />
				</Link>

				{/* Navigation */}
				<nav className="hidden md:flex gap-8 text-[#0d141c] font-medium text-base">
					<Link
						href="/courses"
						className="hover:text-[#0c77f2] transition-colors"
					>
						Courses
					</Link>
					<Link
						href="/dashboard"
						className="hover:text-[#0c77f2] transition-colors"
					>
						Dashboard
					</Link>
					<Link
						href="/community"
						className="hover:text-[#0c77f2] transition-colors"
					>
						Community
					</Link>
				</nav>

				{/* Badges & Credits */}
				<div className="flex items-center gap-6">
					{/* Badges */}
					<div className="flex gap-2">
						{mockBadges.map((badge) => (
							<motion.div
								key={badge.name}
								title={badge.name}
								className="text-xl"
								whileHover={{ scale: 1.2 }}
								transition={{ type: 'spring', stiffness: 300 }}
							>
								{badge.icon}
							</motion.div>
						))}
					</div>
					{/* Credits */}
					<div className="flex items-center gap-1 bg-[#e7edf4] px-3 py-1 rounded-lg text-[#0d141c] font-semibold text-sm">
						<span>💎</span>
						<span>{mockCredits} credits</span>
					</div>
				</div>
			</div>
		</header>
	);
}