import Link from "next/link";
import { User } from "lucide-react";
import { api } from "@/trpc/server";

export default async function TermsOfService() {
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
        <h1 className="ml-auto font-semibold text-black">Terms of Service</h1>
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
            <h1 className="text-3xl font-bold text-black mb-6">Terms of Service</h1>
            
            <div className="space-y-6 text-black">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using LinkHub, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                <p className="leading-relaxed">
                  LinkHub provides a platform for creating and sharing public profiles with contact information, 
                  networking details, and personal notes. Users can manage their profile information and control 
                  their privacy settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>You are responsible for maintaining the confidentiality of your account information</li>
                  <li>You agree to provide accurate and complete information</li>
                  <li>You will not use the service for any unlawful purpose</li>
                  <li>You will not attempt to gain unauthorized access to any part of the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Privacy and Data Protection</h2>
                <p className="leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                  of the service, to understand our practices regarding the collection and use of your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                <p className="leading-relaxed">
                  The service and its original content, features, and functionality are and will remain the 
                  exclusive property of LinkHub and its licensors. The service is protected by copyright, 
                  trademark, and other laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  In no event shall LinkHub, nor its directors, employees, partners, agents, suppliers, or 
                  affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
                  damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
                <p className="leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any new 
                  terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
                <p className="leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through the 
                  appropriate channels provided on our platform.
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