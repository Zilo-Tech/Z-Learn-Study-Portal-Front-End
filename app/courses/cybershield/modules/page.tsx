"use client";
import { useRouter, useParams } from 'next/navigation';

const mockModules = [
	{
		id: 'intro',
		title: 'Introduction to Cybersecurity',
		lessons: 3,
		icon: '🛡️',
		description: 'Learn the basics of cybersecurity and why it matters.',
	},
	{
		id: 'attacks',
		title: 'Types of Cyber Attacks',
		lessons: 4,
		icon: '💻',
		description: 'Explore common cyber threats and how they work.',
	},
	{
		id: 'protection',
		title: 'Protection Best Practices',
		lessons: 3,
		icon: '🔒',
		description: 'Discover essential strategies to protect yourself and your organization.',
	},
	{
		id: 'network',
		title: 'Network Security',
		lessons: 2,
		icon: '🌐',
		description: 'Understand how to secure networks and prevent breaches.',
	},
	{
		id: 'incident',
		title: 'Incident Response',
		lessons: 2,
		icon: '🚨',
		description: 'Learn how to respond to and recover from cyber incidents.',
	},
	{
		id: 'future',
		title: 'The Future of Cybersecurity',
		lessons: 1,
		icon: '🤖',
		description: 'Look ahead at emerging trends and technologies.',
	},
];

export default function ModulesPage() {
	const router = useRouter();
	const params = useParams();
	const courseId =
		typeof params.courseId === 'string'
			? params.courseId
			: Array.isArray(params.courseId)
			? params.courseId[0]
			: 'cybershield';
	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-4xl font-bold mb-8 text-center text-[#003b5c]">
				Modules for {courseId.replace(/-/g, ' ')}
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{mockModules.map((mod) => (
					<div
						key={mod.id}
						className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border border-[#e3eaf3] hover:shadow-xl transition-all duration-300"
					>
						<div className="flex items-center mb-4">
							<span className="text-3xl mr-4">{mod.icon}</span>
							<div>
								<h2 className="text-xl font-semibold text-[#0d141c]">
									{mod.title}
								</h2>
								<p className="text-gray-500 text-sm">
									{mod.lessons} Lessons
								</p>
							</div>
						</div>
						<p className="text-[#49709c] mb-6 flex-1">
							{mod.description}
						</p>
						<button
							className="mt-auto bg-brand text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand/90 transition-colors shadow"
							onClick={() =>
								router.push(
									`/courses/${courseId}/modules/${mod.id}/lessons/1`
								)
							}
						>
							Start Module
						</button>
					</div>
				))}
			</div>
		</div>
	);
}