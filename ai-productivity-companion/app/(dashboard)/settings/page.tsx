import SettingsCard from "@/components/settings/SettingsCard";
import LogoutCard from "@/components/settings/LogoutCard";

export default function SettingsPage() {
    return (
        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Settings
                </h1>

                <p className="mt-2 text-gray-500">
                    Manage your account settings.
                </p>

            </div>

            <SettingsCard />

            <LogoutCard />

        </div>
    );
}