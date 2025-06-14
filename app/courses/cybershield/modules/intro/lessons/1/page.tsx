"use client";

import AgentChatBox from '@/components/agent-chat/AgentChatBox';
import { useState } from 'react';

const lessons = [
	{
		title: 'Lesson 1: What is Cybersecurity?',
		icon: '🛡️',
		content: [
			'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are often aimed at accessing, changing, or destroying sensitive information, extorting money, or disrupting normal business operations.',
			'The importance of cybersecurity has grown as our reliance on technology increases. Every device connected to the internet is a potential target for cybercriminals.',
			'Key concepts in cybersecurity include confidentiality (keeping data private), integrity (ensuring data is accurate and unaltered), and availability (making sure data and systems are accessible when needed).',
			'Cybersecurity professionals use a variety of tools and techniques to protect against threats, such as firewalls, encryption, multi-factor authentication, and regular software updates.',
			'Staying informed about the latest threats and best practices is essential for everyone, not just IT professionals.',
			'Real-world Example: In 2017, the WannaCry ransomware attack affected hundreds of thousands of computers worldwide, encrypting data and demanding ransom payments. This incident highlighted the importance of keeping systems updated and having strong security practices.',
			'Quick Tip: Always use unique, strong passwords for each of your accounts and enable two-factor authentication whenever possible.'
		]
	},
	{
		title: 'Lesson 2: Types of Cyber Attacks',
		icon: '💻',
		content: [
			'There are many types of cyber attacks, including phishing, malware, ransomware, DDoS attacks, and social engineering.',
			'Phishing attacks trick users into revealing sensitive information. Malware is software designed to harm or exploit devices. Ransomware locks data and demands payment for its release.',
			'DDoS (Distributed Denial of Service) attacks overwhelm systems with traffic. Social engineering manipulates people into giving up confidential information.',
			'Real-world Example: In 2021, a major pipeline in the US was shut down due to a ransomware attack, causing fuel shortages and highlighting the impact of cyber threats.',
			'Quick Tip: Be cautious with emails and links from unknown sources, and always verify before clicking.'
		]
	},
	{
		title: 'Lesson 3: Best Practices for Protection',
		icon: '🔒',
		content: [
			'Use strong, unique passwords for each account and enable two-factor authentication whenever possible.',
			'Keep your software and operating systems up to date to patch security vulnerabilities.',
			'Regularly back up important data and store backups securely.',
			'Educate yourself and others about the latest cyber threats and how to avoid them.',
			'Real-world Example: Many breaches occur due to weak or reused passwords. Using a password manager can help you maintain strong credentials.',
			'Quick Tip: Set reminders to update your passwords and review your security settings regularly.'
		]
	}
];

const miniAssessments = [
	{
		question: 'Which of these is a key concept in cybersecurity?',
		options: [
			{ value: 'a', label: 'Confidentiality' },
			{ value: 'b', label: 'Velocity' },
			{ value: 'c', label: 'Gravity' }
		],
		correctAnswer: 'a'
	},
	{
		question: 'What is a common goal of ransomware?',
		options: [
			{ value: 'a', label: 'To speed up your computer' },
			{ value: 'b', label: 'To demand payment for locked data' },
			{ value: 'c', label: 'To improve security' }
		],
		correctAnswer: 'b'
	},
	{
		question: 'What is a good way to protect your accounts?',
		options: [
			{ value: 'a', label: 'Use the same password everywhere' },
			{ value: 'b', label: 'Enable two-factor authentication' },
			{ value: 'c', label: 'Share your password with friends' }
		],
		correctAnswer: 'b'
	}
];

export default function LessonPage() {
	const [lessonIndex, setLessonIndex] = useState(0);
	const [showMiniAssessment, setShowMiniAssessment] = useState(false);
	const [miniAnswer, setMiniAnswer] = useState<string | null>(null);
	const [miniFeedback, setMiniFeedback] = useState<string | null>(null);

	const lesson = lessons[lessonIndex];
	const isLastLesson = lessonIndex === lessons.length - 1;

	if (showMiniAssessment) {
		const mini = miniAssessments[lessonIndex];
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
				<div className="max-w-2xl w-full mx-auto">
					<div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-[#d6e2eb]">
						<h2 className="text-2xl font-bold mb-4">Quick Check</h2>
						<p className="mb-6">{mini.question}</p>
						<div className="space-y-2 mb-4">
							{mini.options.map(opt => (
								<button
									key={opt.value}
									className={`w-full px-4 py-2 rounded border ${miniAnswer === opt.value ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'} mb-2`}
									onClick={() => {
										setMiniAnswer(opt.value);
										if (opt.value === mini.correctAnswer) {
											setMiniFeedback('Correct!');
										} else {
											setMiniFeedback('Try again!');
										}
									}}
									disabled={!!miniFeedback}
								>
									{opt.label}
								</button>
							))}
						</div>
						{miniFeedback && (
							<div className="mt-4">
								<span className={miniFeedback === 'Correct!' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{miniFeedback}</span>
								{miniFeedback === 'Correct!' && (
									<button
										className="ml-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
										onClick={() => {
											setShowMiniAssessment(false);
											setMiniAnswer(null);
											setMiniFeedback(null);
											if (!isLastLesson) {
												setLessonIndex(i => i + 1);
											} else {
												// TODO: Route to module assessment or completion
												// For now, just reload or show a message
												window.location.reload();
											}
										}}
									>
										{isLastLesson ? 'Finish Module' : 'Continue to Next Lesson'}
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
			<div className="max-w-2xl w-full mx-auto">
				<div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-[#d6e2eb]">
					<div className="flex flex-col items-center mb-6">
						<span className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">Module: Introduction</span>
						<span className="text-5xl mb-2">{lesson.icon}</span>
						<h1 className="text-3xl font-bold text-[#003b5c] mb-2">{lesson.title}</h1>
					</div>
					<div className="prose prose-lg text-[#49709c] mb-8 text-left mx-auto max-w-xl">
						{lesson.content.map((p, i) => (
							<p key={i} className={`mb-4 leading-relaxed ${p.startsWith('Quick Tip:') ? 'bg-blue-50 border-l-4 border-blue-400 p-3 rounded' : ''}`}>{p}</p>
						))}
					</div>
					{/* Agent chat and interactive buttons */}
					<div className="bg-gray-50 rounded-lg shadow p-6 mb-6">
						<h3 className="text-xl font-semibold mb-2">Chat with Z-Learn Agent</h3>
						<AgentChatBox _mockMode />
						<div className="flex gap-2 mt-4 justify-center">
							<button className="bg-blue-500 text-white px-3 py-1 rounded">Ask Agent</button>
							<button className="bg-blue-500 text-white px-3 py-1 rounded">Summarize</button>
							<button className="bg-blue-500 text-white px-3 py-1 rounded">Quiz Me</button>
						</div>
					</div>
					<div className="flex justify-between mt-6">
						<button
							className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50"
							onClick={() => setLessonIndex(i => Math.max(0, i - 1))}
							disabled={lessonIndex === 0}
						>
							Previous
						</button>
						<button
							className="px-8 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90 transition-colors shadow-md text-lg"
							onClick={() => setShowMiniAssessment(true)}
						>
							{isLastLesson ? 'Finish Module' : 'Continue'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}