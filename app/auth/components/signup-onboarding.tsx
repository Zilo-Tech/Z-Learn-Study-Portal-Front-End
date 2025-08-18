"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../../components/ui/select";
import { MultiSelect } from "../../../components/ui/multiselect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { register } from "@/app/services/auth";

type Role = "learner" | "tutor";

interface FormState {
	// Step 1
	full_name: string;
	email: string;
	password: string;
	confirm_password: string;
	// Step 2
	 role: Role;
	 bio: string;
	 interests: string[];
	 interests_custom: string;
	 location: string;
	 timezone: string;
	 phone: string;
	// Tutor-only fields
	 tutor_subjects: string[];
	 tutor_subjects_custom: string;
	 tutor_hourly_rate: string;
	 tutor_years_experience: string;
	 tutor_education: string;
	 tutor_languages: string[];
	 tutor_languages_custom: string;
	 tutor_certifications: string;
}

export default function SignupOnboardingForm() {
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	 const [form, setForm] = useState<FormState>({
		 full_name: "",
		 email: "",
		 password: "",
		 confirm_password: "",
		 role: "learner",
		 bio: "",
		 interests: [],
		 interests_custom: "",
		 location: "",
		 timezone: "",
		 phone: "",
		 tutor_subjects: [],
		 tutor_subjects_custom: "",
		 tutor_hourly_rate: "",
		 tutor_years_experience: "",
		 tutor_education: "",
		 tutor_languages: [],
		 tutor_languages_custom: "",
		 tutor_certifications: ""
	 });

	const next = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
	const back = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));

	const onSubmit = async () => {
		setIsLoading(true);
		setError(null);
		try {
			if (form.password !== form.confirm_password) {
				setError("Passwords do not match");
				setIsLoading(false);
				return;
			}
			// Build payload per auth_onboarding.md
			const payload: Record<string, unknown> = {
				full_name: form.full_name,
				email: form.email,
				password: form.password,
				confirm_password: form.confirm_password,
				role: form.role,
				bio: form.bio || undefined,
				 interests: [
					 ...form.interests,
					 ...(form.interests_custom ? [form.interests_custom] : [])
				 ],
				 location: form.location || undefined,
				 timezone: form.timezone || undefined,
				phone: form.phone || undefined
			};
			if (form.role === "tutor") {
				Object.assign(payload, {
					 tutor_subjects: [
						 ...form.tutor_subjects,
						 ...(form.tutor_subjects_custom ? [form.tutor_subjects_custom] : [])
					 ],
					tutor_hourly_rate: form.tutor_hourly_rate ? parseFloat(form.tutor_hourly_rate) : undefined,
					tutor_years_experience: form.tutor_years_experience ? parseInt(form.tutor_years_experience) : undefined,
					tutor_education: form.tutor_education || undefined,
					 tutor_languages: [
						 ...form.tutor_languages,
						 ...(form.tutor_languages_custom ? [form.tutor_languages_custom] : [])
					 ],
					tutor_certifications: form.tutor_certifications
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean),
					// Keep availability optional for now
				});
			}
			await register(payload);
			// Redirect to OTP / activation step
			window.location.href = `/auth/otp?email=${encodeURIComponent(form.email)}`;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="w-full mx-auto px-2"
		>
			{/* Stepper */}
			<div className="flex items-center justify-center mb-6">
				<div className="flex items-center gap-3">
					<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= 1 ? "bg-emerald-600" : "bg-gray-300"}`}>1</div>
					<div className={`h-1 w-10 ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"}`} />
					<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= 2 ? "bg-emerald-600" : "bg-gray-300"}`}>2</div>
					<div className={`h-1 w-10 ${step >= 3 ? "bg-emerald-600" : "bg-gray-200"}`} />
					<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${step >= 3 ? "bg-emerald-600" : "bg-gray-300"}`}>
						<CheckCircle2 className="w-4 h-4" />
					</div>
				</div>
			</div>

			{step === 1 && (
				<div className="space-y-6 border rounded-lg p-4 sm:p-4 lg:p-6">
					<div className="space-y-2">
						<Label htmlFor="full_name">Full name</Label>
						<Input id="full_name" value={form.full_name} onChange={(e)=> setForm({ ...form, full_name: e.target.value })} placeholder="Jane Doe" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" value={form.email} onChange={(e)=> setForm({ ...form, email: e.target.value })} placeholder="name@example.com" required />
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" value={form.password} onChange={(e)=> setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirm_password">Confirm Password</Label>
							<Input id="confirm_password" type="password" value={form.confirm_password} onChange={(e)=> setForm({ ...form, confirm_password: e.target.value })} placeholder="••••••••" required />
						</div>
					</div>
					<div className="space-y-2">
						<Label>Role</Label>
						<RadioGroup value={form.role} onValueChange={(v)=> setForm({ ...form, role: v as Role })} className="grid grid-cols-2 gap-2">
							<div className="flex items-center space-x-2 border rounded-lg p-3">
								<RadioGroupItem id="role-learner" value="learner" />
								<Label htmlFor="role-learner" className="cursor-pointer">Learner</Label>
							</div>
							<div className="flex items-center space-x-2 border rounded-lg p-3">
								<RadioGroupItem id="role-tutor" value="tutor" />
								<Label htmlFor="role-tutor" className="cursor-pointer">Tutor</Label>
							</div>
						</RadioGroup>
					</div>
					<div className="flex items-center justify-between">
						<div />
						<Button onClick={next} className="bg-emerald-600 hover:bg-emerald-700 text-white">Continue</Button>
					</div>
				</div>
			)}

			{step === 2 && (
				<div className="space-y-6 border rounded-lg p-4 sm:p-4 lg:p-6">
					 <div className="grid gap-4 md:grid-cols-2">
						 <div className="space-y-2 md:col-span-2">
							 <Label htmlFor="bio">Bio</Label>
							<Textarea id="bio" value={form.bio} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> setForm({ ...form, bio: e.target.value })} placeholder="Tell us about you (optional)" rows={4} />
						 </div>
						 <div className="space-y-2">
							 <Label htmlFor="interests">Interests</Label>
								 <MultiSelect
									 id="interests"
									 options={["Python", "Algorithms", "Web Development", "AI", "Math", "Cybersecurity", "Data Science", "Cloud", "Other"]}
									 value={form.interests}
									 onChange={(v: string[]) => setForm({ ...form, interests: v })}
									 placeholder="Select interests"
								 />
							 <Input className="mt-2" value={form.interests_custom} onChange={e => setForm({ ...form, interests_custom: e.target.value })} placeholder="Add custom interest" />
						 </div>
						 <div className="space-y-2">
							 <Label htmlFor="location">Location</Label>
							<Select value={form.location} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, location: e.target.value })}>
								<SelectTrigger id="location" />
								 <SelectContent>
									 <SelectItem value="US">United States</SelectItem>
									 <SelectItem value="FR">France</SelectItem>
									 <SelectItem value="NG">Nigeria</SelectItem>
									 <SelectItem value="IN">India</SelectItem>
									 <SelectItem value="GB">United Kingdom</SelectItem>
									 <SelectItem value="DE">Germany</SelectItem>
									 <SelectItem value="Other">Other</SelectItem>
								 </SelectContent>
							 </Select>
						 </div>
						 <div className="space-y-2">
							 <Label htmlFor="timezone">Timezone</Label>
							<Select value={form.timezone} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, timezone: e.target.value })}>
								<SelectTrigger id="timezone" />
								 <SelectContent>
									 <SelectItem value="UTC">UTC</SelectItem>
									 <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
									 <SelectItem value="America/New_York">America/New_York</SelectItem>
									 <SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem>
									 <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
									 <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
									 <SelectItem value="Other">Other</SelectItem>
								 </SelectContent>
							 </Select>
						 </div>
						 <div className="space-y-2 md:col-span-2">
							 <Label htmlFor="phone">Phone</Label>
							 <Input id="phone" value={form.phone} onChange={(e)=> setForm({ ...form, phone: e.target.value })} placeholder="+1 555 123 4567" />
						 </div>
					 </div>

					{form.role === "tutor" && (
						<div className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								 <div className="space-y-2">
									 <Label htmlFor="tutor_subjects">Subjects</Label>
										 <MultiSelect
											 id="tutor_subjects"
											 options={["Python", "Algorithms", "Web Development", "AI", "Math", "Cybersecurity", "Data Science", "Cloud", "Other"]}
											 value={form.tutor_subjects}
											 onChange={(v: string[]) => setForm({ ...form, tutor_subjects: v })}
											 placeholder="Select subjects"
										 />
									 <Input className="mt-2" value={form.tutor_subjects_custom} onChange={e => setForm({ ...form, tutor_subjects_custom: e.target.value })} placeholder="Add custom subject" />
								 </div>
								<div className="space-y-2">
									<Label htmlFor="tutor_hourly_rate">Hourly rate ($)</Label>
									<Input id="tutor_hourly_rate" type="number" value={form.tutor_hourly_rate} onChange={(e)=> setForm({ ...form, tutor_hourly_rate: e.target.value })} placeholder="25" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="tutor_years_experience">Years experience</Label>
									<Input id="tutor_years_experience" type="number" value={form.tutor_years_experience} onChange={(e)=> setForm({ ...form, tutor_years_experience: e.target.value })} placeholder="5" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="tutor_education">Education</Label>
									<Input id="tutor_education" value={form.tutor_education} onChange={(e)=> setForm({ ...form, tutor_education: e.target.value })} placeholder="PhD Computer Science" />
								</div>
								 <div className="space-y-2">
									 <Label htmlFor="tutor_languages">Languages</Label>
										 <MultiSelect
											 id="tutor_languages"
											 options={["English", "French", "Spanish", "German", "Hindi", "Chinese", "Arabic", "Other"]}
											 value={form.tutor_languages}
											 onChange={(v: string[]) => setForm({ ...form, tutor_languages: v })}
											 placeholder="Select languages"
										 />
									 <Input className="mt-2" value={form.tutor_languages_custom} onChange={e => setForm({ ...form, tutor_languages_custom: e.target.value })} placeholder="Add custom language" />
								 </div>
								<div className="space-y-2">
									<Label htmlFor="tutor_certifications">Certifications (comma separated)</Label>
									<Input id="tutor_certifications" value={form.tutor_certifications} onChange={(e)=> setForm({ ...form, tutor_certifications: e.target.value })} placeholder="Teaching Certificate" />
								</div>
							</div>
							<p className="text-xs text-gray-500">You can set detailed availability later from your tutor dashboard.</p>
						</div>
					)}

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
					)}

					<div className="flex items-center justify-between">
						<Button type="button" variant="outline" onClick={back}>
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
						<Button onClick={next} className="bg-emerald-600 hover:bg-emerald-700 text-white">Review</Button>
					</div>
				</div>
			)}

			{step === 3 && (
				<div className="space-y-6 border rounded-lg p-4 sm:p-4 lg:p-6">
					<h3 className="text-lg font-semibold text-gray-900">Review your details</h3>
					<div className="grid gap-3 text-sm">
						<div><span className="text-gray-500">Name:</span> {form.full_name}</div>
						<div><span className="text-gray-500">Email:</span> {form.email}</div>
						<div><span className="text-gray-500">Role:</span> {form.role}</div>
						{form.bio && <div><span className="text-gray-500">Bio:</span> {form.bio}</div>}
						{form.interests && <div><span className="text-gray-500">Interests:</span> {form.interests}</div>}
						{form.location && <div><span className="text-gray-500">Location:</span> {form.location}</div>}
						{form.timezone && <div><span className="text-gray-500">Timezone:</span> {form.timezone}</div>}
						{form.phone && <div><span className="text-gray-500">Phone:</span> {form.phone}</div>}
						{form.role === "tutor" && (
							<div className="space-y-1">
								{form.tutor_subjects && <div><span className="text-gray-500">Subjects:</span> {form.tutor_subjects}</div>}
								{form.tutor_hourly_rate && <div><span className="text-gray-500">Hourly rate:</span> ${form.tutor_hourly_rate}</div>}
								{form.tutor_years_experience && <div><span className="text-gray-500">Experience:</span> {form.tutor_years_experience} years</div>}
								{form.tutor_education && <div><span className="text-gray-500">Education:</span> {form.tutor_education}</div>}
								{form.tutor_languages && <div><span className="text-gray-500">Languages:</span> {form.tutor_languages}</div>}
								{form.tutor_certifications && <div><span className="text-gray-500">Certifications:</span> {form.tutor_certifications}</div>}
							</div>
						)}
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
					)}

					<div className="flex items-center justify-between">
						<Button type="button" variant="outline" onClick={back}>
							<ArrowLeft className="w-4 h-4 mr-2" /> Back
						</Button>
						<Button disabled={isLoading} onClick={onSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create account
						</Button>
					</div>
				</div>
			)}
		</motion.div>
	);
}

