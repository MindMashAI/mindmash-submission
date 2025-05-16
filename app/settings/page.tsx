import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NavigationBar from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Moon, Volume2, Shield, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="border-gray-800 bg-black/80 backdrop-blur-sm text-white">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-fuchsia-400">Settings</CardTitle>
            <CardDescription className="text-gray-400">Customize your MindMash.AI experience</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-fuchsia-400" />
                  Notifications
                </h3>
                <div className="space-y-3 pl-7">
                  {["AI collaboration invites", "New messages in syndicates", "Mash.BiT rewards", "System updates"].map(
                    (item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-gray-300">{item}</span>
                        <Switch defaultChecked={i < 3} />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Moon className="h-5 w-5 mr-2 text-fuchsia-400" />
                  Appearance
                </h3>
                <div className="space-y-3 pl-7">
                  {["Dark mode", "High contrast", "Reduce animations", "Cyberpunk effects"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-300">{item}</span>
                      <Switch defaultChecked={i === 0 || i === 3} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Volume2 className="h-5 w-5 mr-2 text-fuchsia-400" />
                  Sound & Audio
                </h3>
                <div className="space-y-3 pl-7">
                  {["Interface sounds", "Notification sounds", "Background music", "Voice feedback"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-300">{item}</span>
                      <Switch defaultChecked={i < 2} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-fuchsia-400" />
                  Privacy & Security
                </h3>
                <div className="space-y-3 pl-7">
                  {["Two-factor authentication", "Data collection", "Session timeout", "Public profile"].map(
                    (item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-gray-300">{item}</span>
                        <Switch defaultChecked={i === 0} />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-fuchsia-400" />
                  Language & Region
                </h3>
                <div className="space-y-3 pl-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Language</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Time Zone</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (Central European Time)</option>
                        <option>UTC+9 (Japan Standard Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
              >
                Reset to Defaults
              </Button>
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <NavigationBar />
      </div>
    </div>
  )
}
