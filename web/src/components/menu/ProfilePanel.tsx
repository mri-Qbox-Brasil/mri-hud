import { useState } from "react";
import { User } from "lucide-react";
import { useProfileStore } from "../../stores/profileStore";
import { useT } from "../../utils/i18n";
import Panel from "../atoms/Panel";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";

export default function ProfilePanel() {
  const t = useT();
  const profiles = useProfileStore((s) => s.profiles);
  const { addNewProfile, saveHUDToProfile, applyProfileToHud, deleteProfile, renameProfile } = useProfileStore.getState();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <Panel name={t("menu.icons.profiles")} icon={User}>
      <div className="mx-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
        {profiles.map((profile, i) => (
          <div key={i} className="flex flex-col justify-end items-center border-2 p-3 border-border rounded-lg my-3">
            {editingIndex === i ? (
              <TextInput
                value={profile.name}
                onChange={(v) => renameProfile(i, v)}
                onBlur={() => setEditingIndex(null)}
              />
            ) : (
              <p
                className="text-xl font-semibold text-center cursor-pointer"
                onClick={() => setEditingIndex(i)}
              >
                {profile.name}
              </p>
            )}
            <Button name={t("menu.icons.save_profile")} onClick={() => saveHUDToProfile(i)} />
            <Button name={t("menu.icons.apply_profile")} onClick={() => applyProfileToHud(i)} />
            <Button name={t("menu.icons.delete_profile")} className="hover:bg-red-600" onClick={() => deleteProfile(i)} />
          </div>
        ))}
        {profiles.length < 6 && (
          <div className="flex flex-col">
            <Button name={t("menu.icons.add_profile")} className="w-[100px]" onClick={addNewProfile} />
          </div>
        )}
      </div>
    </Panel>
  );
}
