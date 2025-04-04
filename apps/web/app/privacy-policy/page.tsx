"use client"

import { motion } from "framer-motion"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function PrivacyPolicy() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNav />

      <main>
        {/* Header Section */}
        <section className="relative overflow-hidden py-12 md:py-16 border-b border-border/40">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]" />
          <motion.div
            className="container px-4 md:px-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Privacy Policy</h1>
              <p className="mt-4 text-muted-foreground">Last Updated: March 30, 2025</p>
            </div>
          </motion.div>
        </section>

        {/* Policy Content */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto space-y-8 prose prose-invert"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <h2 className="text-xl font-bold">1. Introduction</h2>
                <p>
                  At EventChain, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our website and services. Please read this
                  privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not
                  access the site.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold">2. Information We Collect</h2>
                <h3 className="text-lg font-semibold mt-4">Personal Data</h3>
                <p>When you register on our site, we collect personally identifiable information, such as your:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number (optional)</li>
                  <li>Billing information when making purchases</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Usage Data</h3>
                <p>We may also collect information on how the service is accessed and used. This data may include:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your computer's IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages you visit on our site</li>
                  <li>Time and date of your visit</li>
                  <li>Time spent on those pages</li>
                  <li>Other statistics</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold">3. How We Use Your Information</h2>
                <p>We use the information we collect in various ways, including to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide, operate, and maintain our website</li>
                  <li>Improve, personalize, and expand our website</li>
                  <li>Understand and analyze how you use our website</li>
                  <li>Develop new products, services, features, and functionality</li>
                  <li>Communicate with you about events you're interested in</li>
                  <li>Send you emails related to your account and events</li>
                  <li>Find and prevent fraud</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold">4. Sharing Your Information</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Event organizers, for events you register for</li>
                  <li>Service providers who help us operate our business</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold">5. Your Data Protection Rights</h2>
                <p>You have the following data protection rights:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The right to access, update or delete your personal information</li>
                  <li>The right to rectification</li>
                  <li>The right to object to processing of your personal data</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold">6. Cookies Policy</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our Service and we hold certain
                  information. Cookies are files with a small amount of data which may include an anonymous unique
                  identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
                  sent.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold">7. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last Updated" date at the top of this page.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold">8. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at: privacy@eventchain.com</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

