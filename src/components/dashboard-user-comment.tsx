import React from 'react'
import type { Guest } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import { Mail, Phone, Copy, MessageSquare, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const avatarGradients = [
  'from-pink-500 to-yellow-500',
  'from-green-400 to-blue-500',
  'from-purple-500 to-indigo-500',
  'from-red-500 to-orange-500',
  'from-teal-400 to-cyan-500',
]

const getDisplayName = (guest: Guest) => {
    if (guest.displayNamePref === 'anonymous') return 'Anonymous';
    if (guest.displayNamePref === 'initial') {
        const parts = guest.name.split(' ');
        const firstName = parts[0] || '';
        const lastInitial = parts.length > 1 ? ` ${parts[parts.length - 1]?.charAt(0) || ''}.` : '';
        return `${firstName}${lastInitial}`;
    }
    return guest.name;
}

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

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // You can add toast notification here if needed
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

interface DashboardUserCommentProps {
  guest: Guest;
  index: number;
  handleDeleteGuest: (id: string) => void;
  handleToggleGuestHidden: (id: string) => void;
  toggleGuestHidden: { isPending: boolean };
}

const DashboardUserComment = ({ guest, index, handleDeleteGuest, handleToggleGuestHidden, toggleGuestHidden }: DashboardUserCommentProps) => {
  return (
		<>
			<div
				key={guest.id}
				className="flex relative items-center justify-between gap-6 p-4 pr-2 border rounded-lg bg-slate-800/5 shadow-inner placeholder:text-zinc-800/70 border-transparent focus:placeholder:opacity-0">
				<div className="flex flex-col w-full xs:flex-row items-start gap-4">
					<Avatar className="flex-shrink-0">
						{guest.profileImageUrl ? (
							<AvatarImage
								src={guest.profileImageUrl}
								alt={guest.name}
							/>
						) : null}
						<AvatarFallback
							className={cn(
								"bg-gradient-to-br text-primary-foreground",
								avatarGradients[index % avatarGradients.length]
							)}>
							{getDisplayName(guest as Guest).charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div className='w-full '>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
							<div className="flex justify-between w-full">
							<p className="font-semibold">
								{getDisplayName(guest as Guest)}
							</p>
							<span className="text-xs text-muted-foreground block absolute right-2 top-2">
								{formatDate(guest.createdAt)}
							</span>
							</div>
							<div className="flex gap-2 flex-row sm:items-center">
								<div className="flex flex-col xs:flex-row sm:items-center gap-2">
									<Badge
										variant="secondary"
										className="text-xs bg-black/50 rounded-full w-fit">
										{guest.publicAction}
									</Badge>
									<Badge
										variant="secondary"
										className="text-xs w-fit">
										{guest.role}
									</Badge>
									{guest.hidden && (
										<Badge
											variant="destructive"
											className="text-xs">
											Hidden
										</Badge>
									)}
								</div>
							</div>
						</div>
						<div className="flex w-full flex-row gap-2 mt-2">
							{guest.email && (
								<div className="flex items-center gap-2 min-w-0">
									{/* Small screen: Clickable icon button */}
									<div className="sm:hidden">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 p-0 bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
													<Mail className="h-5 w-5 text-black" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
												<DropdownMenuItem asChild className="text-black hover:bg-white/20 focus:bg-white/20">
													<a
														href={`mailto:${guest.email}`}>
														<Mail className="mr-2 h-4 w-4" />
														Email
													</a>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														copyToClipboard(
															guest.email,
															"Email Address"
														)
													}
													className="text-black hover:bg-white/20 focus:bg-white/20">
													<Copy className="mr-2 h-4 w-4" />
													Copy
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									{/* Large screen: Icon + text + ellipsis dropdown */}
									<div className="hidden sm:flex items-center gap-2 min-w-0">
										<Mail className="h-4 w-4 text-black flex-shrink-0" />
										<span className="text-sm text-black truncate">
											{guest.email}
										</span>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 flex-shrink-0 bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
													<MoreVertical className="h-4 w-4 text-black" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
												<DropdownMenuItem asChild className="text-black hover:bg-white/20 focus:bg-white/20">
													<a
														href={`mailto:${guest.email}`}>
														<Mail className="mr-2 h-4 w-4" />
														Email
													</a>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														copyToClipboard(
															guest.email,
															"Email Address"
														)
													}
													className="text-black hover:bg-white/20 focus:bg-white/20">
													<Copy className="mr-2 h-4 w-4" />
													Copy
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							)}
							{guest.phone && (
								<div className="flex items-center gap-2 min-w-0">
									{/* Small screen: Clickable icon button */}
									<div className="sm:hidden">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 p-0 bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
													<Phone className="h-5 w-5 text-black" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
												<DropdownMenuItem asChild className="text-black hover:bg-white/20 focus:bg-white/20">
													<a href={`tel:${guest.phone}`}>
														<Phone className="mr-2 h-4 w-4" />
														Call
													</a>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<a href={`sms:${guest.phone}`}>
														<MessageSquare className="mr-2 h-4 w-4" />
														Text
													</a>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														copyToClipboard(
															guest.phone || "",
															"Phone Number"
														)
													}
													className="text-black hover:bg-white/20 focus:bg-white/20">
													<Copy className="mr-2 h-4 w-4" />
													Copy
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									{/* Large screen: Icon + text + ellipsis dropdown */}
									<div className="hidden sm:flex items-center gap-2 min-w-0">
										<Phone className="h-4 w-4 text-black flex-shrink-0" />
										<span className="text-sm text-black truncate">
											{guest.phone}
										</span>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 flex-shrink-0 bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
													<MoreVertical className="h-4 w-4 text-black" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
												<DropdownMenuItem asChild className="text-black hover:bg-white/20 focus:bg-white/20">
													<a href={`tel:${guest.phone}`}>
														<Phone className="mr-2 h-4 w-4" />
														Call
													</a>
												</DropdownMenuItem>
												<DropdownMenuItem asChild className="text-black hover:bg-white/20 focus:bg-white/20">
													<a href={`sms:${guest.phone}`}>
														<MessageSquare className="mr-2 h-4 w-4" />
														Text
													</a>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														copyToClipboard(
															guest.phone || "",
															"Phone Number"
														)
													}
													className="text-black hover:bg-white/20 focus:bg-white/20">
													<Copy className="mr-2 h-4 w-4" />
													Copy
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							)}
						</div>
						{guest.note && (
							<div className="mt-3 p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
								<p className="text-sm font-medium text-black leading-relaxed">
									"{guest.note}"
								</p>
							</div>
						)}
						
						{/* Smallest screens: Buttons at the bottom */}
						<div className="xs:hidden w-full flex justify-center gap-2 mt-3">
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									handleDeleteGuest(guest.id.toString())
								}
								className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 hover:bg-red-500/30 hover:border-red-400/60 transition-all duration-300">
								<Trash2 className="h-4 w-4 text-red-600" />
							</Button>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											handleToggleGuestHidden(
												guest.id.toString()
											)
										}
										disabled={toggleGuestHidden.isPending}
										className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
										{guest.hidden ? (
											<EyeOff className="h-4 w-4 text-black" />
										) : (
											<Eye className="h-4 w-4 text-black" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
									<p className="text-black">
										{guest.hidden ? "Show Guest" : "Hide Guest"}
									</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</div>
				{/* Large screens: Buttons on the right */}
				<div className="hidden xs:flex flex-col gap-2 items-end">
					<div className="flex flex-col sm:flex-row items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() =>
								handleDeleteGuest(guest.id.toString())
							}
							className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 hover:bg-red-500/30 hover:border-red-400/60 transition-all duration-300">
							<Trash2 className="h-4 w-4 text-red-600" />
						</Button>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										handleToggleGuestHidden(
											guest.id.toString()
										)
									}
									disabled={toggleGuestHidden.isPending}
									className="bg-white/30 backdrop-blur-sm border border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300">
									{guest.hidden ? (
										<EyeOff className="h-4 w-4 text-black" />
									) : (
										<Eye className="h-4 w-4 text-black" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
								<p className="text-black">
									{guest.hidden ? "Show Guest" : "Hide Guest"}
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</>
  )
}

export default DashboardUserComment