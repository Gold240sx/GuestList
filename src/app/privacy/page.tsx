import Link from "next/link";
import { User } from "lucide-react";
import { api } from "@/trpc/server";

export default async function PrivacyPolicy() {
  const profile = await api.profile.get();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 bg-background/20 backdrop-blur-md z-10 border-b border-white/20">
        <Link
          href="/"
          className="flex items-center gap-2"
          prefetch={false}>
          {profile?.appIconUrl ? (
            <img
              src={profile.appIconUrl}
              alt="App Icon"
              className="h-auto w-8 rounded object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
          <span className="font-semibold text-black">LinkHub</span>
        </Link>
        <h1 className="ml-auto font-semibold text-black">Privacy Policy</h1>
      </header>
      
      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors duration-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 lg:p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy</h1>
            
            <div className="space-y-6 text-black">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="leading-relaxed mb-3">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Profile information (name, email, phone number)</li>
                  <li>Profile images and app icons</li>
                  <li>Resume files and documents</li>
                  <li>About me and networking information</li>
                  <li>Social media links</li>
                  <li>Notes and comments</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Display your profile information as intended</li>
                  <li>Process and store your uploaded files</li>
                  <li>Communicate with you about your account</li>
                  <li>Ensure the security and integrity of our platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
                <p className="leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy. Your profile information is 
                  displayed publicly as intended by your privacy settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Storage and Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. Your data is stored securely 
                  using industry-standard encryption and security practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Your Rights and Choices</h2>
                <p className="leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Control your privacy settings and profile visibility</li>
                  <li>Request a copy of your data</li>
                  <li>Opt out of certain communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Cookies and Tracking</h2>
                <p className="leading-relaxed">
                  We may use cookies and similar tracking technologies to enhance your experience on our 
                  platform. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Third-Party Services</h2>
                <p className="leading-relaxed">
                  Our service may integrate with third-party services for authentication, file storage, 
                  and other functionalities. These services have their own privacy policies, and we 
                  encourage you to review them.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our service is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please 
                  contact us through the appropriate channels provided on our platform.
                </p>
              </section>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-black/70">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 