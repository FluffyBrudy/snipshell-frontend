"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCommandsStore } from "@/app/store/commands.store";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Command, X, Plus, Tag, FileText, Sparkles, Loader2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";

const commandSchema = z.object({
	command: z.string().min(1, "Command is required"),
	arguments: z.string().min(1, "Arguments are required"),
});

type CommandFormData = z.infer<typeof commandSchema>;

interface Props {
	onClose: () => void;
	isOpen?: boolean;
	initialCommand?: string;
	mode?: "create" | "edit";
	userCommandId?: number;
	initialValues?: {
		command?: string;
		arguments?: string;
		note?: Record<string, string>;
		tags?: string[];
	};
}

export function CommandForm({ onClose, isOpen = true, initialCommand, mode = "create", userCommandId, initialValues }: Props) {
	const { createUserCommand, editUserCommand, isLoading } = useCommandsStore();
	const [tagsInput, setTagsInput] = useState("");
	const [noteFields, setNoteFields] = useState<Array<{ id: string; key: string; value: string }>>([
		{ id: "1", key: "", value: "" },
	]);

	const tagRegex = /^[a-z]+(?:-[a-z0-9]+)*$/;
	const tokens = tagsInput.split(/\s+/).map((t) => t.trim()).filter((t) => t.length > 0);
	const validTags = tokens.filter((t) => tagRegex.test(t));
	const invalidTags = tokens.filter((t) => !tagRegex.test(t));

	const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CommandFormData>({
		resolver: zodResolver(commandSchema),
	});

	const watchedCommand = watch("command");
	const watchedArgs = watch("arguments");

	const addNoteField = () => {
		const newId = Date.now().toString();
		setNoteFields([...noteFields, { id: newId, key: "", value: "" }]);
	};

	const removeNoteField = (id: string) => {
		if (noteFields.length === 1) return;
		setNoteFields(noteFields.filter((f) => f.id !== id));
	};

	const updateNoteField = (id: string, field: "key" | "value", value: string) => {
		setNoteFields(noteFields.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
	};

	const normalizedInitial = useMemo(() => ({
		command: initialValues?.command ?? initialCommand ?? "",
		arguments: initialValues?.arguments ?? "",
		note: initialValues?.note ?? {},
		tags: initialValues?.tags ?? [],
	}), [initialValues, initialCommand]);

	useEffect(() => {
		if (mode === "edit") {
			reset({
				command: normalizedInitial.command,
				arguments: normalizedInitial.arguments,
			});

			const tags = (normalizedInitial.tags || []).join(" ");
			setTagsInput(tags);

			const entries = Object.entries(normalizedInitial.note || {});
			if (entries.length > 0) {
				setNoteFields(entries.map(([key, value], idx) => ({ id: `${idx + 1}`, key, value })));
			} else {
				setNoteFields([{ id: "1", key: "", value: "" }]);
			}
		} else if (initialCommand) {
			reset({
				command: initialCommand,
				arguments: "",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, initialCommand, normalizedInitial.command, normalizedInitial.arguments]);

	const onSubmit = async (data: CommandFormData) => {
		try {
			const noteObject: Record<string, string> = {};
			noteFields.forEach((f) => {
				const k = f.key.trim();
				const v = f.value.trim();
				if (k && v) noteObject[k] = v;
			});


			if (mode === "edit" && userCommandId) {
				const changed: Partial<{ command: string; arguments: string; note: Record<string, string>; tags: string[] }> = {};
				if (data.command !== normalizedInitial.command) changed.command = data.command;
				if (data.arguments !== normalizedInitial.arguments) changed.arguments = data.arguments;
				const initialTagsSorted = [...(normalizedInitial.tags || [])].sort();
				const newTagsSorted = [...validTags].sort();
				if (JSON.stringify(initialTagsSorted) !== JSON.stringify(newTagsSorted)) changed.tags = validTags;
				if (JSON.stringify(noteObject) !== JSON.stringify(normalizedInitial.note || {})) changed.note = noteObject;

				if (Object.keys(changed).length > 0) {
					await editUserCommand(userCommandId, changed);
				}
			} else {
				await createUserCommand({
					command: data.command,
					arguments: data.arguments,
					note: noteObject,
					tags: validTags,
				});
			}

			reset();
			setTagsInput("");
			setNoteFields([{ id: "1", key: "", value: "" }]);
			onClose();
		} catch (error) {
			console.error("Failed to submit command:", error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl bg-slate-800/95 border-slate-700 backdrop-blur-sm max-h-[85vh] p-0">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle className="flex items-center gap-2 text-slate-200">
						<div className="p-2 bg-emerald-500/20 rounded-lg">
							<Command className="w-5 h-5 text-emerald-400" />
						</div>
						<span className="text-xl font-bold text-gradient">
							{mode === "edit" ? "Edit Command" : "Add New Command"}
						</span>
					</DialogTitle>
				</DialogHeader>

				<div className="overflow-y-auto p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="command" className="text-slate-300">Command</Label>
								<div className="relative">
									<Command className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
									<Input
										id="command"
										{...register("command")}
										placeholder="e.g., git, docker, npm"
										className="pl-10 bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
									/>
								</div>
								{errors.command && <p className="text-red-400 text-sm">{errors.command.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="arguments" className="text-slate-300">Arguments</Label>
								<Input
									id="arguments"
									{...register("arguments")}
									placeholder="e.g., commit -m 'message'"
									className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
								/>
								{errors.arguments && <p className="text-red-400 text-sm">{errors.arguments.message}</p>}
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-slate-300 flex items-center gap-2">
								<FileText className="w-4 h-4" />
								Notes
							</Label>
							<div className="space-y-3">
								{noteFields.map((field) => (
									<div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-2">
										<Input
											value={field.key}
											onChange={(e) => updateNoteField(field.id, "key", e.target.value)}
											placeholder="Key"
											className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
										/>
										<div className="flex gap-2">
											<Input
												value={field.value}
												onChange={(e) => updateNoteField(field.id, "value", e.target.value)}
												placeholder="Value"
												className="flex-1 bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
											/>
											{noteFields.length > 1 && (
												<Button type="button" onClick={() => removeNoteField(field.id)} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
													<X className="w-4 h-4" />
												</Button>
											)}
										</div>
									</div>
								))}
								<Button type="button" onClick={addNoteField} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
									<Plus className="w-4 h-4 mr-2" />
									Add Field
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label className="text-slate-300 flex items-center gap-2">
								<Tag className="w-4 h-4" />
								Tags
							</Label>
							<Input
								value={tagsInput}
								onChange={(e) => setTagsInput(e.target.value)}
								placeholder="space-separated, lowercase, hyphenated (e.g., git version-control)"
								className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
							/>
							{(validTags.length > 0 || invalidTags.length > 0) && (
								<div className="flex flex-wrap gap-2">
									{validTags.map((tag) => (
										<Badge key={tag} variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
											{tag}
										</Badge>
									))}
									{invalidTags.map((tag) => (
										<Badge key={tag} variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
											{tag} (invalid)
										</Badge>
									))}
								</div>
							)}
							<div className="flex items-center gap-2">
								<p className="text-xs text-slate-400">Use lowercase words with hyphens; separate multiple tags with spaces.</p>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											type="button"
											aria-label="Tag format details"
											className="inline-flex items-center justify-center rounded-full p-1 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition"
										>
											<HelpCircle className="w-4 h-4" />
										</button>
									</TooltipTrigger>
									<TooltipContent side="top" sideOffset={6} className="bg-slate-800 text-slate-200 border border-slate-600 shadow-xl">
										<div className="max-w-xs space-y-2">
											<p className="text-xs text-slate-300">Regex pattern:</p>
											<code className="block text-[11px] font-mono bg-slate-900/70 text-emerald-300 px-2 py-1 rounded border border-slate-700">/^[a-z]+(?:-[a-z0-9]+)*$/</code>
											<ul className="list-disc pl-5 text-[11px] text-slate-300 space-y-1">
												<li>Lowercase letters only</li>
												<li>Hyphens allowed between words</li>
												<li>Digits allowed after a hyphen</li>
												<li>Separate multiple tags with spaces</li>
											</ul>
										</div>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>

						<Separator className="bg-slate-600" />

						<div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
							<h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-emerald-400" />
								Preview
							</h4>
							<code className="text-sm font-mono text-emerald-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-600 block">
								$ {watchedCommand || "command"} {watchedArgs || "arguments"}
							</code>
						</div>

						<div className="flex justify-end gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
							<Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										{mode === "edit" ? "Saving..." : "Creating..."}
									</>
								) : (
									<>
										<Plus className="w-4 h-4 mr-2" />
										{mode === "edit" ? "Save Changes" : "Create Command"}
									</>
								)}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
