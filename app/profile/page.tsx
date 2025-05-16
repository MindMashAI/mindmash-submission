"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Wallet, Bell, Shield, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/demo" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Profile Settings</h1>
          </div>
          <Button variant="outline" size="sm" className="border-cyan-900 text-cyan-400 hover:bg-cyan-900/20">
            Save Changes
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Section */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-400" />
              User Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  defaultValue="mindmash_user"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                <input
                  type="text"
                  defaultValue="MindMash Explorer"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="info@mindmash.ai"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-gray-400" />
              Connected Wallets
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <img
                    src="https://www.crossmint.com/assets/crossmint/logo.svg"
                    alt="Crossmint"
                    className="h-6 w-6 mr-3"
                  />
                  <div>
                    <div className="font-medium">Crossmint</div>
                    <div className="text-xs text-gray-400">Connected 3 days ago</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-900/20">
                  Disconnect
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <img
                    src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidcu55wibsgxbw4yh2j5bpjv4d2ia6sswt2amuvd7fabugh2tvkcq"
                    alt="Solflare"
                    className="h-6 w-6 mr-3"
                  />
                  <div>
                    <div className="font-medium">Solflare</div>
                    <div className="text-xs text-gray-400">Connected 1 week ago</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-900/20">
                  Disconnect
                </Button>
              </div>

              <div className="mt-4 text-center">
                <a
                  href="https://solflare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-400 text-sm inline-flex items-center"
                >
                  Learn more about Solflare wallet
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-gray-400" />
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-300">Email notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-300">Transaction alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-300">AI collaboration updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-400" />
              Security
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <div>
                  <span className="text-gray-300 block">Two-factor authentication</span>
                  <span className="text-xs text-gray-500">Add an extra layer of security</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={twoFactor}
                    onChange={() => setTwoFactor(!twoFactor)}
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="py-2">
                <Button variant="outline" className="w-full border-cyan-900/50 text-cyan-400 hover:bg-cyan-900/20">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-4 mt-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Button variant="outline" size="sm" className="border-cyan-900 text-cyan-400 hover:bg-cyan-900/20">
            <Link href="/demo">Back to Demo</Link>
          </Button>
          <span className="text-gray-500 text-sm">© 2025 MindMash.AI</span>
        </div>
      </footer>
    </div>
  )
}
