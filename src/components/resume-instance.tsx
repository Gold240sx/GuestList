import type { Resume } from '@/lib/types'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { FileText, Copy, Trash2, Download } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

interface ResumeInstanceProps {
  resume: Resume;
  index: number;
  setCurrentResume: { mutate: (params: { id: number }) => void; isPending: boolean };
  handleDeleteResume: (id: number) => void;
  deleteResume: { isPending: boolean };
}

const ResumeInstance = ({ resume, setCurrentResume, handleDeleteResume, deleteResume }: ResumeInstanceProps) => {
  return (
		<div
			key={resume.id}
			className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
			<div className="flex flex-col gap-4">
				<div className="text-left">
					<p className="font-semibold break-words flex line-clamp-2 overflow-hidden">
						<span className="mr-1 flex-shrink-0"><FileText className="h-5 w-5 text-muted-foreground" /></span>
						<span className="line-clamp-2">
							{resume.fileName.length > 25 
								? `${resume.fileName.slice(0, 15)}...${resume.fileName.slice(-11)}`
								: resume.fileName
							}
						</span>
					</p>
					<span className="text-sm text-muted-foreground pb-2 block">
						{formatDate(resume.createdAt)}
					</span>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Badge
							variant={
								resume.isCurrent ? "default" : "secondary"
							}>
							{resume.isCurrent ? "Current" : "Previous"}
						</Badge>
						<span>•</span>
						<span>
							{(resume.fileSize / 1024 / 1024).toFixed(2)} MB
						</span>
						<span>•</span>
						<div className="flex items-center gap-1">
							{resume.downloadCount}
							<Download className="h-4 w-4" />
						</div>
					</div>
				</div>
			</div>
			
			{/* Smallest screens: Buttons at the bottom */}
			<div className="sm:hidden flex justify-center gap-2 mt-3">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() =>
								window.open(resume.fileUrl, "_blank")
							}
							className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
							<Copy className="h-4 w-4 text-black" />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
						<p className="text-black">Download resume</p>
					</TooltipContent>
				</Tooltip>
				{!resume.isCurrent && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									setCurrentResume.mutate({
										id: resume.id,
									})
								}
								disabled={setCurrentResume.isPending}
								className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
								<FileText className="h-4 w-4 text-black" />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
							<p className="text-black">Set as current resume</p>
						</TooltipContent>
					</Tooltip>
				)}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleDeleteResume(resume.id)}
							disabled={deleteResume.isPending}
							className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 hover:bg-red-500/30 hover:border-red-400/60 transition-all duration-300">
							<Trash2 className="h-4 w-4 text-red-600" />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
						<p className="text-black">Delete resume</p>
					</TooltipContent>
				</Tooltip>
			</div>
			
			{/* Large screens: Buttons on the right */}
			<div className="hidden sm:flex flex-col gap-2 items-end">
				<div className="flex flex-row items-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									window.open(resume.fileUrl, "_blank")
								}
								className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
								<Copy className="h-4 w-4 text-black" />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
							<p className="text-black">Download resume</p>
						</TooltipContent>
					</Tooltip>
					{!resume.isCurrent && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										setCurrentResume.mutate({
											id: resume.id,
										})
									}
									disabled={setCurrentResume.isPending}
									className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
									<FileText className="h-4 w-4 text-black" />
								</Button>
							</TooltipTrigger>
							<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
								<p className="text-black">Set as current resume</p>
							</TooltipContent>
						</Tooltip>
					)}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleDeleteResume(resume.id)}
								disabled={deleteResume.isPending}
								className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 hover:bg-red-500/30 hover:border-red-400/60 transition-all duration-300">
								<Trash2 className="h-4 w-4 text-red-600" />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
							<p className="text-black">Delete resume</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
  )
}

export default ResumeInstance