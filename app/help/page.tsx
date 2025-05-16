import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NavigationBar from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, MessageCircle, Video, ArrowRight, Wallet } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="border-gray-800 bg-black/80 backdrop-blur-sm text-white">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-fuchsia-400">Help Center</CardTitle>
            <CardDescription className="text-gray-400">Find answers and support for MindMash.AI</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Getting Started</h3>
                    <p className="text-sm text-gray-400">Learn the basics of MindMash.AI</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">AI Syndicates</h3>
                    <p className="text-sm text-gray-400">Collaborate with AI and humans</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                    <Wallet className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Wallet & Tokens</h3>
                    <p className="text-sm text-gray-400">Manage your Mash.BiT and NFTs</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                    <Video className="h-5 w-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Video Tutorials</h3>
                    <p className="text-sm text-gray-400">Watch step-by-step guides</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Frequently Asked Questions</h3>

              {[
                {
                  question: "How do I earn Mash.BiT tokens?",
                  answer:
                    "You earn Mash.BiT tokens by interacting with AI models, contributing to syndicates, and creating valuable content that others engage with.",
                },
                {
                  question: "Can I use MindMash.AI without a crypto wallet?",
                  answer:
                    "Yes! We offer a dual-path system. Beginners can use Crossmint for instant onboarding with embedded wallets, while Web3 natives can connect with Solflare.",
                },
                {
                  question: "How do AI Syndicates work?",
                  answer:
                    "AI Syndicates are collaborative workspaces where you can work with multiple AI models and human collaborators on projects, sharing ideas and resources.",
                },
              ].map((faq, i) => (
                <div key={i} className="border border-gray-800 rounded-md p-4 hover:bg-gray-900/50 transition-colors">
                  <h4 className="font-medium text-white flex items-center justify-between cursor-pointer">
                    {faq.question}
                    <ArrowRight className="h-4 w-4 text-fuchsia-400" />
                  </h4>
                  <p className="text-sm text-gray-400 mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-fuchsia-900/50 rounded-md bg-fuchsia-900/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Need more help?</h3>
                <p className="text-sm text-gray-400">Contact our support team for personalized assistance</p>
              </div>
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        <NavigationBar />
      </div>
    </div>
  )
}
