module.exports = {
    branches: ["main"],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "@semantic-release/changelog",
            {
                "changelogFile": "CHANGELOG.md"
            }
        ],
        [
            "@semantic-release/npm",
            {
                npmPublish: false,
                pkgRoot: ".release"
            }
        ],
        [
            "@semantic-release/exec",
            {
                "prepareCmd": "sed -i -E 's/^version \".*\"/version \"${nextRelease.version}\"/g' fxmanifest.lua && sed -i -E 's/\"version\": \".*\"/\"version\": \"${nextRelease.version}\"/g' web/package.json && sed -i -E 's/\"version\": \".*\"/\"version\": \"${nextRelease.version}\"/g' .release/package.json && cd web && pnpm install && pnpm build && cd .. && zip -r ps-hud.zip . -x \"web/node_modules/*\" \"web/src/*\" \"web/public/*\" \"web/scripts/*\" \"web/*.json\" \"web/*.config.ts\" \"web/*.config.js\" \"svelte-source/*\" \".git/*\" \".github/*\" \".release/*\" \"node_modules/*\" \"version\" \"package-lock.json\" \"CHANGELOG.md\" \".vscode/*\""
            }
        ],
        [
            "@semantic-release/git",
            {
                assets: ["web/package.json", ".release/package.json", "fxmanifest.lua", "CHANGELOG.md", "html/**/*"],
                message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ],
        [
            "@semantic-release/github",
            {
                "assets": [
                    { "path": "ps-hud.zip", "label": "ps-hud v${nextRelease.version}.zip" }
                ]
            }
        ]
    ]
};
