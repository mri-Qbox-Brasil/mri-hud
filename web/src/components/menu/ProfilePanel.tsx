import { useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useProfileStore } from "../../stores/profileStore";
import { useI18nStore } from "../../utils/i18n";
import Panel from "../atoms/Panel";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";

export default function ProfilePanel() {
  const t = useI18nStore((s) => s.translations);
  const profiles = useProfileStore((s) => s.profiles);
  const { addNewProfile, saveHUDToProfile, applyProfileToHud, deleteProfile, renameProfile } = useProfileStore.getState();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <Panel name={t.customizationProfiles} icon={faUser} color="white">
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
            <Button name={t.saveHudToProfile} onClick={() => saveHUDToProfile(i)} />
            <Button name={t.applyProfileToHud} onClick={() => applyProfileToHud(i)} />
            <Button name={t.deleteProfile} className="hover:bg-red-600" onClick={() => deleteProfile(i)} />
          </div>
        ))}
        {profiles.length < 6 && (
          <div className="flex flex-col">
            <Button name={t.addNewProfile} className="w-[100px]" onClick={addNewProfile} />
          </div>
        )}
      </div>
    </Panel>
  );
}
