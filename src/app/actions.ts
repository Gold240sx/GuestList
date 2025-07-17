
"use server";

import { Guest } from "@/lib/types";
import { addGuest as addGuestToFirestore } from "@/lib/firestore";


// This is a mock function. In a real app, you'd use a service like Resend, SendGrid, or Nodemailer.
// You would also want to hide the recipient email behind an environment variable.
const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  console.log("--- Sending Email ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("Body:");
  console.log(html);
  console.log("---------------------");
  // Pretend it was sent successfully
  return { success: true };
};

export async function addGuest(guest: Omit<Guest, 'id'>) {
  try {
    const newGuest = await addGuestToFirestore(guest);

    // Send email notification to admin
    await sendEmail({
      to: "240designworks@gmail.com", // In a real app, use process.env.NOTIFICATION_EMAIL
      subject: "New Guest List Sign-up!",
      html: `
        <h1>New Guest!</h1>
        <p><strong>Name:</strong> ${guest.name}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
        <p><strong>Phone:</strong> ${guest.phone || 'Not provided'}</p>
        <p><strong>Role:</strong> ${guest.role}</p>
        <p><strong>Public Action:</strong> ${guest.publicAction}</p>
        <p><strong>Note:</strong> ${guest.note || 'No note provided.'}</p>
        <p><strong>Display Preference:</strong> ${guest.displayNamePref}</p>
      `,
    });

    return { success: true, data: newGuest };
  } catch (error) {
    console.error("Error adding guest:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to add guest. ${errorMessage}` };
  }
}


export async function notifyResumeDownload(email: string) {
    try {
        console.log(`Resume downloaded by: ${email}`);

        // Send email notification to admin
        await sendEmail({
          to: "240designworks@gmail.com", // In a real app, use process.env.NOTIFICATION_EMAIL
          subject: "Your Resume Was Downloaded!",
          html: `
            <h1>Resume Downloaded</h1>
            <p>Someone with the email <strong>${email}</strong> has just downloaded your resume after signing the guest book.</p>
          `,
        });

        return { success: true };

    } catch(error) {
        console.error("Error notifying about resume download:", error);
        return { success: false, error: "Failed to send notification." };
    }
}

export async function sendResumeToUser(email: string) {
    try {
        const resumeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/resume.pdf`;
        console.log(`Sending resume link to: ${email}`);

        // Send email with resume link to the user
        await sendEmail({
            to: email,
            subject: "Here is the resume you requested",
            html: `
                <h1>Thank You for Your Interest!</h1>
                <p>As requested, here is the link to download the resume:</p>
                <p><a href="${resumeUrl}" target="_blank">Download Resume</a></p>
                <p>Feel free to reach out with any opportunities.</p>
            `
        });

        return { success: true };
    } catch(error) {
        console.error("Error sending resume to user:", error);
        return { success: false, error: "Failed to send resume link." };
    }
}
