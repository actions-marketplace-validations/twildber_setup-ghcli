import * as os from "os";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

function downloadUrl(version: string, arch: string): string {
  const osType = os.type();

  const Linux64 = osType === "Linux" && arch === "x64";
  const LinuxArm64 = osType === "Linux" && arch === "arm64";
  const DarwinX64 = osType === "Darwin" && arch === "x64";
  const DarwinArm64 = osType === "Darwin" && arch === "arm64";
  const Windows64 = osType === "Windows_NT" && arch === "x64";
  const WindowsArm64 = osType === "Windows_NT" && arch === "arm64";

  core.debug(
    `Evaluating download url with osType '${osType}' and arch '${arch}'`
  );

  switch (true) {
    case Linux64:
      return `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_linux_amd64.tar.gz`;
    case LinuxArm64:
      return `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_linux_arm64.tar.gz`;

    case DarwinX64:
      return `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_macOS_amd64.zip`;
    case DarwinArm64:
      return `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_macOS_arm64.zip`;

    case Windows64:
      return `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_windows_amd64.zip`;
    case WindowsArm64:
    default:
      return `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_windows_arm64.zip`;
  }
}

async function downloadCli(version: string, arch: string): Promise<void> {
  let cachedGhCli = tc.find("gh", version, arch);

  if (!cachedGhCli) {
    try {
      const url = downloadUrl(version, arch);
      const ghCliPath = await tc.downloadTool(url);

      let unzippedGhCliPath: string;

      if (url.endsWith(".zip")) {
        unzippedGhCliPath = await tc.extractZip(ghCliPath);
      } else {
        unzippedGhCliPath = await tc.extractTar(url);
      }

      cachedGhCli = await tc.cacheDir(unzippedGhCliPath, "gh", version, arch);
    } catch (error) {
      core.setFailed(error.message);
    }
  }

  core.addPath(cachedGhCli + "/bin");
}

async function setup() {
  const version = core.getInput("version");
  await downloadCli(version, os.arch());
  core.setOutput("gh_version", version);
}
